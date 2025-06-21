import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'VOTRE_CLE_API_ICI';

app.post('/api/chatgpt', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt manquant' });
  try {
    const system = "Génère 5 questions à choix multiples sur ce sujet, avec 4 réponses par question et indique la bonne réponse. Format JSON: [{question, options, correct}]";
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {role: 'system', content: system},
          {role: 'user', content: prompt}
        ],
        max_tokens: 800,
        temperature: 0.7
      })
    });
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'Erreur lors de la requête à OpenAI.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('Backend ChatGPT démarré sur le port', PORT);
});
