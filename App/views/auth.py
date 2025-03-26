from App.controllers.auth import login
from flask import Blueprint, jsonify, request
from flask_jwt_extended import unset_jwt_cookies

auth_views = Blueprint('auth_views', __name__)

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