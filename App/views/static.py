from flask import Blueprint, jsonify
from App.services.category import CategoryService

static_views = Blueprint('static_views', __name__)

@static_views.route('/ffm/categories', methods=['GET'])
def get_categories():
    try:
        categories = CategoryService.load_transaction_categories()
        return jsonify({"status":"success", "categories": categories})

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status":"error", "messsage": str(e)}), 500

@static_views.route('/ffm/categories/<string:category_key>', methods=['GET'])
def get_category(category_key):
    try:
        category = CategoryService.get_category(category_key)
        return jsonify({"status":"success", "category": category})

    except Exception as e:
        print(f"An Error Occurred: {e}")
        return jsonify({"status":"error", "message": str(e)}), 500