from App.database import db

class UserBudget(db.Model):
    __tablename__='userBudget'

    # Attributes
    userBudget = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userID = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    budgetID = db.Column(db.Integer, db.ForeignKey('budget.budgetID'), nullable=False)

    # Relationships
    user = db.relationship('User', back_populates='user_budgets') # Relationship to User
    budget = db.relationship('Budget', back_populates='user_budgets') # Relationship to Budget

    def get_json(self):
            return {
                'userBudgetID': self.userBudgetID,
                'userID': self.userID,
                'budgetID': self.budgetID
            }

    def __str__(self):
        return f"UserBudget(userBudgetID={self.userBudgetID}, userID={self.userID}, budgetID={self.budgetID})"

    def __repr__(self):
        return self.__str__()