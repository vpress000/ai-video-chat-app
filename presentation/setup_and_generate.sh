#!/bin/bash

# PowerPoint Presentation Generator Setup Script
# This script sets up the Python environment and generates the presentation

echo "🎬 Video Chat Application - PowerPoint Generator Setup"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if Python is installed
check_python() {
    if command -v python3 >/dev/null 2>&1; then
        PYTHON_VERSION=$(python3 --version)
        print_success "Python found: $PYTHON_VERSION"
        return 0
    elif command -v python >/dev/null 2>&1; then
        PYTHON_VERSION=$(python --version)
        print_success "Python found: $PYTHON_VERSION"
        return 0
    else
        print_error "Python is not installed. Please install Python 3.7+ from https://python.org/"
        return 1
    fi
}

# Check if pip is installed
check_pip() {
    if command -v pip3 >/dev/null 2>&1; then
        PIP_VERSION=$(pip3 --version)
        print_success "pip found: $PIP_VERSION"
        return 0
    elif command -v pip >/dev/null 2>&1; then
        PIP_VERSION=$(pip --version)
        print_success "pip found: $PIP_VERSION"
        return 0
    else
        print_error "pip is not installed. Please install pip."
        return 1
    fi
}

# Install required packages
install_requirements() {
    print_status "Installing required Python packages..."
    
    # Try pip3 first, then pip
    if command -v pip3 >/dev/null 2>&1; then
        pip3 install -r requirements.txt
    elif command -v pip >/dev/null 2>&1; then
        pip install -r requirements.txt
    else
        print_error "No pip command found!"
        return 1
    fi
    
    if [ $? -eq 0 ]; then
        print_success "All packages installed successfully"
        return 0
    else
        print_error "Failed to install packages"
        return 1
    fi
}

# Generate the presentation
generate_presentation() {
    print_status "Generating PowerPoint presentation..."
    
    # Try python3 first, then python
    if command -v python3 >/dev/null 2>&1; then
        python3 generate_presentation.py
    elif command -v python >/dev/null 2>&1; then
        python generate_presentation.py
    else
        print_error "No python command found!"
        return 1
    fi
    
    if [ $? -eq 0 ]; then
        print_success "Presentation generated successfully!"
        return 0
    else
        print_error "Failed to generate presentation"
        return 1
    fi
}

# Main execution
main() {
    print_status "Starting setup process..."
    
    # Check prerequisites
    if ! check_python; then
        exit 1
    fi
    
    if ! check_pip; then
        exit 1
    fi
    
    # Install requirements
    if ! install_requirements; then
        print_error "Setup failed during package installation"
        exit 1
    fi
    
    # Generate presentation
    if ! generate_presentation; then
        print_error "Setup failed during presentation generation"
        exit 1
    fi
    
    # Success message
    echo ""
    print_success "🎉 ALL DONE!"
    echo ""
    print_status "Your PowerPoint presentation has been generated:"
    echo "📁 File: Video_Chat_Application_Presentation.pptx"
    echo ""
    print_status "Next steps:"
    echo "1. Open the PowerPoint file in Microsoft PowerPoint"
    echo "2. Review the slides and customize as needed"
    echo "3. Add your name and contact information"
    echo "4. Practice your presentation using the delivery guide"
    echo "5. Test on your presentation equipment"
    echo ""
    print_warning "Pro tip: Read the delivery-guide.md for presentation tips!"
}

# Run main function
main
