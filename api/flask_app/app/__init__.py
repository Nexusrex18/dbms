from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
import os

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()

def create_app(test_config=None):
    # Create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    
    # Set default configuration
    app.config.from_mapping(
        SECRET_KEY='dev',
        SQLALCHEMY_DATABASE_URI='sqlite:///' + os.path.join(app.instance_path, 'safenest.sqlite'),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        JWT_SECRET_KEY='jwt-secret-key',
        JWT_ACCESS_TOKEN_EXPIRES=60*60*24  # 1 day
    )

    if test_config is None:
        # Load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # Load the test config if passed in
        app.config.from_mapping(test_config)

    # Ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # Initialize extensions with app
    db.init_app(app)
    jwt.init_app(app)
    CORS(app)

    # Import and register blueprints
    from app.routes import auth, users, alerts, community, classes
    
    app.register_blueprint(auth.bp)
    app.register_blueprint(users.bp)
    app.register_blueprint(alerts.bp)
    app.register_blueprint(community.bp)
    app.register_blueprint(classes.bp)

    @app.route('/api/health')
    def health():
        return {"status": "healthy"}

    return app