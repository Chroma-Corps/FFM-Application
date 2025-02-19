import enum
from App.database import db

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
    transactionDate = db.Column(db.Date, nullable=False)
    transactionTime = db.Column(db.Time, nullable=False)

    # Relationships
    userID = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    budgetID = db.Column(db.Integer, db.ForeignKey('budget.budgetID'), nullable=True)
    budget = db.relationship('Budget', back_populates='transaction')

    def __init__(self, userID, transactionTitle, transactionDesc, transactionType, transactionCategory, transactionAmount, transactionDate=None, transactionTime=None, budgetID=None):
        self.userID = userID
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
            'userID': self.userID,
            'transactionID': self.transactionID,
            'transactionTitle': self.transactionTitle,
            'transactionDescription': self.transactionDesc,
            'transactionType': self.transactionType.value,
            'transactionCategory': self.transactionCategory.value,
            'transactionAmount': self.transactionAmount,
            'transactionDate': self.transactionDate.strftime("%a, %d %b %Y"),
            'transactionTime': self.transactionTime.strftime("%H:%M"),
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