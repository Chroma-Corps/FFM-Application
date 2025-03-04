from App.models import Transaction
from App.database import db
from App.models.budget import Budget

# Add Transaction
def add_transaction(userID, transactionTitle, transactionDesc, transactionType, transactionCategory, transactionAmount, transactionDate=None, transactionTime=None, budgetID=None, bankID=None):
    new_transaction = Transaction(
        userID=userID,
        transactionTitle=transactionTitle,
        transactionDesc=transactionDesc,
        transactionType=transactionType,
        transactionCategory=transactionCategory,
        transactionAmount=transactionAmount,
        transactionDate=transactionDate,
        transactionTime=transactionTime,
        budgetID=budgetID,
        bankID=bankID
    )
    db.session.add(new_transaction)

    # Update budget's remaining amount if tied to a budget
    if budgetID:
        budget = Budget.query.get(budgetID)
        if budget:
            budget.remainingBudgetAmount -= transactionAmount


    db.session.commit()
    return new_transaction

# Get Transaction By ID
def get_transaction(id):
    return Transaction.query.get(id)

# Get Transaction By ID (JSON)
def get_transaction_json(id):
    transaction = Transaction.query.get(id)
    if transaction:
        return transaction.get_json()
    return None

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

# Get Transactions for Specific User (JSON)
def get_user_transactions_json(user_id):
    transactions = Transaction.query.filter_by(userID=user_id).all()
    if not transactions:
        return []
    transactions = [transactions.get_json() for transactions in transactions]
    return transactions

def get_transactions_by_budget(budgetID):
    transactions = Transaction.query.filter_by(budgetID=budgetID).all()
    return [transaction.get_json() for transaction in transactions]

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