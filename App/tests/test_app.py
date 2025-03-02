import datetime
import pytest, logging, unittest
from flask import current_app
from App.main import create_app
from App.database import db, create_db
from App.models import (
    User,
    TransactionType
)
from App.controllers import (
    create_user,
    get_all_users_json,
    my_login_user,
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
    update_transaction
)

def string_to_date(date_str):
    return datetime.datetime.strptime(date_str, "%Y-%m-%d").date()

def string_to_time(time_str):
    return datetime.datetime.strptime(time_str, "%H:%M").time()

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
        with current_app.test_request_context():
            response = my_login_user(newuser)
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
        newuser = create_user("Alex Alexander", "alex@mail.com", "alexpass")
        newbudget = create_budget("January Budget", 200.00, 200.00, string_to_date("2025-01-01"), string_to_date("2025-01-31"), newuser.id)
        budget = get_budget(newbudget.budgetID)
        assert budget.budgetTitle == "January Budget"
        assert budget.budgetAmount == 200.00

    def test_int_06_get_user_budgets_json(self):
        newuser = create_user("Michael Myers", "michael@mail.com", "michaelpass")
        budget1 = create_budget("January Budget", 200.00, 200.00, string_to_date("2025-01-01"), string_to_date("2025-01-31"), newuser.id)
        budget2 = create_budget("February Budget", 150.00, 150.00, string_to_date("2025-02-01"), string_to_date("2025-02-28"), newuser.id)
        budget3 = create_budget("March Budget", 100.00, 100.00, string_to_date("2025-03-01"), string_to_date("2025-03-31"), newuser.id)
        user_budgets_json = get_user_budgets_json(newuser.id)
        self.assertListEqual([{"budgetID":budget1.budgetID, 
                               "budgetTitle":"January Budget",
                               "budgetAmount":200.00,
                               "remainingBudgetAmount":200.00,
                               "startDate":"Wed, 01 Jan 2025",
                               "endDate":"Fri, 31 Jan 2025",
                               "userID": newuser.id,
                               "transactions":[] },
                              {"budgetID":budget2.budgetID, 
                               "budgetTitle":"February Budget",
                               "budgetAmount":150.00,
                               "remainingBudgetAmount":150.00,
                               "startDate":"Sat, 01 Feb 2025",
                               "endDate":"Fri, 28 Feb 2025",
                               "userID": newuser.id,
                               "transactions":[] },
                               {"budgetID":budget3.budgetID, 
                               "budgetTitle":"March Budget",
                               "budgetAmount":100.00,
                               "remainingBudgetAmount":100.00,
                               "startDate":"Sat, 01 Mar 2025",
                               "endDate":"Mon, 31 Mar 2025",
                               "userID": newuser.id,
                               "transactions":[] }
                              ], user_budgets_json)

    def test_int_07_update_budget(self):
        newuser = create_user("John Wick", "wick@mail.com", "wickpass")
        newbudget = create_budget("My Budget", 5.00, 5.00, string_to_date("2025-01-01"), string_to_date("2025-01-31"), newuser.id)
        update_budget(newbudget.budgetID, None, 500.00, None, None)
        budget = get_budget(newbudget.budgetID)
        assert budget.budgetAmount == 500.00

    def test_int_08_delete_budget(self):
        newuser = create_user("Poppy Poppyseed", "poppy@mail.com", "poppypass")
        newbudget = create_budget("Temp Budget", 10.00, 10.00, string_to_date("2025-01-01"), string_to_date("2025-01-31"), newuser.id)
        delete_budget(newbudget.budgetID)
        deletedbudget = get_budget(newbudget.budgetID)
        assert deletedbudget is None

class TransactionIntegrationTests(unittest.TestCase):

    def test_int_09_add_transaction(self):
        newuser = create_user("Sunny Sunflower", "sunny@mail.com", "sunnypass")
        newbudget = create_budget("Sunny Budget", 500.00, 500.00, string_to_date("2025-01-01"), string_to_date("2025-01-31"), newuser.id)
        newtransaction = add_transaction(
            newuser.id, 
            "Ride To School", 
            "Usual bus route ride to school", 
            TransactionType.EXPENSE, 
            TransactionCategory.TRANSIT, 
            7.00, 
            transactionDate=string_to_date("2025-01-06"),
            transactionTime=string_to_time("09:30"),
            budgetID=newbudget.budgetID
        )
        transaction = get_transaction(newtransaction.transactionID)
        assert transaction.transactionTitle == "Ride To School"

    def test_int_10_user_transactions_json(self):
        newuser = create_user("Sonni Bunni", "sonni@mail.com", "sonniepass")
        newbudget = create_budget("Sunny Budget", 1000.00, 1000.00, string_to_date("2025-01-01"), string_to_date("2025-01-31"), newuser.id)
        newtransaction1 = add_transaction(
            newuser.id, 
            "Movie Night", 
            "Spontaneous Movie Night", 
            TransactionType.EXPENSE, 
            TransactionCategory.ENTERTAINMENT, 
            30.00, 
            transactionDate=string_to_date("2025-02-10"),
            transactionTime=string_to_time("17:30"),
            budgetID=newbudget.budgetID
        )
        newtransaction2 = add_transaction(
            newuser.id, 
            "Mini Grocery Shopping", 
            "Small grocery shopping trip", 
            TransactionType.EXPENSE, 
            TransactionCategory.GROCERIES, 
            100.00, 
            transactionDate=string_to_date("2025-01-22"),
            transactionTime=string_to_time("11:00"),
            budgetID=newbudget.budgetID
        )
        user_transaction_json = get_user_transactions_json(newuser.id)
        self.assertListEqual([{"userID":newuser.id, 
                               "transactionID":newtransaction1.transactionID,
                               "transactionTitle":"Movie Night",
                               "transactionDescription":"Spontaneous Movie Night",
                               "transactionType":"expense",
                               "transactionCategory":"entertainment",
                               "transactionAmount": 30.00,
                               "transactionDate": "Mon, 10 Feb 2025",
                               "transactionTime": "17:30" },
                              {"userID":newuser.id, 
                               "transactionID":newtransaction2.transactionID,
                               "transactionTitle":"Mini Grocery Shopping",
                               "transactionDescription":"Small grocery shopping trip",
                               "transactionType":"expense",
                               "transactionCategory":"groceries",
                               "transactionAmount": 100.00,
                               "transactionDate": "Wed, 22 Jan 2025",
                               "transactionTime": "11:00" }
                              ], user_transaction_json)

    def test_int_11_update_transaction(self):
        newuser = create_user("Larry Pinhead", "larry@mail.com", "larrypass")
        newbudget = create_budget("My Budget", 2000.00, 2000.00, string_to_date("2025-01-01"), string_to_date("2025-01-31"), newuser.id)
        newtransaction = add_transaction(
            newuser.id, 
            "Picnic Party", 
            "Had a small picnic with friends", 
            TransactionType.EXPENSE, 
            "Bills", 
            75.00, 
            transactionDate=string_to_date("2025-02-01"),
            transactionTime=string_to_time("14:30"),
            budgetID=newbudget.budgetID
        )
        update_transaction(newtransaction.transactionID, None, None, None, newtransaction.transactionCategory, None, None, None, None)
        transaction = get_transaction(newtransaction.transactionID)
        assert transaction.transactionCategory.value == "entertainment"