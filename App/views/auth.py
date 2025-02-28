from flask import Blueprint, render_template, jsonify, request, flash, send_from_directory, flash, redirect, url_for
from flask_jwt_extended import jwt_required, current_user, unset_jwt_cookies, set_access_cookies, get_jwt_identity, verify_jwt_in_request
from.index import index_views
from App.models.user import User
from App.controllers import (
    get_all_users,
    my_login_user,
    my_logout_user
)
from App.database import db

auth_views = Blueprint('auth_views', __name__)

'''
Page/Action Routes
'''    
@auth_views.route('/users', methods=['GET'])
def get_user_page():
    users = get_all_users()
    return

@auth_views.route('/identify', methods=['GET'])
@jwt_required()
def identify_page():
    return

@auth_views.route('/verify-token', methods=['GET'])
@jwt_required()
def verify_token():
    try:
        verify_jwt_in_request()
        current_user = get_jwt_identity()
        print(f"Token is valid, current user: {current_user}")
        return jsonify(valid=True, user=current_user), 200
    except Exception as e:
       print(f"Token verification error: {e}")
       return jsonify(valid=False, error=str(e)), 401


@auth_views.route('/login', methods=['POST'])
def login_action():
    try:
        data = request.get_json()
        token = authenticate_and_login_user(data['email'], data['password'])

        if not token:
            return jsonify({"message": "Bad email Or Password Given"}), 401

        user = db.session.query(User).filter(User.email == data['email']).first()

        if user:
            return jsonify({
                "message": "Login Successful",
                "token": token,
                "userID": user.id
            }), 200
        
        return jsonify({"message": "User not found"}), 404
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(error="An Error Occurred While Logging In"), 500



# Login Acion Helper Function
def authenticate_and_login_user(email, password):
    user = db.session.query(User).filter(User.email == email).first()
    print(f"DEBUG: Attempting User Login: {user}")
    if user and user.check_password(password):
        return my_login_user(user)
    return None

"""LogOut"""
@auth_views.route('/logout', methods=['POST'])
@jwt_required()
def logout_action():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        print(f"DEBUG: Logging Out: {user}")
        return my_logout_user()
    except Exception as e:
        print(f"DEBUG: Error During Logout: {e}")
        return jsonify(error="An Error Occurred While Logging Out"), 500

'''
API Routes
'''

# @auth_views.route('/api/login', methods=['POST'])
# def user_login_api():
#   data = request.json
#   token = login(data['email'], data['password'])
#   if not token:
#     return jsonify(message='bad email or password given'), 401
#   response = jsonify(access_token=token) 
#   set_access_cookies(response, token)
#   return response

# @auth_views.route('/api/identify', methods=['GET'])
# @jwt_required()
# def identify_user():
#     return jsonify({'message': f"email: {current_user.email}, id : {current_user.id}"})

# @auth_views.route('/api/logout', methods=['GET'])
# def logout_api():
#     response = jsonify(message="Logged Out!")
#     unset_jwt_cookies(response)
#     return response