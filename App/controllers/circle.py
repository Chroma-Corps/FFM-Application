from App.controllers.bank import get_bank_by_circle_json
from App.controllers.budget import get_budget_by_circle_json
from App.controllers.goal import get_goal_by_circle_json
from App.controllers.transaction import get_transaction_by_circle_json
from App.database import db
from App.models import Circle, UserCircle
from App.controllers.userCircle import create_user_circle, is_circle_owner

# Create A New Circle
def create_circle(circleName, circleType, circleColor, circleImage, userID, userIDs=None):
    try: 
        new_circle = Circle (
            circleName=circleName,
            circleType=circleType,
            circleColor=circleColor,
            circleImage=circleImage
        )
        db.session.add(new_circle)
        db.session.commit()

        create_user_circle(userID, new_circle.circleID)

        if userIDs:
            for otherUserID in userIDs:
                create_user_circle(otherUserID, new_circle.circleID)
        return new_circle

    except Exception as e:
        db.session.rollback()
        print(f"Failed To Create Circle: {e}")
        return None

# Get Circle By ID
def get_circle(circleID):
    return Circle.query.get(circleID)

# Get Circle By ID (JSON)
def get_circle_json(circleID):
    circle = Circle.query.get(circleID)
    if circle:
        return circle.get_json()
    return None

# Get All Circles
def get_all_circles():
    return Circle.query.all()

# Get All Circles (JSON)
def get_all_circles_json():
    circles = Circle.query.all()
    if not circles:
        return []
    circles = [circle.get_json() for circle in circles]
    return circles

# Update Existing Circle
def update_circle(circleID, circleName=None, circleColor=None, circleImage=None):
    try:
        circle = get_circle(circleID)

        if circle:
            if circleName:
                circle.circleName = circleName
            if circleColor is not None:
                circle.circleColor = circleColor
            if circleImage is not None:
                circle.circleImage = circleImage
            db.session.commit()

            print(f"Circle With ID {circleID} Updated Successfully.")
            return circle
        return None

    except Exception as e:
        db.session.rollback()
        print(f"Failed To Update Circle: {e}")
        return None

# Delete Circle
def delete_circle(userID, circleID):
    try:
        if not is_circle_owner(userID, circleID):
            return "Unauthorized"

        circle = get_circle(circleID)
        if not circle:
            return None

        user_circles = UserCircle.query.filter_by(circleID=circleID).all()
        for user_circle in user_circles:
            db.session.delete(user_circle)
        db.session.commit()

        db.session.delete(circle)
        db.session.commit()
        return True

    except Exception as e:
        db.session.rollback()
        print(f"Failed To Delete Circle: {e}")
        return None

# Get All Banks With The Circle
def get_circle_banks_json(circleID):
    try:
        circle_bank = get_bank_by_circle_json(circleID)

        if circle_bank:
            return circle_bank
        else:
            return []

    except Exception as e:
        print(f"Error Fetching Banks For Circle {circleID}: {e}")
        return []

# Get All Budgets With The Circle
def get_circle_budgets_json(circleID):
    try:
        circle_budget = get_budget_by_circle_json(circleID)

        if circle_budget:
            return circle_budget
        else:
            return []

    except Exception as e:
        print(f"Error Fetching Budgets For Circle {circleID}: {e}")
        return []

# Get All Goals With The Circle
def get_circle_goals_json(circleID):
    try:
        circle_goal = get_goal_by_circle_json(circleID)

        if circle_goal:
            return circle_goal
        else:
            return []

    except Exception as e:
        print(f"Error Fetching Goals For Circle {circleID}: {e}")
        return []

# Get All Transactions With The Circle
def get_circle_transactions_json(circleID):
    try:
        circle_transaction = get_transaction_by_circle_json(circleID)

        if circle_transaction:
            return circle_transaction
        else:
            return []

    except Exception as e:
        print(f"Error Fetching Transactions For Circle {circleID}: {e}")
        return []