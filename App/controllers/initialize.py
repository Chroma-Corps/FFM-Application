from App.database import db
from App.controllers.bank import create_bank
from App.controllers.budget import create_budget
from App.controllers.transaction import add_transaction
from App.controllers.user import create_user
from App.models.budget import BudgetType, TransactionScope
from App.models.transaction import TransactionType

def initialize():
    db.drop_all()
    db.create_all()
    bob = create_user('Bob Bobberson', 'bob@mail.com', 'bobpass')
    alice = create_user('Alice Bobberson','alice@mail.com', 'alicepass')

    # # Banks
    # bobberson_bank = create_bank (
    #     userID=bob.id,
    #     bankTitle="Bobberson Bank",
    #     bankCurrency="TTD",
    #     bankAmount=5000.00,
    #     userIDs=[alice.id]
    # )

    # # Family Budgets
    # family_budget = create_budget (
    #     budgetTitle="Alice & Bob Budget",
    #     budgetAmount=5000.00,
    #     budgetType=BudgetType.EXPENSE,
    #     budgetCategory="groceries",
    #     transactionScope=TransactionScope.EXCLUSIVE,
    #     startDate="2025-01-01",
    #     endDate="2025-01-31",
    #     userID=bob.id,
    #     bankID=bobberson_bank.bankID,
    #     userIDs=[alice.id]
    # )

    # # Family Transactions - Testing Exclusivity
    # add_transaction (
    #     userID=bob.id,
    #     transactionTitle="Family Transaction",
    #     transactionDesc="Family Trip - Added By Mr. Bobberson",
    #     transactionType=TransactionType.EXPENSE,
    #     transactionCategory="entertainment",
    #     transactionAmount=500.00,
    #     transactionDate="2025-01-25",
    #     transactionTime="9:30",
    #     budgetID=family_budget.budgetID,
    #     bankID=bobberson_bank.bankID
    # )

    # add_transaction (
    #     userID=bob.id,
    #     transactionTitle="Family Transaction 2",
    #     transactionDesc="Family Trip - Added By Mr. Bobberson",
    #     transactionType=TransactionType.EXPENSE,
    #     transactionCategory="transit",
    #     transactionAmount=20.00,
    #     transactionDate="2025-02-10",
    #     transactionTime="10:30",
    #     budgetID=family_budget.budgetID,
    #     bankID=bobberson_bank.bankID
    # )