from App.database import db
from App.models import UserBank

def create_user_bank(userID, bankID):
    try:
        new_user_bank = UserBank(userID=userID, bankID=bankID)
        db.session.add(new_user_bank)
        db.session.commit()
        return new_user_bank

    except Exception as e:
        db.session.rollback()
        print(f"Failed To Create User-Bank Relationship: {e}")
        return None

def get_user_banks_json(userID):
    try:
        user_banks = UserBank.query.filter_by(userID=userID).all()
        return [user_bank.bank.get_json() for user_bank in user_banks] if user_banks else []

    except Exception as e:
        print(f"Error Fetching Banks For User {userID}: {e}")
        return []