@echo off
REM PowerPoint Presentation Generator Setup Script for Windows
REM This script sets up the Python environment and generates the presentation

echo 🎬 Video Chat Application - PowerPoint Generator Setup
echo ==================================================

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Python is not installed or not in PATH
    echo Please install Python 3.7+ from https://python.org/
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)

echo ✅ Python found: 
python --version

REM Check if pip is installed
pip --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: pip is not installed or not in PATH
    echo Please reinstall Python with pip included
    pause
    exit /b 1
)

echo ✅ pip found:
pip --version

REM Install required packages
echo.
echo 📦 Installing required Python packages...
pip install -r requirements.txt

if %errorlevel% neq 0 (
    echo ❌ ERROR: Failed to install required packages
    echo Please check your internet connection and try again
    pause
    exit /b 1
)

echo ✅ All packages installed successfully

REM Generate the presentation
echo.
echo 🎯 Generating PowerPoint presentation...
python generate_presentation.py

if %errorlevel% neq 0 (
    echo ❌ ERROR: Failed to generate presentation
    echo Please check the error messages above
    pause
    exit /b 1
)

REM Success message
echo.
echo 🎉 SUCCESS! Your presentation has been generated.
echo.
echo 📁 File: Video_Chat_Application_Presentation.pptx
echo.
echo 📋 Next steps:
echo 1. Open the PowerPoint file in Microsoft PowerPoint
echo 2. Review the slides and customize as needed
echo 3. Add your name and contact information
echo 4. Practice your presentation using the delivery guide
echo 5. Test on your presentation equipment
echo.
echo 💡 Pro tip: Read the delivery-guide.md for presentation tips!
echo.
pause
