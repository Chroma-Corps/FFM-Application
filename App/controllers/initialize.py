from App.controllers.circle import create_circle, get_circle
from App.controllers.goal import create_goal
from App.database import db
from App.controllers.bank import create_bank
from App.controllers.budget import create_budget
from App.controllers.transaction import add_transaction
from App.controllers.user import create_user, set_active_circle
from App.models.budget import BudgetType, TransactionScope
from App.models.circle import CircleType
from App.models.goal import GoalType
from App.models.transaction import TransactionType

def initialize():
    db.drop_all()
    db.create_all()

    # Bobberson
    bob = create_user('Bob Bobberson', 'bob@mail.com', 'bobpass')
    alice = create_user('Alice Bobberson','alice@mail.com', 'alicepass')

    # Chroma Corps
    jalene = create_user('Jalene Armstrong', 'jalene@mail.com', 'jalenepass')
    rynnia = create_user('Rynnia Ryan','rynnia@mail.com', 'rynniapass')
    tamia = create_user('Tamia Williams', 'tamia@mail.com', 'tamiapass')

    # Circles
    bob_self = create_circle (
        userID=bob.id,
        circleName="Self",
        circleType=CircleType.SELF,
        circleColor="#48A6A7"
    )

    bobberson_circle = create_circle (
        userID=bob.id,
        circleName="Bobberson",
        circleType=CircleType.GROUP,
        circleColor="#48A6A7",
        userIDs=[alice.id, jalene.id]
    )

    chroma_circle = create_circle (
        userID=jalene.id,
        circleName="ChromaCorps",
        circleType=CircleType.GROUP,
        circleColor="#F8641E",
        userIDs=[rynnia.id, tamia.id]
    )

    set_active_circle(bob.id, bob_self.circleID)
    set_active_circle(jalene.id, bobberson_circle.circleID)

    # Bank - Bob
    bob_bank = create_bank (
        userID=bob.id,
        bankTitle="Bob's Bank",
        bankCurrency="TTD",
        bankAmount=5000.00,
        isPrimary=True,
        userIDs=[],
        circleID=bob_self.circleID
    )

    # Bank - Bobberson
    bobberson_bank = create_bank (
        userID=bob.id,
        bankTitle="Bobberson Bank",
        bankCurrency="TTD",
        bankAmount=5000.00,
        isPrimary=True,
        userIDs=[alice.id],
        circleID=bobberson_circle.circleID
    )

    # Bank - Chroma Corps
    create_bank (
        userID=jalene.id,
        bankTitle="Chroma Bank",
        bankCurrency="TTD",
        bankAmount=5000.00,
        isPrimary=True,
        userIDs=[rynnia.id, tamia.id],
        circleID=chroma_circle.circleID
    )

    # Goal
    bobberson_goal = create_goal (
        userID=bob.id,
        goalTitle="Vacation Planning",
        targetAmount=1000.00,
        goalType=GoalType.SAVINGS,
        startDate="2025-01-01",
        endDate="2025-01-31",
        userIDs=[alice.id],
        circleID=bobberson_circle.circleID
    )

    create_budget (
        userID=bob.id,
        bankID=bobberson_bank.bankID,
        circleID=bobberson_circle.circleID,
        budgetTitle="Inclusive Budget",
        budgetAmount=1000.00,
        budgetType=BudgetType.EXPENSE,
        budgetCategory=['SHOPPING', 'TRANSIT', 'ENTERTAINMENT'],
        transactionScope=TransactionScope.INCLUSIVE,
        startDate="2025-01-01",
        endDate="2025-01-31",
        userIDs=[alice.id]
    )

    exclusive_budget = create_budget (
        userID=bob.id,
        bankID=None,
        circleID=bobberson_circle.circleID,
        budgetTitle="Exclusive Budget",
        budgetAmount=1000.00,
        budgetType=BudgetType.EXPENSE,
        budgetCategory=[],
        transactionScope=TransactionScope.EXCLUSIVE,
        startDate="2025-01-01",
        endDate="2025-01-31",
        userIDs=[alice.id]
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
        bankID=bobberson_bank.bankID,
        circleID=bobberson_circle.circleID,
        goalID=bobberson_goal.goalID
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
        bankID=bobberson_bank.bankID,
        circleID=bobberson_circle.circleID,
        goalID=bobberson_goal.goalID
    )