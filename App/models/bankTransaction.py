from App.database import db

class BankTransaction(db.Model):
    __tablename__='bankTransaction'

    bankTransactionID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    transactionID = db.Column(db.Integer, db.ForeignKey('transaction.transactionID'), nullable=False)
    bankID = db.Column(db.Integer, db.ForeignKey('bank.bankID'), nullable=False)

    def get_json(self):
        return {
            'bankTransactionID': self.bankTransactionID,
            'transactionID': self.transactionID,
            'bankID': self.bankID
        }

    def __str__(self):
        return f"BankTransaction(bankTransactionID={self.bankTransactionID}, transactionID={self.transactionID}, bankID={self.bankID})"

    def __repr__(self):
        return self.__str__()