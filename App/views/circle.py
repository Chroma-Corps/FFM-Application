from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from App.controllers import (
    create_circle,
    get_user_circles_json,
    get_circle_json,
    get_all_circle_transactions,
    get_circle_users_json,
    delete_circle,
    update_circle
)

circle_views = Blueprint('circle_views', __name__)

# 1. Creates A New Circle -  Handles Multi-User Associations
@circle_views.route('/create-circle', methods=['POST'])
@jwt_required()
def new_circle():
    try:
        data = request.get_json()
        circleName = data.get('circleName')
        circleType = data.get('circleType')
        circleColor = data.get('circleColor')
        userID = get_jwt_identity()
        userIDs = data.get('userIDs') or []

        if not all([circleName, circleType, circleColor, userID]):
           return jsonify({"status": "error", "message": "Missing Required Fields"}), 400

        new_circle = create_circle(
            circleName=circleName,
            circleType=circleType,
            circleColor=circleColor,
            userID=userID, # Creator Of Circle
            userIDs=userIDs) # Associated Users

        if new_circle is None:
            return jsonify({"status":"error", "message":"Failed To Create Circle"}), 500
        return jsonify({"status":"success", "message":"Circle Created Successfully", "circleID": new_circle.circleID, "circle": new_circle.get_json()}), 201

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

# 2. List User Circles
@circle_views.route('/circles', methods=['GET'])
@jwt_required()
def list_user_circles():
    try:
        userID = get_jwt_identity()
        circles = get_user_circles_json(userID)
        return jsonify({"status": "success", "circles": circles}), 200

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status": "error", "message": "Failed To Fetch Circles"}), 500

# 3. Retrieve A Specific Circle
@circle_views.route('/circle/<int:circleID>', methods=['GET'])
def get_circle_details(circleID):
    try:
        circle_data = get_circle_json(circleID)
        return jsonify({"status": "success", "circle": circle_data}), 200

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status": "error", "message": "Failed To Fetch Circle"}), 500

# 4. Retrieve Circle Transactions
@circle_views.route('/circle/<int:circleID>/transactions', methods=['GET'])
def get_circle_transactions(circleID):
    try:
        transactions = get_all_circle_transactions(circleID)
        return jsonify({"status":"success", "transactions": transactions}), 200

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status":"error", "message": f"Failed To Fetch Transactions: {str(e)}"}), 500

# 5. Retrieve Circle Users
@circle_views.route('/circle/<int:circleID>/users', methods=['GET'])
def get_circle_users(circleID):
    try:
        users = get_circle_users_json(circleID)
        return jsonify({"status":"success", "users": users}), 200

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status":"error", "message": f"Failed To Fetch Users: {str(e)}"}), 500

# 6. Delete Circle - Handles Non-Owner Users Of The Circle (AKA Those Who Didn't Create It)
@circle_views.route('/circle/<int:circleID>', methods=['DELETE'])
@jwt_required()
def delete_user_circle(circleID):
    try:
        userID = get_jwt_identity()
        result = delete_circle(userID, circleID)

        if result == True:
            return jsonify({"status": "success", "message": "Circle Deleted Successfully"}), 200
        elif result == "Unauthorized":
            return jsonify({"status": "error", "message": "Unauthorized To Delete This Circle"}), 403
        else:
            return jsonify({"status": "error", "message": "Failed To Delete Circle"}), 500

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status": "error", "message": f"Failed To Delete Circle: {str(e)}"}), 500

# 7. Update Circle
@circle_views.route('/circle/<int:circleID>', methods=['PUT'])
@jwt_required()
def update_user_circle(circleID):
    try:
        data = request.get_json()
        circleName = data.get('circleName')
        circleColor = data.get('circleColor')

        updated_circle = update_circle(circleID, circleName, circleColor)

        if updated_circle:
            return jsonify({"status": "success", "message": "Circle Updated Successfully"}), 200
        else:
            return jsonify({"status": "error", "message": "Failed To Update Circle"}), 500

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status": "error", "message": f"Failed To Update Circle: {str(e)}"}), 500