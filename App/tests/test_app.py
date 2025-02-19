import os, tempfile, pytest, logging, unittest
from werkzeug.security import check_password_hash, generate_password_hash

from App.main import create_app
from App.database import db, create_db
from App.models import User
# from App.controllers import (
#     create_user,
#     get_all_users_json,
#     login,
#     get_user,
#     update_user
# )


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

# This fixture creates an empty database for the test and deletes it after the test
# scope="class" would execute the fixture once and resued for all methods in the class
# @pytest.fixture(autouse=True, scope="module")
# def empty_db():
#     app = create_app({'TESTING': True, 'SQLALCHEMY_DATABASE_URI': 'sqlite:///test.db'})
#     create_db()
#     yield app.test_client()
#     db.drop_all()


# def test_authenticate():
#     user = create_user("Bob Bobberson", "bob@mail.com", "bobpass")
#     assert login("bob@mail.com", "bobpass") != None

# class UsersIntegrationTests(unittest.TestCase):

#     def test_create_user(self):
#         user = create_user("Rick Rickson", "rick@mail.com", "bobpass")
#         assert user.email == "rick@mail.com"

#     def test_get_all_users_json(self):
#         users_json = get_all_users_json()
#         self.assertListEqual([{"id":1, "email":"bob@mail.com"}, {"id":2, "email":"rick@mail.com"}], users_json)

#     # Tests data changes in the database
#     def test_update_user(self):
#         update_user(1, "ronnie@mail.com")
#         user = get_user(1)
#         assert user.email == "ronnie@mail.com"
        

