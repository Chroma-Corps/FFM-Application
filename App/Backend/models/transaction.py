import enum
from datetime import datetime
from App.Backend.database import db

class TransactionType(enum.Enum):
    INCOME = "income"
    EXPENSE = "expense"

class TransactionCategory(enum.Enum):
    INCOME = "income"
    BILLS = "bills"
    TRANSIT = "transit"
    GROCERIES = "groceries"
    ENTERTAINMENT = "entertainment"
    SHOPPING = "shopping"

class Transaction(db.Model):
    __tablename__='transaction'

    # Attributes
    transactionID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    transactionTitle = db.Column(db.String(20), nullable=False)
    transactionDesc = db.Column(db.String(120), nullable=True)
    transactionType = db.Column(db.Enum(TransactionType), nullable=False)
    transactionCategory = db.Column(db.Enum(TransactionCategory), nullable=False)
    transactionAmount = db.Column(db.Float, nullable=False)
    transactionDate = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    transactionTime = db.Column(db.Time, nullable=False, default=datetime.utcnow)

    # Relationships
    budgetID = db.Column(db.Integer, db.ForeignKey('budget.budgetID'), nullable=True)
    budget = db.relationship('Budget', back_populates='transaction')

    def __init__(self, transactionTitle, transactionDesc, transactionType, transactionCategory, transactionAmount, transactionDate=None, transactionTime=None, budgetID=None):
        self.transactionTitle = transactionTitle
        self.transactionDesc = transactionDesc
        self.transactionType = transactionType
        self.transactionCategory = transactionCategory
        self.transactionAmount = transactionAmount
        self.transactionDate = transactionDate
        self.transactionTime = transactionTime
        self.budgetID = budgetID

    def get_json(self):
        return {
            'Transaction ID': self.transactionID,
            'Transaction Title': self.transactionTitle,
            'Transaction Description': self.transactionDesc,
            'Transaction Type': self.transactionType.value,
            'Transaction Category': self.transactionCategory.value,
            'Transaction Amount': self.transactionAmount,
            'Transaction Date': self.transactionDate.strftime("%Y-%m-%d"),
            'Transaction Time': self.transactionTime.strftime("%H:%M:%S")
        }

    def __str__(self):
        return f"{self.transactionTitle} ({self.transactionType}): {self.transactionAmount} on {self.transactionDate} at {self.transactionTime}"

    def __repr__(self):
        return (
            f"Transaction(transactionID={self.transactionID}, transactionTitle='{self.transactionTitle}', "
            f"transactionType='{self.transactionType}', transactionCategory='{self.transactionCategory}', "
            f"transactionAmount={self.transactionAmount}, transactionDate='{self.transactionDate}', "
            f"transactionTime='{self.transactionTime}')"
        )