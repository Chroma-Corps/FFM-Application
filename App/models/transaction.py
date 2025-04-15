import enum
from App.database import db
from sqlalchemy import types
from sqlalchemy.ext.mutable import MutableList
from App.services.currency import CurrencyService
from App.services.datetime import convert_to_date, convert_to_time

class TransactionType(enum.Enum):
    INCOME = "Income"
    EXPENSE = "Expense"

class Transaction(db.Model):
    __tablename__='transaction'

    # Attributes
    transactionID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    transactionTitle = db.Column(db.String(120), nullable=False)
    transactionDesc = db.Column(db.String(225), nullable=True)
    transactionType = db.Column(db.Enum(TransactionType), nullable=False)
    transactionCategory = db.Column(MutableList.as_mutable(types.JSON), nullable=True)
    transactionAmount = db.Column(db.Float, nullable=False)
    transactionDate = db.Column(db.Date, nullable=False)
    transactionTime = db.Column(db.Time, nullable=False)
    voided = db.Column(db.Boolean, default=False)

    # Foreign Keys
    budgetID = db.Column(db.Integer, db.ForeignKey('budget.budgetID'), nullable=True)
    goalID = db.Column(db.Integer, db.ForeignKey('goal.goalID'), nullable=True)
    bankID = db.Column(db.Integer, db.ForeignKey('bank.bankID'), nullable=False)
    circleID = db.Column(db.Integer, db.ForeignKey('circle.circleID'), nullable=False)

    # Relationships
    budget = db.relationship('Budget', backref='transactions', lazy=True) # 1 Budget -> Many Transactions
    goal = db.relationship('Goal', backref='transactions', lazy=True) # 1 Goal -> Many Transactions
    bank = db.relationship('Bank', backref='transactions', lazy=True) # 1 Bank -> Many Transactions
    circle = db.relationship('Circle', backref='transactions', lazy=True) # 1 Circle -> Many Transactions
    user_transactions = db.relationship('UserTransaction', back_populates='transaction') # UserTransaction
    attachments = db.relationship('TransactionAttachment', backref='transaction', cascade="all, delete-orphan") # TransactionAttachments

    def __init__(self, transactionTitle, transactionDesc, transactionType, transactionCategory, transactionAmount, transactionDate, transactionTime, attachments, circleID, bankID, goalID=None, budgetID=None):
        self.bankID = bankID
        self.budgetID = budgetID
        self.goalID = goalID
        self.circleID = circleID
        self.transactionTitle = transactionTitle
        self.transactionDesc = transactionDesc
        self.transactionType = transactionType
        self.transactionCategory = transactionCategory
        self.transactionAmount = transactionAmount
        self.transactionDate = convert_to_date(transactionDate)
        self.transactionTime = convert_to_time(transactionTime)
        self.attachments = attachments if attachments else []

    def get_json(self):
        amount = CurrencyService.format_currency(self.transactionAmount, self.bank.bankCurrency)

        return {
            'transactionID': self.transactionID,
            'transactionTitle': self.transactionTitle,
            'transactionDescription': self.transactionDesc,
            'transactionType': self.transactionType.value,
            'transactionCategory': self.transactionCategory,
            'transactionAmount': amount,
            'transactionDate': self.transactionDate.strftime("%a, %b %d %Y"),
            'transactionTime': self.transactionTime.strftime("%H:%M"),
            'transactionBank': self.bankID,
            'transactionBudget': self.budgetID,
            'transactionGoal': self.goalID,
            'attachments': [attachment.get_json() for attachment in self.attachments],
            'owner': self.user_transactions[0].user.name
        }
        
    def __str__(self):
        amount = CurrencyService.format_currency(self.transactionAmount, self.bank.bankCurrency)
        return f"{self.transactionTitle} ({self.transactionType.value} | {self.transactionCategory}): {amount} on {self.transactionDate} at {self.transactionTime}"

    def __repr__(self):
        return (
            f"Transaction(transactionID={self.transactionID}, transactionTitle='{self.transactionTitle}', "
            f"transactionType='{self.transactionType}', transactionCategory='{self.transactionCategory}', "
            f"transactionAmount={self.transactionAmount}, transactionDate='{self.transactionDate}', "
            f"transactionTime='{self.transactionTime}')"
        )