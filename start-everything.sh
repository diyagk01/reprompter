#!/bin/bash

echo "🚀 Starting RePrompter with Global Hotkey System"
echo "================================================"

# Check if server is already running
if curl -s http://localhost:3001/api/prompts > /dev/null 2>&1; then
    echo "✅ Server is already running on port 3001"
else
    echo "🌐 Starting RePrompter server..."
    # Start server in background
    npm start &
    SERVER_PID=$!
    
    # Wait for server to start
    echo "⏳ Waiting for server to start..."
    for i in {1..30}; do
        if curl -s http://localhost:3001/api/prompts > /dev/null 2>&1; then
            echo "✅ Server started successfully!"
            break
        fi
        sleep 1
    done
    
    if [ $i -eq 30 ]; then
        echo "❌ Server failed to start within 30 seconds"
        kill $SERVER_PID 2>/dev/null
        exit 1
    fi
fi

echo ""
echo "🎧 Starting global hotkey listener..."
echo "Hotkey: Cmd + Shift + V"
echo "Press Ctrl+C to stop everything"
echo ""

# Start the hotkey listener
source venv/bin/activate && python global_hotkey_enhancer.py

# Cleanup when hotkey listener stops
echo ""
echo "🛑 Stopping server..."
kill $SERVER_PID 2>/dev/null
echo "👋 RePrompter stopped" 