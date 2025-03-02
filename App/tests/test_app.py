import datetime
import pytest, logging, unittest
from flask import current_app
from App.main import create_app
from App.database import db, create_db
from App.models import (
    User,
    TransactionType,
    BudgetType
)
from App.controllers import (
    create_user,
    get_all_users_json,
    login,
    get_user,
    update_user,
    create_budget,
    get_budget,
    get_user_budgets_json,
    update_budget,
    delete_budget,
    add_transaction,
    get_transaction,
    get_user_transactions_json,
    update_transaction,
    void_transaction,
    create_bank,
    get_bank,
    get_user_banks_json,
    update_bank,
    delete_bank
)

LOGGER = logging.getLogger(__name__)

@pytest.fixture(autouse=True, scope="module")
def empty_db():
    app = create_app({'TESTING': True, 'SQLALCHEMY_DATABASE_URI': 'sqlite:///test.db'})
    create_db()
    yield app.test_client()
    db.drop_all()

'''
   Unit Tests
'''

class UserUnitTests(unittest.TestCase):

    def test_unit_01_new_user(self):
        user = User("Bob Bobberson", "bob@mail.com", "bobpass")
        assert user.name == "Bob Bobberson"
        assert user.email == "bob@mail.com"

    def test_unit_02_get_json(self):
        user = User("Bob Bobberson", "bob@mail.com", "bobpass")
        user_json = user.get_json()
        self.assertDictEqual(user_json, {"id":None, "name":"Bob Bobberson", "email":"bob@mail.com"})

    def test_unit_03_check_password(self):
        password = "mypass"
        user = User("Bob Bobberson", "bob@mail.com", password)
        assert user.check_password(password)

    def test_unit_04_multiple_users(self):
        user1 = User("James Jameson", "james@mail.com", "jamespass")
        user2 = User("Anna Annabelle", "anna@mail.com", "annapass")
        user3 = User("Bella Churchbell", "bella@mail.com", "bellapass")

        assert user1.name == "James Jameson"
        assert user1.email == "james@mail.com"

        assert user2.name == "Anna Annabelle"
        assert user2.email == "anna@mail.com"

        assert user3.name == "Bella Churchbell"
        assert user3.email == "bella@mail.com"

    def test_unit_05_get_all_users_json(self):
        user1 = User("James Jameson", "james@mail.com", "jamespass")
        user1_json = user1.get_json()

        user2 = User("Anna Annabelle", "anna@mail.com", "annapass")
        user2_json = user2.get_json()

        user3 = User("Bella Churchbell", "bella@mail.com", "bellapass")
        user3_json = user3.get_json()

        self.assertDictEqual(user1_json, {"id":None, "name":"James Jameson", "email":"james@mail.com"})
        self.assertDictEqual(user2_json, {"id":None, "name":"Anna Annabelle", "email":"anna@mail.com"})
        self.assertDictEqual(user3_json, {"id":None, "name":"Bella Churchbell", "email":"bella@mail.com"})

'''
    Integration Tests
'''

class UserIntegrationTests(unittest.TestCase):

    def test_int_01_create_user(self):
        newuser = create_user("Johnny Applesauce", "johnny@mail.com", "johnnypass")
        user = get_user(newuser.id)
        assert user.email == "johnny@mail.com"

    def test_int_02_authenticate(self):
        newuser = create_user("Bubble Bub", "bubble@mail.com", "bubblepass")
        response = login(newuser.email, "bubblepass")
        assert response is not None

    def test_int_03_get_all_users_json(self):
        users_json = get_all_users_json()
        print(users_json)
        self.assertListEqual([{"id":1, "name":"Johnny Applesauce","email":"johnny@mail.com"},
                              {"id":2, "name":"Bubble Bub", "email":"bubble@mail.com"}
                              ], users_json)

    def test_int_04_update_user(self):
        newuser = create_user("Ronnie Ron", "runnie@mail.com", "ronniepass")
        update_user(newuser.id, "ronnie@mail.com")
        user = get_user(newuser.id)
        assert user.email == "ronnie@mail.com"

class BudgetIntegrationTests(unittest.TestCase):

    def test_int_05_create_budget(self):
        newuser = create_user(name="Alex Alexander", email="alex@mail.com", password="alexpass")
        newbank = create_bank(userID=newuser.id, bankTitle="Alex Bank", bankCurrency="USD", bankAmount=5000.00)
        newbudget = create_budget(budgetTitle="Alex Budget", budgetAmount=200.00, budgetType=BudgetType.EXPENSE, budgetCategory="ENTERTAINMENT", startDate="2025-01-01", endDate="2025-01-31", userID=newuser.id, bankID=newbank.bankID)
        budget = get_budget(newbudget.budgetID)
        assert budget.budgetTitle == "Alex Budget"
        assert budget.budgetAmount == 200.00

    def test_int_06_get_user_budgets_json(self):
        newuser = create_user(name="Michael Myers", email="michael@mail.com", password="michaelpass")
        newbank = create_bank(userID=newuser.id, bankTitle="Michael Bank", bankCurrency="USD", bankAmount=5000.00)
        newbudget = create_budget(budgetTitle="Michael Budget", budgetAmount=500.00, budgetType=BudgetType.EXPENSE, budgetCategory="SHOPPING", startDate="2025-01-01", endDate="2025-01-31", userID=newuser.id, bankID=newbank.bankID)
        user_budgets_json = get_user_budgets_json(newuser.id)
        self.assertListEqual([{"budgetID":newbudget.budgetID, 
                               "budgetTitle":"Michael Budget",
                               "budgetAmount":"$500.00",
                               "remainingBudgetAmount":"$500.00",
                               "budgetType": "Expense",
                               "budgetCategory": "Shopping",
                               "startDate":"Wed, 01 Jan 2025",
                               "endDate":"Fri, 31 Jan 2025",
                               "userID": newuser.id,
                               "bankID": newbank.bankID,
                               "transactions":[] },
                              ], user_budgets_json)

    def test_int_07_update_budget(self):
        newuser = create_user(name="John Wick", email="wick@mail.com", password="wickpass")
        newbank = create_bank(userID=newuser.id, bankTitle="Wick Bank", bankCurrency="TTD", bankAmount=10000.00)
        newbudget = create_budget(budgetTitle="Wick Budget", budgetAmount=20.00, budgetType=BudgetType.EXPENSE, budgetCategory="TRANSIT", startDate="2025-01-01", endDate="2025-01-31", userID=newuser.id, bankID=newbank.bankID)
        update_budget(budgetID=newbudget.budgetID, budgetTitle=None, budgetAmount=2000.00, budgetType=None, budgetCategory=None, startDate=None, endDate=None, bankID=None)
        budget = get_budget(newbudget.budgetID)
        assert budget.budgetAmount == 2000.00

    def test_int_08_delete_budget(self):
        newuser = create_user(name="Poppy Poppyseed", email="poppy@mail.com", password="poppypass")
        newbank = create_bank(userID=newuser.id, bankTitle="Poppy Bank", bankCurrency="TTD", bankAmount=10000.00)
        newbudget = create_budget(budgetTitle="Poppy Budget", budgetAmount=250.15, budgetType=BudgetType.EXPENSE, budgetCategory="GROCERIES", startDate="2025-01-01", endDate="2025-01-31", userID=newuser.id, bankID=newbank.bankID)
        delete_budget(newbudget.budgetID)
        deletedbudget = get_budget(newbudget.budgetID)
        assert deletedbudget is None

class TransactionIntegrationTests(unittest.TestCase):

    def test_int_09_add_transaction(self):
        newuser = create_user(name="Sunny Sunflower", email="sunny@mail.com", password="sunnypass")
        newbank = create_bank(userID=newuser.id, bankTitle="Sunny Bank", bankCurrency="TTD", bankAmount=5000.00)
        newbudget = create_budget(budgetTitle="Sunny Budget", budgetAmount=500.00, budgetType=BudgetType.EXPENSE, budgetCategory="TRANSIT", startDate="2025-01-01", endDate="2025-01-31", userID=newuser.id, bankID=newbank.bankID)
        newtransaction = add_transaction(
            userID=newuser.id, 
            transactionTitle="Ride To School", 
            transactionDesc="Usual bus route ride to school", 
            transactionType=TransactionType.EXPENSE, 
            transactionCategory="TRANSIT", 
            transactionAmount=7.00, 
            transactionDate="2025-01-06",
            transactionTime="09:30",
            budgetID=newbudget.budgetID
        )
        transaction = get_transaction(newtransaction.transactionID)
        assert transaction.transactionTitle == "Ride To School"

    def test_int_10_user_transactions_json(self):
        newuser = create_user(name="Sonni Bunni", email="sonni@mail.com", password="sonniepass")
        newbank = create_bank(userID=newuser.id, bankTitle="Sonni Bank", bankCurrency="USD", bankAmount=3700.00)
        newbudget = create_budget(budgetTitle="Sonni Budget", budgetAmount=760.00, budgetType=BudgetType.EXPENSE, budgetCategory="BILLS", startDate="2025-01-01", endDate="2025-01-31", userID=newuser.id, bankID=newbank.bankID)
        newtransaction = add_transaction(
            userID=newuser.id, 
            transactionTitle="Movie Night", 
            transactionDesc="Spontaneous Movie Night", 
            transactionType=TransactionType.EXPENSE, 
            transactionCategory="ENTERTAINMENT", 
            transactionAmount=30.00, 
            transactionDate="2025-02-10",
            transactionTime="17:30",
            budgetID=newbudget.budgetID
        )
        user_transaction_json = get_user_transactions_json(newuser.id)
        self.assertListEqual([{"userID":newuser.id, 
                               "transactionID":newtransaction.transactionID,
                               "transactionTitle":"Movie Night",
                               "transactionDescription":"Spontaneous Movie Night",
                               "transactionType":"Expense",
                               "transactionCategory":"Entertainment",
                               "transactionAmount": "$30.00",
                               "transactionDate": "Mon, 10 Feb 2025",
                               "transactionTime": "17:30" },
                              ], user_transaction_json)

    def test_int_11_update_transaction(self):
        newuser = create_user(name="Larry Pinhead", email="larry@mail.com", password="larrypass")
        newbank = create_bank(userID=newuser.id, bankTitle="Larry Bank", bankCurrency="TTD", bankAmount=300.00)
        newbudget = create_budget(budgetTitle="Larry Budget", budgetAmount=10.00, budgetType=BudgetType.EXPENSE, budgetCategory="ENTERTAINMENT", startDate="2025-01-01", endDate="2025-01-31", userID=newuser.id, bankID=newbank.bankID)
        newtransaction = add_transaction(
            userID=newuser.id, 
            transactionTitle="Picnic Party", 
            transactionDesc="Had a small picnic with friends", 
            transactionType=TransactionType.EXPENSE, 
            transactionCategory="Bills", 
            transactionAmount=75.00, 
            transactionDate="2025-02-01",
            transactionTime="14:30",
            budgetID=newbudget.budgetID
        )
        update_transaction(id=newtransaction.transactionID, transactionTitle=None, transactionDesc=None, transactionType=None, transactionCategory="ENTERTAINMENT", transactionAmount=None, transactionDate=None, transactionTime=None, budgetID=None)
        transaction = get_transaction(newtransaction.transactionID)
        assert transaction.transactionCategory == "Entertainment"

    def test_int_12_void_transaction(self):
        newuser = create_user(name="Laura Lynn", email="laura@mail.com", password="laurapass")
        newbank = create_bank(userID=newuser.id, bankTitle="Laura Bank", bankCurrency="USD", bankAmount=1500.00)
        newbudget = create_budget(budgetTitle="Larua Budget", budgetAmount=700.00, budgetType=BudgetType.SAVINGS, budgetCategory="INCOME", startDate="2025-01-01", endDate="2025-01-31", userID=newuser.id, bankID=newbank.bankID)
        newtransaction = add_transaction(
            userID=newuser.id, 
            transactionTitle="Savings Budget", 
            transactionDesc="A Savings Budget", 
            transactionType=TransactionType.INCOME, 
            transactionCategory="Income", 
            transactionAmount=100.00, 
            transactionDate="2025-02-01",
            transactionTime="14:30",
            budgetID=newbudget.budgetID
        )
        void_transaction(id=newtransaction.transactionID)
        transaction = get_transaction(newtransaction.transactionID)
        assert transaction.voided == True

class BankIntegrationTests(unittest.TestCase):

    def test_13_create_bank(self):
        newuser = create_user(name="Curt Curtis", email="curt@mail.com", password="curtpass")
        newbank = create_bank(userID=newuser.id, bankTitle="Curt Bank", bankCurrency="TTD", bankAmount=50000.00)
        bank = get_bank(newbank.bankID)
        assert bank.bankTitle == "Curt Bank"
        assert bank.bankAmount == 50000.00

    def test_14_get_user_banks(self):
        newuser = create_user(name="James Klug", email="klug@mail.com", password="klugpass")
        newbank = create_bank(userID=newuser.id, bankTitle="Klug Bank", bankCurrency="USD", bankAmount=2300.00)
        user_banks_json = get_user_banks_json(newuser.id)
        self.assertListEqual([{"userID":newuser.id, 
                               "bankTitle":"Klug Bank",
                               "bankCurrency":"USD",
                               "bankAmount":"$2300.00",
                               "remainingBankAmount": "$2300.00"},
                              ], user_banks_json)

    def test_int_15_update_bank(self):
        newuser = create_user(name="Misha Petrov", email="misha@mail.com", password="mishapass")
        newbank = create_bank(userID=newuser.id, bankTitle="Misha Bank", bankCurrency="TTD", bankAmount=200.00)
        update_bank(bankID=newbank.bankID, bankTitle="Petrov Bank", bankCurrency=None, bankAmount=None)
        bank = get_bank(newbank.bankID)
        assert bank.bankTitle == "Petrov Bank"

    def test_int_16_delete_bank(self):
        newuser = create_user(name="Hannah Alonzo", email="hannah@mail.com", password="hannahpass")
        newbank = create_bank(userID=newuser.id, bankTitle="Hannah Bank", bankCurrency="TTD", bankAmount=10000.00)
        delete_bank(newbank.bankID)
        deletedbank = get_budget(newbank.bankID)
        assert deletedbank is None