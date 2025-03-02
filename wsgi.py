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

@test.command("user", help="Run User Tests")
@click.argument("type", default="all")
def user_tests_command(type):
    if type == "unit":
        sys.exit(pytest.main(["-k", "UserUnitTests"]))
    elif type == "int":
        sys.exit(pytest.main(["-k", "UserIntegrationTests"]))
    else:
        sys.exit(pytest.main(["-k", "App"]))

@test.command("budget", help="Run Budget Tests")
@click.argument("type", default="all")
def budget_tests_command(type):
    if type == "int":
        sys.exit(pytest.main(["-k", "BudgetIntegrationTests"]))
    else:
        sys.exit(pytest.main(["-k", "App"]))

@test.command("transaction", help="Run Transaction Tests")
@click.argument("type", default="all")
def budget_tests_command(type):
    if type == "int":
        sys.exit(pytest.main(["-k", "TransactionIntegrationTests"]))
    else:
        sys.exit(pytest.main(["-k", "App"]))

@test.command("bank", help="Run Bank Tests")
@click.argument("type", default="all")
def budget_tests_command(type):
    if type == "int":
        sys.exit(pytest.main(["-k", "BankIntegrationTests"]))
    else:
        sys.exit(pytest.main(["-k", "App"]))

app.cli.add_command(test)