from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from App.controllers import (
    create_user,
    get_all_users_json,
    get_user_by_email
)
from App.controllers.user import get_user_json

user_views = Blueprint('user_views', __name__)

# 1. List All Users
@user_views.route('/allusers', methods=['GET'])
def get_all_users():
    users = get_all_users_json()
    return jsonify({"status": "success", "users": users}), 200

# 2. Create New User
@user_views.route('/create-user', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        existing_user = get_user_by_email(email)
        if existing_user:
            return jsonify({"status": "error", "message": "Uh-Oh! A User With This Email Already Exists!"}), 400

        new_user = create_user(name, email, password)
        if new_user is None:
            return jsonify({"status":"error", "message":"Failed To Register New User"}), 500
        return jsonify({"status": "success", "message": "Registered Successfully"}), 201

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status": "error", "message": "An Error Occurred During Registration"}), 500

# 3. Get Current User
@user_views.route('/user', methods=['GET'])
@jwt_required()
def get_user():
    currentUserID = get_jwt_identity()

    user_data = get_user_json(currentUserID)
    if user_data is None:
        return jsonify({"status":"error", "message":"Failed To Retrieve User Data"}), 500
    return jsonify({"status": "success", "user": user_data}), 200