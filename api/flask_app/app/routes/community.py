from flask import Blueprint, jsonify, request
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

bp = Blueprint('community', __name__, url_prefix='/api/community')

# In a real application, you would define Post and Comment models
# For now, we'll simulate community functionality

@bp.route('/posts', methods=['GET'])
def get_posts():
    # In a real application, fetch posts from database
    # Optional query parameters: page, limit, category
    
    page = request.args.get('page', 1, type=int)
    limit = min(request.args.get('limit', 10, type=int), 50)
    category = request.args.get('category', None)
    
    # Sample posts
    sample_posts = [
        {
            "id": 1,
            "title": "Safety Tips for Night Walking",
            "content": "Here are some important safety tips when walking at night...",
            "author": {"id": 101, "name": "Safety Expert"},
            "created_at": "2023-05-10T18:30:00Z",
            "likes": 45,
            "comments_count": 12,
            "category": "tips"
        },
        {
            "id": 2,
            "title": "Self-Defense Basics Everyone Should Know",
            "content": "Learning these basic self-defense moves can help in emergency situations...",
            "author": {"id": 102, "name": "Defense Instructor"},
            "created_at": "2023-05-08T14:20:00Z",
            "likes": 78,
            "comments_count": 25,
            "category": "education"
        }
    ]
    
    if category:
        sample_posts = [post for post in sample_posts if post.get('category') == category]
    
    return jsonify({
        "posts": sample_posts,
        "page": page,
        "limit": limit,
        "total": len(sample_posts)
    }), 200

@bp.route('/posts', methods=['POST'])
@jwt_required()
def create_post():
    user_id = get_jwt_identity()
    data = request.json
    
    # In a real application, save post to database
    
    return jsonify({
        "id": 999,  # This would be the new post ID
        "title": data.get('title'),
        "content": data.get('content'),
        "created_at": datetime.utcnow().isoformat(),
        "author_id": user_id
    }), 201

@bp.route('/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    # In a real application, fetch specific post from database
    
    sample_post = {
        "id": post_id,
        "title": "Sample Post Title",
        "content": "This is the full content of the sample post...",
        "author": {"id": 101, "name": "Author Name"},
        "created_at": "2023-05-10T18:30:00Z",
        "likes": 45,
        "comments": [
            {
                "id": 1,
                "content": "Great post, thanks for sharing!",
                "author": {"id": 201, "name": "Commenter 1"},
                "created_at": "2023-05-10T19:00:00Z"
            },
            {
                "id": 2,
                "content": "This was very helpful information.",
                "author": {"id": 202, "name": "Commenter 2"},
                "created_at": "2023-05-10T19:30:00Z"
            }
        ]
    }
    
    return jsonify(sample_post), 200

@bp.route('/posts/<int:post_id>/comments', methods=['POST'])
@jwt_required()
def add_comment(post_id):
    user_id = get_jwt_identity()
    data = request.json
    
    # In a real application, save comment to database
    
    return jsonify({
        "id": 999,  # This would be the new comment ID
        "content": data.get('content'),
        "post_id": post_id,
        "author_id": user_id,
        "created_at": datetime.utcnow().isoformat()
    }), 201

@bp.route('/resources', methods=['GET'])
def get_resources():
    # In a real application, fetch resources from database
    
    sample_resources = [
        {
            "id": 1,
            "title": "Emergency Services Guide",
            "description": "A comprehensive guide to emergency services in your area",
            "url": "https://example.com/resources/emergency-guide",
            "category": "guides"
        },
        {
            "id": 2,
            "title": "Safety Equipment Recommendations",
            "description": "Recommended safety equipment for personal protection",
            "url": "https://example.com/resources/safety-equipment",
            "category": "equipment"
        }
    ]
    
    return jsonify(sample_resources), 200