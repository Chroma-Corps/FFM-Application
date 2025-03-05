from App.database import db
from App.services.currency import CurrencyService

class Bank(db.Model):
    __tablename__='bank'

    # Attributes
    bankID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    bankTitle = db.Column(db.String(20), nullable=False)
    bankCurrency = db.Column(db.String(3), nullable=False)
    bankAmount = db.Column(db.Float, nullable=False)
    remainingBankAmount = db.Column(db.Float, nullable=False)
    userID = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __init__(self, userID, bankTitle, bankCurrency, bankAmount, remainingBankAmount):
        self.userID = userID
        self.bankTitle = bankTitle
        self.bankCurrency = bankCurrency
        self.bankAmount = bankAmount
        self.remainingBankAmount = remainingBankAmount

    def get_json(self):
        balance = CurrencyService.format_currency(self.bankAmount, self.bankCurrency)
        remainingBalance = CurrencyService.format_currency(self.remainingBankAmount, self.bankCurrency)

        return {
            'userID': self.userID,
            'bankID': self.bankID,
            'bankTitle': self.bankTitle,
            'bankCurrency': self.bankCurrency,
            'bankAmount': balance,
            'remainingBankAmount': remainingBalance
        }

    def __str__(self):
        balance = CurrencyService.format_currency(self.bankAmount, self.bankCurrency)
        remainingBalance = CurrencyService.format_currency(self.remainingBankAmount, self.bankCurrency)

        return (
            f"Bank ID: {self.bankID}, Title: {self.bankTitle}, "
            f"Currency: {self.bankCurrency}, Amount: {balance}, "
            f"Remaining Amount: {remainingBalance}"
        )

    def __repr__(self):
        return (
            f"Bank(bankID={self.bankID}, bankTitle='{self.bankTitle}', "
            f"bankCurrency='{self.bankCurrency}', bankAmount='{self.bankAmount}', "
            f"remainingBankAmount={self.remainingBankAmount}')"
        )