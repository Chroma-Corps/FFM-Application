from flask import Blueprint, render_template, jsonify, request, flash, send_from_directory, flash, redirect, url_for
from flask_jwt_extended import jwt_required, current_user, unset_jwt_cookies, set_access_cookies, get_jwt_identity, verify_jwt_in_request
from.index import index_views
from App.models.user import User
from App.controllers import (
    login
)
from App.database import db

auth_views = Blueprint('auth_views', __name__)

"""Login"""
@auth_views.route('/login', methods=['POST'])
def login_action():
    try:
        data = request.get_json()
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({"error":'Email And Password Are Required'}), 400
        
        token = login(data['email'], data['password'])
        if not token:
            return jsonify({"error": "Bad email Or Password Given"}), 401
        return jsonify(access_token=token), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(error="An Error Occurred While Logging In"), 500

"""Logout"""
@auth_views.route('/logout', methods=['POST'])
def logout_action():
    try:
        response = jsonify(message="Logged Out Successfully")
        unset_jwt_cookies(response)
        return response, 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify(error="An Error Occurred While Logging Out"), 500