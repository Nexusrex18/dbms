from flask import Blueprint, jsonify, request
from app import db
from app.models.user import User
from app.models.emergency_contact import EmergencyContact
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint('users', __name__, url_prefix='/api/users')

@bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify(user.to_dict()), 200

@bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    data = request.json
    
    # Update user fields
    if 'full_name' in data:
        user.full_name = data['full_name']
    if 'phone' in data:
        user.phone = data['phone']
    if 'address' in data:
        user.address = data['address']
    
    db.session.commit()
    
    return jsonify(user.to_dict()), 200

@bp.route('/emergency-contacts', methods=['GET'])
@jwt_required()
def get_emergency_contacts():
    user_id = get_jwt_identity()
    contacts = EmergencyContact.query.filter_by(user_id=user_id).all()
    
    return jsonify([contact.to_dict() for contact in contacts]), 200

@bp.route('/emergency-contacts', methods=['POST'])
@jwt_required()
def add_emergency_contact():
    user_id = get_jwt_identity()
    data = request.json
    
    contact = EmergencyContact(
        user_id=user_id,
        name=data['name'],
        relationship=data['relationship'],
        phone=data['phone'],
        email=data.get('email')
    )
    
    db.session.add(contact)
    db.session.commit()
    
    return jsonify(contact.to_dict()), 201

@bp.route('/emergency-contacts/<int:contact_id>', methods=['PUT', 'DELETE'])
@jwt_required()
def manage_emergency_contact(contact_id):
    user_id = get_jwt_identity()
    contact = EmergencyContact.query.filter_by(id=contact_id, user_id=user_id).first()
    
    if not contact:
        return jsonify({"error": "Contact not found"}), 404
    
    if request.method == 'DELETE':
        db.session.delete(contact)
        db.session.commit()
        return jsonify({"message": "Contact deleted"}), 200
    
    # Update contact
    data = request.json
    contact.name = data.get('name', contact.name)
    contact.relationship = data.get('relationship', contact.relationship)
    contact.phone = data.get('phone', contact.phone)
    contact.email = data.get('email', contact.email)
    
    db.session.commit()
    
    return jsonify(contact.to_dict()), 200