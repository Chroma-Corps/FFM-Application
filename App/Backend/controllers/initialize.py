import datetime
from App.Backend.controllers.budget import create_budget
from .user import create_user
from App.Backend.database import db


def initialize():
    db.drop_all()
    db.create_all()
    bob = create_user('Bob Bobberson', 'bob@mail.com', 'bobpass')
    alice = create_user('Alice Wonderland','alice@mail.com', 'alicepass')
    create_user('Trudy TruffleHat','trudy@mail.com', 'trudypass')
    create_user('Rick Rickson','rick@mail.com', 'rickpass')
    create_user('Jane Doe','jane@mail.com', 'janepass')

    def string_to_date(date_str):
        return datetime.datetime.strptime(date_str, "%Y-%m-%d").date()

    # Example Budgets
    budget1 = create_budget("January Budget", string_to_date("2025-01-01"), string_to_date("2025-01-31"), bob.id)
    budget2 = create_budget("February Budget", string_to_date("2025-02-01"), string_to_date("2025-02-28"), bob.id)
    budget3 = create_budget("March Budget", string_to_date("2025-03-01"), string_to_date("2025-03-31"), alice.id)
