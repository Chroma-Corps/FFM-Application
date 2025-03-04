from flask import Blueprint, jsonify
from services.category import CategoryService

static_views = Blueprint('static_views', __name__)

@static_views.route('/ffm/categories', methods=['GET'])
def get_categories():
    try:
        categories = CategoryService.load_transaction_categories()
        return jsonify(categories)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@static_views.route('/ffm/categories/<string:category_key>', methods=['GET'])
def get_category(category_key):
    try:
        category = CategoryService.get_category(category_key)
        return jsonify({"category": category})
    except Exception as e:
        return jsonify({"error": str(e)}), 500