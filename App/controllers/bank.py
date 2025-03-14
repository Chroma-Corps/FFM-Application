from App.controllers.userBank import create_user_bank
from App.database import db
from App.models import Bank
from App.models.transaction import Transaction
from App.services.currency import CurrencyService

# Create A New Bank
def create_bank(userID, bankTitle, bankCurrency, bankAmount):
    try:
        new_bank = Bank (bankTitle=bankTitle,
            bankCurrency=bankCurrency,
            bankAmount=bankAmount,
            remainingBankAmount=bankAmount
        )
        db.session.add(new_bank)
        db.session.commit()

        create_user_bank(userID, new_bank.bankID)
        return new_bank

    except Exception as e:
        db.session.rollback()
        print(f"Fail To Create Bank: {e}")
        return None

# Get Bank By ID
def get_bank(id):
    return Bank.query.get(id)

# Get Bank By ID (JSON)
def get_bank_json(id):
    bank = Bank.query.get(id)
    if bank:
        return bank.get_json()
    return None

# Get All Banks
def get_all_banks():
    return Bank.query.all()

# Get All Banks (JSON)
def get_all_banks_json():
    banks = Bank.query.all()
    if not banks:
        return []
    banks = [bank.get_json() for bank in banks]
    return banks

# Update Existing Bank
def update_bank(bankID, bankTitle=None, bankCurrency=None, bankAmount=None):
    try:
        bank = Bank.query.get(bankID)

        if not bank:
            return None

        if bankTitle:
            bank.bankTitle = bankTitle
        if bankCurrency:
            bank.bankCurrency = CurrencyService.fetch_currency(bankCurrency)
        if bankAmount is not None:
            bank.bankAmount = bankAmount
            bank.remainingBankAmount = bankAmount

        db.session.commit()
        return bank
    except Exception as e:
        db.session.rollback()
        print(f"Failed To Update Bank: {e}")
        return None

# Get Bank Transactions
def get_bank_transactions(bankID):
    return Transaction.query.filter_by(bankID=bankID).all()

# Get Bank Transactions (JSON)
def get_bank_transactions_json(bankID):
    transactions = Transaction.query.filter_by(bankID=bankID).all()
    if not transactions:
        return []
    transactions_json = [transaction.get_json() for transaction in transactions]
    return transactions_json

# Delete Bank
def delete_bank(bank_id):
    bank = Bank.query.get(bank_id)
    if not bank:
        return None

    db.session.delete(bank)
    db.session.commit()
    return bank