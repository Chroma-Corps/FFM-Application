from flask import Blueprint, render_template, jsonify, request, send_from_directory, flash, redirect, url_for
from flask_jwt_extended import jwt_required, current_user, unset_jwt_cookies, set_access_cookies
from App.Backend.models.transaction import Transaction

from App.Backend.controllers import (
    get_all_transactions_json
)

transaction_views = Blueprint('transaction_views', __name__)

@jwt_required()
@transaction_views.route('/alltransactions', methods=['GET'])
def list_all_transactions():
    transactions = get_all_transactions_json()
    return jsonify(transactions)