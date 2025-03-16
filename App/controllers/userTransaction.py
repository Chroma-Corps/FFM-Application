from App.database import db
from App.models import UserTransaction

# Associates A User With A Transaction
def create_user_transaction(userID, transactionID):
    try:
        new_user_transaction = UserTransaction(userID=userID, transactionID=transactionID)
        db.session.add(new_user_transaction)
        db.session.commit()
        return new_user_transaction

    except Exception as e:
        db.session.rollback()
        print(f"Failed To Create User-Transaction Relationship: {e}")
        return None

# Retrieves All Transactions Associated With A User
def get_user_transactions_json(userID):
    try:
        user_transactions = UserTransaction.query.filter_by(userID=userID).all()
        return [user_transactions.transaction.get_json() for user_transaction in user_transactions] if user_transactions else []

    except Exception as e:
        print(f"Error Fetching Transactions For User {userID}: {e}")
        return []

# Verifies Whether The User Is The Creator Of The Transaction
def is_transaction_owner(currentUserID, transactionID):
    user_transaction = UserTransaction.query.filter_by(transactionID=transactionID).order_by(UserTransaction.userTransactionID).first()
    if user_transaction and user_transaction.userID == currentUserID:
        return True
    return False

# Retrieve All Active Transactions
def get_user_active_transactions(userID):
    try:
        user_transactions = UserTransaction.query.filter_by(userID=userID).all()
        return [ut.transaction for ut in user_transactions if not ut.transaction.voided]

    except Exception as e:
        print(f"Error Fetching Active Transactions For User {userID}: {e}")
        return []

# Retrieve All Inactive Transactions
def get_user_inactive_transactions(userID):
    try:
        user_transactions = UserTransaction.query.filter_by(userID=userID).all()
        return [ut.transaction for ut in user_transactions if ut.transaction.voided]

    except Exception as e:
        print(f"Error Fetching Inactive Transactions For User {userID}: {e}")
        return []

def get_user_transaction_by_transaction_id(transactionID):
    return db.session.query(UserTransaction).filter(UserTransaction.transactionID == transactionID).first()
