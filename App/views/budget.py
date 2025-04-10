from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from App.controllers import (
    create_budget,
    delete_budget,
    update_budget,
    get_user,
    get_budget_json,
    get_budget_users_json,
    get_circle_budgets_json,
    get_all_budget_transactions
)

budget_views = Blueprint('budget_views', __name__)

# 1. Creates A New Budget -  Handles Multi-User Associations
@budget_views.route('/create-budget', methods=['POST'])
@jwt_required()
def new_budget():
    try:
        data = request.get_json()
        budgetTitle = data.get('budgetTitle')
        budgetAmount = data.get('budgetAmount')
        budgetType=data.get('budgetType')
        budgetCategory= data.get('budgetCategory')
        transactionScope = data.get('transactionScope')
        startDate = data.get('startDate')
        endDate = data.get('endDate')
        userID = get_jwt_identity()
        bankID = data.get('bankID')
        userIDs = data.get('userIDs') or []
        color = data.get('color')

        if not all([budgetTitle, budgetAmount, budgetType, transactionScope, startDate, endDate, userID]):
           return jsonify({"status": "error", "message": "Missing Required Fields"}), 400

        new_budget = create_budget(
            budgetTitle=budgetTitle,
            budgetAmount=budgetAmount,
            budgetType=budgetType,
            budgetCategory=budgetCategory,
            transactionScope=transactionScope,
            startDate=startDate,
            endDate=endDate,
            userID=userID, # Creator Of Budget
            bankID=bankID,
            userIDs=userIDs, # Associated Users
            color=color)

        if new_budget is None:
            return jsonify({"status":"error", "message":"Failed To Create Budget"}), 500
        return jsonify({"status":"success", "message":"Budget Created Successfully", "budgetID": new_budget.budgetID, "budget": new_budget.get_json()}), 201

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

# 2. List User Budgets
@budget_views.route('/budgets', methods=['GET'])
@jwt_required()
def list_user_budgets():
    try:
        userID = get_jwt_identity()
        user = get_user(userID)
        circleID = user.activeCircleID
        budgets = get_circle_budgets_json(circleID)
        return jsonify({"status": "success", "budgets": budgets}), 200

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status": "error", "message": "Failed To Fetch Budgets"}), 500

# 3. Retrieve A Specific Budget
@budget_views.route('/budget/<int:budgetID>', methods=['GET'])
def get_budget_details(budgetID):
    try:
        budget_data = get_budget_json(budgetID)
        return jsonify({"status": "success", "budget": budget_data}), 200

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status": "error", "message": "Failed To Fetch Budget"}), 500

# 4. Retrieve Budget Transactions
@budget_views.route('/budget/<int:budgetID>/transactions', methods=['GET'])
def get_budget_transactions(budgetID):
    try:
        transactions = get_all_budget_transactions(budgetID)
        return jsonify({"status":"success", "transactions": transactions}), 200

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status":"error", "message": f"Failed To Fetch Transactions: {str(e)}"}), 500

# 5. Retrieve Budget Users
@budget_views.route('/budget/<int:budgetID>/users', methods=['GET'])
def get_budget_users(budgetID):
    try:
        users = get_budget_users_json(budgetID)
        return jsonify({"status":"success", "users": users}), 200

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status":"error", "message": f"Failed To Fetch Users: {str(e)}"}), 500

# 6. Delete Budget - Handles Non-Owner Users Of The Budget (AKA Those Who Didn't Create It)
@budget_views.route('/budget/<int:budgetID>', methods=['DELETE'])
@jwt_required()
def delete_user_budget(budgetID):
    try:
        userID = get_jwt_identity()
        result = delete_budget(userID, budgetID)

        if result == True:
            return jsonify({"status": "success", "message": "Budget Deleted Successfully"}), 200
        elif result == "Unauthorized":
            return jsonify({"status": "error", "message": "Unauthorized To Delete This Budget"}), 403
        else:
            return jsonify({"status": "error", "message": "Failed To Delete Budget"}), 500

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status": "error", "message": f"Failed To Delete Budget: {str(e)}"}), 500

# 7. Update Budget
@budget_views.route('/budget/<int:budgetID>', methods=['PUT'])
@jwt_required()
def update_user_budget(budgetID):
    try:
        data = request.get_json()
        budgetTitle = data.get('budgetTitle')
        budgetAmount = data.get('budgetAmount')
        budgetType = data.get('budgetType')
        budgetCategory = data.get('budgetCategory')
        startDate = data.get('startDate')
        endDate = data.get('endDate')
        bankID = data.get('bankID')
        color = data.get('color')

        updated_budget = update_budget(budgetID, budgetTitle, budgetAmount, budgetType, budgetCategory, startDate, endDate, bankID, color)

        if updated_budget:
            return jsonify({"status": "success", "message": "Budget Updated Successfully"}), 200
        else:
            return jsonify({"status": "error", "message": "Failed To Update Budget"}), 500

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status": "error", "message": f"Failed To Update Budget: {str(e)}"}), 500