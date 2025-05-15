from app import create_app, db
from flask import Flask

app = create_app()

# Replace the removed before_first_request
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)