from App.Backend.database import db

class Budget(db.Model):
    __tablename__='budget'

    # Attributes
    budgetID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    budgetTitle = db.Column(db.String(20), nullable=False)
    startDate = db.Column(db.Date,nullable=False)
    endDate = db.Column(db.Date,nullable=False)

    # Relationships
    transaction = db.relationship('Transaction', back_populates='budget', cascade='all, delete-orphan')

    def __init__(self, budgetTitle, startDate, endDate):
        self.budgetTitle = budgetTitle
        self.startDate = startDate
        self.endDate = endDate

    def get_json(self):
        return{
            'Budget ID': self.budgetID,
            'Budget Title': self.budgetTitle,
            'Start Date': self.startDate,
            'End Date': self.endDate
        }

    def __str__(self):
        return f"{self.budgetTitle} (Start: {self.startDate}, End: {self.endDate})"

    def __repr__(self):
        return (
            f"Budget(budgetID={self.budgetID}, budgetTitle='{self.budgetTitle}', "
            f"startDate='{self.startDate}', endDate='{self.endDate}')"
        )



