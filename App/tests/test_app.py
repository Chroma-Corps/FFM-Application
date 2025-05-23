import pytest, logging, unittest
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

        assert bank.bankTitle == "Jenny Wallet"

    def test_int_13_get_user_banks_json(self):
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

        updated_bank = update_bank(bankID=bank.bankID, bankAmount=5000)
        assert updated_bank.bankAmount == 5000

    def test_int_15_delete_bank(self):
        user = create_user(name="Jenny Applesauce",
                            email="jenny5@mail.com",
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

# Budget
class BudgetIntegrationTests(unittest.TestCase):

    def test_int_16_create_budget(self):
        user = create_user(name="Alex Alexander",
                              email="alex@mail.com",
                              password="alexpass")

        circle = create_circle(circleName="Alex Circle",
                        circleType=CircleType.SELF,
                        circleColor="#6A3D9A",
                        circleImage="https://picsum.photos/id/82/300/300.jpg",
                        userID=user.id)

        set_active_circle(userID=user.id, circleID=circle.circleID)

        bank = create_bank(userID=user.id,
                           bankTitle="Alex Wallet",
                           bankCurrency="TTD",
                           bankAmount=1000,
                           isPrimary=True,
                           color="#6A3D9A")

        budget = create_budget(budgetTitle="Alex Budget", 
                               budgetAmount=200.00,
                               budgetType=BudgetType.EXPENSE,
                               budgetCategory=["ENTERTAINMENT"],
                               transactionScope=TransactionScope.INCLUSIVE,
                               color="#6A3D9A",
                               startDate="2025-01-01",
                               endDate="2025-01-31",
                               userID=user.id,
                               bankID=bank.bankID)

        newbudget = get_budget(budget.budgetID)
        assert newbudget.budgetTitle == "Alex Budget"
        assert newbudget.budgetAmount == 200.00

    def test_int_17_get_user_budgets_json(self):
        user = create_user(name="Michael Myers", email="michael@mail.com", password="michaelpass")

        circle = create_circle(circleName="Michael Circle",
                        circleType=CircleType.SELF,
                        circleColor="#6A3D9A",
                        circleImage="https://picsum.photos/id/82/300/300.jpg",
                        userID=user.id)

        set_active_circle(userID=user.id, circleID=circle.circleID)

        bank = create_bank(userID=user.id,
                           bankTitle="Michael Wallet",
                           bankCurrency="USD",
                           bankAmount=5000,
                           isPrimary=True,
                           color="#6A3D9A")

        budget = create_budget(budgetTitle="Michael Budget", 
                            budgetAmount=500.00,
                            budgetType=BudgetType.EXPENSE,
                            budgetCategory=["SHOPPING"],
                            transactionScope=TransactionScope.INCLUSIVE,
                            color="#6A3D9A",
                            startDate="2025-01-01",
                            endDate="2025-01-31",
                            userID=user.id,
                            bankID=bank.bankID)

        user_budgets_json = get_user_budgets_json(userID=user.id)

        expected = [{
                    "budgetID":budget.budgetID,
                    "budgetTitle":"Michael Budget",
                    "budgetAmount":"$500.00",
                    "remainingBudgetAmount":"$500.00",
                    "budgetType": "Expense",
                    "budgetCategory": ["Shopping"],
                    "transactionScope": "Inclusive",
                    "startDate":"Wed, 01 Jan 2025",
                    "endDate":"Fri, 31 Jan 2025",
                    "bankID": bank.bankID,
                    "color": "#6A3D9A",
                    "owner": "Michael Myers"
                    }]

        self.assertListEqual(user_budgets_json, expected)

    def test_int_18_update_budget(self):
        user = create_user(name="John Wick",
                              email="wick@mail.com",
                              password="wickpass")

        circle = create_circle(circleName="Wick Circle",
                        circleType=CircleType.SELF,
                        circleColor="#6A3D9A",
                        circleImage="https://picsum.photos/id/82/300/300.jpg",
                        userID=user.id)

        set_active_circle(userID=user.id, circleID=circle.circleID)

        bank = create_bank(userID=user.id,
                           bankTitle="Wick Wallet",
                           bankCurrency="TTD",
                           bankAmount=10000,
                           isPrimary=True,
                           color="#6A3D9A")

        budget = create_budget(budgetTitle="Wick Budget", 
                               budgetAmount=250.00,
                               budgetType=BudgetType.EXPENSE,
                               budgetCategory=["TRANSIT"],
                               transactionScope=TransactionScope.INCLUSIVE,
                               color="#6A3D9A",
                               startDate="2025-01-01",
                               endDate="2025-01-31",
                               userID=user.id,
                               bankID=bank.bankID)

        update_budget(budgetID=budget.budgetID, budgetTitle="John Wick Budget")
        updated_budget = get_budget(budget.budgetID)
        assert updated_budget.budgetTitle == "John Wick Budget"

    def test_int_19_delete_budget(self):
        user = create_user(name="Poppy Poppyseed",
                              email="poppy@mail.com",
                              password="poppypass")

        circle = create_circle(circleName="Poppy Circle",
                        circleType=CircleType.SELF,
                        circleColor="#6A3D9A",
                        circleImage="https://picsum.photos/id/82/300/300.jpg",
                        userID=user.id)

        set_active_circle(userID=user.id, circleID=circle.circleID)

        bank = create_bank(userID=user.id,
                           bankTitle="Poppy Wallet",
                           bankCurrency="TTD",
                           bankAmount=10000,
                           isPrimary=True,
                           color="#6A3D9A")

        budget = create_budget(budgetTitle="Poppy Budget", 
                               budgetAmount=250.15,
                               budgetType=BudgetType.EXPENSE,
                               budgetCategory=["GROCERIES"],
                               transactionScope=TransactionScope.EXCLUSIVE,
                               color="#6A3D9A",
                               startDate="2025-01-01",
                               endDate="2025-01-31",
                               userID=user.id,
                               bankID=bank.bankID)

        delete_budget(userID=user.id, budgetID=budget.budgetID)
        deletedbudget = get_budget(budgetID=budget.budgetID)
        self.assertIsNone(deletedbudget)

# Goal
class GoalIntegrationTests(unittest.TestCase):

    def test_int_20_create_goal(self):
        user = create_user(name="Alex Alexander",
                              email="alex1@mail.com",
                              password="alexpass")

        circle = create_circle(circleName="Alex Circle",
                        circleType=CircleType.SELF,
                        circleColor="#6A3D9A",
                        circleImage="https://picsum.photos/id/82/300/300.jpg",
                        userID=user.id)

        set_active_circle(userID=user.id, circleID=circle.circleID)

        goal = create_goal(goalTitle="Alex Goal",
                           targetAmount=1000.00,
                           goalType=GoalType.SAVINGS,
                           color="#6A3D9A",
                           startDate="2025-01-01",
                           endDate="2025-01-31",
                           userID=user.id)

        newgoal = get_goal(goal.goalID)
        assert newgoal.goalTitle == "Alex Goal"
        assert newgoal.targetAmount == 1000.00

    def test_int_21_get_user_goals_json(self):
        user = create_user(name="Michael Myers", email="michael1@mail.com", password="michaelpass")

        circle = create_circle(circleName="Michael Circle",
                        circleType=CircleType.SELF,
                        circleColor="#6A3D9A",
                        circleImage="https://picsum.photos/id/82/300/300.jpg",
                        userID=user.id)

        set_active_circle(userID=user.id, circleID=circle.circleID)

        goal = create_goal(goalTitle="Michael Goal",
                           targetAmount=1000.00,
                           goalType=GoalType.SAVINGS,
                           color="#6A3D9A",
                           startDate="2025-01-01",
                           endDate="2025-01-31",
                           userID=user.id)

        user_goals_json = get_user_goals_json(userID=user.id)

        expected = [{
                    "goalID":goal.goalID,
                    "goalTitle":"Michael Goal",
                    "targetAmount":"TT$1000.00",
                    "currentAmount": "TT$0.00",
                    "goalType": "Savings",
                    "startDate":"Wed, 01 Jan 2025",
                    "endDate":"Fri, 31 Jan 2025",
                    "color": "#6A3D9A",
                    "owner": "Michael Myers"
                    }]

        self.assertListEqual(user_goals_json, expected)

    def test_int_22_update_goal(self):
        user = create_user(name="John Wick",
                            email="wick1@mail.com",
                            password="wickpass")

        circle = create_circle(circleName="Wick Circle",
                        circleType=CircleType.SELF,
                        circleColor="#6A3D9A",
                        circleImage="https://picsum.photos/id/82/300/300.jpg",
                        userID=user.id)

        set_active_circle(userID=user.id, circleID=circle.circleID)

        goal = create_goal(goalTitle="Wick Goal",
                           targetAmount=20.00,
                           goalType=GoalType.SAVINGS,
                           color="#6A3D9A",
                           startDate="2025-01-01",
                           endDate="2025-01-31",
                           userID=user.id)

        update_goal(goalID=goal.goalID, targetAmount=2200)
        updated_goal = get_goal(goal.goalID)
        assert updated_goal.targetAmount == 2200

    def test_int_23_delete_goal(self):
        user = create_user(name="Poppy Poppyseed",
                              email="poppy1@mail.com",
                              password="poppypass")

        circle = create_circle(circleName="Poppy Circle",
                        circleType=CircleType.SELF,
                        circleColor="#6A3D9A",
                        circleImage="https://picsum.photos/id/82/300/300.jpg",
                        userID=user.id)

        set_active_circle(userID=user.id, circleID=circle.circleID)

        goal = create_goal(goalTitle="Popppy Goal",
                           targetAmount=1000.00,
                           goalType=GoalType.SAVINGS,
                           color="#6A3D9A",
                           startDate="2025-01-01",
                           endDate="2025-01-31",
                           userID=user.id)

        delete_goal(userID=user.id, goalID=goal.goalID)
        deletedgoal = get_goal(goalID=goal.goalID)
        self.assertIsNone(deletedgoal)

# Transaction
class TransactionIntegrationTests(unittest.TestCase):

    def test_int_24_add_transaction(self):
        user = create_user(name="Sunny Sunflower",
                           email="sunny@mail.com",
                           password="sunnypass")

        circle = create_circle(circleName="Sunny Circle",
                        circleType=CircleType.SELF,
                        circleColor="#6A3D9A",
                        circleImage="https://picsum.photos/id/82/300/300.jpg",
                        userID=user.id)

        set_active_circle(userID=user.id, circleID=circle.circleID)

        bank = create_bank(userID=user.id,
                           bankTitle="Sunny Wallet",
                           bankCurrency="TTD",
                           bankAmount=1000,
                           isPrimary=True,
                           color="#6A3D9A")

        budget = create_budget(budgetTitle="Sunny Budget", 
                                budgetAmount=200.00,
                                budgetType=BudgetType.EXPENSE,
                                budgetCategory=["TRANSIT"],
                                transactionScope=TransactionScope.INCLUSIVE,
                                color="#6A3D9A",
                                startDate="2025-01-01",
                                endDate="2025-01-31",
                                userID=user.id,
                                bankID=bank.bankID)

        add_transaction(
            transactionTitle="Ride To School", 
            transactionDesc="Usual bus route ride to school", 
            transactionType=TransactionType.EXPENSE, 
            transactionCategory=["TRANSIT"], 
            transactionAmount=10.00, 
            transactionDate="2025-01-06",
            transactionTime="09:30",
            bankID=bank.bankID,
            userID=user.id,
            goalID=None,
            budgetID=budget.budgetID
        )

        assert bank.remainingBankAmount == 990

    def test_int_25_user_transactions_json(self):
        user = create_user(name="Sonni Bunni",
                           email="sonni@mail.com",
                           password="sonnipass")

        circle = create_circle(circleName="Sonni Circle",
                        circleType=CircleType.SELF,
                        circleColor="#6A3D9A",
                        circleImage="https://picsum.photos/id/82/300/300.jpg",
                        userID=user.id)

        set_active_circle(userID=user.id, circleID=circle.circleID)

        bank = create_bank(userID=user.id,
                           bankTitle="Sonni Wallet",
                           bankCurrency="USD",
                           bankAmount=3700,
                           isPrimary=True,
                           color="#6A3D9A")

        budget = create_budget(budgetTitle="Sonni Budget", 
                                budgetAmount=760.00,
                                budgetType=BudgetType.EXPENSE,
                                budgetCategory=["ENTERTAINMENT"],
                                transactionScope=TransactionScope.INCLUSIVE,
                                color="#6A3D9A",
                                startDate="2025-01-01",
                                endDate="2025-01-31",
                                userID=user.id,
                                bankID=bank.bankID)

        newtransaction, _ = add_transaction(
            transactionTitle="Movie Night", 
            transactionDesc="Spontaneous Movie Night", 
            transactionType=TransactionType.EXPENSE, 
            transactionCategory=["ENTERTAINMENT", "TRANSIT"], 
            transactionAmount=30.00, 
            transactionDate="2025-02-10",
            transactionTime="17:30",
            bankID=bank.bankID,
            userID=user.id,
            goalID=None,
            budgetID=budget.budgetID
        )

        user_transactions_json = get_user_transactions_json(userID=user.id)
        expected = [{
                "transactionID": newtransaction.transactionID,
                "transactionTitle":"Movie Night",
                "transactionDescription":"Spontaneous Movie Night",
                "transactionAmount": "$30.00",
                "transactionType":"Expense",
                "transactionCategory": ["Entertainment", "Transit"],
                "transactionDate": "Mon, Feb 10 2025",
                "transactionTime": "17:30",
                "transactionBank": bank.bankID,
                "transactionBudget":budget.budgetID,
                "transactionGoal": None,
                "attachments": [],
                "owner": "Sonni Bunni"
                }]

        self.assertListEqual(user_transactions_json, expected)
    
    def test_int_26_update_transaction(self):
        user = create_user(name="Larry Pinhead",
                    email="larry@mail.com",
                    password="larrypass")

        circle = create_circle(circleName="Larry Circle",
                        circleType=CircleType.SELF,
                        circleColor="#6A3D9A",
                        circleImage="https://picsum.photos/id/82/300/300.jpg",
                        userID=user.id)

        set_active_circle(userID=user.id, circleID=circle.circleID)

        bank = create_bank(userID=user.id,
                           bankTitle="Larry Wallet",
                           bankCurrency="TTD",
                           bankAmount=300,
                           isPrimary=True,
                           color="#6A3D9A")

        budget = create_budget(budgetTitle="Larry Budget", 
                                budgetAmount=1000.00,
                                budgetType=BudgetType.EXPENSE,
                                budgetCategory=["ENTERTAINMENT"],
                                transactionScope=TransactionScope.INCLUSIVE,
                                color="#6A3D9A",
                                startDate="2025-01-01",
                                endDate="2025-01-31",
                                userID=user.id,
                                bankID=bank.bankID)

        newtransaction = add_transaction(
            transactionTitle="Picanic Party", 
            transactionDesc="Had a small picnic with friends", 
            transactionType=TransactionType.EXPENSE, 
            transactionCategory=["ENTERTAINMENT"], 
            transactionAmount=75.00, 
            transactionDate="2025-01-06",
            transactionTime="14:30",
            bankID=bank.bankID,
            userID=user.id,
            goalID=None,
            budgetID=budget.budgetID,
        )

        transaction = newtransaction[0]

        update_transaction(transactionID=transaction.transactionID, transactionTitle="Picnic Party")
        updated_transaction = get_transaction(transaction.transactionID)
        assert updated_transaction.transactionTitle == "Picnic Party"

    def test_int_27_void_transaction(self):
        user = create_user(name="Laura Lynn",
                    email="laura@mail.com",
                    password="laurapass")

        circle = create_circle(circleName="Larua Circle",
                        circleType=CircleType.SELF,
                        circleColor="#6A3D9A",
                        circleImage="https://picsum.photos/id/82/300/300.jpg",
                        userID=user.id)

        set_active_circle(userID=user.id, circleID=circle.circleID)

        bank = create_bank(userID=user.id,
                           bankTitle="Larua Wallet",
                           bankCurrency="USD",
                           bankAmount=1500,
                           isPrimary=True,
                           color="#6A3D9A")

        budget = create_budget(budgetTitle="Larua Budget", 
                                budgetAmount=700.00,
                                budgetType=BudgetType.SAVINGS,
                                budgetCategory=["INCOME"],
                                transactionScope=TransactionScope.INCLUSIVE,
                                color="#6A3D9A",
                                startDate="2025-01-01",
                                endDate="2025-01-31",
                                userID=user.id,
                                bankID=bank.bankID)

        newtransaction, _ = add_transaction(
            transactionTitle="Savings", 
            transactionDesc="", 
            transactionType=TransactionType.INCOME, 
            transactionCategory=["INCOME"], 
            transactionAmount=100.00, 
            transactionDate="2025-02-01",
            transactionTime="14:30",
            bankID=bank.bankID,
            userID=user.id,
            goalID=None,
            budgetID=budget.budgetID
        )

        void_transaction(userID=user.id, transactionID=newtransaction.transactionID)
        transaction = get_transaction(newtransaction.transactionID)
        assert transaction.voided == True