from werkzeug.security import check_password_hash, generate_password_hash
from App.Backend.database import db
from flask_login import UserMixin

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False, unique=False)
    email =  db.Column(db.String(20), nullable=False, unique=True)
    password = db.Column(db.String(120), nullable=False)

    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.set_password(password)

    def get_json(self):
        return{
            'id': self.id,
            'name': self.name,
            'email': self.email
        }

    def set_password(self, password):
        """Create hashed password."""
        self.password = generate_password_hash(password)
    
    def check_password(self, password):
        """Check hashed password."""
        return check_password_hash(self.password, password)

