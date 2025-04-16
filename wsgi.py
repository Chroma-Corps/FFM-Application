import click, pytest, sys
from flask import Flask
from flask.cli import with_appcontext, AppGroup

from App.database import db, get_migrate
from App.models import User
from App.main import create_app
from App.controllers import ( create_user, get_all_users_json, get_all_users, initialize )

app = create_app()
migrate = get_migrate(app)

@app.cli.command("init", help="Creates And Initializes The Database")
def init():
    initialize()
    print('Database Intialized!')

'''
Test Commands
'''

test = AppGroup('test', help='Testing Commands')
# eg : flask test <command>

# eg : flask test user
@test.command("user", help="Run User Tests")
@click.argument("type", default="all")
def user_tests_command(type):
    if type == "unit":
        sys.exit(pytest.main(["-k", "UserUnitTests"]))
    elif type == "int":
        sys.exit(pytest.main(["-k", "UserIntegrationTests"]))
    else:
        sys.exit(pytest.main(["-k", "App"]))

# eg : flask test circle
@test.command("circle", help="Run Circle Tests")
@click.argument("type", default="all")
def circle_tests_command(type):
    if type == "unit":
        sys.exit(pytest.main(["-k", "CircleUnitTests"]))
    elif type == "int":
        sys.exit(pytest.main(["-k", "CircleIntegrationTests"]))
    else:
        sys.exit(pytest.main(["-k", "App"]))

# eg : flask test bank
@test.command("bank", help="Run Bank Tests")
@click.argument("type", default="all")
def bank_tests_command(type):
    if type == "unit":
        sys.exit(pytest.main(["-k", "BankUnitTests"]))
    elif type == "int":
        sys.exit(pytest.main(["-k", "BankIntegrationTests"]))
    else:
        sys.exit(pytest.main(["-k", "App"]))

# eg : flask test budget
@test.command("budget", help="Run Budget Tests")
@click.argument("type", default="all")
def budget_tests_command(type):
    if type == "unit":
        sys.exit(pytest.main(["-k", "BudgetUnitTests"]))
    elif type == "int":
        sys.exit(pytest.main(["-k", "BudgetIntegrationTests"]))
    else:
        sys.exit(pytest.main(["-k", "App"]))

# eg : flask test goal
@test.command("goal", help="Run Goal Tests")
@click.argument("type", default="all")
def goal_tests_command(type):
    if type == "unit":
        sys.exit(pytest.main(["-k", "GoalUnitTests"]))
    elif type == "int":
        sys.exit(pytest.main(["-k", "GoalIntegrationTests"]))
    else:
        sys.exit(pytest.main(["-k", "App"]))

# eg : flask test transaction
@test.command("transaction", help="Run Transaction Tests")
@click.argument("type", default="all")
def transaction_tests_command(type):
    if type == "unit":
        sys.exit(pytest.main(["-k", "TransactionUnitTests"]))
    elif type == "int":
        sys.exit(pytest.main(["-k", "TransactionIntegrationTests"]))
    else:
        sys.exit(pytest.main(["-k", "App"]))

# eg : flask test all
@test.command("all", help="Run All Tests")
@click.argument("type", default="all")
def all_tests_command(type):
    if type == "unit":
        sys.exit(pytest.main(["-k", "UserUnitTests or CircleUnitTests or BankUnitTests or BudgetUnitTests or GoalUnitTests or TransactionUnitTests"]))
    elif type == "int":
        sys.exit(pytest.main(["-k", "UserIntegrationTests or CircleIntegrationTests or BankIntegrationTests or BudgetIntegrationTests or GoalIntegrationTests or TransactionIntegrationTests"]))
    else:
        sys.exit(pytest.main(["-k", "App"]))

app.cli.add_command(test)