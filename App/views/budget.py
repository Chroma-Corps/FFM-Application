from flask import Blueprint, render_template, jsonify, request, send_from_directory, flash, redirect, url_for
from flask_jwt_extended import get_jwt_identity, jwt_required, current_user, unset_jwt_cookies, set_access_cookies
from App.controllers.budget import get_budget_json
from App.models.budget import Budget
import datetime

from App.controllers import (
    get_all_budgets_json,
    get_user_budgets_json,
    create_budget
)

budget_views = Blueprint('budget_views', __name__)

def string_to_date(date_str):
    return datetime.datetime.strptime(date_str, "%Y-%m-%d").date()

@budget_views.route('/budgets', methods=['GET'])
def list_all_budgets():
    try:
        budgets = get_all_budgets_json()
        return jsonify(budgets)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(error="Failed To Fetch Budgets"), 500

@budget_views.route('/create-budget', methods=['POST'])
@jwt_required()
def new_budget():
    try:
        data = request.get_json()
        budgetTitle = data.get('budgetTitle')
        budgetAmount = data.get('budgetAmount')
        remainingBudgetAmount = data.get('remainingBudgetAmount')
        budgetType=data.get('budgetType')
        budgetCategory=data.get('budgetCategory')
        startDate = data.get('startDate')
        endDate = data.get('endDate')
        userID = data.get('userID')
        bankID = data.get('bankID')

        if not all([budgetTitle, budgetAmount, remainingBudgetAmount, budgetType, budgetCategory, startDate, endDate, userID, bankID]):
            return jsonify({"error": "Missing Required Fields"}), 400

        startDate = string_to_date(startDate)
        endDate = string_to_date(endDate)

        new_budget = create_budget(budgetTitle=budgetTitle, budgetAmount=budgetAmount, remainingBudgetAmount=remainingBudgetAmount, budgetType=budgetType, budgetCategory=budgetCategory, startDate=startDate, endDate=endDate, userID=userID, bankID=bankID)
        return jsonify({"message": "Budget Created Successfully", "budgetID": new_budget.budgetID}), 201

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@budget_views.route('/budgets/<int:user_id>', methods=['GET'])
@jwt_required()
def list_user_budgets(user_id):
    try:
        budgets = get_user_budgets_json(user_id)
        return jsonify(budgets)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(error="Failed To Fetch Budgets"), 500

@budget_views.route('/budget/<int:id>', methods=['GET'])
def get_budget_details(id):
    budget_data = get_budget_json(id)
    if not budget_data:
        return jsonify({'error': 'Budget Not Found'}), 404 
    return jsonify(budget_data)
