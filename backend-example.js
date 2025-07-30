// Simple Express.js backend example
// npm install express cors dotenv openai

const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const port = 3001;

// OpenAI client (API key hidden on server)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Secure server-side only
});

app.use(cors());
app.use(express.json());

// Secure endpoint for persona responses
app.post('/api/generate-response', async (req, res) => {
  try {
    const { personaId, coachMessage, conversationHistory } = req.body;
    
    // Add rate limiting, user validation here
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: conversationHistory,
      max_tokens: 300,
      temperature: 0.8
    });

    res.json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});