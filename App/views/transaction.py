from flask import Blueprint, jsonify, request
from App.models.transaction import TransactionType
from flask_jwt_extended import get_jwt_identity, jwt_required

from App.controllers import (
    get_transaction_json,
    get_user_transactions_json,
    add_transaction,
    get_budget,
    get_bank,
    void_transaction
)

transaction_views = Blueprint('transaction_views', __name__)

# Helper Function: When Adding A Transaction Adjusts Relevant Balances Accordingly
def transaction_handler(userID, userIDs, transactionTitle, transactionDesc, transactionType, transactionCategory, transactionAmount, transactionDate, transactionTime, budgetID, bankID):
    try: 
        budget = get_budget(budgetID)
        if not budget:
            return None, "Budget Not Found"
        
        bank = get_bank(bankID)
        if not bank:
            return None, "Bank Not Found"

        # Adjust Balance Within Associated Bank and Budget
        factor = 1 if transactionType == TransactionType.INCOME else -1
        budget.remainingBudgetAmount += factor * transactionAmount
        bank.remainingBankAmount += factor * transactionAmount


        if budget.remainingBudgetAmount < 0:
            return None, "Insufficient Budget Balance"
        if bank.remainingBankAmount < 0:
            return None, "Insufficient Bank Balance"

        # Transaction Data
        transaction_data = {
            'userID': userID,
            'userIDs': userIDs,
            'transactionTitle': transactionTitle,
            'transactionDesc': transactionDesc,
            'transactionType': transactionType,
            'transactionCategory': transactionCategory,
            'transactionAmount': transactionAmount,
            'transactionDate': transactionDate,
            'transactionTime': transactionTime,
            'budgetID': budgetID,
            'bankID': bankID
        }
        return transaction_data, None

    except Exception as e:
        return None, str(e)

# 1. Creates A New Transaction -  Handles Multi-User Associations
@transaction_views.route('/add-transaction', methods=['POST'])
@jwt_required()
def new_transaction():
    try:
        data = request.get_json()
        userID = get_jwt_identity()
        transactionTitle = data.get('transactionTitle')
        transactionDesc = data.get('transactionDesc')
        transactionType = data.get('transactionType')
        transactionCategory = data.get('transactionCategory')
        transactionAmount = data.get('transactionAmount')
        transactionDate = data.get('transactionDate')
        transactionTime = data.get('transactionTime')
        budgetID = data.get('budgetID')
        bankID = data.get('bankID')
        userIDs = data.get('userIDs') or []

        if not all([userID, transactionTitle, transactionDesc, transactionType,
                    transactionCategory, transactionAmount, transactionDate,
                    transactionTime, budgetID, bankID]):
            return jsonify({"status": "error", "message": "Missing Required Fields"}), 400

        if not isinstance(transactionAmount, (int, float)):
            return jsonify({"status": "error", "message": "Invalid Transaction Amount"}), 400

        transaction_data, error_message = transaction_handler(
            userID, userIDs, transactionTitle, transactionDesc, transactionType,
            transactionCategory, float(transactionAmount), transactionDate,
            transactionTime, budgetID, bankID
        )
        if error_message:
            return jsonify({"status":"error", "message": error_message}), 400

        new_transaction = add_transaction(**transaction_data)
        if new_transaction is None:
            return jsonify({"status":"error", "message": "Failed To Add Transaction"}), 500
        return jsonify({"status":"success", "message": "Transaction Added Successfully", "transactionID": new_transaction.transactionID}), 201

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status":"error", "message": str(e)}), 500

# 2. List User Transactions
@transaction_views.route('/transactions', methods=['GET'])
@jwt_required()
def list_user_transactions():
    try:
        userID = get_jwt_identity()
        transactions = get_user_transactions_json(userID)
        return jsonify({"status":"success", "transactions": transactions}), 200

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status": "error", "message": "Failed To Fetch Transactions"}), 500

# 3. Retrieve A Specific Transaction
@transaction_views.route('/transaction/<int:transactionID>', methods=['GET'])
def get_transation_details(transactionID):
    try:
        transaction_data = get_transaction_json(transactionID)
        return jsonify({"status": "success", "message": transaction_data}), 200

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status": "error", "message": "Failed To Fetch Transaction"}), 500

# 4. Void Transaction - Handles Non-Owner Users Of The Transaction (AKA Those Who Didn't Create It)
@transaction_views.route('/transaction/<int:transactionID>/void>', methods=['PUT'])
@jwt_required()
def void_user_transaction(transactionID):
    try:
        userID = get_jwt_identity()
        result = void_transaction(userID, transactionID)

        if result == True:
             return jsonify({"status": "success", "message": "Transaction Successfully Voided"}), 200
        elif result == "Unauthorized":
            return jsonify({"status": "error", "message": "Unauthorized To Void This Transaction"}), 403
        else:
            return jsonify({"status": "error", "message": "Failed To Void Transaction"}), 500

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status": "error", "message": f"Failed To Void Transaction: {str(e)}"}), 500

# 5. Update Transaction
transaction_views.route('/transaction/<int:transactionID>', methods=['PUT'])
@jwt_required()
def update_user_transaction(transactionID):
    return