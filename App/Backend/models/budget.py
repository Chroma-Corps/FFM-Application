from enum import Enum
from App.Backend.database import db

class BudgetType(Enum):
    INDIVIDUAL = "Individual"
    FAMILY = "Family"

class Budget(db.Model):
    __tablename__ = 'budget'

    # Attributes
    budgetID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    budgetTitle = db.Column(db.String(20), nullable=False)
    budgetAmount = db.Column(db.Float, nullable=False)
    remainingBudgetAmount = db.Column(db.Float, nullable=False)
    startDate = db.Column(db.Date, nullable=False)
    endDate = db.Column(db.Date, nullable=False)

    # Relationships
    userID = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    transaction = db.relationship('Transaction', back_populates='budget', cascade='all, delete-orphan')

    def __init__(self, budgetTitle, budgetAmount, startDate, endDate, userID):
        self.budgetTitle = budgetTitle
        self.budgetAmount = budgetAmount
        self.remainingBudgetAmount = budgetAmount
        self.startDate = startDate
        self.endDate = endDate
        self.userID = userID

    def get_json(self):
        return {
            'budgetID': self.budgetID,
            'budgetTitle': self.budgetTitle,
            'budgetAmount': self.budgetAmount,
            'remainingBudgetAmount': self.remainingBudgetAmount,
            'startDate': self.startDate.strftime("%a, %d %b %Y"),
            'endDate': self.endDate.strftime("%a, %d %b %Y"),
            'userID': self.userID,
            'transactions': [transaction.get_json() for transaction in self.transaction]
        }

    def __str__(self):
        return f"{self.budgetTitle} {self.budgetAmount} (Start: {self.startDate}, End: {self.endDate})"

    def __repr__(self):
        return (
            f"Budget(budgetID={self.budgetID}, budgetTitle='{self.budgetTitle}', budgetAmount={self.budgetAmount}, "
            f"startDate='{self.startDate}', endDate='{self.endDate}')"
        )