from App.database import db

class UserGoal(db.Model):
    __tablename__='userGoal'

    # Attributes
    userGoalID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userID = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    goalID = db.Column(db.Integer, db.ForeignKey('goal.goalID'), nullable=False)

    # Relationships
    user = db.relationship('User', back_populates='user_goals') # Relationship to User
    goal = db.relationship('Goal', back_populates='user_goals') # Relationship to Goal

    def get_json(self):
        return {
            'userGoalID': self.userGoalID,
            'userID': self.userID,
            'goalID': self.goalID
        }

    def __str__(self):
        return f"UserGoal(userGoalID={self.userGoalID}, userID={self.userID}, goalID={self.goalID})"

    def __repr__(self):
        return self.__str__()