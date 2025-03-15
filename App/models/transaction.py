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
    transactionTitle = db.Column(db.String(20), nullable=False)
    transactionDesc = db.Column(db.String(120), nullable=True)
    transactionType = db.Column(db.Enum(TransactionType), nullable=False)
    transactionCategory = db.Column(MutableList.as_mutable(types.JSON), nullable=True)
    transactionAmount = db.Column(db.Float, nullable=False)
    transactionDate = db.Column(db.Date, nullable=False)
    transactionTime = db.Column(db.Time, nullable=False)
    voided = db.Column(db.Boolean, default=False)

    # Foreign Keys
    budgetID = db.Column(db.Integer, db.ForeignKey('budget.budgetID'), nullable=True)
    bankID = db.Column(db.Integer, db.ForeignKey('bank.bankID'), nullable=False)

    # Relationships
    budget = db.relationship('Budget', backref='transactions', lazy=True) # 1 Budget -> Many Transactions
    bank = db.relationship('Bank', backref='transactions', lazy=True) # 1 Bank -> Many Transactions
    user_transactions = db.relationship('UserTransaction', back_populates='transaction') # UserTransaction

    def __init__(self, transactionTitle, transactionDesc, transactionType, transactionCategory, transactionAmount, transactionDate=None, transactionTime=None, budgetID=None, bankID=None):
        self.bankID = bankID
        self.budgetID = budgetID
        self.transactionTitle = transactionTitle
        self.transactionDesc = transactionDesc
        self.transactionType = transactionType
        self.transactionCategory = transactionCategory
        self.transactionAmount = transactionAmount
        self.transactionDate = convert_to_date(transactionDate)
        self.transactionTime = convert_to_time(transactionTime)

    def get_json(self):
        amount = CurrencyService.format_currency(self.transactionAmount, self.bank.bankCurrency)

        return {
            'transactionID': self.transactionID,
            'transactionTitle': self.transactionTitle,
            'transactionDescription': self.transactionDesc,
            'transactionType': self.transactionType.value,
            'transactionCategory': self.transactionCategory,
            'transactionAmount': amount,
            'transactionDate': self.transactionDate.strftime("%a, %d %b %Y"),
            'transactionTime': self.transactionTime.strftime("%H:%M"),
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