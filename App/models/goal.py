import enum
from App.database import db
from App.models.bank import Bank
from App.models.userBank import UserBank
from App.models.userGoal import UserGoal
from App.services.currency import CurrencyService
from App.services.datetime import convert_to_date

class GoalType(enum.Enum):
    SAVINGS = "Savings"
    EXPENSE = "Expense"

class Goal(db.Model):
    __tablename__='goal'

    # Attributes
    goalID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    goalTitle = db.Column(db.String(120), nullable=False)
    targetAmount = db.Column(db.Float, nullable=False)
    currentAmount = db.Column(db.Float, nullable=False)
    goalType = db.Column(db.Enum(GoalType), nullable=False)
    startDate = db.Column(db.Date,nullable=False)
    endDate = db.Column(db.Date,nullable=False)
    color = db.Column(db.String(120), nullable=True)

    # Foreign Keys
    circleID = db.Column(db.Integer, db.ForeignKey('circle.circleID'), nullable=False)

    # Relationships
    user_goals = db.relationship('UserGoal', back_populates='goal') # UserGoal
    circle = db.relationship('Circle', backref='goals', lazy=True) # 1 Circle -> Many Goals

    def __init__(self, goalTitle, targetAmount, currentAmount, goalType, startDate, endDate, circleID, color):
        self.circleID = circleID
        self.goalTitle = goalTitle
        self.targetAmount = targetAmount
        self.goalType = goalType
        self.startDate = convert_to_date(startDate)
        self.endDate = convert_to_date(endDate)
        self.color = color

        # Set currentAmount Based On GoalType Enum
        self.goalType = GoalType(goalType)

        if self.goalType == GoalType.SAVINGS:
            self.currentAmount = 0
        else:
            self.currentAmount = currentAmount

    def get_json(self):
        main_bank = None
        user_goal = UserGoal.query.filter_by(goalID=self.goalID).first()

        if user_goal:
            userID = user_goal.userID
            user_bank = UserBank.query.filter_by(userID=userID).join(Bank).filter(Bank.isPrimary == True).first()
            if user_bank:
                main_bank = user_bank.bank
        bank_currency = main_bank.bankCurrency if main_bank else "TTD"

        targetAmount = CurrencyService.format_currency(self.targetAmount, bank_currency)
        currentAmount = CurrencyService.format_currency(self.currentAmount, bank_currency)

        return{
            'goalID': self.goalID,
            'goalTitle': self.goalTitle,
            'targetAmount': targetAmount,
            'currentAmount': currentAmount,
            'goalType': self.goalType.value,
            'startDate': self.startDate.strftime("%a, %d %b %Y"),
            'endDate': self.endDate.strftime("%a, %d %b %Y"),
            'color': self.color,
            'owner': self.user_goals[0].user.name
        }

    def __str__(self):
        main_bank = None
        user_goal = UserGoal.query.filter_by(goalID=self.goalID).first()

        if user_goal:
            userID = user_goal.userID
            user_bank = UserBank.query.filter_by(userID=userID).join(Bank).filter(Bank.isPrimary == True).first()
            if user_bank:
                main_bank = user_bank.bank
        bank_currency = main_bank.bankCurrency if main_bank else "TTD"

        targetAmount = CurrencyService.format_currency(self.targetAmount, bank_currency)
        return f"{self.goalTitle} ({self.goalType.value} | {targetAmount}) (Start: {self.startDate}, End: {self.endDate})"

    def __repr__(self):
        return (
            f"Goal(goalID={self.goalID}, goalTitle='{self.goalTitle}', targetAmount={self.targetAmount}, "
            f"goalType='{self.goalType.value}', "
            f"startDate='{self.startDate}', endDate='{self.endDate}')"
        )