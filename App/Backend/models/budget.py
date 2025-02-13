from App.Backend.database import db

class Budget(db.Model):
    __tablename__='budget'

    # Attributes
    budgetID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    budgetTitle = db.Column(db.String(20), nullable=False)
    startDate = db.Column(db.Date,nullable=False)
    endDate = db.Column(db.Date,nullable=False)

    # Relationships
    userID = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    transaction = db.relationship('Transaction', back_populates='budget', cascade='all, delete-orphan')

    def __init__(self, budgetTitle, startDate, endDate, userID):
        self.budgetTitle = budgetTitle
        self.startDate = startDate
        self.endDate = endDate
        self.userID = userID

    def get_json(self):
        return{
            'budgetID': self.budgetID,
            'budgetTitle': self.budgetTitle,
            'startDate': self.startDate.strftime("%a, %d %b %Y"),
            'endDate': self.endDate.strftime("%a, %d %b %Y"),
            'userID': self.userID
        }

    def __str__(self):
        return f"{self.budgetTitle} (Start: {self.startDate}, End: {self.endDate})"

    def __repr__(self):
        return (
            f"Budget(budgetID={self.budgetID}, budgetTitle='{self.budgetTitle}', "
            f"startDate='{self.startDate}', endDate='{self.endDate}')"
        )



