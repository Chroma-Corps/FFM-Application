from App.database import db
from App.controllers.goal import create_goal
from App.controllers.bank import create_bank
from App.controllers.circle import create_circle
from App.controllers.budget import create_budget
from App.controllers.transaction import add_transaction
from App.controllers.user import create_user, set_active_circle

from App.models.goal import GoalType
from App.models.circle import CircleType
from App.models.transaction import TransactionType
from App.models.budget import BudgetType, TransactionScope

def initialize():
    db.drop_all()
    db.create_all()

    # Users
    bob = create_user('Bob Bobberson', 'bob@mail.com', 'bobpass')
    alice = create_user('Alice Bobberson','alice@mail.com', 'alicepass')
    jalene = create_user('Jalene Armstrong', 'jalene@mail.com', 'jalenepass')

    bobberson_circle = create_circle (
        userID=bob.id,
        circleName="Bobberson",
        circleType=CircleType.GROUP,
        circleColor="#6A3D9A",
        circleImage="https://picsum.photos/id/82/300/300.jpg",
        userIDs=[alice.id, jalene.id]
    )

    set_active_circle(bob.id, bobberson_circle.circleID)
    set_active_circle(jalene.id, bobberson_circle.circleID)
    set_active_circle(alice.id, bobberson_circle.circleID)

    # Bank - Bobberson
    bobberson_bank = create_bank (
        userID=bob.id,
        bankTitle="Bobberson Bank",
        bankCurrency="TTD",
        bankAmount=5000.00,
        isPrimary=True,
        userIDs=[alice.id, jalene.id],
        circleID=bobberson_circle.circleID
    )

    # Goal
    bobberson_goal = create_goal (
        userID=bob.id,
        goalTitle="Vacation Planning",
        targetAmount=1000.00,
        goalType=GoalType.SAVINGS,
        startDate="2025-01-01",
        endDate="2025-01-31",
        userIDs=[alice.id, jalene.id],
    )

    create_budget (
        userID=bob.id,
        bankID=bobberson_bank.bankID,
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
        goalID=None,
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
        goalID=None,
    )

    add_transaction (
        userID=jalene.id,
        transactionTitle="Vacay Progress",
        transactionDesc="Saved a sum of money to contribute towards vacation plans",
        transactionType=TransactionType.INCOME,
        transactionCategory=['INCOME'],
        transactionAmount=200.00,
        transactionDate="2025-03-10",
        transactionTime="09:30",
        bankID=bobberson_bank.bankID,
        goalID=bobberson_goal.goalID
    )

    # Users - Chroma Corps
    rynnia = create_user('Rynnia Ryan','rynnia@mail.com', 'rynniapass')
    tamia = create_user('Tamia Williams', 'tamia@mail.com', 'tamiapass')

    chroma_circle = create_circle (
        userID=jalene.id,
        circleName="ChromaCorps",
        circleType=CircleType.GROUP,
        circleColor="#F8641E",
        circleImage="https://i.postimg.cc/nrzJXWDb/chromacorps.jpg",
        userIDs=[rynnia.id, tamia.id]
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

    set_active_circle(rynnia.id, chroma_circle.circleID)
    set_active_circle(tamia.id, chroma_circle.circleID)

    create_circle (
        userID=bob.id,
        circleName="Test Circle #1",
        circleType=CircleType.GROUP,
        circleColor="#3A8DFF",
        circleImage="https://picsum.photos/id/40/300/300.jpg",
        userIDs=[alice.id, jalene.id]
    )

    create_circle (
        userID=bob.id,
        circleName="Test Circle #2",
        circleType=CircleType.GROUP,
        circleColor="#F28D35",
        circleImage="https://picsum.photos/id/56/300/300.jpg",
        userIDs=[alice.id]
    )

     # Circles - Personal
    jalene_self = create_circle (
        userID=jalene.id,
        circleName="Self",
        circleType=CircleType.SELF,
        circleColor="#48A6A7",
        circleImage="https://picsum.photos/id/65/300/300.jpg"
    )

    # Bank - Jalene
    create_bank (
        userID=jalene.id,
        bankTitle="Jalene's Personal Bank",
        bankCurrency="TTD",
        bankAmount=100.00,
        isPrimary=True,
        userIDs=[],
        circleID=jalene_self.circleID
    )