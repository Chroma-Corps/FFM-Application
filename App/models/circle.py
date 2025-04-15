import enum
import secrets  # To Generate A Random Code
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
    circleImage = db.Column(db.String(255), nullable=False)
    circleCode = db.Column(db.String(120), nullable=False, unique=True)

    # Relationships
    user_circles = db.relationship('UserCircle', back_populates='circle') # UserCircle

    def __init__(self, circleName, circleType, circleColor, circleImage):
        self.circleName = circleName
        self.circleType = circleType
        self.circleColor = circleColor
        self.circleImage = circleImage
        self.circleCode = self.generate_circle_code()

    def generate_circle_code(self):
        """Generates A Unique Code For The Circle."""
        return f"{self.circleName[:3].upper()}-{secrets.token_hex(4)}"


    def get_json(self):
        return{
            'circleID': self.circleID,
            'circleName': self.circleName,
            'circleType': self.circleType.value,
            'circleColor': self.circleColor,
            'circleImage': self.circleImage,
            'circleCode': self.circleCode,
            'owner': self.user_circles[0].user.name
        }

    def __str__(self):
        return f"{self.circleName}- {self.circleType.value} | ({self.circleColor})"

    def __repr__(self):
        return (
            f"Circle(circleID={self.circleID}, circleName='{self.circleName}', circleType='{self.circleType.value}', circleColor={self.circleColor}"
        )