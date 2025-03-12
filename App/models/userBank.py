from App.database import db

class UserBank(db.Model):
    __tablename__='userBank'

    userBankID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userID = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    bankID = db.Column(db.Integer, db.ForeignKey('bank.bankID'), nullable=False)

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