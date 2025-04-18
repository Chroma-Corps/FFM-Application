from App.controllers.transactionAttachment import add_transaction_attachment
from App.database import db
from App.controllers.goal import get_goal
from App.controllers.bank import get_bank
from App.controllers.budget import get_budget
from App.controllers.user import get_user_json
from App.models.bank import Bank
from App.models.goal import Goal
from App.services.category import CategoryService
from App.services.datetime import convert_to_date, convert_to_time
from App.models import Transaction, TransactionType, Budget, TransactionScope
from App.controllers.userTransaction import create_user_transaction, is_transaction_owner, get_user_transaction_by_transaction_id

# Add A New Transaction
def add_transaction(transactionTitle, transactionDesc, transactionType, transactionCategory, transactionAmount, bankID, userID, goalID, userIDs=None, transactionDate=None, transactionTime=None, budgetID=None, attachments=None):
    try:
        userIDs = userIDs or []
        attachments = attachments or []
        user = get_user_json(userID)
        circleID=user['activeCircle']

        transaction_data, error = transaction_handler(
            userID, userIDs, transactionTitle, transactionDesc, 
            transactionType, transactionCategory, transactionAmount, 
            transactionDate, transactionTime, budgetID, bankID, goalID, attachments, circleID
        )
        if error:
            return None, error

        new_transaction = Transaction(
            transactionTitle=transaction_data['transactionTitle'],
            transactionDesc=transaction_data['transactionDesc'],
            transactionType=transaction_data['transactionType'],
            transactionCategory=CategoryService.get_category(transaction_data['transactionCategory']) if transaction_data['transactionCategory'] else None,
            transactionAmount=transaction_data['transactionAmount'],
            transactionDate=transaction_data['transactionDate'],
            transactionTime=transaction_data['transactionTime'],
            budgetID=transaction_data['budgetID'],
            bankID=transaction_data['bankID'],
            circleID=circleID,
            goalID=transaction_data['goalID'],
            attachments=None
        )
        db.session.add(new_transaction)
        db.session.commit()

        if attachments:
            for attachment in attachments:
                print(attachment)
                add_transaction_attachment(
                    transactionID=new_transaction.transactionID,
                    fileName=attachment.get('name'),
                    fileType=attachment.get('mimeType'),
                    fileSize=attachment.get('size'),
                    fileUri=attachment.get('uri')
                )

        create_user_transaction(userID, new_transaction.transactionID)
        if userIDs:
            for otherUserID in userIDs:
                create_user_transaction(otherUserID, new_transaction.transactionID)
        return new_transaction, None

    except Exception as e:
        db.session.rollback()
        print(f"Failed To Create Transaction: {e}")
        return None, str(e)

# Get Transaction By ID
def get_transaction(transactionID):
    return Transaction.query.get(transactionID)

# Get Transaction Based On Circle
def get_transaction_by_circle_json(circleID):
    transactions = Transaction.query.filter_by(circleID=circleID).all()
    if not transactions:
        return []
    transactions = [transaction.get_json() for transaction in transactions]
    return transactions

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

# Get Transaction Associated With A Budget | Considers Both Inclusive & Exclusive
def get_all_budget_transactions(budgetID):
    budget = Budget.query.get(budgetID)
    if not budget:
        return {"error": "Budget Not Found"}

    transactions = []
    if budget.transactionScope.value == TransactionScope.INCLUSIVE.value:
        all_transactions = Transaction.query.filter_by(circleID=budget.circleID).all()
        for transaction in all_transactions:
            if isinstance(transaction.transactionCategory, list):
                if any(cat in budget.budgetCategory for cat in transaction.transactionCategory):
                    transactions.append(transaction)
            else:
                if transaction.transactionCategory in budget.budgetCategory:
                    transactions.append(transaction)
    else:
        transactions = Transaction.query.filter_by(budgetID=budgetID).all()

    return [transaction.get_json() for transaction in transactions]

# Get Transaction Associated With A Bank
def get_all_bank_transactions(bankID):
    bank = Bank.query.get(bankID)
    if not bank:
        return {"error": "Bank Not Found"}
    transactions = Transaction.query.filter_by(circleID=bank.circleID).all()
    return [transaction.get_json() for transaction in transactions]

# Get Transaction Associated With A Goal
def get_all_goal_transactions(goalID):
    goal = Goal.query.get(goalID)
    if not goal:
        return {"error": "Budget Not Found"}
    transactions = Transaction.query.filter_by(circleID=goal.circleID, goalID=goalID).all()
    return [transaction.get_json() for transaction in transactions]

# Get Transaction Associated With A Circle
def get_all_circle_transactions(circleID):
    transactions = Transaction.query.filter_by(circleID=circleID).all()
    return [transaction.get_json() for transaction in transactions]

# Update Existing Transaction
def update_transaction(transactionID, transactionTitle=None, transactionDesc=None, transactionType=None,
                       transactionCategory=None, transactionAmount=None, transactionDate=None,
                       transactionTime=None, voided=None, budgetID=None, bankID=None, goalID=None):
    try:
        transaction = get_transaction(transactionID)

        if transaction:

            # Retrieving The UserID For The Transaction
            userTransaction = get_user_transaction_by_transaction_id(transactionID)
            if userTransaction:
                userID = userTransaction.userID
            else:
                print("UserID Not Found For The Transaction")
                return None

            currBankID = transaction.bankID
            currGoalID = transaction.goalID
            currBudgetID = transaction.budgetID
            currTransactionType = transaction.transactionType
            currTransactionAmount = transaction.transactionAmount
            currTransactionCategory = transaction.transactionCategory

            goal_changed = goalID is not None and goalID != currGoalID
            budget_changed = budgetID is not None and budgetID != currBudgetID
            bank_changed = bankID and bankID != currBankID
            type_changed = transactionType and transactionType != currTransactionType
            amount_changed = transactionAmount is not None and transactionAmount != currTransactionAmount

            # Revert Old Data If Change
            if budget_changed or bank_changed or goal_changed or amount_changed or type_changed:
                if currGoalID:
                    adjust_goal_balance(currGoalID, currTransactionType, -currTransactionAmount)
                if currBankID:
                    adjust_bank_balance(currBankID, currTransactionType, -currTransactionAmount)
                if currBudgetID:
                    adjust_exclusive_budget_balance(currBudgetID, currTransactionType, -currTransactionAmount)
                adjust_inclusive_budgets(userID, currTransactionCategory, currTransactionType, -currTransactionAmount)

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
            if voided is not None:
                transaction.voided = voided
            if budgetID is not None:
                transaction.budgetID = budgetID
            else:
                transaction.budgetID = None
            if bankID:
                transaction.bankID = bankID
            if goalID is not None:
                transaction.goalID = goalID
            else:
                transaction.goalID = None
            db.session.commit()

            if (amount_changed or type_changed) and not budget_changed and not bank_changed and not goal_changed:
                adjust_goal_balance(transaction.goalID, transaction.transactionType, transaction.transactionAmount)
                adjust_bank_balance(transaction.bankID, transaction.transactionType, transaction.transactionAmount)
                adjust_exclusive_budget_balance(transaction.budgetID, transaction.transactionType, transaction.transactionAmount)

            elif budget_changed or bank_changed or goal_changed:
                adjust_goal_balance(transaction.goalID, transaction.transactionType, transaction.transactionAmount)
                adjust_bank_balance(transaction.bankID, transaction.transactionType, transaction.transactionAmount)
                adjust_exclusive_budget_balance(transaction.budgetID, transaction.transactionType, transaction.transactionAmount)

            adjust_inclusive_budgets(userID, transaction.transactionCategory, transaction.transactionType, transaction.transactionAmount)

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

# Adjusts Goal Balance Based On Transaction Type (Income/Expense)
def adjust_goal_balance(goalID, transactionType, transactionAmount):
    if goalID:
        goal = get_goal(goalID)
        if not goal:
            raise ValueError("Goal Not Found")

        transaction_type_str = str(transactionType).lower() if isinstance(transactionType, str) else transactionType.value.lower()

        factor = 1 if transaction_type_str == TransactionType.INCOME.value.lower() else -1
        goal.currentAmount += factor * transactionAmount

        # Handle Insufficient Goal Balance
        if goal.currentAmount < 0:
            raise ValueError("Insufficient Goal Balance")
        db.session.commit()

# Adjusts Bank Balance Based On Transaction Type (Income/Expense)
def adjust_bank_balance(bankID, transactionType, transactionAmount):
    bank = get_bank(bankID)
    if not bank:
        raise ValueError("Bank Not Found")

    transaction_type_str = str(transactionType).lower() if isinstance(transactionType, str) else transactionType.value.lower()

    factor = 1 if transaction_type_str == TransactionType.INCOME.value.lower() else -1
    bank.remainingBankAmount += factor * transactionAmount


    # Handle Insufficient Bank Balance
    if bank.remainingBankAmount < 0:
        raise ValueError("Insufficient Bank Balance")
    db.session.commit()

# Adjusts Exclusive Budget Balance Based On Transaction Type (Income/Expense)
def adjust_exclusive_budget_balance(budgetID, transactionType, transactionAmount):
    if budgetID:
        budget = get_budget(budgetID)
        if not budget:
            raise ValueError("Budget Not Found")

        transaction_type_str = str(transactionType).lower() if isinstance(transactionType, str) else transactionType.value.lower()

        factor = 1 if transaction_type_str == TransactionType.INCOME.value.lower() else -1
        budget.remainingBudgetAmount += factor * transactionAmount

        # Handle Insufficient Budget Balance
        if budget.remainingBudgetAmount < 0:
            raise ValueError("Insufficient Budget Balance")
        db.session.commit()

# Adjusts Inclusive Budget Balance Based On Transaction Type (Income/Expense)
def adjust_inclusive_budgets(circleID, transactionCategory, transactionType, transactionAmount):
    try:
        from App.controllers.circle import get_circle_budgets_json
        user_circles_json = get_circle_budgets_json(circleID)

        for user_circle in user_circles_json:
            inclusive_budget = get_budget(user_circle['budgetID'])
            if inclusive_budget and inclusive_budget.transactionScope.value == TransactionScope.INCLUSIVE.value:

                # Rather Do This Here Than In Frontend
                normalized_budget_categories = [category.lower() for category in inclusive_budget.budgetCategory]
                normalized_transaction_categories = [category.lower() for category in transactionCategory]

                if any(cat in normalized_budget_categories for cat in normalized_transaction_categories):
                    transaction_type_str = str(transactionType).lower() if isinstance(transactionType, str) else transactionType.value.lower()

                    if transaction_type_str == TransactionType.INCOME.value.lower():
                        inclusive_budget.remainingBudgetAmount += transactionAmount
                    else:
                        inclusive_budget.remainingBudgetAmount -= transactionAmount

                    if inclusive_budget.remainingBudgetAmount < 0:
                        raise ValueError("Insufficient Budget Balance in Inclusive Budget")
        db.session.commit()

    except Exception as e:
        db.session.rollback()
        raise ValueError(f"Error adjusting inclusive budgets: {str(e)}")

def transaction_handler(userID, userIDs, transactionTitle, transactionDesc, transactionType, transactionCategory, transactionAmount, transactionDate, transactionTime, budgetID, bankID, goalID, attachments, circleID):
    try:
        adjust_bank_balance(bankID, transactionType, transactionAmount)
        adjust_inclusive_budgets(circleID, transactionCategory, transactionType, transactionAmount)
        if goalID is not None:
            adjust_goal_balance(goalID, transactionType, transactionAmount)
        if budgetID is not None:
            adjust_exclusive_budget_balance(budgetID, transactionType, transactionAmount)

        transaction_data = {
            'userID': userID,
            'userIDs': userIDs,
            'transactionTitle': transactionTitle,
            'transactionDesc': transactionDesc,
            'transactionType': transactionType,
            'transactionCategory': transactionCategory,
            'transactionAmount': transactionAmount,
            'transactionDate': transactionDate,
            'transactionTime': transactionTime,
            'budgetID': budgetID,  # Can be None
            'bankID': bankID,
            'goalID': goalID,
            'attachments': attachments
        }
        return transaction_data, None

    except ValueError as e:
        return None, str(e)

    except Exception as e:
        db.session.rollback()
        return None, f"Transaction Handler Error: {str(e)}"