from App.Backend.models import Transaction
from App.Backend.database import db

# Add Transaction
def add_transaction(userID, transactionTitle, transactionDesc, transactionType, transactionCategory, transactionAmount, transactionDate=None, transactionTime=None, budgetID=None):
    new_transaction = Transaction(
        userID=userID,
        transactionTitle=transactionTitle,
        transactionDesc=transactionDesc,
        transactionType=transactionType,
        transactionCategory=transactionCategory,
        transactionAmount=transactionAmount,
        transactionDate=transactionDate,
        transactionTime=transactionTime,
        budgetID=budgetID
    )
    db.session.add(new_transaction)
    db.session.commit()
    return new_transaction

# Get Transaction By ID
def get_transaction(id):
    return Transaction.query.get(id)

# Get All Transactions
def get_all_transactions():
    return Transaction.query.all()

# Get All Transactions (JSON)
def get_all_transactions_json():
    transactions = Transaction.query.all()
    if not transactions:
        return []
    transactions = [transaction.get_json() for transaction in transactions]
    return transactions

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
            transaction.transactionCategory = transactionCategory
        if transactionAmount:
            transaction.transactionAmount = transactionAmount
        if transactionDate:
            transaction.transactionDate = transactionDate
        if transactionTime:
            transaction.transactionTime = transactionTime
        if budgetID is not None:
            transaction.budgetID = budgetID
        db.session.add(transaction)
        db.session.commit()
        return transaction
    return None

# Delete A Transaction
def delete_transaction(id):
    transaction = get_transaction(id)
    if transaction:
        db.session.delete(transaction)
        db.session.commit()
        return True
    return False