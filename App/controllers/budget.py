from App.models import Budget, BudgetType
from App.database import db
from App.services.category import CategoryService

# Create A New Budget
def create_budget(budgetTitle, budgetAmount, budgetType, budgetCategory, startDate, endDate, userID, bankID):
    try: 
        if budgetCategory is not None:
            selectedCategory = CategoryService.get_category(budgetCategory)
        else:
            selectedCategory = None

        new_budget = Budget (
            budgetTitle=budgetTitle,
            budgetAmount=budgetAmount,
            remainingBudgetAmount=budgetAmount,
            budgetType=budgetType,
            budgetCategory=selectedCategory,
            startDate=startDate,
            endDate=endDate,
            userID=userID,
            bankID=bankID
        )

        db.session.add(new_budget)
        db.session.commit()
        return new_budget

    except Exception as e:
        db.session.rollback()
        print(f"Failed To Create Budget: {e}")
        return None

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
def update_budget(budgetID, budgetTitle=None, budgetAmount=None, budgetType=None, budgetCategory=None, startDate=None, endDate=None, bankID=None):
    budget = get_budget(budgetID)
    if budget:
        if budgetTitle:
            budget.budgetTitle = budgetTitle
        if budgetAmount is not None:
            budget.budgetAmount = budgetAmount
            budget.remainingBudgetAmount = budgetAmount
        if budgetType:
            budget.budgetType = budgetType
        if budgetCategory:
            budget.budgetCategory = CategoryService.get_category(budgetCategory)
        if startDate:
            budget.startDate = startDate
        if endDate:
            budget.endDate = endDate
        if bankID:
            budget.bankID = bankID

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