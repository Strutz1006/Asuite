import express from 'express';
import axios from 'axios';

const router = express.Router();
const CATALYST_SERVICE_URL = process.env.CATALYST_SERVICE_URL || 'http://localhost:8003';

// Change Management Analytics
router.post('/readiness/assess', async (req, res) => {
  try {
    const response = await axios.post(`${CATALYST_SERVICE_URL}/assess-readiness`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Catalyst service error:', error.message);
    res.status(500).json({ error: 'Failed to assess readiness', details: error.message });
  }
});

router.post('/stakeholders/analyze', async (req, res) => {
  try {
    const response = await axios.post(`${CATALYST_SERVICE_URL}/analyze-stakeholders`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Catalyst service error:', error.message);
    res.status(500).json({ error: 'Failed to analyze stakeholders', details: error.message });
  }
});

router.post('/journey/optimize', async (req, res) => {
  try {
    const response = await axios.post(`${CATALYST_SERVICE_URL}/optimize-journey`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Catalyst service error:', error.message);
    res.status(500).json({ error: 'Failed to optimize journey', details: error.message });
  }
});

router.post('/sentiment/analyze', async (req, res) => {
  try {
    const response = await axios.post(`${CATALYST_SERVICE_URL}/analyze-sentiment`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Catalyst service error:', error.message);
    res.status(500).json({ error: 'Failed to analyze sentiment', details: error.message });
  }
});

router.post('/resistance/predict', async (req, res) => {
  try {
    const response = await axios.post(`${CATALYST_SERVICE_URL}/predict-resistance`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Catalyst service error:', error.message);
    res.status(500).json({ error: 'Failed to predict resistance', details: error.message });
  }
});

export default router;