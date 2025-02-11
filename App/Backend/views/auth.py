from flask import Blueprint, render_template, jsonify, request, flash, send_from_directory, flash, redirect, url_for
from flask_jwt_extended import jwt_required, current_user, unset_jwt_cookies, set_access_cookies

from.index import index_views

from App.Backend.controllers import (
    login,
    get_all_users
)

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

@auth_views.route('/login', methods=['POST'])
def login_action():
    data = request.get_json()
    token = login(data['email'], data['password'])

    if not token:
        return jsonify({"message": "Bad email Or Password Given"}), 401

    response = jsonify({"message": "Login Successful"})
    set_access_cookies(response, token)
    return response

@auth_views.route('/logout', methods=['GET'])
def logout_action():
    response = redirect(request.referrer) 
    flash("Logged Out!")
    unset_jwt_cookies(response)
    return response

'''
API Routes
'''

@auth_views.route('/api/login', methods=['POST'])
def user_login_api():
  data = request.json
  token = login(data['email'], data['password'])
  if not token:
    return jsonify(message='bad email or password given'), 401
  response = jsonify(access_token=token) 
  set_access_cookies(response, token)
  return response

@auth_views.route('/api/identify', methods=['GET'])
@jwt_required()
def identify_user():
    return jsonify({'message': f"email: {current_user.email}, id : {current_user.id}"})

@auth_views.route('/api/logout', methods=['GET'])
def logout_api():
    response = jsonify(message="Logged Out!")
    unset_jwt_cookies(response)
    return response