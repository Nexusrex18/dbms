from app import db

class EmergencyContact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    relationship = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), nullable=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'relationship': self.relationship,
            'phone': self.phone,
            'email': self.email
        }