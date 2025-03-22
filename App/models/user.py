from App.database import db
from flask_login import UserMixin
from werkzeug.security import check_password_hash, generate_password_hash

class User(db.Model, UserMixin):
    __tablename__ = 'user'

    # Attributes
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(225), nullable=False, unique=False)
    email =  db.Column(db.String(225), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    activeCircleID = db.Column(db.Integer, db.ForeignKey('circle.circleID'), nullable=True)

    # Relationships
    active_circle = db.relationship('Circle', backref='active_users', lazy=True) # Active Circle The User Is Within
    user_budgets = db.relationship('UserBudget', back_populates='user') # UserBudget
    user_banks = db.relationship('UserBank', back_populates='user') # UserBank
    user_goals = db.relationship('UserGoal', back_populates='user') # UserGoal
    user_circles = db.relationship('UserCircle', back_populates='user') # UserCircle
    user_transactions = db.relationship('UserTransaction', back_populates='user') # UserTransaction

    def __init__(self, name, email, activeCircleID, password):
        self.name = name
        self.email = email
        self.activeCircleID = activeCircleID
        self.set_password(password)

    def get_json(self):
        return{
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'activeCircle': self.activeCircleID
        }

    def set_password(self, password):
        """Create hashed password."""
        self.password = generate_password_hash(password)
    
    def check_password(self, password):
        """Check hashed password."""
        return check_password_hash(self.password, password)

