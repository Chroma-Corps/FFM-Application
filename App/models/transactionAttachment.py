from datetime import datetime
from App.database import db

class TransactionAttachment(db.Model):
    __tablename__ = 'transactionAttachment'

    attachmentID = db.Column(db.Integer, primary_key=True)
    transactionID = db.Column(db.Integer, db.ForeignKey('transaction.transactionID'), nullable=False)
    fileName = db.Column(db.String(255), nullable=False)
    fileSize = db.Column(db.Integer, nullable=True)
    fileType = db.Column(db.String(50), nullable=True)
    uploadedAt = db.Column(db.DateTime, default=datetime.utcnow)
    fileUri = db.Column(db.String(512), nullable=True) 

    def get_json(self):
        return {
            'attachmentID': self.attachmentID,
            'transactionID': self.transactionID,
            'fileName': self.fileName,
            'fileSize': self.fileSize,
            'fileType': self.fileType,
            'fileUri': self.fileUri,
            'uploaded': self.uploadedAt.strftime("%Y-%m-%d %H:%M:%S")
        }

    def __str__(self):
        return f"TransactionAttachment(attachmentID={self.attachmentID}, transactionID={self.transactionID}, fileName={self.fileName}, fileUri={self.fileUri})"

    def __repr__(self):
        return self.__str__()