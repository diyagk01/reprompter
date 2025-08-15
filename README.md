Reprompter is a prompt enhancer for coding assistants like Cursor. You type or paste a short prompt, and it turns it into a fully fleshed-out, structured instruction set that works better with AI coding tools. It uses Novita’s DeepSeek V3 model under the hood to add context, clarify requirements, and format everything for maximum agent effectiveness.

You can run it two ways: through the React web app, or via a global hotkey that works system-wide on macOS. The web app lets you enhance prompts manually, browse your history, and copy or delete items. The hotkey workflow is faster — select text in any app, copy it, press Cmd+Shift+V, and the enhanced prompt is instantly pasted back in.

The backend is a Node.js + Express server that exposes endpoints for enhancing prompts (POST /api/enhance), retrieving them (GET /api/prompts), and deleting them. All prompts (original + enhanced) are stored locally in SQLite. The hotkey listener is a Python script using pynput for keyboard hooks and pyperclip for clipboard handling. The enhancement logic is simple: the server sends your text to Novita’s DeepSeek V3 API with a predefined system prompt that adds programming language details, error handling, performance constraints, and formatting guidance.

Setup is quick:
Install server dependencies with npm install
Install client dependencies with cd client && npm install
Copy .env.example to .env and add your Novita API key
Either run ./setup-hotkey.sh to prepare the Python environment for the hotkey listener, or set it up manually with a virtualenv and pip install -r requirements.txt
Start the server with npm start and build the client with npm run build:client (or run both in dev mode with auto-reload)

When it’s running, you have a local service that takes vague prompts like “create a function to sort an array” and turns them into precise, multi-step requests — specifying algorithms, complexity targets, error handling, test cases, and documentation. The result is a prompt that an AI coding agent can follow with far less ambiguity.
