from flask import Blueprint, jsonify, request
from datetime import datetime
from app import db
from app.models.user import User
from app.models.emergency_contact import EmergencyContact
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint('alerts', __name__, url_prefix='/api/alerts')

# In a real application, you would define an Alert model
# For now, we'll simulate alert functionality

@bp.route('/sos', methods=['POST'])
@jwt_required()
def create_sos():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    data = request.json
    alert_type = data.get('type', 'emergency')
    location = data.get('location', {})
    message = data.get('message', '')
    
    # In a real application, you would:
    # 1. Create an alert record in the database
    # 2. Notify emergency contacts
    # 3. Potentially integrate with emergency services
    
    # Get user's emergency contacts
    contacts = EmergencyContact.query.filter_by(user_id=user_id).all()
    
    # Simulate alert processing
    response = {
        "success": True,
        "message": f"SOS alert ({alert_type}) created successfully",
        "timestamp": datetime.utcnow().isoformat(),
        "location": location,
        "user": user.to_dict(),
        "contacts_notified": len(contacts)
    }
    
    return jsonify(response), 201

@bp.route('/history', methods=['GET'])
@jwt_required()
def get_alert_history():
    user_id = get_jwt_identity()
    
    # In a real application, you would fetch alerts from database
    # For now, return a sample response
    
    sample_alerts = [
        {
            "id": 1,
            "type": "emergency",
            "status": "resolved",
            "created_at": "2023-05-01T14:30:00Z",
            "location": {"lat": 37.7749, "lng": -122.4194}
        },
        {
            "id": 2,
            "type": "medical",
            "status": "resolved",
            "created_at": "2023-04-15T09:45:00Z",
            "location": {"lat": 37.7749, "lng": -122.4194}
        }
    ]
    
    return jsonify(sample_alerts), 200

@bp.route('/<int:alert_id>/cancel', methods=['POST'])
@jwt_required()
def cancel_alert(alert_id):
    # In a real application, you would update the alert status in the database
    
    return jsonify({
        "success": True,
        "message": f"Alert {alert_id} cancelled successfully"
    }), 200