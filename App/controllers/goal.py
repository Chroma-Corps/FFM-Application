from App.database import db
from App.models import Goal, UserGoal
from App.controllers.user import get_user_json
from App.services.datetime import convert_to_date
from App.controllers.userGoal import create_user_goal, is_goal_owner

# Create A New Goal
def create_goal(goalTitle, targetAmount, goalType, color, startDate, endDate, userID, userIDs=None):
    try:
        user = get_user_json(userID)

        new_goal = Goal (
            goalTitle=goalTitle,
            targetAmount=targetAmount,
            currentAmount=targetAmount,
            goalType=goalType,
            startDate=startDate,
            endDate=endDate,
            circleID=user["activeCircle"],
            color = color
        )
        db.session.add(new_goal)
        db.session.commit()

        create_user_goal(userID, new_goal.goalID)

        if userIDs:
            for otherUserID in userIDs:
                create_user_goal(otherUserID, new_goal.goalID)
        return new_goal

    except Exception as e:
        db.session.rollback()
        print(f"Failed To Create Goal: {e}")
        return None

# Get Goal By ID
def get_goal(goalID):
    if goalID is None:
        return None
    return Goal.query.get(goalID)


# Get Goal Based On Circle
def get_goal_by_circle_json(circleID):
    goals = Goal.query.filter_by(circleID=circleID).all()
    if not goals:
        return []
    goals = [goal.get_json() for goal in goals]
    return goals

# Get Goal By ID (JSON)
def get_goal_json(goalID):
    goal = Goal.query.get(goalID)
    if goal:
        return goal.get_json()
    return None

# Get All Goals
def get_all_goals():
    return Goal.query.all()

# Get All Goals (JSON)
def get_all_goals_json():
    goals = Goal.query.all()
    if not goals:
        return []
    goals = [goal.get_json() for goal in goals]
    return goals

# Update Existing Goal
def update_goal(goalID, goalTitle=None, targetAmount=None, goalType=None, startDate=None, endDate=None, color=None):
    try:
        goal = get_goal(goalID)

        if goal:
            if goalTitle:
                goal.goalTitle = goalTitle
            if targetAmount is not None:
                goal.targetAmount = targetAmount
                goal.currentAmount = targetAmount
            if goalType:
                goal.goalType = goalType
            if startDate:
                goal.startDate = convert_to_date(startDate)
            if endDate:
                goal.endDate = convert_to_date(endDate)
            if color:
                goal.color = color
            db.session.commit()

            print(f"Goal With ID {goalID} Updated Successfully.")
            return goal
        return None

    except Exception as e:
        db.session.rollback()
        print(f"Failed To Update Goal: {e}")
        return None

# Delete Goal
def delete_goal(userID, goalID):
    try:
        if not is_goal_owner(userID, goalID):
            return "Unauthorized"

        goal = get_goal(goalID)
        if not goal:
            return None

        user_goals = UserGoal.query.filter_by(goalID=goalID).all()
        for user_goal in user_goals:
            db.session.delete(user_goal)

        db.session.delete(goal)
        db.session.commit()
        return True

    except Exception as e:
        db.session.rollback()
        print(f"Failed To Delete Goal: {e}")
        return None