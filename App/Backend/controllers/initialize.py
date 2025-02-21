import datetime
from App.Backend.controllers.budget import create_budget
from App.Backend.controllers.transaction import add_transaction
from App.Backend.models.transaction import TransactionCategory, TransactionType
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

    def string_to_time(time_str):
        return datetime.datetime.strptime(time_str, "%H:%M").time()

    # Example Budgets
    budget1 = create_budget("January Budget", 150.25, 150.25, string_to_date("2025-01-01"), string_to_date("2025-01-31"), bob.id, "Individual")
    budget2 = create_budget("February Budget", 50, 50,  string_to_date("2025-02-01"), string_to_date("2025-02-28"), bob.id, "Individual")
    budget3 = create_budget("March Budget", 1000, 1000, string_to_date("2025-03-01"), string_to_date("2025-03-31"), alice.id, "Individual")


    # Example Transactions for Bob
    add_transaction(
        bob.id, 
        "Grocery Shopping", 
        "Weekly groceries for the family", 
        TransactionType.EXPENSE, 
        TransactionCategory.GROCERIES, 
        120.50, 
        transactionDate=string_to_date("2025-01-05"),
        transactionTime=string_to_time("14:30"),
        budgetID=budget1.budgetID
    )

    add_transaction(
        bob.id, 
        "Movie Tickets", 
        "Weekend movie with friends", 
        TransactionType.EXPENSE, 
        TransactionCategory.ENTERTAINMENT,
        45.00, 
        transactionDate=string_to_date("2025-01-10"),
        transactionTime=string_to_time("19:00"),
        budgetID=budget1.budgetID
    )
