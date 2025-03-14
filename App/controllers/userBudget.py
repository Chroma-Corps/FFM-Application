from App.database import db
from App.models import UserBudget

# Associates A User With A Budget
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

# Retrieves All Budgets Associated With A User
def get_user_budgets_json(userID):
    try:
        user_budgets = UserBudget.query.filter_by(userID=userID).all()
        return [user_budget.budget.get_json() for user_budget in user_budgets] if user_budgets else []

    except Exception as e:
        print(f"Error Fetching Budgets For User {userID}: {e}")
        return []

# Verifies Whether The User Is The Creator Of The Budget
def is_budget_owner(currentUserID, budgetID):
    user_budget = UserBudget.query.filter_by(budgetID=budgetID).order_by(UserBudget.userBudgetID).first()
    if user_budget and user_budget.userID == currentUserID:
        return True
    return False