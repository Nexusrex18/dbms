from flask import Blueprint, request, jsonify
from app import db, jwt
from app.models.user import User
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt_identity
)

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/register', methods=['POST'])
def register():
    data = request.json
    
    # Check if username or email already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already registered"}), 409
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"error": "Username already taken"}), 409
    
    # Create new user
    user = User(
        email=data['email'],
        username=data['username'],
        full_name=data['full_name'],
        phone=data['phone'],
        address=data.get('address', '')
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    # Handle additional user metadata if provided
    if 'meta' in data:
        meta = data['meta']
        
        # Handle emergency contacts
        if 'emergency_contacts' in meta:
            try:
                from app.models.emergency_contact import EmergencyContact
                for contact_data in meta['emergency_contacts']:
                    contact = EmergencyContact(
                        user_id=user.id,
                        name=contact_data['name'],
                        relationship=contact_data['relationship'],
                        phone=contact_data['phone']
                    )
                    db.session.add(contact)
            except ImportError:
                # Log that EmergencyContact model couldn't be imported
                print("Warning: EmergencyContact model not available")
        
        # Additional metadata could be stored in a separate profile table
        # or user_meta table depending on your schema design
        
        db.session.commit()
    
    return jsonify({"message": "User registered successfully"}), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.json
    
    # Find user by email
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({"error": "Invalid credentials"}), 401
    
    # Create access token
    access_token = create_access_token(identity=str(user.id))
    
    return jsonify({
        "access_token": access_token,
        "user": user.to_dict()
    }), 200

@bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # In a production environment, you would invalidate the token here
    # by adding it to a blocklist/deny list or using a revocation mechanism
    # For now, we'll just return a successful response
    # as the actual logout is handled by the client removing the token
    
    return jsonify({"message": "Logged out successfully"}), 200

@bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify(user.to_dict()), 200