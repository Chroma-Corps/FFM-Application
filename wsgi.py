import click, pytest, sys
from flask import Flask
from flask.cli import with_appcontext, AppGroup

from App.Backend.database import db, get_migrate
from App.Backend.models import User
from App.Backend.main import create_app
from App.Backend.controllers import ( create_user, get_all_users_json, get_all_users, initialize )

app = create_app()
migrate = get_migrate(app)

@app.cli.command("init", help="Creates and initializes the database")
def init():
    initialize()
    print('Database Intialized!')