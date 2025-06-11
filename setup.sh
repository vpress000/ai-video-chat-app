#!/bin/bash

# Video Chat Application Setup Script
# This script sets up and starts both backend and frontend servers

echo "🎥 Video Chat Application Setup"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_nodejs() {
    if command -v node >/dev/null 2>&1; then
        NODE_VERSION=$(node --version)
        print_success "Node.js found: $NODE_VERSION"
    else
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
}

# Check if npm is installed
check_npm() {
    if command -v npm >/dev/null 2>&1; then
        NPM_VERSION=$(npm --version)
        print_success "npm found: $NPM_VERSION"
    else
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    cd backend
    
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating from .env.example..."
        cp .env.example .env
        print_warning "Please edit backend/.env with your API keys before starting the servers!"
    fi
    
    if [ ! -d "node_modules" ]; then
        print_status "Installing backend dependencies..."
        npm install
        if [ $? -eq 0 ]; then
            print_success "Backend dependencies installed"
        else
            print_error "Failed to install backend dependencies"
            exit 1
        fi
    else
        print_success "Backend dependencies already installed"
    fi
    
    cd ..
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    cd frontend
    
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
        if [ $? -eq 0 ]; then
            print_success "Frontend dependencies installed"
        else
            print_error "Failed to install frontend dependencies"
            exit 1
        fi
    else
        print_success "Frontend dependencies already installed"
    fi
    
    cd ..
}

# Test backend API
test_backend() {
    print_status "Testing backend API..."
    sleep 2
    
    HEALTH_RESPONSE=$(curl -s http://localhost:5000/api/health 2>/dev/null)
    if [ $? -eq 0 ] && [[ $HEALTH_RESPONSE == *"OK"* ]]; then
        print_success "Backend API is responding correctly"
        echo "Response: $HEALTH_RESPONSE"
    else
        print_warning "Backend API test failed or server not ready yet"
    fi
}

# Start servers
start_servers() {
    print_status "Starting servers..."
    
    # Start backend
    print_status "Starting backend server on port 5000..."
    cd backend
    npm run dev &
    BACKEND_PID=$!
    cd ..
    
    # Wait a moment for backend to start
    sleep 3
    
    # Test backend
    test_backend
    
    # Start frontend
    print_status "Starting frontend server on port 3000..."
    cd frontend
    npm start &
    FRONTEND_PID=$!
    cd ..
    
    print_success "Servers started!"
    echo ""
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 Backend API: http://localhost:5000"
    echo "💾 Health Check: http://localhost:5000/api/health"
    echo ""
    echo "Press Ctrl+C to stop all servers"
    
    # Wait for user interrupt
    trap 'kill $BACKEND_PID $FRONTEND_PID 2>/dev/null' EXIT
    wait
}

# Main setup flow
main() {
    echo "Checking prerequisites..."
    check_nodejs
    check_npm
    
    echo ""
    echo "Setting up application..."
    setup_backend
    setup_frontend
    
    echo ""
    echo "Setup complete! 🎉"
    echo ""
    
    read -p "Do you want to start the servers now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        start_servers
    else
        echo ""
        echo "To start the servers manually:"
        echo "Backend:  cd backend && npm run dev"
        echo "Frontend: cd frontend && npm start"
        echo ""
        echo "Don't forget to set your API keys in backend/.env!"
    fi
}

# Run main function
main
