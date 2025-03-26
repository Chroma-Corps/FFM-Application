from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from App.controllers import (
    create_bank,
    update_bank,
    delete_bank,
    get_bank_json,
    get_user_banks_json,
    get_all_bank_budgets,
    get_bank_users_json,
    get_all_bank_transactions
)

bank_views = Blueprint('bank_views', __name__)

# 1. Creates A New Bank -  Handles Multi-User Associations
@bank_views.route('/create-bank', methods=['POST'])
@jwt_required()
def new_bank():
    try:
        data = request.get_json()
        userID = get_jwt_identity()
        bankTitle = data.get('bankTitle')
        bankCurrency = data.get('bankCurrency')
        bankAmount = data.get('bankAmount')
        isPrimary = data.get('isPrimary')
        userIDs = data.get('userIDs') or []

        if not all([bankTitle, bankCurrency]):
            return jsonify({"status": "error", "message": "Missing Required Fields"}), 400

        new_bank = create_bank(
            userID, # Creator Of Bank
            bankTitle,
            bankCurrency,
            bankAmount,
            isPrimary,
            userIDs=userIDs) # Associated Users

        if new_bank is None:
            return jsonify({"status":"error", "message":"Failed To Create Bank"}), 500
        return jsonify({"status":"success", "message": "Bank Created Successfully", "bankID": new_bank.bankID, "bank": new_bank.get_json()}), 201

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

# 2. List User Banks
@bank_views.route('/banks', methods=['GET'])
@jwt_required()
def list_user_banks():
    try:
        userID = get_jwt_identity()
        banks = get_user_banks_json(userID)
        return jsonify({"status": "success", "banks": banks}), 200

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status": "error", "message": "Failed To Fetch Banks"}), 500

# 3. Retrieve A Specific Bank
@bank_views.route('/bank/<int:bankID>', methods=['GET'])
@jwt_required()
def get_bank_details(bankID):
    try:
        bank_data = get_bank_json(bankID)
        return jsonify({"status": "success", "bank": bank_data}), 200

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status": "error", "message": "Failed To Fetch Bank"}), 500

# 4. Retrieve Bank Transactions
@bank_views.route('/bank/<int:bankID>/transactions', methods=['GET'])
@jwt_required()
def get_bank_transactions(bankID):
    try:
        transactions = get_all_bank_transactions(bankID)
        return jsonify({"status":"success", "transactions": transactions}), 200

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status":"error", "message": f"Failed To Fetch Transactions: {str(e)}"}), 500

# 5. Retrieve Bank Budgets
@bank_views.route('/bank/<int:bankID>/budgets', methods=['GET'])
def get_bank_budgets(bankID):
    try:
        budgets = get_all_bank_budgets(bankID)
        return jsonify({"status":"success", "budgets": budgets}), 200

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status":"error", "message": f"Failed To Fetch Budgets: {str(e)}"}), 500

# 6. Retrieve Bank Users
@bank_views.route('/bank/<int:bankID>/users', methods=['GET'])
def get_bank_users(bankID):
    try:
        users = get_bank_users_json(bankID)
        return jsonify({"status":"success", "users": users}), 200

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status":"error", "message": f"Failed To Fetch Users: {str(e)}"}), 500

# 7. Update Bank
@bank_views.route('/bank/<int:bankID>', methods=['PUT'])
@jwt_required()
def update_user_bank(bankID):
    try:
        data = request.get_json()
        bankTitle = data.get('bankTitle')
        bankCurrency = data.get('bankCurrency')
        bankAmount = data.get('bankAmount')

        updated_bank = update_bank(bankID, bankTitle, bankCurrency, bankAmount)

        if updated_bank:
            return jsonify({"status": "success", "message": "Bank Updated Successfully"}), 200
        else:
            return jsonify({"status": "error", "message": "Failed To Update Bank"}), 500

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status": "error", "message": f"Failed To Update Bank: {str(e)}"}), 500

# 8. Delete Bank
@bank_views.route('/bank/<int:bankID>', methods=['DELETE'])
@jwt_required()
def delete_user_bank(bankID):
    try:
        userID = get_jwt_identity()
        result = delete_bank(userID, bankID)

        if result == True:
            return jsonify({"status": "success", "message": "Bank Deleted Successfully"}), 200
        elif result == "Unauthorized":
            return jsonify({"status": "error", "message": "Unauthorized To Delete This Bank"}), 403
        else:
            return jsonify({"status": "error", "message": "Failed To Delete Bank"}), 500

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status": "error", "message": f"Failed To Delete Bank: {str(e)}"}), 500
