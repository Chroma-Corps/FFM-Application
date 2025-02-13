from flask import Blueprint, render_template, jsonify, request, send_from_directory, flash, redirect, url_for
from flask_jwt_extended import get_jwt_identity, jwt_required, current_user, unset_jwt_cookies, set_access_cookies
from App.Backend.models.budget import Budget

from App.Backend.controllers import (
    get_all_budgets_json,
    get_user_budgets_json
)

budget_views = Blueprint('budget_views', __name__)

@budget_views.route('/budgets', methods=['GET'])
@jwt_required()
def list_all_budgets():
    try:
        budgets = get_all_budgets_json()
        return jsonify(budgets)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(error="Failed to fetch budgets"), 500
    
@budget_views.route('/budgets/<int:user_id>', methods=['GET'])
@jwt_required()
def list_user_budgets(user_id):
    try:
        budgets = get_user_budgets_json(user_id)
        return jsonify(budgets)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(error="Failed to fetch budgets"), 500
