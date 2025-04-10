from App.controllers.auth import login, signup
from App.controllers.user import create_user
from App.controllers.user import get_user_by_email
from flask import Blueprint, jsonify, request
from flask_jwt_extended import unset_jwt_cookies

auth_views = Blueprint('auth_views', __name__)

"""Register/Sign-Up"""
@auth_views.route('/register', methods=['POST'])
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
        return jsonify({"status": "success", "message": "Registered Successfully"}), 201

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status": "error", "message": "An Error Occurred During Registration"}), 500
    
"""Login"""
@auth_views.route('/login', methods=['POST'])
def login_action():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
    
        if not all([email, password]):
            return jsonify({"status": "error", "message":"Email And Password Are Required"}), 400
        
        token = login(
            email=email,
            password=password)

        if token is None:
            return jsonify({"status": "error", "message": "Bad Email Or Password Given"}), 401
        return jsonify({"status": "success", "message": "Logged In Successfully", "access_token": token}), 200

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify(error="An Error Occurred While Logging In"), 500

"""Logout"""
@auth_views.route('/logout', methods=['POST'])
def logout_action():
    try:
        response = jsonify({"status": "success", "message": "Logged Out Successfully"})
        unset_jwt_cookies(response)
        return response, 200

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status": "error", "message": "An Error Occurred While Logging Out"}), 500