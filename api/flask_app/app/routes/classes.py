from flask import Blueprint, jsonify, request
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta

bp = Blueprint('classes', __name__, url_prefix='/api/classes')

# In a real application, you would define Class and Registration models
# For now, we'll simulate class functionality

@bp.route('/', methods=['GET'])
def get_classes():
    # In a real application, fetch classes from database
    # Optional query parameters: type, level, date
    
    class_type = request.args.get('type')
    level = request.args.get('level')
    
    # Generate sample classes
    tomorrow = datetime.now() + timedelta(days=1)
    next_week = datetime.now() + timedelta(days=7)
    
    sample_classes = [
        {
            "id": 1,
            "title": "Basic Self-Defense",
            "description": "Learn fundamental self-defense techniques",
            "instructor": "John Doe",
            "type": "self-defense",
            "level": "beginner",
            "capacity": 20,
            "registered": 12,
            "date": tomorrow.strftime("%Y-%m-%d"),
            "time": "18:00-19:30",
            "location": "Main Studio, 123 Safety St"
        },
        {
            "id": 2,
            "title": "Women's Safety Workshop",
            "description": "Specialized safety techniques for women",
            "instructor": "Jane Smith",
            "type": "workshop",
            "level": "all-levels",
            "capacity": 15,
            "registered": 8,
            "date": next_week.strftime("%Y-%m-%d"),
            "time": "10:00-12:00",
            "location": "Community Center, 456 Security Ave"
        }
    ]
    
    # Apply filters if provided
    filtered_classes = sample_classes
    if class_type:
        filtered_classes = [c for c in filtered_classes if c['type'] == class_type]
    if level:
        filtered_classes = [c for c in filtered_classes if c['level'] == level]
    
    return jsonify(filtered_classes), 200

@bp.route('/<int:class_id>', methods=['GET'])
def get_class(class_id):
    # In a real application, fetch specific class from database
    
    sample_class = {
        "id": class_id,
        "title": "Basic Self-Defense",
        "description": "Learn fundamental self-defense techniques including basic strikes, blocks, and escapes. This class is perfect for beginners with no prior experience.",
        "instructor": {
            "name": "John Doe",
            "bio": "Certified self-defense instructor with 10+ years of experience",
            "qualifications": ["Black belt in Krav Maga", "Certified Personal Trainer"]
        },
        "type": "self-defense",
        "level": "beginner",
        "capacity": 20,
        "registered": 12,
        "date": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d"),
        "time": "18:00-19:30",
        "duration_minutes": 90,
        "location": "Main Studio, 123 Safety St",
        "requirements": ["Comfortable clothing", "Water bottle"],
        "topics_covered": ["Basic stance", "Blocking techniques", "Escape methods"]
    }
    
    return jsonify(sample_class), 200

@bp.route('/<int:class_id>/register', methods=['POST'])
@jwt_required()
def register_for_class(class_id):
    user_id = get_jwt_identity()
    
    # In a real application:
    # 1. Check if class has available spots
    # 2. Check if user is already registered
    # 3. Create registration record
    
    return jsonify({
        "success": True,
        "message": f"Successfully registered for class {class_id}",
        "registration_id": 12345,
        "class_id": class_id,
        "user_id": user_id
    }), 201

@bp.route('/user/registrations', methods=['GET'])
@jwt_required()
def get_user_registrations():
    user_id = get_jwt_identity()
    
    # In a real application, fetch user's class registrations from database
    
    sample_registrations = [
        {
            "registration_id": 1001,
            "class": {
                "id": 1,
                "title": "Basic Self-Defense",
                "date": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d"),
                "time": "18:00-19:30"
            },
            "status": "confirmed",
            "registered_on": (datetime.now() - timedelta(days=3)).isoformat()
        }
    ]
    
    return jsonify(sample_registrations), 200

@bp.route('/instructors', methods=['GET'])
def get_instructors():
    # In a real application, fetch instructors from database
    
    sample_instructors = [
        {
            "id": 1,
            "name": "John Doe",
            "specialties": ["Self-defense", "Krav Maga"],
            "bio": "Certified self-defense instructor with 10+ years of experience",
            "image_url": "https://example.com/images/john-doe.jpg"
        },
        {
            "id": 2,
            "name": "Jane Smith",
            "specialties": ["Women's self-defense", "Safety awareness"],
            "bio": "Specializes in women's safety and self-defense techniques",
            "image_url": "https://example.com/images/jane-smith.jpg"
        }
    ]
    
    return jsonify(sample_instructors), 200