import enum
from App.database import db

class CircleType(enum.Enum):
    # Circle Name Would Be Set To  "Self" In Frontend - Upon Self Option Being Choosen
    # Or If User Doesn't Create A Group Right Away
    SELF = "Self"
    GROUP = "Group"

class Circle(db.Model):
    __tablename__='circle'

    # Attributes
    circleID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    circleName = db.Column(db.String(120), nullable=False)
    circleType = db.Column(db.Enum(CircleType), nullable=False)
    circleColor = db.Column(db.String(120), nullable=False)

    # Relationships
    user_circles = db.relationship('UserCircle', back_populates='circle') # UserCircle

    def __init__(self, circleName, circleType, circleColor):
        self.circleName = circleName
        self.circleType = circleType
        self.circleColor = circleColor

    def get_json(self):
        return{
            'circleID': self.circleID,
            'circleName': self.circleName,
            'circleType': self.circleType.value,
            'circleColor': self.circleColor
        }

    def __str__(self):
        return f"{self.circleName}- {self.circleType.value} | ({self.circleColor})"

    def __repr__(self):
        return (
            f"Circle(circleID={self.circleID}, circleName='{self.circleName}', circleType='{self.circleType.value}', circleColor={self.circleColor}"
        )