from App.database import db
from App.models import Transaction
from App.services.category import CategoryService
from App.services.datetime import convert_to_date, convert_to_time
from App.controllers.userTransaction import create_user_transaction,is_transaction_owner

# Add A New Transaction
def add_transaction(transactionTitle, transactionDesc, transactionType, transactionCategory, transactionAmount, bankID, userID, userIDs=None, transactionDate=None, transactionTime=None, budgetID=None):
    try:
        if transactionCategory is not None:
            selectedCategory = CategoryService.get_category(transactionCategory)
        else:
            selectedCategory = None

        new_transaction = Transaction(
            transactionTitle=transactionTitle,
            transactionDesc=transactionDesc,
            transactionType=transactionType,
            transactionCategory=selectedCategory,
            transactionAmount=transactionAmount,
            transactionDate=transactionDate,
            transactionTime=transactionTime,
            budgetID=budgetID,
            bankID=bankID
        )
        db.session.add(new_transaction)
        db.session.commit()

        create_user_transaction(userID, new_transaction.transactionID)

        if userIDs:
            for otherUserID in userIDs:
                create_user_transaction(otherUserID, new_transaction.transactionID)
        return new_transaction

    except Exception as e:
        db.session.rollback()
        print(f"Failed To Create Transaction: {e}")
        return None

# Get Transaction By ID
def get_transaction(transactionID):
    return Transaction.query.get(transactionID)

# Get Transaction By ID (JSON)
def get_transaction_json(transactionID):
    transaction = Transaction.query.get(transactionID)
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
def get_user_transactions_json(userID):
    transactions = Transaction.query.filter_by(userID=userID).all()
    if not transactions:
        return []
    transactions = [transactions.get_json() for transactions in transactions]
    return transactions

# Get Transaction Associated With A Budget
def get_all_budget_transactions(budgetID):
    transactions = Transaction.query.filter_by(budgetID=budgetID).all()
    return [transaction.get_json() for transaction in transactions]

# Get Transaction Associated With A Bank
def get_all_bank_transactions(bankID):
    transactions = Transaction.query.filter_by(bankID=bankID).all()
    return [transaction.get_json() for transaction in transactions]

# Update Existing Transaction
def update_transaction(transactionID, transactionTitle=None, transactionDesc=None, transactionType=None, transactionCategory=None, transactionAmount=None, transactionDate=None, transactionTime=None, budgetID=None):
    try:
        transaction = get_transaction(transactionID)

        if transaction:
            if transactionTitle:
                transaction.transactionTitle = transactionTitle
            if transactionDesc:
                transaction.transactionDesc = transactionDesc
            if transactionType:
                transaction.transactionType = transactionType
            if transactionCategory:
                transaction.transactionCategory = CategoryService.get_category(transactionCategory)
            if transactionAmount is not None:
                transaction.transactionAmount = transactionAmount
            if transactionDate:
                transaction.transactionDate = convert_to_date(transactionDate)
            if transactionTime:
                transaction.transactionTime = convert_to_time(transactionTime)
            if budgetID:
                transaction.budgetID = budgetID
            db.session.commit()

            print(f"Transaction With ID {transactionID} Updated Successfully.")
            return transaction
        return None

    except Exception as e:
        db.session.rollback()
        print(f"Failed To Update Transaction: {e}")
        return None

# Void Transaction
def void_transaction(userID, transactionID):
    try:
        if not is_transaction_owner(userID, transactionID):
            return "Unauthorized"

        transaction = get_transaction(transactionID)
        if not transaction:
            return None

        transaction.voided = True
        db.session.commit()

    except Exception as e:
        db.session.rollback()
        print(f"Failed To Void Transaction: {e}")
        return None