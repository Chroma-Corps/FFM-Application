from App.models.user import User
from flask import Blueprint, jsonify, request, flash

from App.controllers import (
    create_user,
    get_all_users_json,
    get_user_by_email
)

user_views = Blueprint('user_views', __name__)

# 1. List All Users
@user_views.route('/allusers', methods=['GET'])
def get_all_users():
    users = get_all_users_json()
    return jsonify({"status": "success", "users": users})

# 2. Create New User
@user_views.route('/register', methods=['POST'])
def register_action():
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
        return jsonify({"status": "success", "message": "Registration Successful!"}), 201

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500