from App.database import db
from App.models.transactionAttachment import TransactionAttachment
from datetime import datetime

# Associates An Attachment With An Existing Transaction
def add_transaction_attachment(transactionID, fileName, fileType, fileSize, fileUri, uploadedAt=None):
    try:
        attachment = TransactionAttachment(
            transactionID=transactionID,
            fileName=fileName,
            fileType=fileType,
            fileSize=fileSize,
            fileUri=fileUri,
            uploadedAt=uploadedAt or datetime.utcnow()
        )
        db.session.add(attachment)
        db.session.commit()
        return attachment

    except Exception as e:
        db.session.rollback()
        print(f"Failed To Add Attachment To Transaction: {e}")
        return None