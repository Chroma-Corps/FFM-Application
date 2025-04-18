import enum
from App.database import db
from sqlalchemy import types
from App.models.bank import Bank
from App.models.userBank import UserBank
from App.models.userBudget import UserBudget
from sqlalchemy.ext.mutable import MutableList
from App.services.currency import CurrencyService
from App.services.datetime import convert_to_date

class BudgetType(enum.Enum):
    SAVINGS = "Savings"
    EXPENSE = "Expense"

class TransactionScope(enum.Enum):
    EXCLUSIVE = "Exclusive" # Only User-Added Transactions
    INCLUSIVE = "Inclusive" # Includes All Transactions Within The Budget's Categories

class Budget(db.Model):
    __tablename__='budget'

    # Attributes
    budgetID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    budgetTitle = db.Column(db.String(120), nullable=False)
    budgetAmount = db.Column(db.Float, nullable=False)
    budgetType = db.Column(db.Enum(BudgetType), nullable=False)
    budgetCategory = db.Column(MutableList.as_mutable(types.JSON), nullable=True)
    transactionScope = db.Column(db.Enum(TransactionScope), nullable=False)
    remainingBudgetAmount = db.Column(db.Float, nullable=False)
    startDate = db.Column(db.Date,nullable=False)
    endDate = db.Column(db.Date,nullable=False)
    bankID = db.Column(db.Integer, db.ForeignKey('bank.bankID'), nullable=True)
    color = db.Column(db.String(120), nullable=True)

    # Foreign Keys
    circleID = db.Column(db.Integer, db.ForeignKey('circle.circleID'), nullable=False)

    # Relationships
    circle = db.relationship('Circle', backref='budgets', lazy=True) # 1 Circle -> Many Budgets
    banks = db.relationship('Bank', back_populates='budgets')
    user_budgets = db.relationship('UserBudget', back_populates='budget') # UserBudget

    def __init__(self, budgetTitle, budgetAmount, remainingBudgetAmount, budgetType, budgetCategory, transactionScope, startDate, endDate, bankID, circleID, color):
        self.circleID = circleID
        self.bankID = bankID
        self.budgetTitle = budgetTitle
        self.budgetAmount = budgetAmount
        self.remainingBudgetAmount = remainingBudgetAmount
        self.budgetType = budgetType
        self.budgetCategory = budgetCategory
        self.transactionScope = transactionScope
        self.startDate = convert_to_date(startDate)
        self.endDate = convert_to_date(endDate)
        self.color = color

    def get_json(self):
        main_bank = None
        user_budget = UserBudget.query.filter_by(budgetID=self.budgetID).first()
        if user_budget:
            userID = user_budget.userID

            user_bank = UserBank.query.filter_by(userID=userID).join(Bank).filter(Bank.isPrimary == True).first()
            if user_bank:
                main_bank = user_bank.bank
        bank_currency = main_bank.bankCurrency if main_bank else "TTD"

        amount = CurrencyService.format_currency(self.budgetAmount, bank_currency)
        remainingAmount = CurrencyService.format_currency(self.remainingBudgetAmount, bank_currency)

        return{
            'budgetID': self.budgetID,
            'budgetTitle': self.budgetTitle,
            'budgetAmount': amount,
            'remainingBudgetAmount': remainingAmount,
            'budgetType': self.budgetType.value,
            'budgetCategory': self.budgetCategory,
            'transactionScope': self.transactionScope.value,
            'startDate': self.startDate.strftime("%a, %d %b %Y"),
            'endDate': self.endDate.strftime("%a, %d %b %Y"),
            'bankID': self.bankID,
            'color': self.color,
            'owner': self.user_budgets[0].user.name
        }

    def __str__(self):
        amount = CurrencyService.format_currency(self.budgetAmount, self.banks.bankCurrency)
        return f"{self.budgetTitle} ({self.budgetType.value} | {', '.join(self.budgetCategory)} {self.transactionScope.value}) {amount} (Start: {self.startDate}, End: {self.endDate})"

    def __repr__(self):
        return (
            f"Budget(budgetID={self.budgetID}, budgetTitle='{self.budgetTitle}', budgetAmount={self.budgetAmount}, "
            f"budgetType='{self.budgetType.value}', budgetCategory={self.budgetCategory}, transactionScope='{self.transactionScope.value}', "
            f"startDate='{self.startDate}', endDate='{self.endDate}')"
        )