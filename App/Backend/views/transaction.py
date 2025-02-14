import datetime
from flask import Blueprint, render_template, jsonify, request, send_from_directory, flash, redirect, url_for
from flask_jwt_extended import jwt_required, current_user, unset_jwt_cookies, set_access_cookies
from App.Backend.models.transaction import Transaction, TransactionCategory, TransactionType

from App.Backend.controllers import (
    get_all_transactions_json,
    get_user_transactions_json,
    add_transaction
)

transaction_views = Blueprint('transaction_views', __name__)

def string_to_date(date_str):
    return datetime.datetime.strptime(date_str, "%Y-%m-%d").date()

def string_to_time(time_str):
        return datetime.datetime.strptime(time_str, "%H:%M").time()

@jwt_required()
@transaction_views.route('/alltransactions', methods=['GET'])
def list_all_transactions():
    transactions = get_all_transactions_json()
    return jsonify(transactions)

@transaction_views.route('/add-transaction', methods=['POST'])
@jwt_required()
def new_budget():
    try:
        data = request.get_json()
        userID = data.get('userID')
        transactionTitle = data.get('transactionTitle')
        transactionDesc = data.get('transactionDesc')
        transactionType = TransactionType(data.get('transactionType'))
        transactionCategory = TransactionCategory(data.get('transactionCategory'))
        transactionAmount = data.get('transactionAmount')
        transactionDate = data.get('transactionDate')
        transactionTime = data.get('transactionTime')
        budgetID = data.get('budgetID')

        if not all([userID, transactionTitle, transactionDesc, transactionType, transactionCategory, transactionAmount, transactionDate, transactionTime]):
            return jsonify({"error": "Missing required fields"}), 400

        transactionDate = string_to_date(transactionDate)
        transactionTime = string_to_time(transactionTime)

        new_transaction = add_transaction(
            userID=userID,
            transactionTitle=transactionTitle,
            transactionDesc=transactionDesc,
            transactionType=transactionType,
            transactionCategory=transactionCategory,
            transactionAmount=transactionAmount,
            transactionDate=transactionDate,
            transactionTime=transactionTime,
            budgetID=budgetID
        )
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
        return jsonify(error="Failed to fetch budgets"), 500