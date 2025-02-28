import datetime
from flask import Blueprint, render_template, jsonify, request, send_from_directory, flash, redirect, url_for
from flask_jwt_extended import jwt_required, current_user, unset_jwt_cookies, set_access_cookies
from App.models.bank import Bank
from App.models.budget import Budget
from App.models.transaction import Transaction, TransactionType

from App.controllers import (
    get_all_transactions_json,
    get_user_transactions_json,
    add_transaction
)

transaction_views = Blueprint('transaction_views', __name__)

def string_to_date(date_str):
    return datetime.datetime.strptime(date_str, "%Y-%m-%d").date()

def string_to_time(time_str):
        return datetime.datetime.strptime(time_str, "%H:%M").time()

def transaction_handler(userID, transactionTitle, transactionDesc, transactionType, transactionCategory, transactionAmount, transactionDate, transactionTime, budgetID):
    try: 
        budget = Budget.query.get(budgetID)
        if not budget:
            return None, "Budget Not Found"
        
        bank = Bank.query.get(budget.bankID)
        if not bank:
            return None, "Bank Not Found"

        # Update Remaining Budget Amount
        updated_remaining_budget_amount = budget.remainingBudgetAmount - transactionAmount
        budget.remainingBudgetAmount = updated_remaining_budget_amount

        # Adjust Bank Balance
        if transactionType == TransactionType.INCOME:
            bank.balance += transactionAmount
        elif transactionType == TransactionType.EXPENSE:
            bank.balance -= transactionAmount

        # Transaction Data
        return {
            'userID': userID,
            'transactionTitle': transactionTitle,
            'transactionDesc': transactionDesc,
            'transactionType': transactionType,
            'transactionCategory': transactionCategory,
            'transactionAmount': transactionAmount,
            'transactionDate': transactionDate,
            'transactionTime': transactionTime,
            'budgetID': budgetID,
            'bankID': bank.bankID
        }, None

    except Exception as e:
        print(f"Error: {e}")
        return None, str(e)

@jwt_required()
@transaction_views.route('/alltransactions', methods=['GET'])
def list_all_transactions():
    transactions = get_all_transactions_json()
    return jsonify(transactions)

@transaction_views.route('/add-transaction', methods=['POST'])
@jwt_required()
def new_transaction():
    try:
        data = request.get_json()
        userID = data.get('userID')
        transactionTitle = data.get('transactionTitle')
        transactionDesc = data.get('transactionDesc')
        transactionType = TransactionType(data.get('transactionType'))
        transactionCategory = data.get('transactionCategory')
        transactionAmount = data.get('transactionAmount')
        transactionDate = data.get('transactionDate')
        transactionTime = data.get('transactionTime')
        budgetID = data.get('budgetID')

        if not all([userID, transactionTitle, transactionDesc, transactionType, transactionCategory, transactionAmount, transactionDate, transactionTime, budgetID]):
            return jsonify({"error": "Missing Required Fields"}), 400

        transaction_data, error_message = transaction_handler(
            userID, transactionTitle, transactionDesc, transactionType,
            transactionCategory, float(transactionAmount), string_to_date(transactionDate),
            string_to_time(transactionTime), budgetID
        )

        if error_message:
            return jsonify({"error": error_message}), 400

        new_transaction = add_transaction(**transaction_data)
        return jsonify({"message": "Transaction Created Successfully", "transactionID": new_transaction.transactionID}), 201

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@transaction_views.route('/transactions/<int:user_id>', methods=['GET'])
@jwt_required()
def list_user_transactions(user_id):
    try:
        transactions = get_user_transactions_json(user_id)
        return jsonify(transactions)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(error="Failed To Fetch Budgets"), 500