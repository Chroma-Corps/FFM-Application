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

        if isinstance(category_key, list):
            result = []
            for key in category_key:
                category = categories.get(key.upper())
                if category:
                    result.append(category)
                else:
                    result.append( "Unknown Category")
            return result
        else:
            category = categories.get(category_key.upper())
            return [category] if category else ["Unknown Category"]