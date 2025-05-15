#!/usr/bin/env bash

# Run Flask backend server
cd api/flask_app
echo "Starting Flask server on port 5000..."
echo "Make sure you have installed all required dependencies:"
echo "pip install -r requirements.txt"
echo ""
echo "Press Ctrl+C to stop the server"
echo "-------------------------------------"

python run.py
