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

    def string_to_date(date_str):
        return datetime.datetime.strptime(date_str, "%Y-%m-%d").date()

    def string_to_time(time_str):
        return datetime.datetime.strptime(time_str, "%H:%M").time()
    

    # Bob's Budgets
    january_budget = create_budget("January Budget", 150.25, string_to_date("2025-01-01"), string_to_date("2025-01-31"), bob.id)
    february_budget = create_budget("February Budget", 50, string_to_date("2025-02-01"), string_to_date("2025-02-28"), bob.id)
    march_budget = create_budget("March Budget", 200, string_to_date("2025-03-01"), string_to_date("2025-03-31"), bob.id)
    groceries_budget = create_budget("Groceries", 500, string_to_date("2025-01-01"), string_to_date("2025-06-30"), bob.id)
    entertainment_budget = create_budget("Entertainment", 300, string_to_date("2025-01-01"), string_to_date("2025-06-30"), bob.id)


    # Transactions for Bob
    add_transaction(
        bob.id, 
        "Grocery Shopping", 
        "Weekly groceries for the family", 
        TransactionType.EXPENSE, 
        TransactionCategory.GROCERIES, 
        120.50, 
        transactionDate=string_to_date("2025-01-05"),
        transactionTime=string_to_time("14:30"),
        budgetID=january_budget.budgetID
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
        budgetID=january_budget.budgetID
    )

    add_transaction(
        bob.id, 
        "Dinner Out", 
        "Family dinner at a restaurant", 
        TransactionType.EXPENSE, 
        TransactionCategory.ENTERTAINMENT, 
        60.00, 
        transactionDate=string_to_date("2025-02-14"),
        transactionTime=string_to_time("20:00"),
        budgetID=january_budget.budgetID
    )

    add_transaction(
        bob.id, 
        "Electric Bill", 
        "Monthly electricity payment", 
        TransactionType.EXPENSE, 
        TransactionCategory.TRANSIT, 
        100.00, 
        transactionDate=string_to_date("2025-03-05"),
        transactionTime=string_to_time("09:00"),
        budgetID=january_budget.budgetID
    )

    add_transaction(
        bob.id, 
        "Supermarket Run", 
        "Restocking groceries", 
        TransactionType.EXPENSE, 
        TransactionCategory.GROCERIES, 
        80.00, 
        transactionDate=string_to_date("2025-03-15"),
        transactionTime=string_to_time("13:00"),
        budgetID=january_budget.budgetID
    )

    add_transaction(
        bob.id, 
        "Streaming Subscription", 
        "Monthly streaming service", 
        TransactionType.EXPENSE, 
        TransactionCategory.ENTERTAINMENT, 
        15.99, 
        transactionDate=string_to_date("2025-03-20"),
        transactionTime=string_to_time("10:00"),
        budgetID=entertainment_budget.budgetID
    )

    add_transaction(
        bob.id, 
        "Gym Membership", 
        "Monthly gym fee", 
        TransactionType.EXPENSE, 
        TransactionCategory.TRANSIT, 
        30.00, 
        transactionDate=string_to_date("2025-04-01"),
        transactionTime=string_to_time("07:30"),
        budgetID=march_budget.budgetID
    )