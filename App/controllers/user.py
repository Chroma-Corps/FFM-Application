from App.models import User
from App.database import db

# Create A New User
def create_user(name, email, password):
    try:
        newuser = User(
            name=name,
            email=email,
            password=password
        )
        db.session.add(newuser)
        db.session.commit()
        return newuser

    except Exception as e:
        db.session.rollback()
        print(f"Failed To Create New User: {e}")
        return None

# Get User By Email
def get_user_by_email(email):
    return User.query.filter_by(email=email).first()

# Get User By ID
def get_user(userID):
    return User.query.get(userID)

# Get All Users
def get_all_users():
    return User.query.all()

# Get All Users (JSON)
def get_all_users_json():
    users = User.query.all()
    if not users:
        return []
    users = [user.get_json() for user in users]
    return users

# Update Existing User
def update_user(userID, newName=None, newEmail=None, newPassword=None):
    try:
        user = get_user(userID)

        if user:
            if newName:
                user.name = newName
            if newEmail:
                user.email = newEmail
            if newPassword:
                user.password = newPassword
            db.session.commit()

            print(f"User With ID {userID} Updated Successfully.")
            return user
        return None

    except Exception as e:
        db.session.rollback()
        print(f"Failed To Update User: {e}")
        return None