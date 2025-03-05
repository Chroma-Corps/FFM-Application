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
    alice = create_user('Alice Wonderland','alice@mail.com', 'alicepass')

    # Banks
    bob_bank1 = create_bank(bob.id, "Bank 1", "ttd", 5000.00)
    bob_bank2 = create_bank(bob.id, "Bank 2", "usd", 5000.00)
    alice_bank = create_bank(alice.id, "Bank 1", "usd", 1500.00)

    # Budgets
    expense_budet = create_budget (
        budgetTitle="Expense Budget", 
        budgetAmount=150.25, 
        budgetType=BudgetType.EXPENSE,
        budgetCategory="groceries",
        startDate="2025-01-01",
        endDate="2025-01-31",
        userID=bob.id,
        bankID=bob_bank1.bankID
    )

    savings_budget = create_budget( 
        budgetTitle="Savings Budget",
        budgetAmount=50.00,
        budgetType=BudgetType.SAVINGS,
        budgetCategory=None,
        startDate="2025-02-01",
        endDate="2025-02-28",
        userID=bob.id,
        bankID=bob_bank2.bankID
    )

    create_budget (
        budgetTitle="Budget `",
        budgetAmount=1000.00,
        budgetType=BudgetType.EXPENSE,
        budgetCategory="shopping",
        startDate="2025-03-01",
        endDate="2025-03-31",
        userID=alice.id,
        bankID=alice_bank.bankID
    )

    # Transactions
    add_transaction (
        userID=bob.id,
        transactionTitle="Expense Transaction",
        transactionDesc="An Expense Transaction",
        transactionType=TransactionType.SHOPPING,
        transactionCategory="expense",
        transactionAmount=50.00,
        transactionDate="2025-01-25",
        transactionTime="11:30",
        budgetID=expense_budet.budgetID,
        bankID=bob_bank1.bankID
    )

    add_transaction (
        userID=bob.id,
        transactionTitle="Savings Transaction",
        transactionDesc="An Savings Transaction",
        transactionType=TransactionType.INCOME,
        transactionCategory="income",
        transactionAmount=50.00,
        transactionDate="2025-02-05",
        transactionTime="11:30",
        budgetID=savings_budget.budgetID,
        bankID=bob_bank2.bankID
    )