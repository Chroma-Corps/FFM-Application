from App.database import db

class BankBudget(db.Model):
    __tablename__='bankBudget'

    bankBudgetID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    budgetID = db.Column(db.Integer, db.ForeignKey('budget.budgetID'), nullable=False)
    bankID = db.Column(db.Integer, db.ForeignKey('bank.bankID'), nullable=False)

    def get_json(self):
            return {
                'bankBudgetID': self.bankBudgetID,
                'budgetID': self.budgetID,
                'bankID': self.bankID
            }

    def __str__(self):
        return f"BankBudget(bankBudgetID={self.bankBudgetID}, budgetID={self.budgetID}, bankID={self.bankID})"

    def __repr__(self):
        return self.__str__()