from App.database import db
from App.services.currency import CurrencyService

class Bank(db.Model):
    __tablename__='bank'

    # Attributes
    bankID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    bankTitle = db.Column(db.String(120), nullable=False)
    bankCurrency = db.Column(db.String(10), nullable=False)
    bankAmount = db.Column(db.Float, nullable=False)
    remainingBankAmount = db.Column(db.Float, nullable=False)
    isPrimary = db.Column(db.Boolean, default=False)
    color = db.Column(db.String(120), nullable=False)

    # Foreign Keys
    circleID = db.Column(db.Integer, db.ForeignKey('circle.circleID'), nullable=False)

    # Relationships
    circle = db.relationship('Circle', backref='banks', lazy=True) # 1 Circle -> Many Banks
    budgets = db.relationship('Budget', back_populates='banks', cascade='all, delete-orphan')
    user_banks = db.relationship('UserBank', back_populates='bank') # UserBanks

    def __init__(self, bankTitle, bankCurrency, bankAmount, remainingBankAmount, isPrimary, color, circleID):
        self.circleID = circleID
        self.bankTitle = bankTitle
        self.bankCurrency = bankCurrency
        self.bankAmount = bankAmount
        self.remainingBankAmount = remainingBankAmount
        self.isPrimary = isPrimary
        self.color = color

    def get_json(self):
        balance = CurrencyService.format_currency(self.bankAmount, self.bankCurrency)
        remainingBalance = CurrencyService.format_currency(self.remainingBankAmount, self.bankCurrency)

        return {
            'bankID': self.bankID,
            'bankTitle': self.bankTitle,
            'bankCurrency': self.bankCurrency,
            'bankAmount': balance,
            'remainingBankAmount': remainingBalance,
            'isPrimary': self.isPrimary,
            'color': self.color
        }

    def __str__(self):
        balance = CurrencyService.format_currency(self.bankAmount, self.bankCurrency)
        remainingBalance = CurrencyService.format_currency(self.remainingBankAmount, self.bankCurrency)

        return (
            f"Bank ID: {self.bankID}, Title: {self.bankTitle}, "
            f"Currency: {self.bankCurrency}, Amount: {balance}, "
            f"Remaining Amount: {remainingBalance}"
            f"Primary Bank: {self.isPrimary}"
            f"Color: {self.color}"
        )

    def __repr__(self):
        return (
            f"Bank(bankID={self.bankID}, bankTitle='{self.bankTitle}', "
            f"bankCurrency='{self.bankCurrency}', bankAmount='{self.bankAmount}', "
            f"remainingBankAmount={self.remainingBankAmount}',"
            f"isPrimary='{self.isPrimary}'"
            f"color='{self.color}')"
        )