import datetime
import pytest, logging, unittest
from flask import current_app
from App.main import create_app
from App.database import db, create_db
from App.models import *
from App.controllers import *

LOGGER = logging.getLogger(__name__)

@pytest.fixture(autouse=True, scope="module")
def empty_db():
    app = create_app({'TESTING': True, 'SQLALCHEMY_DATABASE_URI': 'sqlite:///test.db'})
    create_db()
    yield app.test_client()
    db.drop_all()

'''
    Unit & Integration Tests

    Models covered in this test suite:
    1. User
    2. Circle
    3. Bank
    4. Budget
    5. Goal
    6. Transaction
'''

'''
    Unit Tests

    These tests focus solely on:
    - Creating model objects
    - Retrieving created model objects
'''

# User
class UserUnitTests(unittest.TestCase):

    def test_unit_01_new_user(self):
        user = User(name="Bob Bobberson",
                    email="bob@mail.com",
                    password="bobpass",
                    activeCircleID=None)

        assert user.name == "Bob Bobberson"
        assert user.email == "bob@mail.com"

    def test_unit_02_get_user_json(self):
        user = User(name="Bob Bobberson",
                    email="bob@mail.com",
                    password="bobpass",
                    activeCircleID=None)

        user_json = user.get_json()
        self.assertDictEqual(user_json, {"id":None, "name":"Bob Bobberson", "email":"bob@mail.com", "activeCircle":None})

    def test_unit_03_check_password(self):
        password = "mypass"
        user = User(name="Bob Bobberson",
                    email="bob@mail.com",
                    password=password,
                    activeCircleID=None)
        assert user.check_password(password)

    def test_unit_04_multiple_new_users(self):
        user1 = User(name="James Jameson",
                     email="james@mail.com",
                     password="jamespass",
                     activeCircleID=None)
        user2 = User(name="Anna Annabelle",
                     email="anna@mail.com",
                     password="annapass",
                     activeCircleID=None)
        user3 = User(name="Bella Churchbell",
                     email="bella@mail.com",
                     password="bellapass",
                     activeCircleID=None)

        assert user1.name == "James Jameson"
        assert user1.email == "james@mail.com"

        assert user2.name == "Anna Annabelle"
        assert user2.email == "anna@mail.com"

        assert user3.name == "Bella Churchbell"
        assert user3.email == "bella@mail.com"

    def test_unit_05_get_all_users_json(self):
        user1 = User(name="James Jameson",
                     email="james@mail.com",
                     password="jamespass",
                     activeCircleID=None)
        user1_json = user1.get_json()

        user2 = User(name="Anna Annabelle",
                     email="anna@mail.com",
                     password="annapass",
                     activeCircleID=None)
        user2_json = user2.get_json()

        user3 = User(name="Bella Churchbell",
                     email="bella@mail.com",
                     password="bellapass",
                     activeCircleID=None)
        user3_json = user3.get_json()

        self.assertDictEqual(user1_json, {"id":None, "name":"James Jameson", "email":"james@mail.com", "activeCircle":None})
        self.assertDictEqual(user2_json, {"id":None, "name":"Anna Annabelle", "email":"anna@mail.com", "activeCircle":None})
        self.assertDictEqual(user3_json, {"id":None, "name":"Bella Churchbell", "email":"bella@mail.com", "activeCircle":None})

# Circle
class CircleUnitTests(unittest.TestCase):

    def test_unit_06_new_self_circle(self):
        self_circle = Circle(circleName="Self Circle",
                            circleType=CircleType.SELF,
                            circleColor="#6A3D9A",
                            circleImage="https://picsum.photos/id/82/300/300.jpg")

        assert self_circle.circleName == "Self Circle"
        assert self_circle.circleType == CircleType.SELF

    def test_unit_07_get_self_circle(self):
        user = User(name="Bob Bobberson",
                    email="bob@mail.com",
                    password="bobpass",
                    activeCircleID=None)

        self_circle = Circle(circleName="Self Circle",
                            circleType=CircleType.SELF,
                            circleColor="#6A3D9A",
                            circleImage="https://picsum.photos/id/82/300/300.jpg")

        uc = UserCircle(user=user, circle=self_circle)
        circle.user_circles = [uc]

        self_circle_json = self_circle.get_json()
        expected = {
            "circleID": None,
            "circleName": "Self Circle",
            "circleType": CircleType.SELF.value,
            "circleColor": "#6A3D9A",
            "circleImage": "https://picsum.photos/id/82/300/300.jpg",
            "owner": "Bob Bobberson"
        }

        actual = self_circle_json.copy()
        actual.pop("circleCode")

        self.assertDictEqual(actual, expected)
        self.assertTrue(self_circle_json["circleCode"].startswith("SEL-"))

    def test_unit_08_new_group_circle(self):
        group_circle = Circle(circleName="Group Circle",
                            circleType=CircleType.GROUP,
                            circleColor="#6A3D9A",
                            circleImage="https://picsum.photos/id/82/300/300.jpg")

        assert group_circle.circleName == "Group Circle"
        assert group_circle.circleType == CircleType.GROUP

    def test_unit_09_get_group_circle(self):
        user = User(name="Alice Aliceson",
                    email="alice@mail.com",
                    password="alicepass",
                    activeCircleID=None)

        group_circle = Circle(circleName="Group Circle",
                            circleType=CircleType.GROUP,
                            circleColor="#6A3D9A",
                            circleImage="https://picsum.photos/id/82/300/300.jpg")

        uc = UserCircle(user=user, circle=group_circle)
        circle.user_circles = [uc]

        group_circle_json = group_circle.get_json()
        expected = {
            "circleID": None,
            "circleName": "Group Circle",
            "circleType": CircleType.GROUP.value,
            "circleColor": "#6A3D9A",
            "circleImage": "https://picsum.photos/id/82/300/300.jpg",
            "owner": "Alice Aliceson"
        }

        actual = group_circle_json.copy()
        actual.pop("circleCode")

        self.assertDictEqual(actual, expected)
        self.assertTrue(group_circle_json["circleCode"].startswith("GRO-"))

# Bank
class BankUnitTests(unittest.TestCase):

    def test_unit_10_new_bank(self):
        circle = Circle(circleName="Self Circle",
                            circleType=CircleType.SELF,
                            circleColor="#6A3D9A",
                            circleImage="https://picsum.photos/id/82/300/300.jpg")

        bank = Bank(bankTitle="New Wallet",
                    bankCurrency="TTD",
                    bankAmount=500,
                    remainingBankAmount=500,
                    isPrimary=True,
                    color="#6A3D9A",
                    circleID=circle.circleID)

        assert bank.bankTitle == "New Wallet"
        assert bank.bankAmount == 500

    def test_unit_11_get_new_bank(self):
        user = User(name="Alice Aliceson",
                    email="alice@mail.com",
                    password="alicepass",
                    activeCircleID=None)

        circle = Circle(circleName="Self Circle",
                            circleType=CircleType.SELF,
                            circleColor="#6A3D9A",
                            circleImage="https://picsum.photos/id/82/300/300.jpg")

        bank = Bank(bankTitle="New Wallet",
                    bankCurrency="TTD",
                    bankAmount=500,
                    remainingBankAmount=500,
                    isPrimary=True,
                    color="#6A3D9A",
                    circleID=circle.circleID)

        ub = UserBank(user=user, bank=bank)
        bank.user_banks = [ub]

        bank_json = bank.get_json()
        expected = {
            "bankID": None,
            "bankTitle": "New Wallet",
            "bankCurrency": "TTD",
            "bankAmount": "TT$500.00",
            "remainingBankAmount": "TT$500.00",
            "isPrimary": True,
            "color": "#6A3D9A",
            "owner": "Alice Aliceson"
        }
        self.assertDictEqual(bank_json, expected)

# Budget
class BudgetUnitTests(unittest.TestCase):

    def test_unit_12_new_savings_budget(self):
        circle = Circle(circleName="Self Circle",
                            circleType=CircleType.SELF,
                            circleColor="#6A3D9A",
                            circleImage="https://picsum.photos/id/82/300/300.jpg")

        bank = Bank(bankTitle="New Wallet",
                    bankCurrency="TTD",
                    bankAmount=500,
                    remainingBankAmount=500,
                    isPrimary=True,
                    color="#6A3D9A",
                    circleID=circle.circleID)

        budget = Budget(circleID=circle.circleID,
                        bankID=bank.bankID,
                        budgetTitle="Savings Budget",
                        budgetAmount=200,
                        remainingBudgetAmount=200,
                        budgetType=BudgetType.SAVINGS.value,
                        budgetCategory=["Shopping"],
                        transactionScope=TransactionScope.INCLUSIVE,
                        startDate="2025-04-16",
                        endDate="2025-04-17",
                        color="#6A3D9A")

        assert budget.budgetTitle == "Savings Budget"
        assert budget.budgetType == "Savings"

    def test_unit_13_get_new_savings_budget(self):
        user = User(name="Bob Bobberson",
                    email="bob@mail.com",
                    password="bobpass",
                    activeCircleID=None)

        circle = Circle(circleName="Self Circle",
                            circleType=CircleType.SELF,
                            circleColor="#6A3D9A",
                            circleImage="https://picsum.photos/id/82/300/300.jpg")

        bank = Bank(bankTitle="New Wallet",
                    bankCurrency="TTD",
                    bankAmount=500,
                    remainingBankAmount=500,
                    isPrimary=True,
                    color="#6A3D9A",
                    circleID=circle.circleID)

        budget = Budget(circleID=circle.circleID,
                        bankID=bank.bankID,
                        budgetTitle="Savings Budget",
                        budgetAmount=200,
                        remainingBudgetAmount=200,
                        budgetType=BudgetType.SAVINGS,
                        budgetCategory=["Shopping"],
                        transactionScope=TransactionScope.INCLUSIVE,
                        startDate="2025-04-16",
                        endDate="2025-04-17",
                        color="#6A3D9A")

        ub = UserBudget(user=user, budget=budget)
        budget.user_budgets = [ub]

        budget_json = budget.get_json()
        expected = {
            "budgetID": None,
            "budgetTitle": "Savings Budget",
            "budgetAmount": "TT$200.00",
            "remainingBudgetAmount": "TT$200.00",
            "budgetType": "Savings",
            "budgetCategory":["Shopping"],
            "transactionScope": "Inclusive",
            "startDate": "Wed, 16 Apr 2025",
            "endDate":"Thu, 17 Apr 2025",
            "bankID": None,
            "color": "#6A3D9A",
            "owner": "Bob Bobberson"
        }
        self.assertDictEqual(budget_json, expected)

    def test_unit_14_new_expense_budget(self):
        circle = Circle(circleName="Self Circle",
                            circleType=CircleType.SELF,
                            circleColor="#6A3D9A",
                            circleImage="https://picsum.photos/id/82/300/300.jpg")

        bank = Bank(bankTitle="New Wallet",
                    bankCurrency="TTD",
                    bankAmount=500,
                    remainingBankAmount=500,
                    isPrimary=True,
                    color="#6A3D9A",
                    circleID=circle.circleID)

        budget = Budget(circleID=circle.circleID,
                        bankID=bank.bankID,
                        budgetTitle="Expense Budget",
                        budgetAmount=200,
                        remainingBudgetAmount=200,
                        budgetType=BudgetType.EXPENSE.value,
                        budgetCategory=["Shopping"],
                        transactionScope=TransactionScope.INCLUSIVE,
                        startDate="2025-04-16",
                        endDate="2025-04-17",
                        color="#6A3D9A")

        assert budget.budgetTitle == "Expense Budget"
        assert budget.budgetType == "Expense"

    def test_unit_15_get_new_expense_budget(self):
        user = User(name="Alice Aliceson",
                    email="alice@mail.com",
                    password="alicepass",
                    activeCircleID=None)

        circle = Circle(circleName="Self Circle",
                            circleType=CircleType.SELF,
                            circleColor="#6A3D9A",
                            circleImage="https://picsum.photos/id/82/300/300.jpg")

        bank = Bank(bankTitle="New Wallet",
                    bankCurrency="TTD",
                    bankAmount=500,
                    remainingBankAmount=500,
                    isPrimary=True,
                    color="#6A3D9A",
                    circleID=circle.circleID)

        budget = Budget(circleID=circle.circleID,
                        bankID=bank.bankID,
                        budgetTitle="Expense Budget",
                        budgetAmount=200,
                        remainingBudgetAmount=200,
                        budgetType=BudgetType.EXPENSE,
                        budgetCategory=[],
                        transactionScope=TransactionScope.EXCLUSIVE,
                        startDate="2025-04-16",
                        endDate="2025-04-17",
                        color="#6A3D9A")

        ub = UserBudget(user=user, budget=budget)
        budget.user_budgets = [ub]

        budget_json = budget.get_json()
        expected = {
            "budgetID": None,
            "budgetTitle": "Expense Budget",
            "budgetAmount": "TT$200.00",
            "remainingBudgetAmount": "TT$200.00",
            "budgetType": "Expense",
            "budgetCategory":[],
            "transactionScope": "Exclusive",
            "startDate": "Wed, 16 Apr 2025",
            "endDate":"Thu, 17 Apr 2025",
            "bankID": None,
            "color": "#6A3D9A",
            "owner": "Alice Aliceson"
        }
        self.assertDictEqual(budget_json, expected)

# Goal
class GoalUnitTests(unittest.TestCase):

    def test_unit_16_new_savings_goal(self):
        circle = Circle(circleName="Self Circle",
                            circleType=CircleType.SELF,
                            circleColor="#6A3D9A",
                            circleImage="https://picsum.photos/id/82/300/300.jpg")

        goal = Goal(circleID=circle.circleID,
                    goalTitle="Savings Goal",
                    targetAmount=150,
                    currentAmount=None,
                    goalType=GoalType.SAVINGS,
                    startDate="2025-04-16",
                    endDate="2025-04-17",
                    color="#6A3D9A")

        assert goal.goalTitle == "Savings Goal"
        assert goal.goalType.value == "Savings"

    def test_unit_17_get_new_savings_goal(self):
        user = User(name="Bob Bobberson",
                    email="bob@mail.com",
                    password="bobpass",
                    activeCircleID=None)

        circle = Circle(circleName="Self Circle",
                            circleType=CircleType.SELF,
                            circleColor="#6A3D9A",
                            circleImage="https://picsum.photos/id/82/300/300.jpg")

        goal = Goal(circleID=circle.circleID,
                    goalTitle="Savings Goal",
                    targetAmount=150,
                    currentAmount=0,
                    goalType=GoalType.SAVINGS,
                    startDate="2025-04-16",
                    endDate="2025-04-17",
                    color="#6A3D9A")

        ug = UserGoal(user=user, goal=goal)
        goal.user_goals = [ug]

        goal_json = goal.get_json()
        expected = {
            "goalID": None,
            "goalTitle": "Savings Goal",
            "targetAmount": "TT$150.00",
            "currentAmount": "TT$0.00",
            "goalType": "Savings",
            "startDate": "Wed, 16 Apr 2025",
            "endDate":"Thu, 17 Apr 2025",
            "color": "#6A3D9A",
            "owner": "Bob Bobberson"
        }
        self.assertDictEqual(goal_json, expected)

    def test_unit_18_new_expense_goal(self):
        circle = Circle(circleName="Self Circle",
                            circleType=CircleType.SELF,
                            circleColor="#6A3D9A",
                            circleImage="https://picsum.photos/id/82/300/300.jpg")

        goal = Goal(circleID=circle.circleID,
                    goalTitle="Expense Goal",
                    targetAmount=150,
                    currentAmount=None,
                    goalType=GoalType.EXPENSE,
                    startDate="2025-04-16",
                    endDate="2025-04-17",
                    color="#6A3D9A")

        assert goal.goalTitle == "Expense Goal"
        assert goal.goalType.value == "Expense"

    def test_unit_19_get_new_expense_goal(self):
        user = User(name="Alice Aliceson",
                    email="alice@mail.com",
                    password="alicepass",
                    activeCircleID=None)

        circle = Circle(circleName="Self Circle",
                            circleType=CircleType.SELF,
                            circleColor="#6A3D9A",
                            circleImage="https://picsum.photos/id/82/300/300.jpg")

        goal = Goal(circleID=circle.circleID,
                    goalTitle="Expense Goal",
                    targetAmount=150,
                    currentAmount=150,
                    goalType=GoalType.EXPENSE.value,
                    startDate="2025-04-16",
                    endDate="2025-04-17",
                    color="#6A3D9A")

        ug = UserGoal(user=user, goal=goal)
        goal.user_goals = [ug]

        goal_json = goal.get_json()
        expected = {
            "goalID": None,
            "goalTitle": "Expense Goal",
            "targetAmount": "TT$150.00",
            "currentAmount": "TT$150.00",
            "goalType": "Expense",
            "startDate": "Wed, 16 Apr 2025",
            "endDate":"Thu, 17 Apr 2025",
            "color": "#6A3D9A",
            "owner": "Alice Aliceson"
        }
        self.assertDictEqual(goal_json, expected)

# Transaction
class TransactionUnitTests(unittest.TestCase):

    def test_unit_20_new_income_transaction(self): 
        circle = Circle(circleName="Self Circle",
                            circleType=CircleType.SELF,
                            circleColor="#6A3D9A",
                            circleImage="https://picsum.photos/id/82/300/300.jpg")

        bank = Bank(bankTitle="New Wallet",
                    bankCurrency="TTD",
                    bankAmount=500,
                    remainingBankAmount=500,
                    isPrimary=True,
                    color="#6A3D9A",
                    circleID=circle.circleID)

        transaction = Transaction(bankID=bank.bankID,
                                  budgetID=None,
                                  goalID=None,
                                  circleID=circle.circleID,
                                  transactionTitle="Income Transaction",
                                  transactionDesc="This is an income transaction",
                                  transactionType=TransactionType.INCOME,
                                  transactionCategory=["Income"],
                                  transactionAmount=200,
                                  transactionDate="2025-04-16",
                                  transactionTime="3:00",
                                  attachments=[])

        assert transaction.transactionTitle == "Income Transaction"
        assert transaction.transactionType.value == "Income"

    def test_unit_21_get_new_income_transaction(self):
        user = User(name="Bob Bobberson",
                    email="bob@mail.com",
                    password="bobpass",
                    activeCircleID=None)

        circle = Circle(circleName="Self Circle",
                            circleType=CircleType.SELF,
                            circleColor="#6A3D9A",
                            circleImage="https://picsum.photos/id/82/300/300.jpg")

        bank = Bank(bankTitle="New Wallet",
                    bankCurrency="TTD",
                    bankAmount=500,
                    remainingBankAmount=500,
                    isPrimary=True,
                    color="#6A3D9A",
                    circleID=circle.circleID)

        transaction = Transaction(bankID=bank.bankID,
                                  budgetID=None,
                                  goalID=None,
                                  circleID=circle.circleID,
                                  transactionTitle="Income Transaction",
                                  transactionDesc="This is an income transaction",
                                  transactionType=TransactionType.INCOME,
                                  transactionCategory=["Income"],
                                  transactionAmount=200,
                                  transactionDate="2025-04-16",
                                  transactionTime="3:00",
                                  attachments=[])

        transaction.bank = bank
        ut = UserTransaction(user=user, transaction=transaction)
        transaction.user_transactions = [ut]

        transaction_json = transaction.get_json()
        expected = {
            "transactionID": None,
            "transactionTitle": "Income Transaction",
            "transactionDescription": "This is an income transaction",
            "transactionType": "Income",
            "transactionCategory": ["Income"],
            "transactionAmount": "TT$200.00",
            "transactionDate":"Wed, Apr 16 2025",
            "transactionTime": "03:00",
            "transactionBank": None,
            "transactionBudget": None,
            "transactionGoal": None,
            "attachments": [],
            "owner": "Bob Bobberson"
        }
        self.assertDictEqual(transaction_json, expected)

    def test_unit_22_new_expense_transaction(self):
        circle = Circle(circleName="Self Circle",
                            circleType=CircleType.SELF,
                            circleColor="#6A3D9A",
                            circleImage="https://picsum.photos/id/82/300/300.jpg")

        bank = Bank(bankTitle="New Wallet",
                    bankCurrency="TTD",
                    bankAmount=500,
                    remainingBankAmount=500,
                    isPrimary=True,
                    color="#6A3D9A",
                    circleID=circle.circleID)

        transaction = Transaction(bankID=bank.bankID,
                                  budgetID=None,
                                  goalID=None,
                                  circleID=circle.circleID,
                                  transactionTitle="Expense Transaction",
                                  transactionDesc="This is an expense transaction",
                                  transactionType=TransactionType.EXPENSE,
                                  transactionCategory=["Transit"],
                                  transactionAmount=20,
                                  transactionDate="2025-04-17",
                                  transactionTime="5:00",
                                  attachments=[])

        assert transaction.transactionTitle == "Expense Transaction"
        assert transaction.transactionType.value == "Expense"

    def test_unit_23_get_new_expense_transaction(self):
        user = User(name="Alice Aliceson",
                    email="alice@mail.com",
                    password="alicepass",
                    activeCircleID=None)

        circle = Circle(circleName="Self Circle",
                            circleType=CircleType.SELF,
                            circleColor="#6A3D9A",
                            circleImage="https://picsum.photos/id/82/300/300.jpg")

        bank = Bank(bankTitle="New Wallet",
                    bankCurrency="TTD",
                    bankAmount=500,
                    remainingBankAmount=500,
                    isPrimary=True,
                    color="#6A3D9A",
                    circleID=circle.circleID)

        transaction = Transaction(bankID=bank.bankID,
                                  budgetID=None,
                                  goalID=None,
                                  circleID=circle.circleID,
                                  transactionTitle="Expense Transaction",
                                  transactionDesc="This is an expense transaction",
                                  transactionType=TransactionType.EXPENSE,
                                  transactionCategory=["Transit"],
                                  transactionAmount=20,
                                  transactionDate="2025-04-17",
                                  transactionTime="11:00",
                                  attachments=[])

        transaction.bank = bank
        ut = UserTransaction(user=user, transaction=transaction)
        transaction.user_transactions = [ut]

        transaction_json = transaction.get_json()
        expected = {
            "transactionID": None,
            "transactionTitle": "Expense Transaction",
            "transactionDescription": "This is an expense transaction",
            "transactionType": "Expense",
            "transactionCategory": ["Transit"],
            "transactionAmount": "TT$20.00",
            "transactionDate":"Thu, Apr 17 2025",
            "transactionTime": "11:00",
            "transactionBank": None,
            "transactionBudget": None,
            "transactionGoal": None,
            "attachments": [],
            "owner": "Alice Aliceson"
        }
        self.assertDictEqual(transaction_json, expected)

'''
    Integration Tests

    These tests focus solely on:
    - Specific use case scenarios
'''

# User
class UserIntegrationTests(unittest.TestCase):

    def test_int_01_create_user(self):
        newuser = create_user(name="Johnny Applesauce",
                              email="johnny@mail.com",
                              password="johnnypass")

        user = get_user(newuser.id)
        assert user.email == "johnny@mail.com"

    def test_int_02_authenticate(self):
        newuser = create_user(name="Bubble Bub",
                              email="bubble@mail.com",
                              password="bubblepass")

        response = login(newuser.email, "bubblepass")
        assert response is not None

    def test_int_03_get_all_users_json(self):
        users_json = get_all_users_json()
        self.assertListEqual([{"id":1, "name":"Johnny Applesauce","email":"johnny@mail.com", "activeCircle":None},
                              {"id":2, "name":"Bubble Bub", "email":"bubble@mail.com", "activeCircle": None}
                              ], users_json)

    def test_int_04_update_user_email(self):
        newuser = create_user(name="Ronnie Ron",
                              email="runnie@mail.com",
                              password="ronniepass")

        update_user(userID=newuser.id, newEmail="ronnie@mail.com")
        user = get_user(newuser.id)
        assert user.email == "ronnie@mail.com"

    def test_int_05_user_forgot_password(self):
        newuser = create_user(name="Sonnie Bonnie",
                              email="sonnie@mail.com",
                              password="sonniepass")

        update_user(userID=newuser.id, newPassword="newsonniepass")
        user = get_user(newuser.id)
        assert user.password == "newsonniepass"

# Circle
class CircleIntegrationTests(unittest.TestCase):

    def test_int_06_create_circle(self):
        user = create_user(name="Johnny Applesauce",
                              email="johnny1@mail.com",
                              password="johnnypass")

        circle = create_circle(circleName="Johnny Circle",
                               circleType=CircleType.SELF,
                               circleColor="#6A3D9A",
                               circleImage="https://picsum.photos/id/82/300/300.jpg",
                               userID=user.id)

        assert circle.circleName == "Johnny Circle"

    def test_int_07_get_user_circles_json(self):
        user = create_user(name="Johnny Applesauce",
                            email="johnny2@mail.com",
                            password="johnnypass")

        create_circle(circleName="Johnny Circle",
                        circleType=CircleType.SELF,
                        circleColor="#6A3D9A",
                        circleImage="https://picsum.photos/id/82/300/300.jpg",
                        userID=user.id)

        circles_json = get_user_circles_json(userID=user.id)

        self.assertGreater(len(circles_json), 0, "No circles found for the user")

        first_circle = circles_json[0]

        expected = {
            "circleID": first_circle["circleID"],
            "circleName": "Johnny Circle",
            "circleType": "Self",
            "circleColor": "#6A3D9A",
            "circleImage": "https://picsum.photos/id/82/300/300.jpg",
            "owner": user.name
        }

        actual = first_circle.copy()
        actual.pop("circleCode", None)

        self.assertDictEqual(actual, expected)
        self.assertTrue(first_circle["circleCode"].startswith("JOH-"))

    def test_int_08_update_circle(self):
        user = create_user(name="Johnny Applesauce",
                            email="johnny3@mail.com",
                            password="johnnypass")

        circle = create_circle(circleName="Johnny Circle",
                        circleType=CircleType.SELF,
                        circleColor="#6A3D9A",
                        circleImage="https://picsum.photos/id/82/300/300.jpg",
                        userID=user.id)

        updated_circle = update_circle(circleID=circle.circleID,
                                       circleName="My Circle")
        assert updated_circle.circleName == "My Circle"

    def test_int_09_delete_circle(self):
        user = create_user(name="Johnny Applesauce",
                            email="johnny4@mail.com",
                            password="johnnypass")

        circle = create_circle(circleName="Johnny Circle",
                            circleType=CircleType.SELF,
                            circleColor="#6A3D9A",
                            circleImage="https://picsum.photos/id/82/300/300.jpg",
                            userID=user.id)

        delete_circle(userID=user.id, circleID=circle.circleID)
        deletedcircle = get_circle(circleID=circle.circleID)
        self.assertIsNone(deletedcircle)

    def test_int_10_join_circle(self):
        user1 = create_user(name="Johnny Applesauce",
                              email="johnny5@mail.com",
                              password="johnnypass")
        
        user2 = create_user(name="Jenny Applesauce",
                              email="jenny@mail.com",
                              password="johnnypass")

        circle = create_circle(circleName="Applesauce",
                               circleType=CircleType.GROUP,
                               circleColor="#6A3D9A",
                               circleImage="https://picsum.photos/id/82/300/300.jpg",
                               userID=user1.id)

        add_to_circle(circleCode=circle.circleCode, userID=user2.id)

        circle_users=get_circle_users_json(circleID=circle.circleID)
        self.assertListEqual([{"id":user1.id, "name":"Johnny Applesauce","email":"johnny5@mail.com", "activeCircle":None},
                              {"id":user2.id, "name":"Jenny Applesauce", "email":"jenny@mail.com", "activeCircle": None}
                              ], circle_users)

    def test_int_11_leave_circle(self):
        user1 = create_user(name="Johnny Applesauce",
                              email="johnny6@mail.com",
                              password="johnnypass")

        user2 = create_user(name="Jenny Applesauce",
                              email="jenny1@mail.com",
                              password="jennypass")

        circle = create_circle(circleName="Applesauce",
                               circleType=CircleType.GROUP,
                               circleColor="#6A3D9A",
                               circleImage="https://picsum.photos/id/82/300/300.jpg",
                               userID=user1.id)

        add_to_circle(circleCode=circle.circleCode, userID=user2.id)
        remove_from_circle(circleCode=circle.circleCode, userID=user1.id)

        circle_users=get_circle_users_json(circleID=circle.circleID)
        self.assertListEqual([{"id":user2.id, "name":"Jenny Applesauce", "email":"jenny1@mail.com", "activeCircle": None}
                              ], circle_users)

# Bank
class BankIntegrationTests(unittest.TestCase):

    def test_int_12_create_bank(self):
        user = create_user(name="Jenny Applesauce",
                            email="jenny1@mail.com",
                            password="jennypass")

        circle = create_circle(circleName="Jenny Circle",
                        circleType=CircleType.SELF,
                        circleColor="#6A3D9A",
                        circleImage="https://picsum.photos/id/82/300/300.jpg",
                        userID=user.id)

        set_active_circle(userID=user.id, circleID=circle.circleID)

        bank = create_bank(userID=user.id,
                           bankTitle="Jenny Wallet",
                           bankCurrency="TTD",
                           bankAmount=1000,
                           isPrimary=True,
                           color="#6A3D9A")

        assert bank.bankTitle == "Jenny Wallet"

    def test_int_13_get_user_banks_json(self):
        user = create_user(name="Jenny Applesauce",
                              email="jenny2@mail.com",
                              password="jennypass")

        circle = create_circle(circleName="Jenny Circle",
                        circleType=CircleType.SELF,
                        circleColor="#6A3D9A",
                        circleImage="https://picsum.photos/id/82/300/300.jpg",
                        userID=user.id)

        set_active_circle(userID=user.id, circleID=circle.circleID)

        bank = create_bank(userID=user.id,
                           bankTitle="Jenny Wallet",
                           bankCurrency="TTD",
                           bankAmount=1000,
                           isPrimary=True,
                           color="#6A3D9A")

        user_banks_json = get_user_banks_json(userID=user.id)

        expected = [{
            "bankID": bank.bankID,
            "bankTitle": "Jenny Wallet",
            "bankCurrency": "TTD",
            "bankAmount": "TT$1000.00",
            "remainingBankAmount": "TT$1000.00",
            "isPrimary":True,
            "color": "#6A3D9A",
            "owner": "Jenny Applesauce"
        }]

        self.assertListEqual(user_banks_json, expected)

    def test_int_14_update_bank(self): 
        user = create_user(name="Jenny Applesauce",
                            email="jenny3@mail.com",
                            password="jennypass")

        circle = create_circle(circleName="Jenny Circle",
                        circleType=CircleType.SELF,
                        circleColor="#6A3D9A",
                        circleImage="https://picsum.photos/id/82/300/300.jpg",
                        userID=user.id)

        set_active_circle(userID=user.id, circleID=circle.circleID)

        bank = create_bank(userID=user.id,
                           bankTitle="Jenny Wallet",
                           bankCurrency="TTD",
                           bankAmount=1000,
                           isPrimary=True,
                           color="#6A3D9A")

        updated_bank = update_bank(bankID=bank.bankID, bankAmount=5000)
        assert updated_bank.bankAmount == 5000

    def test_int_15_delete_bank(self):
        user = create_user(name="Jenny Applesauce",
                            email="jenny4@mail.com",
                            password="jennypass")

        circle = create_circle(circleName="Jenny Circle",
                        circleType=CircleType.SELF,
                        circleColor="#6A3D9A",
                        circleImage="https://picsum.photos/id/82/300/300.jpg",
                        userID=user.id)

        set_active_circle(userID=user.id, circleID=circle.circleID)

        bank = create_bank(userID=user.id,
                           bankTitle="Jenny Wallet",
                           bankCurrency="TTD",
                           bankAmount=1000,
                           isPrimary=True,
                           color="#6A3D9A")

        delete_bank(userID=user.id, bankID=bank.bankID)
        deletedbank = get_bank(bankID=bank.bankID)
        self.assertIsNone(deletedbank)

# class BudgetIntegrationTests(unittest.TestCase):

#     def test_int_06_create_budget(self):
#         newuser = create_user(name="Alex Alexander", email="alex@mail.com", password="alexpass")
#         newbank = create_bank(userID=newuser.id, bankTitle="Alex Bank", bankCurrency="USD", bankAmount=5000.00)
#         newbudget = create_budget(budgetTitle="Alex Budget", budgetAmount=200.00, budgetType=BudgetType.EXPENSE, budgetCategory="ENTERTAINMENT", startDate="2025-01-01", endDate="2025-01-31", userID=newuser.id, bankID=newbank.bankID)
#         budget = get_budget(newbudget.budgetID)
#         assert budget.budgetTitle == "Alex Budget"
#         assert budget.budgetAmount == 200.00

#     def test_int_07_get_user_budgets_json(self):
#         newuser = create_user(name="Michael Myers", email="michael@mail.com", password="michaelpass")
#         newbank = create_bank(userID=newuser.id, bankTitle="Michael Bank", bankCurrency="USD", bankAmount=5000.00)
#         newbudget = create_budget(budgetTitle="Michael Budget", budgetAmount=500.00, budgetType=BudgetType.EXPENSE, budgetCategory="SHOPPING", startDate="2025-01-01", endDate="2025-01-31", userID=newuser.id, bankID=newbank.bankID)
#         user_budgets_json = get_user_budgets_json(newuser.id)
#         self.assertListEqual([{"budgetID":newbudget.budgetID, 
#                                "budgetTitle":"Michael Budget",
#                                "budgetAmount":"$500.00",
#                                "remainingBudgetAmount":"$500.00",
#                                "budgetType": "Expense",
#                                "budgetCategory": "Shopping",
#                                "startDate":"Wed, 01 Jan 2025",
#                                "endDate":"Fri, 31 Jan 2025",
#                                "userID": newuser.id,
#                                "bankID": newbank.bankID},
#                               ], user_budgets_json)

#     def test_int_08_update_budget(self):
#         newuser = create_user(name="John Wick", email="wick@mail.com", password="wickpass")
#         newbank = create_bank(userID=newuser.id, bankTitle="Wick Bank", bankCurrency="TTD", bankAmount=10000.00)
#         newbudget = create_budget(budgetTitle="Wick Budget", budgetAmount=20.00, budgetType=BudgetType.EXPENSE, budgetCategory="TRANSIT", startDate="2025-01-01", endDate="2025-01-31", userID=newuser.id, bankID=newbank.bankID)
#         update_budget(budgetID=newbudget.budgetID, budgetTitle=None, budgetAmount=2000.00, budgetType=None, budgetCategory=None, startDate=None, endDate=None, bankID=None)
#         budget = get_budget(newbudget.budgetID)
#         assert budget.budgetAmount == 2000.00

#     def test_int_09_delete_budget(self):
#         newuser = create_user(name="Poppy Poppyseed", email="poppy@mail.com", password="poppypass")
#         newbank = create_bank(userID=newuser.id, bankTitle="Poppy Bank", bankCurrency="TTD", bankAmount=10000.00)
#         newbudget = create_budget(budgetTitle="Poppy Budget", budgetAmount=250.15, budgetType=BudgetType.EXPENSE, budgetCategory="GROCERIES", startDate="2025-01-01", endDate="2025-01-31", userID=newuser.id, bankID=newbank.bankID)
#         delete_budget(newbudget.budgetID)
#         deletedbudget = get_budget(newbudget.budgetID)
#         assert deletedbudget is None

# class TransactionIntegrationTests(unittest.TestCase):

#     def test_int_09_add_transaction(self):
#         newuser = create_user(name="Sunny Sunflower", email="sunny@mail.com", password="sunnypass")
#         newbank = create_bank(userID=newuser.id, bankTitle="Sunny Bank", bankCurrency="TTD", bankAmount=5000.00)
#         newbudget = create_budget(budgetTitle="Sunny Budget", budgetAmount=500.00, budgetType=BudgetType.EXPENSE, budgetCategory="TRANSIT", startDate="2025-01-01", endDate="2025-01-31", userID=newuser.id, bankID=newbank.bankID)
#         newtransaction = add_transaction(
#             userID=newuser.id, 
#             transactionTitle="Ride To School", 
#             transactionDesc="Usual bus route ride to school", 
#             transactionType=TransactionType.EXPENSE, 
#             transactionCategory="TRANSIT", 
#             transactionAmount=7.00, 
#             transactionDate="2025-01-06",
#             transactionTime="09:30",
#             budgetID=newbudget.budgetID
#         )
#         transaction = get_transaction(newtransaction.transactionID)
#         assert transaction.transactionTitle == "Ride To School"

#     def test_int_10_user_transactions_json(self):
#         newuser = create_user(name="Sonni Bunni", email="sonni@mail.com", password="sonniepass")
#         newbank = create_bank(userID=newuser.id, bankTitle="Sonni Bank", bankCurrency="USD", bankAmount=3700.00)
#         newbudget = create_budget(budgetTitle="Sonni Budget", budgetAmount=760.00, budgetType=BudgetType.EXPENSE, budgetCategory="BILLS", startDate="2025-01-01", endDate="2025-01-31", userID=newuser.id, bankID=newbank.bankID)
#         newtransaction = add_transaction(
#             userID=newuser.id, 
#             transactionTitle="Movie Night", 
#             transactionDesc="Spontaneous Movie Night", 
#             transactionType=TransactionType.EXPENSE, 
#             transactionCategory="ENTERTAINMENT", 
#             transactionAmount=30.00, 
#             transactionDate="2025-02-10",
#             transactionTime="17:30",
#             budgetID=newbudget.budgetID,
#             bankID=newbank.bankID
#         )
#         user_transaction_json = get_user_transactions_json(newuser.id)
#         self.assertListEqual([{"userID":newuser.id, 
#                                "transactionID":newtransaction.transactionID,
#                                "transactionTitle":"Movie Night",
#                                "transactionDescription":"Spontaneous Movie Night",
#                                "transactionType":"Expense",
#                                "transactionCategory":"ENTERTAINMENT",
#                                "transactionAmount": "$30.00",
#                                "transactionDate": "Mon, 10 Feb 2025",
#                                "transactionTime": "17:30" },
#                               ], user_transaction_json)

#     def test_int_11_update_transaction(self):
#         newuser = create_user(name="Larry Pinhead", email="larry@mail.com", password="larrypass")
#         newbank = create_bank(userID=newuser.id, bankTitle="Larry Bank", bankCurrency="TTD", bankAmount=300.00)
#         newbudget = create_budget(budgetTitle="Larry Budget", budgetAmount=10.00, budgetType=BudgetType.EXPENSE, budgetCategory="ENTERTAINMENT", startDate="2025-01-01", endDate="2025-01-31", userID=newuser.id, bankID=newbank.bankID)
#         newtransaction = add_transaction(
#             userID=newuser.id, 
#             transactionTitle="Picnic Party", 
#             transactionDesc="Had a small picnic with friends", 
#             transactionType=TransactionType.EXPENSE, 
#             transactionCategory="Bills", 
#             transactionAmount=75.00, 
#             transactionDate="2025-02-01",
#             transactionTime="14:30",
#             budgetID=newbudget.budgetID,
#             bankID=newbank.bankID
#         )
#         update_transaction(id=newtransaction.transactionID, transactionTitle=None, transactionDesc=None, transactionType=None, transactionCategory="ENTERTAINMENT", transactionAmount=None, transactionDate=None, transactionTime=None, budgetID=None)
#         transaction = get_transaction(newtransaction.transactionID)
#         assert transaction.transactionCategory == "ENTERTAINMENT"

#     def test_int_12_void_transaction(self):
#         newuser = create_user(name="Laura Lynn", email="laura@mail.com", password="laurapass")
#         newbank = create_bank(userID=newuser.id, bankTitle="Laura Bank", bankCurrency="USD", bankAmount=1500.00)
#         newbudget = create_budget(budgetTitle="Larua Budget", budgetAmount=700.00, budgetType=BudgetType.SAVINGS, budgetCategory="INCOME", startDate="2025-01-01", endDate="2025-01-31", userID=newuser.id, bankID=newbank.bankID)
#         newtransaction = add_transaction(
#             userID=newuser.id, 
#             transactionTitle="Savings Budget", 
#             transactionDesc="A Savings Budget", 
#             transactionType=TransactionType.INCOME, 
#             transactionCategory="Income", 
#             transactionAmount=100.00, 
#             transactionDate="2025-02-01",
#             transactionTime="14:30",
#             budgetID=newbudget.budgetID
#         )
#         void_transaction(id=newtransaction.transactionID)
#         transaction = get_transaction(newtransaction.transactionID)
#         assert transaction.voided == True

# class BankIntegrationTests(unittest.TestCase):

#     def test_int_13_create_bank(self):
#         newuser = create_user(name="Curt Curtis", email="curt@mail.com", password="curtpass")
#         newbank = create_bank(userID=newuser.id, bankTitle="Curt Bank", bankCurrency="TTD", bankAmount=50000.00)
#         bank = get_bank(newbank.bankID)
#         assert bank.bankTitle == "Curt Bank"
#         assert bank.bankAmount == 50000.00

#     def test_int_14_get_user_banks(self):
#         newuser = create_user(name="James Klug", email="klug@mail.com", password="klugpass")
#         newbank = create_bank(userID=newuser.id, bankTitle="Klug Bank", bankCurrency="USD", bankAmount=2300.00)
#         user_banks_json = get_user_banks_json(newuser.id)
#         self.assertListEqual([{"bankID":newbank.bankID,
#                                "userID":newuser.id, 
#                                "bankTitle":"Klug Bank",
#                                "bankCurrency":"USD",
#                                "bankAmount":"$2300.00",
#                                "remainingBankAmount": "$2300.00"},
#                               ], user_banks_json)

#     def test_int_15_update_bank(self):
#         newuser = create_user(name="Misha Petrov", email="misha@mail.com", password="mishapass")
#         newbank = create_bank(userID=newuser.id, bankTitle="Misha Bank", bankCurrency="TTD", bankAmount=200.00)
#         update_bank(bankID=newbank.bankID, bankTitle="Petrov Bank", bankCurrency=None, bankAmount=None)
#         bank = get_bank(newbank.bankID)
#         assert bank.bankTitle == "Petrov Bank"

#     def test_int_16_delete_bank(self):
#         newuser = create_user(name="Hannah Alonzo", email="hannah@mail.com", password="hannahpass")
#         newbank = create_bank(userID=newuser.id, bankTitle="Hannah Bank", bankCurrency="TTD", bankAmount=10000.00)
#         delete_bank(newbank.bankID)
#         deletedbank = get_budget(newbank.bankID)
#         assert deletedbank is None

# # class GoalIntegration(unittest.TestCase):