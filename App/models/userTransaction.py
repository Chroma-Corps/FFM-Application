from App.database import db

class UserTransaction(db.Model):
    __tablename__='userTransaction'

    # Attributes
    userTransactionID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userID = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    transactionID = db.Column(db.Integer, db.ForeignKey('transaction.transactionID'), nullable=False)

    # Relationships
    user = db.relationship('User', back_populates='user_transactions') # Relationship to User
    transaction = db.relationship('Transaction', back_populates='user_transactions') # Relationship to Transaction

    def get_json(self):
        return {
            'userTransactionID': self.userTransactionID,
            'userID': self.userID,
            'transactionID': self.transactionID
        }

    def __str__(self):
        return f"UserTransaction(userTransactionID={self.userTransactionID}, userID={self.userID}, transactionID={self.transactionID})"

    def __repr__(self):
        return self.__str__()