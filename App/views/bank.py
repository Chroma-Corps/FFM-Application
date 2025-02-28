from flask import Blueprint, render_template, jsonify, request, send_from_directory, flash, redirect, url_for
from flask_jwt_extended import get_jwt_identity, jwt_required, current_user, unset_jwt_cookies, set_access_cookies

from App.controllers import (
    create_bank,
    get_user_banks_json,
    get_bank_json
)

bank_views = Blueprint('bank_views', __name__)

@bank_views.route('/create-bank', methods=['POST'])
@jwt_required()
def new_bank():
    try:
        data = request.get_json()
        userID = get_jwt_identity() # Testing
        bankTitle = data.get('bankTitle')
        bankCurrency = data.get('bankCurrency')
        bankAmount = data.get('bankAmount')

        if not all([bankTitle, bankCurrency, bankAmount]):
            return jsonify({"error": "Missing Required Fields"}), 400

        new_bank = create_bank(userID, bankTitle, bankCurrency, bankAmount)
        if not new_bank:
            return jsonify({"error": "Failed To Create Bank"}), 500

        return jsonify({"message": "Bank Created Successfully", "bank": new_bank.get_json()}), 201

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@bank_views.route('/banks/<int:user_id>', methods=['GET'])
@jwt_required()
def list_user_banks(user_id):
    try:
        current_user = get_jwt_identity()
        print(f"Current user: {current_user}")

        if current_user != user_id:
            return jsonify(error="Unauthorized access"), 401

        # Fetch User Banks
        banks = get_user_banks_json(user_id)
        return jsonify(banks)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(error="Failed To Fetch Banks"), 500

@bank_views.route('/bank/<int:id>', methods=['GET'])
def get_bank_details(id):
    bank_data = get_bank_json(id)
    if not bank_data:
        return jsonify({'error': 'Bank Not Found'}), 404 
    return jsonify(bank_data)