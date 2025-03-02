from .user import create_user
from App.Backend.database import db


def initialize():
    db.drop_all()
    db.create_all()
    create_user('Bob Bobberson', 'bob@mail.com', 'bobpass')
    create_user('Alice Wonderland','alice@mail.com', 'alicepass')
    create_user('Trudy TruffleHat','trudy@mail.com', 'trudypass')
    create_user('Rick Rickson','rick@mail.com', 'rickpass')
    create_user('Jane Doe','jane@mail.com', 'janepass')
