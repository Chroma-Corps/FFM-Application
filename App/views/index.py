from flask import Blueprint, redirect, render_template, request, send_from_directory, jsonify
from App.controllers import create_user, initialize

index_views = Blueprint('index_views', __name__)

@index_views.route('/', methods=['GET'])
def index_page():
    return jsonify(message='Family Financial Management Application')

@index_views.route('/init', methods=['GET'])
def init():
    initialize()
    return jsonify(message='Database Initialized!')

@index_views.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status':'healthy'})