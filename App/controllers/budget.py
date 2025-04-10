from App.database import db
from App.models import Budget, UserBudget
from App.controllers.user import get_user_json
from App.services.category import CategoryService
from App.services.datetime import convert_to_date
from App.controllers.userBudget import create_user_budget, is_budget_owner

# Create A New Budget
def create_budget(budgetTitle, budgetAmount, budgetType, budgetCategory, transactionScope, color, startDate, endDate, userID, bankID, userIDs=None):
    try: 
        if budgetCategory is not None:
            selectedCategory = CategoryService.get_category(budgetCategory)
        else:
            selectedCategory = None

        user = get_user_json(userID)

        new_budget = Budget (
            budgetTitle=budgetTitle,
            budgetAmount=budgetAmount,
            remainingBudgetAmount=budgetAmount,
            budgetType=budgetType,
            budgetCategory=selectedCategory,
            transactionScope=transactionScope,
            startDate=startDate,
            endDate=endDate,
            bankID=bankID,
            circleID=user["activeCircle"],
            color = color
        )
        db.session.add(new_budget)
        db.session.commit()

        create_user_budget(userID, new_budget.budgetID)

        if userIDs:
            for otherUserID in userIDs:
                create_user_budget(otherUserID, new_budget.budgetID)
        return new_budget

    except Exception as e:
        db.session.rollback()
        print(f"Failed To Create Budget: {e}")
        return None

# Get Budget By ID
def get_budget(budgetID):
    return Budget.query.get(budgetID)

# Get Budget Based On Circle
def get_budget_by_circle_json(circleID):
    budgets = Budget.query.filter_by(circleID=circleID).all()
    if not budgets:
        return []
    budgets = [budget.get_json() for budget in budgets]
    return budgets

# Get Budget By ID (JSON)
def get_budget_json(budgetID):
    budget = Budget.query.get(budgetID)
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

# Update Existing Budget
def update_budget(budgetID, budgetTitle=None, budgetAmount=None, budgetType=None, budgetCategory=None, startDate=None, endDate=None, bankID=None, color=None):
    try:
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
                budget.startDate = convert_to_date(startDate)
            if endDate:
                budget.endDate = convert_to_date(endDate)
            if bankID:
                budget.bankID = bankID
            if color:
                budget.color = color
            db.session.commit()

            print(f"Budget With ID {budgetID} Updated Successfully.")
            return budget
        return None

    except Exception as e:
        db.session.rollback()
        print(f"Failed To Update Budget: {e}")
        return None

# Delete Budget
def delete_budget(userID, budgetID):
    try:
        if not is_budget_owner(userID, budgetID):
            return "Unauthorized"

        budget = get_budget(budgetID)
        if not budget:
            return None

        user_budgets = UserBudget.query.filter_by(budgetID=budgetID).all()
        for user_budget in user_budgets:
            db.session.delete(user_budget)

        db.session.delete(budget)
        db.session.commit()
        return True

    except Exception as e:
        db.session.rollback()
        print(f"Failed To Delete Budget: {e}")
        return None

# Get Budget By Category
def get_budgets_by_category(category_name):
    budgets = Budget.query.filter(Budget.budgetCategory.like(f"%{category_name}%")).all()
    return [budget.get_json() for budget in budgets]