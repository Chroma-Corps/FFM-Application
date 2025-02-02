from .user import create_user
from App.Backend.database import db


def initialize():
    db.drop_all()
    db.create_all()
    create_user('bob', 'bobpass')
    create_user('alice', 'alicepass')
    create_user('trudy', 'trudypass')
    create_user('rick', 'rickpass')
    create_user('jane', 'janepass')
