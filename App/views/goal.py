from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from App.controllers import (
    create_goal,
    delete_goal,
    update_goal,
    get_goal_json,
    get_goal_users_json,
    get_user_goals_json,
    get_all_goal_transactions
)

goal_views = Blueprint('goal_views', __name__)

# 1. Creates A New Goal -  Handles Multi-User Associations
@goal_views.route('/create-goal', methods=['POST'])
@jwt_required()
def new_goal():
    try:
        data = request.get_json()
        goalTitle = data.get('goalTitle')
        targetAmount = data.get('targetAmount')
        goalType=data.get('goalType')
        startDate = data.get('startDate')
        endDate = data.get('endDate')
        userID = get_jwt_identity()
        userIDs = data.get('userIDs') or []

        if not all([goalTitle, targetAmount, goalType, startDate, endDate, userID]):
           return jsonify({"status": "error", "message": "Missing Required Fields"}), 400

        new_goal = create_goal(
            goalTitle=goalTitle,
            targetAmount=targetAmount,
            goalType=goalType,
            startDate=startDate,
            endDate=endDate,
            userID=userID, # Creator Of Goal
            userIDs=userIDs) # Associated Users

        if new_goal is None:
            return jsonify({"status":"error", "message":"Failed To Create Goal"}), 500
        return jsonify({"status":"success", "message":"Goal Created Successfully", "goalID": new_goal.goalID, "goal": new_goal.get_json()}), 201

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

# 2. List User Goals
@goal_views.route('/goals', methods=['GET'])
@jwt_required()
def list_user_goals():
    try:
        userID = get_jwt_identity()
        goals = get_user_goals_json(userID)
        return jsonify({"status": "success", "goals": goals}), 200

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status": "error", "message": "Failed To Fetch Goals"}), 500

# 3. Retrieve A Specific Goal
@goal_views.route('/goal/<int:goalID>', methods=['GET'])
def get_goal_details(goalID):
    try:
        goal_data = get_goal_json(goalID)
        return jsonify({"status": "success", "goal": goal_data}), 200

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status": "error", "message": "Failed To Fetch Goal"}), 500

# 4. Retrieve Goal Transactions
@goal_views.route('/goal/<int:goalID>/transactions', methods=['GET'])
def get_goal_transactions(goalID):
    try:
        transactions = get_all_goal_transactions(goalID)
        return jsonify({"status":"success", "transactions": transactions}), 200

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status":"error", "message": f"Failed To Fetch Transactions: {str(e)}"}), 500

# 5. Retrieve Goal Users
@goal_views.route('/goal/<int:goalID>/users', methods=['GET'])
def get_goal_users(goalID):
    try:
        users = get_goal_users_json(goalID)
        return jsonify({"status":"success", "users": users}), 200

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status":"error", "message": f"Failed To Fetch Users: {str(e)}"}), 500

# 6. Delete Goal - Handles Non-Owner Users Of The Goal (AKA Those Who Didn't Create It)
@goal_views.route('/goal/<int:goalID>', methods=['DELETE'])
@jwt_required()
def delete_user_goal(goalID):
    try:
        userID = get_jwt_identity()
        result = delete_goal(userID, goalID)

        if result == True:
            return jsonify({"status": "success", "message": "Goal Deleted Successfully"}), 200
        elif result == "Unauthorized":
            return jsonify({"status": "error", "message": "Unauthorized To Delete This Goal"}), 403
        else:
            return jsonify({"status": "error", "message": "Failed To Delete Goal"}), 500

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status": "error", "message": f"Failed To Delete Goal: {str(e)}"}), 500

# 7. Update Goal
@goal_views.route('/goal/<int:goalID>', methods=['PUT'])
@jwt_required()
def update_user_goal(goalID):
    try:
        data = request.get_json()
        goalTitle = data.get('goalTitle')
        targetAmount = data.get('targetAmount')
        goalType = data.get('goalType')
        startDate = data.get('startDate')
        endDate = data.get('endDate')

        updated_goal = update_goal(goalID, goalTitle, targetAmount, goalType, startDate, endDate)

        if updated_goal:
            return jsonify({"status": "success", "message": "Goal Updated Successfully"}), 200
        else:
            return jsonify({"status": "error", "message": "Failed To Update Goal"}), 500

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status": "error", "message": f"Failed To Update Goal: {str(e)}"}), 500