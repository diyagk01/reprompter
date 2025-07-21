# 🚀 RePrompter

A powerful platform that enhances your prompts for better AI coding assistance. Transform simple prompts into comprehensive, detailed instructions that work perfectly with coding agents like Cursor.

## Features

- **🔧 Global Hotkey System**: Press Cmd+Shift+V anywhere to enhance selected text instantly
- **🌐 Web Interface**: Beautiful web app to track and manage all your prompts
- **📊 Prompt History**: View, copy, and manage all your original and enhanced prompts
- **🤖 AI Enhancement**: Uses Novita's DeepSeek V3 model to intelligently enhance prompts
- **📋 Auto-copy**: Enhanced prompts are automatically copied to your clipboard

## Quick Start

### 1. Install Dependencies

```bash
# Install server dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..
```

### 2. Setup Environment

1. Copy the example environment file:
```bash
cp env.example .env
```

2. Add your Novita API key to `.env`:
```
NOVITA_API_KEY=your_actual_novita_api_key_here
```

### 3. Start the Application

```bash
# Start the server
npm start

# In another terminal, build the client
npm run build:client
```

The web app will be available at `http://localhost:3001`

## Global Hotkey System Setup

### Quick Setup:

```bash
# Install Python dependencies and setup hotkey system
./setup-hotkey.sh

# Start everything (server + hotkey listener)
./start-everything.sh
```

### Manual Setup:

1. **Create virtual environment and install dependencies:**
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. **Make scripts executable:**
```bash
chmod +x global_hotkey_enhancer.py
chmod +x start-everything.sh
```

### Usage:

1. **Start the system:**
```bash
./start-everything.sh
```

2. **Use the hotkey anywhere:**
   - Select text in any app (iMessage, Slack, Notes, etc.)
   - Copy it (Cmd+C)
   - Press Cmd+Shift+V
   - Enhanced text will be pasted automatically

3. **Stop the system:**
   - Press Ctrl+C in the terminal
   - Or press ESC while the hotkey listener is active

## Web Interface

The web app provides:

- **Enhance Tab**: Enter prompts and get enhanced versions instantly
- **History Tab**: View all your previous prompts with original and enhanced versions
- **Copy Functionality**: One-click copying of any prompt
- **Delete Functionality**: Remove prompts you no longer need

## How It Works

1. **Prompt Enhancement**: The system uses Novita's DeepSeek V3 model to transform your prompts into more detailed, structured instructions
2. **Context Addition**: Automatically adds programming language specifications, error handling expectations, and performance requirements
3. **Format Optimization**: Structures prompts for maximum effectiveness with AI coding agents
4. **Storage**: All prompts are stored locally in SQLite for easy access and management

## API Endpoints

- `POST /api/enhance` - Enhance a prompt
- `GET /api/prompts` - Get all prompts
- `GET /api/prompts/:id` - Get a specific prompt
- `DELETE /api/prompts/:id` - Delete a prompt

## Example Transformations

**Original Prompt:**
```
create a function to sort an array
```

**Enhanced Prompt:**
```
Create a comprehensive sorting function in JavaScript that:

1. Takes an array of numbers as input parameter
2. Implements a stable sorting algorithm (preferably merge sort or quicksort)
3. Returns a new sorted array without modifying the original
4. Handles edge cases:
   - Empty arrays (return empty array)
   - Arrays with duplicate values
   - Arrays with negative numbers
   - Arrays with floating point numbers
5. Includes proper error handling for invalid inputs
6. Has O(n log n) time complexity
7. Returns the sorted array in ascending order

Please provide:
- The complete function implementation
- JSDoc comments explaining parameters and return value
- Example usage with test cases
- Brief explanation of the chosen algorithm
```

## Development

### Project Structure
```
reprompter/
├── server.js                    # Express server
├── global_hotkey_enhancer.py    # Global hotkey listener
├── setup-hotkey.sh              # Setup script for hotkey system
├── start-everything.sh          # Launcher for server + hotkey
├── requirements.txt             # Python dependencies
├── client/                      # React frontend
│   ├── src/
│   │   ├── App.js              # Main React component
│   │   └── App.css             # Styles
│   └── package.json
├── package.json                 # Server dependencies
└── prompts.db                  # SQLite database (auto-created)
```

### Running in Development Mode

```bash
# Terminal 1: Start server with auto-reload
npm run dev

# Terminal 2: Start React dev server
cd client && npm start
```

## Requirements

- Node.js 16+
- Python 3.7+
- Novita API key
- macOS (for global hotkey functionality)

## License

MIT License - feel free to use and modify as needed!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Happy coding with enhanced prompts! 🎉** 