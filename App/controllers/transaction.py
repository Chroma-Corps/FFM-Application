from App.controllers.budget import get_budget
from App.models import Transaction
from App.database import db
from App.services.category import CategoryService

# Add Transaction
def add_transaction(userID, transactionTitle, transactionDesc, transactionType, transactionCategory, transactionAmount, transactionDate=None, transactionTime=None, budgetID=None, bankID=None):
    try:
        if transactionCategory is not None:
            selectedCategory = CategoryService.get_category(transactionCategory)
        else:
            selectedCategory = None 

        new_transaction = Transaction(
            userID=userID,
            transactionTitle=transactionTitle,
            transactionDesc=transactionDesc,
            transactionType=transactionType,
            transactionCategory=selectedCategory,
            transactionAmount=transactionAmount,
            transactionDate=transactionDate,
            transactionTime=transactionTime,
            budgetID=budgetID,
            bankID=get_budget(budgetID).bankID
        )
        db.session.add(new_transaction)
        db.session.commit()
        return new_transaction

    except Exception as e:
        db.session.rollback()
        print(f"Failed To Add Transaction: {e}")
        return None

# Get Transaction By ID
def get_transaction(id):
    return Transaction.query.get(id)

# Get All Transactions
def get_all_transactions():
    return Transaction.query.all()

# Get Budget By ID (JSON)
def get_transaction_json(id):
    transaction = Transaction.query.get(id)
    if transaction:
        return transaction.get_json()
    return None

# Get All Transactions (JSON)
def get_all_transactions_json():
    transactions = Transaction.query.all()
    if not transactions:
        return []
    transactions = [transaction.get_json() for transaction in transactions]
    return transactions

# Get Transactions for Specific User (JSON)
def get_user_transactions_json(user_id):
    transactions = Transaction.query.filter_by(userID=user_id).all()
    if not transactions:
        return []
    transactions = [transactions.get_json() for transactions in transactions]
    return transactions

def get_all_active_transactions():
    return Transaction.query.filter_by(voided=False).all()

def get_all_inactive_transactions():
    return Transaction.query.filter_by(voided=True).all()

def get_user_active_transactions(user_id):
    return Transaction.query.filter_by(userID=user_id, voided=False).all()

def get_user_inactive_transactions(user_id):
    return Transaction.query.filter_by(userID=user_id, voided=True).all()

# Update Existing Transaction
def update_transaction(id, transactionTitle=None, transactionDesc=None, transactionType=None, transactionCategory=None, transactionAmount=None, transactionDate=None, transactionTime=None, budgetID=None):
    transaction = get_transaction(id)
    if transaction:
        if transactionTitle:
            transaction.transactionTitle = transactionTitle
        if transactionDesc:
            transaction.transactionDesc = transactionDesc
        if transactionType:
            transaction.transactionType = transactionType
        if transactionCategory:
            transaction.transactionCategory = CategoryService.get_category(transactionCategory)
        if transactionAmount:
            transaction.transactionAmount = transactionAmount
        if transactionDate:
            transaction.transactionDate = transactionDate
        if transactionTime:
            transaction.transactionTime = transactionTime
        if budgetID is not None:
            transaction.budgetID = budgetID

        db.session.commit()
        return transaction
    return None

def void_transaction(id):
    transaction = get_transaction(id)
    if transaction:
        transaction.voided = True
        db.session.commit()