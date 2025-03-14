from App.database import db
from App.models import UserBudget

def create_user_budget(userID, budgetID):
    try:
        new_user_budget = UserBudget(userID=userID, budgetID=budgetID)
        db.session.add(new_user_budget)
        db.session.commit()
        return new_user_budget

    except Exception as e:
        db.session.rollback()
        print(f"Failed To Create User-Budget Relationship: {e}")
        return None

def get_user_budgets_json(userID):
    user_budgets = UserBudget.query.filter_by(userID=userID).all()

    if not user_budgets:
        return []

    user_budgets_json = [user_budget.budget.get_json() for user_budget in user_budgets]
    return user_budgets_json

def is_budget_owner(currentUserID, budgetID):
    user_budget = UserBudget.query.filter_by(userID=currentUserID, budgetID=budgetID).first()
    if user_budget:
        budget = user_budget.budget
        if budget.userID == currentUserID:
            return True
    return False
