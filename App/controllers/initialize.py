from App.controllers.goal import create_goal
from App.database import db
from App.controllers.bank import create_bank
from App.controllers.budget import create_budget
from App.controllers.transaction import add_transaction
from App.controllers.user import create_user
from App.models.budget import BudgetType, TransactionScope
from App.models.goal import GoalType
from App.models.transaction import TransactionType

def initialize():
    db.drop_all()
    db.create_all()
    bob = create_user('Bob Bobberson', 'bob@mail.com', 'bobpass')
    alice = create_user('Alice Bobberson','alice@mail.com', 'alicepass')

    # Bank
    new_bank = create_bank (
        userID=bob.id,
        bankTitle="Bob's Bank",
        bankCurrency="TTD",
        bankAmount=5000.00,
        isPrimary=True
    )

    # Goal
    new_goal = create_goal (
        userID=bob.id,
        goalTitle="Bob's Goal",
        targetAmount=1000.00,
        goalType=GoalType.SAVINGS,
        startDate="2025-01-01",
        endDate="2025-01-31",
    )

    inclusive_budget = create_budget (
        userID=bob.id,
        bankID=new_bank.bankID,
        budgetTitle="Inclusive Budget",
        budgetAmount=1000.00,
        budgetType=BudgetType.EXPENSE,
        budgetCategory=['SHOPPING', 'TRANSIT', 'ENTERTAINMENT'],
        transactionScope=TransactionScope.INCLUSIVE,
        startDate="2025-01-01",
        endDate="2025-01-31",
    )

    exclusive_budget = create_budget (
        userID=bob.id,
        bankID=None,
        budgetTitle="Exclusive Budget",
        budgetAmount=1000.00,
        budgetType=BudgetType.EXPENSE,
        budgetCategory=[],
        transactionScope=TransactionScope.EXCLUSIVE,
        startDate="2025-01-01",
        endDate="2025-01-31"
    )

    add_transaction (
        userID=bob.id,
        transactionTitle="Transit Transaction",
        transactionDesc="",
        transactionType=TransactionType.EXPENSE,
        transactionCategory=['TRANSIT'],
        transactionAmount=20.00,
        transactionDate="2025-02-10",
        transactionTime="10:30",
        budgetID=exclusive_budget.budgetID,
        bankID=new_bank.bankID
    )

    add_transaction (
        userID=bob.id,
        transactionTitle="Entertainment Transaction",
        transactionDesc="",
        transactionType=TransactionType.EXPENSE,
        transactionCategory=['ENTERTAINMENT'],
        transactionAmount=200.00,
        transactionDate="2025-03-10",
        transactionTime="09:30",
        bankID=new_bank.bankID
    )