import os
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

class CategoryService:

    @staticmethod
    def load_transaction_categories():
        with open(os.path.join(BASE_DIR, '..', 'assets', 'static', 'categories.json'), "r", encoding="utf-8") as file:
            return json.load(file)

    @staticmethod
    def get_category(category_key):
        categories = CategoryService.load_transaction_categories()
        category = categories.get(category_key.upper())

        if category:
            return category
        else:
            return ("Unknown Category")