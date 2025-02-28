from App.database import db

class Bank(db.Model):
    __tablename__='bank'

    # Attributes
    bankID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    bankTitle = db.Column(db.String(20), nullable=False)
    bankCurrency = db.Column(db.String(20), nullable=False)
    bankAmount = db.Column(db.Float, nullable=False)
    remainingBankAmount = db.Column(db.Float, nullable=False)

    # Relationships
    userID = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __init__(self, userID, bankTitle, bankCurrency, bankAmount, remainingBankAmount):
        self.userID = userID
        self.bankTitle = bankTitle
        self.bankCurrency = bankCurrency
        self.bankAmount = bankAmount
        self.remainingBankAmount = remainingBankAmount

    def get_json(self):
        return {
            'userID': self.userID,
            'bankTitle': self.bankTitle,
            'bankCurrency': self.bankCurrency,
            'bankAmount': self.bankAmount,
            'remainingBankAmount': self.remainingBankAmount
        }

    def __str__(self):
        return (
            f"Bank ID: {self.bankID}, Title: {self.bankTitle}, "
            f"Currency: {self.bankCurrency}, Amount: {self.bankAmount}, "
            f"Remaining Amount: {self.remainingBankAmount}"
        )

    def __repr__(self):
        return (
            f"Bank(bankID={self.bankID}, bankTitle='{self.bankTitle}', "
            f"bankCurrency='{self.bankCurrency}', bankAmount='{self.bankAmount}', "
            f"remainingBankAmount={self.remainingBankAmount}')"
        )