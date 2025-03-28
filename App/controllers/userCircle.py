from App.database import db
from App.models import UserCircle

# Associates A User With A Circle
def create_user_circle(userID, circleID):
    try:
        new_user_circle = UserCircle(userID=userID, circleID=circleID)
        db.session.add(new_user_circle)
        db.session.commit()
        return new_user_circle

    except Exception as e:
        db.session.rollback()
        print(f"Failed To Create User-Circle Relationship: {e}")
        return None

# Retrieves All Circles Associated With A User
def get_user_circles_json(userID):
    try:
        user_circles = UserCircle.query.filter_by(userID=userID).all()
        return [user_circle.circle.get_json() for user_circle in user_circles] if user_circles else []

    except Exception as e:
        print(f"Error Fetching Circles For User {userID}: {e}")
        return []

# Verifies Whether The User Is The Creator Of The Circle
def is_circle_owner(currentUserID, circleID):
    user_circle = UserCircle.query.filter_by(circleID=circleID).order_by(UserCircle.userGoalID).first()
    if user_circle and user_circle.userID == currentUserID:
        return True
    return False

# Retrieves All Users Associated With A Circle
def get_circle_users_json(circleID):
    try:
        circle_users = UserCircle.query.filter_by(circleID=circleID).all()
        return [circle_user.user.get_json() for circle_user in circle_users] if circle_users else []

    except Exception as e:
        print(f"Error Fetching Users For Circle {circleID}: {e}")
        return []