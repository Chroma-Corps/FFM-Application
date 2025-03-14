from App.database import db

class UserBank(db.Model):
    __tablename__='userBank'

    # Attributes
    userBankID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userID = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    bankID = db.Column(db.Integer, db.ForeignKey('bank.bankID'), nullable=False)

    # Relationships
    user = db.relationship('User', back_populates='user_banks') # Relationship to User
    bank = db.relationship('Bank', back_populates='user_banks') # Relationship to Bank

    def get_json(self):
        return {
            'userBankID': self.userBankID,
            'userID': self.userID,
            'bankID': self.bankID
        }

    def __str__(self):
        return f"UserBank(userBankID={self.userBankID}, userID={self.userID}, bankID={self.bankID})"

    def __repr__(self):
        return self.__str__()