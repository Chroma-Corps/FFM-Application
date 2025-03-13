from flask import Blueprint, render_template, jsonify, request, send_from_directory, flash, redirect, url_for
from flask_jwt_extended import get_jwt_identity, jwt_required, current_user, unset_jwt_cookies, set_access_cookies

from App.controllers import (
    create_bank,
    get_user_banks_json,
    get_bank_json,
    get_bank_transactions_json
)

bank_views = Blueprint('bank_views', __name__)

@bank_views.route('/create-bank', methods=['POST'])
@jwt_required()
def new_bank():
    try:
        data = request.get_json()
        userID = get_jwt_identity()
        bankTitle = data.get('bankTitle')
        bankCurrency = data.get('bankCurrency')
        bankAmount = data.get('bankAmount')

        if not all([bankTitle, bankCurrency, bankAmount]):
            return jsonify({"error": "Missing Required Fields"}), 400

        new_bank = create_bank(userID, bankTitle, bankCurrency, bankAmount)
        if not new_bank:
            return jsonify({"error": "Failed To Create Bank"}), 500
        return jsonify({"message": "Bank Created Successfully", "bankID": new_bank.bankID}), 201

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@bank_views.route('/banks', methods=['GET'])
@jwt_required()
def list_user_banks():
    try:
        user_id = get_jwt_identity()
        banks = get_user_banks_json(user_id)
        return jsonify(banks), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(error="Failed To Fetch Banks"), 500

@bank_views.route('/bank/<int:bankID>', methods=['GET'])
def get_bank_details(bankID):
    try:
        bank_data = get_bank_json(bankID)
        return jsonify(bank_data), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Bank Not Found'}), 404 
    
@bank_views.route('/bank/<int:bankID>/transactions', methods=['GET'])
def get_bank_transactions(bankID):
    try:
        transactions = get_bank_transactions_json(bankID)

        if not transactions:
            return jsonify({"message": "No Transactions Found For This Bank"}), 404

        return jsonify( transactions), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Failed to Fetch Bank Transactions'}), 500