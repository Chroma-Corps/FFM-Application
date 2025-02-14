from flask import Blueprint, render_template, jsonify, request, send_from_directory, flash, redirect, url_for
from flask_jwt_extended import jwt_required, current_user, unset_jwt_cookies, set_access_cookies
from App.Backend.models.transaction import Transaction

from App.Backend.controllers import (
    get_all_transactions_json,
    get_user_transactions_json
)

transaction_views = Blueprint('transaction_views', __name__)

@jwt_required()
@transaction_views.route('/alltransactions', methods=['GET'])
def list_all_transactions():
    transactions = get_all_transactions_json()
    return jsonify(transactions)

@transaction_views.route('/transactions/<int:user_id>', methods=['GET'])
@jwt_required()
def list_user_transactions(user_id):
    try:
        transactions = get_user_transactions_json(user_id)
        return jsonify(transactions)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(error="Failed to fetch budgets"), 500