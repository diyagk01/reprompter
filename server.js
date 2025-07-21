const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('client/build'));

// Database setup
const db = new sqlite3.Database('./prompts.db');

// Initialize database
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS prompts (
    id TEXT PRIMARY KEY,
    original_text TEXT NOT NULL,
    enhanced_text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    model_used TEXT DEFAULT 'deepseek/deepseek-v3-0324',
    enhancement_notes TEXT
  )`);
});

// Novita API configuration for DeepSeek V3
const NOVITA_API_KEY = process.env.NOVITA_API_KEY;
const NOVITA_API_URL = 'https://api.novita.ai/v3/openai/chat/completions';

// Helper function to enhance prompt using Novita's DeepSeek V3 model
async function enhancePrompt(originalText) {
  try {
    const response = await axios.post(NOVITA_API_URL, {
      model: 'deepseek/deepseek-v3-0324',
      messages: [
        {
          role: 'system',
          content: `You are an expert at enhancing prompts for coding agents like Cursor. Your job is to take a user's prompt and make it more effective and clear, but keep it concise.

Key principles:
1. Make the prompt clearer and more specific
2. Add programming language context when relevant
3. Keep the enhanced version similar in length to the original
4. Focus on clarity and structure, not extensive detail
5. Return ONLY the enhanced prompt with no prefixes, explanations, or formatting
6. Do not add "Here's an enhanced version:" or any introductory text
7. Do not add quotes around the response

Transform the user's prompt into a better version that will give good results from a coding agent, but keep it concise and direct.`
        },
        {
          role: 'user',
          content: `Please enhance this prompt to make it much more effective for a coding agent: "${originalText}"`
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { "type": "text" }
    }, {
      headers: {
        'Authorization': `Bearer ${NOVITA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    let enhancedText = response.data.choices[0].message.content;
    
    // Remove unwanted prefixes that might slip through
    const unwantedPrefixes = [
      "Here's a significantly enhanced version of your prompt that will be much more effective for a coding agent:",
      "Here's an enhanced version of your prompt:",
      "Here's the enhanced prompt:",
      "Enhanced prompt:",
      "Here's a better version:",
      "Here's the improved prompt:",
      "Improved prompt:"
    ];
    
    for (const prefix of unwantedPrefixes) {
      if (enhancedText.startsWith(prefix)) {
        enhancedText = enhancedText.substring(prefix.length).trim();
      }
    }
    
    // Remove surrounding quotes if present
    if ((enhancedText.startsWith('"') && enhancedText.endsWith('"')) || 
        (enhancedText.startsWith("'") && enhancedText.endsWith("'"))) {
      enhancedText = enhancedText.substring(1, enhancedText.length - 1).trim();
    }
    
    return enhancedText;
  } catch (error) {
    console.error('Error enhancing prompt:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out');
    }
    throw new Error('Failed to enhance prompt');
  }
}

// API Routes

// Enhance a prompt
app.post('/api/enhance', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const enhancedText = await enhancePrompt(text);
    
    // Save to database
    const promptId = uuidv4();
    db.run(
      'INSERT INTO prompts (id, original_text, enhanced_text) VALUES (?, ?, ?)',
      [promptId, text, enhancedText],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to save prompt' });
        }
        
        res.json({
          id: promptId,
          original: text,
          enhanced: enhancedText,
          timestamp: new Date().toISOString()
        });
      }
    );
  } catch (error) {
    console.error('Enhancement error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all prompts
app.get('/api/prompts', (req, res) => {
  db.all('SELECT * FROM prompts ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch prompts' });
    }
    res.json(rows);
  });
});

// Get a specific prompt
app.get('/api/prompts/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM prompts WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch prompt' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Prompt not found' });
    }
    res.json(row);
  });
});

// Delete a prompt
app.delete('/api/prompts/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM prompts WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to delete prompt' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Prompt not found' });
    }
    res.json({ message: 'Prompt deleted successfully' });
  });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/client/build/index.html');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Web app available at http://localhost:${PORT}`);
}); 