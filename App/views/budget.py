from flask import Blueprint, render_template, jsonify, request, send_from_directory, flash, redirect, url_for
from flask_jwt_extended import get_jwt_identity, jwt_required, current_user, unset_jwt_cookies, set_access_cookies
from App.models.budget import Budget
import datetime

from App.controllers import (
    get_user_budgets_json,
    get_budget_json,
    create_budget
)

budget_views = Blueprint('budget_views', __name__)

@budget_views.route('/create-budget', methods=['POST'])
@jwt_required()
def new_budget():
    try:
        data = request.get_json()
        budgetTitle = data.get('budgetTitle')
        budgetAmount = data.get('budgetAmount')
        budgetType=data.get('budgetType')
        budgetCategory=data.get('budgetCategory')
        startDate = data.get('startDate')
        endDate = data.get('endDate')
        userID = get_jwt_identity()
        bankID = data.get('bankID')

        if not all([budgetTitle, budgetAmount, budgetType, budgetCategory, startDate, endDate, userID, bankID]):
            return jsonify({"error": "Missing Required Fields"}), 400

        new_budget = create_budget(budgetTitle=budgetTitle, budgetAmount=budgetAmount, budgetType=budgetType, budgetCategory=budgetCategory, startDate=startDate, endDate=endDate, userID=userID, bankID=bankID)
        return jsonify({"message": "Budget Created Successfully", "budgetID": new_budget.budgetID}), 201

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@budget_views.route('/budgets', methods=['GET'])
@jwt_required()
def list_user_budgets():
    try:
        user_id = get_jwt_identity()
        budgets = get_user_budgets_json(user_id)
        return jsonify(budgets), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(error="Failed To Fetch Budgets"), 500

@budget_views.route('/budget/<int:budgetID>', methods=['GET'])
def get_budget_details(budgetID):
    try:
        budget_data = get_budget_json(budgetID)
        return jsonify(budget_data), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(error="Failed To Fetch Budget"), 500