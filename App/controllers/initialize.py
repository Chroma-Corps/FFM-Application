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

    bob_bank = create_bank(bob.id, "Bob's Savings", "ttd", 5000.00)
    alice_bank = create_bank(alice.id, "Alice's Checking", "usd", 1500.00)

    budget1 = create_budget (
        budgetTitle="January Budget", 
        budgetAmount=150.25, 
        budgetType=BudgetType.EXPENSE,
        budgetCategory="grocercies",
        startDate="2025-01-01",
        endDate="2025-01-31",
        userID=bob.id,
        bankID=bob_bank.bankID
    )

    budget2 = create_budget( 
        budgetTitle="February Budget",
        budgetAmount=50,
        budgetType=BudgetType.SAVINGS,
        budgetCategory=None,
        startDate="2025-02-01",
        endDate="2025-02-28",
        userID=bob.id,
        bankID=bob_bank.bankID
    )

    budget3 = create_budget (
        budgetTitle="March Budget",
        budgetAmount=1000,
        budgetType=BudgetType.EXPENSE,
        budgetCategory="shopping",
        startDate="2025-03-01",
        endDate="2025-03-31",
        userID=alice.id,
        bankID=alice_bank.bankID
    )

    transaction = add_transaction (
        userID=bob.id,
        transactionTitle="Bank Deposit",
        transactionDesc="Deposited money into my savings account",
        transactionType=TransactionType.INCOME,
        transactionCategory="income",
        transactionAmount=500.00,
        transactionDate="2025-01-25",
        transactionTime="11:30",
        budgetID=budget2.budgetID
    )