from App.database import db

class UserCircle(db.Model):
    __tablename__='userCircle'

    # Attributes
    userCircleID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userID = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    circleID = db.Column(db.Integer, db.ForeignKey('circle.circleID'), nullable=False)

    # Relationships
    user = db.relationship('User', back_populates='user_circles') # Relationship to User
    circle = db.relationship('Circle', back_populates='user_circles') # Relationship to Circle

    def get_json(self):
        return {
            'userCircleID': self.userCircleID,
            'userID': self.userID,
            'circleID': self.circleID
        }

    def __str__(self):
        return f"UserCircle(userCircleID={self.userCircleID}, userID={self.userID}, circleID={self.circleID})"

    def __repr__(self):
        return self.__str__()