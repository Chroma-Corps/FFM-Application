from App.database import db
from App.models import Bank, Budget, UserBank
from App.services.currency import CurrencyService
from App.controllers.userBank import create_user_bank, is_bank_owner

# Create A New Bank
def create_bank(userID, circleID, bankTitle, bankCurrency, bankAmount, isPrimary, userIDs=None):
    try:
        new_bank = Bank (
            bankTitle=bankTitle,
            bankCurrency=bankCurrency,
            bankAmount=bankAmount,
            remainingBankAmount=bankAmount,
            isPrimary=isPrimary,
            circleID=circleID
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

# Get Bank Based On Circle
def get_bank_by_circle_json(circleID):
    banks = Bank.query.filter_by(circleID=circleID).all()
    if not banks:
        return []
    banks = [bank.get_json() for bank in banks]
    return banks

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
def update_bank(bankID, bankTitle=None, bankCurrency=None, bankAmount=None, isPrimary=None):
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
            if isPrimary is not None:
                bank.isPrimary = isPrimary
            db.session.commit()

            print(f"Bank With ID {bankID} Updated Successfully.")
            return bank
        return None

    except Exception as e:
        db.session.rollback()
        print(f"Failed To Update Bank: {e}")
        return None

# Get Budgets Associated With A Bank
def get_all_bank_budgets(bankID):
    budgets = Budget.query.filter_by(bankID=bankID).all()
    return [budget.get_json() for budget in budgets]

# Delete Bank
def delete_bank(userID, bankID):
    try:
        if not is_bank_owner(userID, bankID):
            return "Unauthorized"

        bank = get_bank(bankID)
        if not bank:
            return None

        user_banks = UserBank.query.filter_by(bankID=bankID).all()
        for user_bank in user_banks:
            db.session.delete(user_bank)

        db.session.delete(bank)
        db.session.commit()
        return True

    except Exception as e:
        db.session.rollback()
        print(f"Failed To Delete Bank: {e}")
        return None