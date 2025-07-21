#!/usr/bin/env python3
"""
Global Hotkey Enhancer for RePrompter
Listens for Cmd+Shift+V globally and enhances selected text using the local API
"""

import requests
import pyperclip
import subprocess
import time
import sys
from pynput import keyboard
from pynput.keyboard import Key, KeyCode

# Configuration
ENHANCE_API = "http://localhost:3001/api/enhance"
HOTKEY_COMBO = {Key.cmd, Key.shift, KeyCode.from_char('v')}
current_keys = set()

def enhance_prompt(text):
    """Send text to local RePrompter API for enhancement"""
    try:
        print(f"Enhancing: {text[:50]}...")
        response = requests.post(ENHANCE_API, json={"text": text}, timeout=30)
        response.raise_for_status()
        result = response.json()
        enhanced_text = result["enhanced"]
        print(f"Enhanced successfully!")
        return enhanced_text
    except requests.exceptions.RequestException as e:
        print(f"API Error: {e}")
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

def on_activate():
    """Called when hotkey combination is pressed"""
    print("\n🎯 Hotkey activated! Enhancing clipboard text...")
    
    # Get text from clipboard
    original_text = pyperclip.paste().strip()
    
    if not original_text:
        print("❌ No text in clipboard. Please copy some text first (Cmd+C).")
        return
    
    print(f"📋 Original text: {original_text[:100]}{'...' if len(original_text) > 100 else ''}")
    
    # Enhance the text
    enhanced_text = enhance_prompt(original_text)
    
    if enhanced_text:
        # Copy enhanced text to clipboard
        pyperclip.copy(enhanced_text)
        print(f"✅ Enhanced text copied to clipboard!")
        
        # Paste using AppleScript (Cmd+V)
        try:
            applescript = 'tell application "System Events" to keystroke "v" using command down'
            subprocess.run(['osascript', '-e', applescript], check=True, timeout=5)
            print("📝 Enhanced text pasted!")
        except subprocess.TimeoutExpired:
            print("⚠️  Paste timeout - text is in clipboard, paste manually with Cmd+V")
        except subprocess.CalledProcessError:
            print("⚠️  Could not paste automatically - text is in clipboard, paste manually with Cmd+V")
    else:
        print("❌ Failed to enhance text")

def on_press(key):
    """Handle key press events"""
    global current_keys
    
    try:
        # Add key to current set
        current_keys.add(key)
        
        # Check if hotkey combination is complete
        if all(k in current_keys for k in HOTKEY_COMBO):
            on_activate()
            
    except AttributeError:
        # Special keys (like cmd, shift) don't have char attribute
        pass

def on_release(key):
    """Handle key release events"""
    global current_keys
    
    try:
        # Remove key from current set
        current_keys.discard(key)
        
        # Quit on ESC
        if key == Key.esc:
            print("\n👋 Exiting global hotkey enhancer...")
            return False
            
    except AttributeError:
        pass

def check_server():
    """Check if the RePrompter server is running"""
    try:
        response = requests.get("http://localhost:3001/api/prompts", timeout=5)
        return response.status_code == 200
    except:
        return False

def main():
    """Main function"""
    print("🚀 RePrompter Global Hotkey Enhancer")
    print("=" * 50)
    print("Hotkey: Cmd + Shift + V")
    print("Workflow:")
    print("1. Select text in any app")
    print("2. Copy it (Cmd+C)")
    print("3. Press Cmd+Shift+V to enhance")
    print("4. Enhanced text will be pasted automatically")
    print("Press ESC to quit")
    print("=" * 50)
    
    # Check if server is running
    if not check_server():
        print("❌ RePrompter server is not running!")
        print("Please start the server first with: npm start")
        sys.exit(1)
    
    print("✅ Server is running!")
    print("🎧 Listening for hotkey...")
    
    # Start keyboard listener
    with keyboard.Listener(on_press=on_press, on_release=on_release) as listener:
        listener.join()

if __name__ == "__main__":
    main() 