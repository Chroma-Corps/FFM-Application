import os
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

class CurrencyService:
    @staticmethod
    def load_currencies():
        with open(os.path.join(BASE_DIR, '..', 'assets', 'static', 'currencies.json'), "r", encoding="utf-8") as file:
            return json.load(file)

    @staticmethod
    def fetch_currency(currency_code):
        currencies = CurrencyService.load_currencies()
        currency = currencies.get(currency_code.upper())
        if currency:
            return currency.get("symbol", "")
        return ""

    @staticmethod
    def format_currency(amount, currency_code):
        currencies = CurrencyService.load_currencies()
        currency = currencies.get(currency_code.upper())

        if currency:
            symbol = currency.get("symbol", "")
            decimal_digits = currency.get("decimal_digits", 2)  # Fallback Default
        else:
            symbol = ""
            decimal_digits = 2  # Fallback Default

        formatted_amount = f"{symbol}{amount:.{decimal_digits}f}"
        return formatted_amount
