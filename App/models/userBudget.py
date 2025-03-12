from App.database import db

class UserBudget(db.Model):
    __tablename__='userBudget'

    userBudget = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userID = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    budgetID = db.Column(db.Integer, db.ForeignKey('budget.budgetID'), nullable=False)

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