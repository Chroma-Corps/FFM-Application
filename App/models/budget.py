import enum
from App.database import db
from App.services.currency import CurrencyService
from App.services.datetime import convert_to_date

class BudgetType(enum.Enum):
    SAVINGS = "Savings"
    EXPENSE = "Expense"

class Budget(db.Model):
    __tablename__='budget'

    # Attributes
    budgetID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    budgetTitle = db.Column(db.String(20), nullable=False)
    budgetAmount = db.Column(db.Float, nullable=False)
    budgetType = db.Column(db.Enum(BudgetType), nullable=False)
    budgetCategory = db.Column(db.String(20), nullable=True)
    remainingBudgetAmount = db.Column(db.Float, nullable=False)
    startDate = db.Column(db.Date,nullable=False)
    endDate = db.Column(db.Date,nullable=False)
    bankID = db.Column(db.Integer, db.ForeignKey('bank.bankID'), nullable=False)

    # Relationships
    user_budgets = db.relationship('UserBudget', back_populates='budget') # UserBudget
    banks = db.relationship('Bank', back_populates='budgets')

    def __init__(self, budgetTitle, budgetAmount, remainingBudgetAmount, budgetType, budgetCategory, startDate, endDate, bankID):
        self.budgetTitle = budgetTitle
        self.budgetAmount = budgetAmount
        self.remainingBudgetAmount = remainingBudgetAmount
        self.budgetType = budgetType
        self.budgetCategory = budgetCategory
        self.startDate = convert_to_date(startDate)
        self.endDate = convert_to_date(endDate)
        self.bankID = bankID

    def get_json(self):
        amount = CurrencyService.format_currency(self.budgetAmount, self.banks.bankCurrency)
        remainingAmount = CurrencyService.format_currency(self.remainingBudgetAmount, self.banks.bankCurrency)

        return{
            'budgetID': self.budgetID,
            'budgetTitle': self.budgetTitle,
            'budgetAmount': amount,
            'remainingBudgetAmount': remainingAmount,
            'budgetType': self.budgetType.value,
            'budgetCategory': self.budgetCategory,
            'startDate': self.startDate.strftime("%a, %d %b %Y"),
            'endDate': self.endDate.strftime("%a, %d %b %Y"),
            'bankID': self.bankID
        }

    def __str__(self):
        amount = CurrencyService.format_currency(self.budgetAmount, self.banks.bankCurrency)
        return f"{self.budgetTitle} ({self.budgetType.value} | {self.budgetCategory}) {amount} (Start: {self.startDate}, End: {self.endDate})"

    def __repr__(self):
        return (
            f"Budget(budgetID={self.budgetID}, budgetTitle='{self.budgetTitle}' budgetAmount='{self.budgetAmount}', "
            f"budgetType='{self.budgetType}', budgetCategory='{self.budgetCategory}', "
            f"startDate='{self.startDate}', endDate='{self.endDate}')"
        )