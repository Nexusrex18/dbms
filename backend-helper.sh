#!/bin/bash

# Script to run and interact with the Flask backend API
# This helps debug and manage the community posts functionality

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}SafeNest Backend Helper${NC}"
echo "=========================="

# Check if Flask backend is running
check_backend() {
  echo -e "${YELLOW}Checking if Flask backend is running...${NC}"
  if curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/community/resources > /dev/null 2>&1; then
    echo -e "${GREEN}Backend is running!${NC}"
    return 0
  else
    echo -e "${RED}Backend is not running.${NC}"
    return 1
  fi
}

# Start Flask backend if it's not running
start_backend() {
  echo -e "${YELLOW}Starting Flask backend...${NC}"
  
  # Navigate to the Flask app directory
  cd "$HOME/Downloads/care-alert/api/flask_app" || { 
    echo -e "${RED}Error: Could not find Flask app directory${NC}"
    exit 1
  }
  
  # Check if Python virtual environment exists, create if not
  if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Setting up Python virtual environment...${NC}"
    python3 -m venv venv
  fi
  
  # Activate virtual environment
  source venv/bin/activate
  
  # Install requirements
  echo -e "${YELLOW}Installing required packages...${NC}"
  pip install -r requirements.txt
  
  # Run the Flask app in the background
  echo -e "${YELLOW}Starting Flask server...${NC}"
  nohup python run.py > flask.log 2>&1 &
  
  # Store the PID for later
  echo $! > flask.pid
  
  echo -e "${GREEN}Flask backend started (PID: $(cat flask.pid))${NC}"
  echo -e "${BLUE}Server logs will be written to flask.log${NC}"
  
  # Give the server a moment to start up
  sleep 3
  
  # Check if it's running
  if check_backend; then
    echo -e "${GREEN}Backend started successfully!${NC}"
  else
    echo -e "${RED}Backend failed to start. Check flask.log for details.${NC}"
  fi
}

# Test the community endpoints
test_endpoints() {
  echo -e "${YELLOW}Testing community endpoints...${NC}"
  
  echo -e "\n${BLUE}GET /api/community/posts:${NC}"
  curl -s http://localhost:5000/api/community/posts | json_pp
  
  echo -e "\n${BLUE}GET /api/community/resources:${NC}"
  curl -s http://localhost:5000/api/community/resources | json_pp
  
  echo -e "\n${GREEN}Endpoint tests completed.${NC}"
}

# Create a test post (requires auth token)
create_test_post() {
  # Check if token is provided
  if [ -z "$1" ]; then
    echo -e "${RED}Error: Auth token required.${NC}"
    echo "Usage: $0 create-post [AUTH_TOKEN]"
    return 1
  fi
  
  echo -e "${YELLOW}Creating test post...${NC}"
  
  curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $1" \
    -d '{"title": "Test Post", "content": "This is a test post from the helper script", "category": "general"}' \
    http://localhost:5000/api/community/posts | json_pp
    
  echo -e "\n${GREEN}Post creation completed.${NC}"
}

# Stop the Flask backend
stop_backend() {
  if [ -f "$HOME/Downloads/care-alert/api/flask_app/flask.pid" ]; then
    PID=$(cat "$HOME/Downloads/care-alert/api/flask_app/flask.pid")
    echo -e "${YELLOW}Stopping Flask backend (PID: $PID)...${NC}"
    kill "$PID" 2>/dev/null || true
    rm "$HOME/Downloads/care-alert/api/flask_app/flask.pid"
    echo -e "${GREEN}Backend stopped.${NC}"
  else
    echo -e "${RED}No backend PID file found.${NC}"
  fi
}

# Display help
show_help() {
  echo -e "${BLUE}Usage:${NC}"
  echo -e "  $0 ${GREEN}check${NC}      - Check if the Flask backend is running"
  echo -e "  $0 ${GREEN}start${NC}      - Start the Flask backend"
  echo -e "  $0 ${GREEN}stop${NC}       - Stop the Flask backend"
  echo -e "  $0 ${GREEN}test${NC}       - Test community endpoints"
  echo -e "  $0 ${GREEN}create-post${NC} [AUTH_TOKEN] - Create a test post"
  echo -e "  $0 ${GREEN}help${NC}       - Show this help message"
}

# Process command line arguments
case "$1" in
  check)
    check_backend
    ;;
  start)
    if ! check_backend; then
      start_backend
    else
      echo -e "${GREEN}Backend is already running.${NC}"
    fi
    ;;
  stop)
    stop_backend
    ;;
  test)
    test_endpoints
    ;;
  create-post)
    create_test_post "$2"
    ;;
  help|--help|-h)
    show_help
    ;;
  *)
    show_help
    ;;
esac
