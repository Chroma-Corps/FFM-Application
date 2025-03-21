from App.database import db
from App.models import UserGoal

# Associates A User With A Goal
def create_user_goal(userID, goalID):
    try:
        new_user_goal = UserGoal(userID=userID, goalID=goalID)
        db.session.add(new_user_goal)
        db.session.commit()
        return new_user_goal

    except Exception as e:
        db.session.rollback()
        print(f"Failed To Create User-Goal Relationship: {e}")
        return None

# Retrieves All Goals Associated With A User
def get_user_goals_json(userID):
    try:
        user_goals = UserGoal.query.filter_by(userID=userID).all()
        return [user_goal.goal.get_json() for user_goal in user_goals] if user_goals else []

    except Exception as e:
        print(f"Error Fetching Goals For User {userID}: {e}")
        return []

# Verifies Whether The User Is The Creator Of The Goal
def is_goal_owner(currentUserID, goalID):
    user_goal = UserGoal.query.filter_by(goalID=goalID).order_by(UserGoal.userGoalID).first()
    if user_goal and user_goal.userID == currentUserID:
        return True
    return False

# Retrieves All Users Associated With A Goal
def get_goal_users_json(goalID):
    try:
        goal_users = UserGoal.query.filter_by(goalID=goalID).all()
        return [goal_user.user.get_json() for goal_user in goal_users] if goal_users else []

    except Exception as e:
        print(f"Error Fetching Users For Goal {goalID}: {e}")
        return []