from App.database import db
from App.models import UserCircle
from App.models.circle import Circle

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
    user_circle = UserCircle.query.filter_by(circleID=circleID).first()
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

# Adds A Users To An Existing Circle
def add_to_circle(circleCode, userID):
    try:
        circle = Circle.query.filter_by(circleCode=circleCode).first()

        if not circle:
            print("Invalid Circle Code.")
            return {"status": "error", "message": "Invalid Circle Code."}
        
        existing_user_circle = UserCircle.query.filter_by(userID=userID, circleID=circle.circleID).first()
        if existing_user_circle:
            print("User Is Already A Member Of This Circle.")
            return {"status": "error", "message": "User is already a member of this circle."}

        create_user_circle(userID, circle.circleID)
        print(f"User Successfully Added To Circle: {circle.circleName}")
        
        return {"status": "success", "message": f"User successfully added to circle: {circle.circleName}"}

    except Exception as e:
        db.session.rollback()
        print(f"Failed To Add User To Circle: {e}")
        print("An Error Occurred While Adding The User To The Circle.")
        return {"status": "error", "message": "An error occurred while adding the user to the circle."}

# Removes A User From An Existing Circle
def remove_from_circle(circleCode, userID):
    try:
        circle = Circle.query.filter_by(circleCode=circleCode).first()

        if not circle:
            print("Invalid Circle Code.")
            return {"status": "error", "message": "Invalid Circle Code."}

        user_circle = UserCircle.query.filter_by(userID=userID, circleID=circle.circleID).first()

        if not user_circle:
            print("User Is Not A Member Of This Circle.")
            return {"status": "error", "message": "User is not a member of this circle."}

        db.session.delete(user_circle)
        db.session.commit()
        print(f"User Successfully Removed From Circle: {circle.circleName}")

        return {"status": "success", "message": f"User successfully removed from circle: {circle.circleName}"}

    except Exception as e:
        db.session.rollback()
        print(f"Failed To Remove User From Circle: {e}")
        print("An Error Occurred While Removing The User From The Circle.")
        return {"status": "error", "message": "An error occurred while removing the user from the circle."}