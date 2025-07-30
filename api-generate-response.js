// Vercel serverless function example
// Save as: /api/generate-response.js

import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Server environment variable
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { personaId, coachMessage, conversationHistory } = req.body;
    
    // Add authentication/rate limiting here
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: conversationHistory,
      max_tokens: 300,
      temperature: 0.8
    });

    res.json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
}