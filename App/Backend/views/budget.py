from flask import Blueprint, render_template, jsonify, request, send_from_directory, flash, redirect, url_for
from App.Backend.models.budget import Budget

from App.Backend.controllers import (
    get_all_budgets_json
)

budget_views = Blueprint('budget_views', __name__)

@budget_views.route('/allbudgets', methods=['GET'])
def list_all_budgets():
    budgets = get_all_budgets_json()
    return jsonify(budgets)