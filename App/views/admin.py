from flask_admin import Admin
from App.models import db, User
from flask_admin.contrib.sqla import ModelView
from flask import flash, redirect, request, url_for
from flask_jwt_extended import jwt_required, current_user

class AdminView(ModelView):

    @jwt_required()
    def is_accessible(self):
        return current_user is not None

    def inaccessible_callback(self, name, **kwargs):
        # redirect to login page if user doesn't have access
        flash("Login to access admin")
        return redirect(url_for('index_page', next=request.url))

def setup_admin(app):
    admin = Admin(app, name='FlaskMVC', template_mode='bootstrap3')
    admin.add_view(AdminView(User, db.session))