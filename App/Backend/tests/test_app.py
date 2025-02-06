import os, tempfile, pytest, logging, unittest
from werkzeug.security import check_password_hash, generate_password_hash

from App.Backend.main import create_app
from App.Backend.database import db, create_db
from App.Backend.models import User
from App.Backend.controllers import (
    create_user,
    get_all_users_json,
    login,
    get_user,
    get_user_by_email,
    update_user
)


LOGGER = logging.getLogger(__name__)

'''
   Unit Tests
'''
class UserUnitTests(unittest.TestCase):

    def test_new_user(self):
        user = User("bob@mail.com", "bobpass")
        assert user.email == "bob@mail.com"

    # pure function no side effects or integrations called
    def test_get_json(self):
        user = User("bob@mail.com", "bobpass")
        user_json = user.get_json()
        self.assertDictEqual(user_json, {"id":None, "email":"bob@mail.com"})
    
    def test_hashed_password(self):
        password = "mypass"
        hashed = generate_password_hash(password, method='sha256')
        user = User("bob@mail.com", password)
        assert user.password != password

    def test_check_password(self):
        password = "mypass"
        user = User("bob@mail.com", password)
        assert user.check_password(password)

'''
    Integration Tests
'''

# This fixture creates an empty database for the test and deletes it after the test
# scope="class" would execute the fixture once and resued for all methods in the class
@pytest.fixture(autouse=True, scope="module")
def empty_db():
    app = create_app({'TESTING': True, 'SQLALCHEMY_DATABASE_URI': 'sqlite:///test.db'})
    create_db()
    yield app.test_client()
    db.drop_all()


def test_authenticate():
    user = create_user("bob@mail.com", "bobpass")
    assert login("bob@mail.com", "bobpass") != None

class UsersIntegrationTests(unittest.TestCase):

    def test_create_user(self):
        user = create_user("rick@mail.com", "bobpass")
        assert user.email == "rick@mail.com"

    def test_get_all_users_json(self):
        users_json = get_all_users_json()
        self.assertListEqual([{"id":1, "email":"bob@mail.com"}, {"id":2, "email":"rick@mail.com"}], users_json)

    # Tests data changes in the database
    def test_update_user(self):
        update_user(1, "ronnie@mail.com")
        user = get_user(1)
        assert user.email == "ronnie@mail.com"
        

