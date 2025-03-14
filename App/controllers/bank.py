from App.database import db
from App.models import Bank
from App.services.currency import CurrencyService
from App.controllers.userBank import create_user_bank

# Create A New Bank
def create_bank(userID, bankTitle, bankCurrency, bankAmount, userIDs=None):
    try:
        new_bank = Bank (
            bankTitle=bankTitle,
            bankCurrency=bankCurrency,
            bankAmount=bankAmount,
            remainingBankAmount=bankAmount
        )
        db.session.add(new_bank)
        db.session.commit()

        create_user_bank(userID, new_bank.bankID)

        if userIDs:
            for otherUserID in userIDs:
                create_user_bank(otherUserID, new_bank.bankID)
        return new_bank

    except Exception as e:
        db.session.rollback()
        print(f"Fail To Create Bank: {e}")
        return None

# Get Bank By ID
def get_bank(bankID):
    return Bank.query.get(bankID)

# Get Bank By ID (JSON)
def get_bank_json(bankID):
    bank = Bank.query.get(bankID)
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
        bank = get_bank(bankID)

        if not bank:
            print(f"No Bank Found With ID {bankID}")
            return None

        if bank:
            if bankTitle:
                bank.bankTitle = bankTitle
            if bankCurrency:
                bank.bankCurrency = CurrencyService.fetch_currency(bankCurrency)
            if bankAmount is not None:
                bank.bankAmount = bankAmount
                bank.remainingBankAmount = bankAmount
            db.session.commit()

            print(f"Bank With ID {bankID} Updated Successfully.")
            return bank
        return None

    except Exception as e:
        db.session.rollback()
        print(f"Failed To Update Bank: {e}")
        return None