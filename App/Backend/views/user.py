from flask import Blueprint, render_template, jsonify, request, send_from_directory, flash, redirect, url_for
from flask_jwt_extended import jwt_required, current_user as jwt_current_user
from.index import index_views

from App.Backend.models.user import User

from App.Backend.controllers import (
    create_user,
    get_all_users,
    get_all_users_json,
    jwt_required
)

user_views = Blueprint('user_views', __name__)

@user_views.route('/allusers', methods=['GET'])
def get_user_page():
    users = get_all_users_json()
    return jsonify(users)

@user_views.route('/users', methods=['POST'])
def create_user_action():
    data = request.form
    flash(f"User With Email: {data['email']} created!")
    create_user(data['email'], data['password'])
    return

@user_views.route('/register', methods=['POST'])
def register_action():
    data = request.get_json()
    name = data['name']
    email = data['email']
    password = data['password']

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({"message": "A User With This Email Already Exists"}), 400

    newuser = create_user(name, email, password)

    if newuser:
        return jsonify({"message": "Registration Successful"}), 201

    return jsonify(error="An Unknown Error Occurred"), 500