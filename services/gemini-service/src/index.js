const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/gemini/validate-goal', async (req, res) => {
  try {
    const { goal } = req.body;
    const prompt = `You are an expert business consultant specializing in the SMART framework. Analyze the following goal and provide actionable suggestions to make it more Specific, Measurable, Achievable, Relevant, and Time-bound. Format your response as a list of suggestions. Goal: '${goal}'`;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ suggestions: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

app.post('/api/gemini/parse-scenario', async (req, res) => {
  try {
    const { text } = req.body;
    const prompt = `Analyze the following text and extract the key variables, their change, the magnitude of the change, and the timeframe. Return the output as a JSON object with the keys 'variable', 'change', 'magnitude', and 'timeframe'. Text: '${text}'`;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const json = JSON.parse(response.text());

    res.json(json);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

app.post('/api/gemini/suggest-kpis', async (req, res) => {
  try {
    const { role } = req.body;
    const prompt = `List the top 5 most important Key Performance Indicators (KPIs) for a '${role}' at a B2B SaaS company. Provide a brief description for each KPI. Return the output as a JSON array of objects, each with 'kpi_name' and 'description' keys.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const json = JSON.parse(response.text());

    res.json(json);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

app.listen(port, () => {
  console.log(`Gemini service listening at http://localhost:${port}`);
});
