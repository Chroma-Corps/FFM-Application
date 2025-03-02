from App.Backend.models import Budget
from App.Backend.database import db

def create_budget(budgetTitle, budgetAmount, startDate, endDate, userID):
    new_budget = Budget(budgetTitle, budgetAmount, startDate, endDate, userID)
    db.session.add(new_budget)
    db.session.commit()
    return new_budget

# Get Budget By ID
def get_budget(id):
    return Budget.query.get(id)

# Get Budget By ID (JSON)
def get_budget_json(id):
    budget = Budget.query.get(id)
    if budget:
        return budget.get_json()
    return None

# Get All Budgets
def get_all_budgets():
    return Budget.query.all()

# Get All Budgets (JSON)
def get_all_budgets_json():
    budgets = Budget.query.all()
    if not budgets:
        return []
    budgets = [budget.get_json() for budget in budgets]
    return budgets

# Get Budgets for Specific User (JSON)
def get_user_budgets_json(user_id):
    budgets = Budget.query.filter_by(userID=user_id).all()
    if not budgets:
        return []
    budgets = [budget.get_json() for budget in budgets]
    return budgets

# Update Existing Budget
def update_budget(id, budgetTitle=None, budgetAmount=None, startDate=None, endDate=None):
    budget = get_budget(id)
    if budget:
        if budgetTitle:
            budget.budgetTitle = budgetTitle
        if budgetAmount:
            budget.budgetAmount = budgetAmount
        if startDate:
            budget.startDate = startDate
        if endDate:
            budget.endDate = endDate
        db.session.add(budget)
        db.session.commit()
        return budget
    return None

# Delete Budget
def delete_budget(id):
    budget = get_budget(id)
    if budget:
        db.session.delete(budget)
        db.session.commit()
        return True
    return False