from .user import create_user
from App.Backend.database import db


def initialize():
    db.drop_all()
    db.create_all()
    create_user('bob@mail.com', 'bobpass')
    create_user('alice@mail.com', 'alicepass')
    create_user('trudy@mail.com', 'trudypass')
    create_user('rick@mail.com', 'rickpass')
    create_user('jane@mail.com', 'janepass')
