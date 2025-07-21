#!/bin/bash

echo "🚀 Setting up RePrompter Global Hotkey System"
echo "=============================================="

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv

if [ $? -ne 0 ]; then
    echo "❌ Failed to create virtual environment."
    exit 1
fi

# Activate virtual environment and install dependencies
echo "📦 Installing Python dependencies in virtual environment..."
source venv/bin/activate
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies."
    exit 1
fi

# Make the hotkey script executable
echo "🔧 Making hotkey script executable..."
chmod +x global_hotkey_enhancer.py

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To use the global hotkey:"
echo "1. Start the RePrompter server: npm start"
echo "2. Run the hotkey listener: source venv/bin/activate && python global_hotkey_enhancer.py"
echo "3. Use Cmd+Shift+V in any app to enhance selected text"
echo ""
echo "Note: macOS will ask for Accessibility permissions on first run." 