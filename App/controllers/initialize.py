import datetime
from App.controllers.bank import create_bank
from App.controllers.budget import create_budget
from App.controllers.transaction import add_transaction
from App.controllers.user import create_user
from App.database import db
from App.models.budget import BudgetType
from App.models.transaction import TransactionType

def initialize():
    db.drop_all()
    db.create_all()
    bob = create_user('Bob Bobberson', 'bob@mail.com', 'bobpass')
    alice = create_user('Alice Bobberson','alice@mail.com', 'alicepass')

    # Banks
    bobberson_bank = create_bank (
        userID=bob.id,
        bankTitle="Bobberson Bank",
        bankCurrency="TTD",
        bankAmount=5000.00,
        userIDs=[alice.id]
    )

    bob_bank = create_bank (
        userID=bob.id,
        bankTitle="Bob Personal Bank",
        bankCurrency="USD",
        bankAmount=500.00
    )

    # Budgets
    family_budget = create_budget (
        budgetTitle="Alice & Bob Budget",
        budgetAmount=150.00,
        budgetType=BudgetType.EXPENSE,
        budgetCategory="groceries",
        startDate="2025-01-01",
        endDate="2025-01-31",
        userID=bob.id,
        bankID=bobberson_bank.bankID,
        userIDs=[alice.id]
    )

    bob_budget = create_budget (
        budgetTitle="Bob Personal Budget",
        budgetAmount=200.00,
        budgetType=BudgetType.EXPENSE,
        budgetCategory="shopping",
        startDate="2025-02-01",
        endDate="2025-02-28",
        userID=bob.id,
        bankID=bob_bank.bankID,
    )

    # Transactions
    add_transaction (
        userID=bob.id,
        transactionTitle="Family Transaction",
        transactionDesc="Family Trip - Added By Mr. Bobberson",
        transactionType=TransactionType.EXPENSE,
        transactionCategory="entertainment",
        transactionAmount=500.00,
        transactionDate="2025-01-25",
        transactionTime="9:30",
        budgetID=family_budget.budgetID,
        bankID=bobberson_bank.bankID
    )