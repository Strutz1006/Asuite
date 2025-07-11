import express from 'express';
import axios from 'axios';

const router = express.Router();
const PULSE_SERVICE_URL = process.env.PULSE_SERVICE_URL || 'http://localhost:8002';

// KPI Design and Tracking Analytics
router.post('/kpis/calculate', async (req, res) => {
  try {
    const response = await axios.post(`${PULSE_SERVICE_URL}/calculate-kpis`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Pulse service error:', error.message);
    res.status(500).json({ error: 'Failed to calculate KPIs', details: error.message });
  }
});

router.post('/anomalies/detect', async (req, res) => {
  try {
    const response = await axios.post(`${PULSE_SERVICE_URL}/detect-anomalies`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Pulse service error:', error.message);
    res.status(500).json({ error: 'Failed to detect anomalies', details: error.message });
  }
});

router.post('/trends/analyze', async (req, res) => {
  try {
    const response = await axios.post(`${PULSE_SERVICE_URL}/analyze-trends`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Pulse service error:', error.message);
    res.status(500).json({ error: 'Failed to analyze trends', details: error.message });
  }
});

router.post('/forecasting/predict', async (req, res) => {
  try {
    const response = await axios.post(`${PULSE_SERVICE_URL}/predict-values`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Pulse service error:', error.message);
    res.status(500).json({ error: 'Failed to predict values', details: error.message });
  }
});

router.post('/correlations/find', async (req, res) => {
  try {
    const response = await axios.post(`${PULSE_SERVICE_URL}/find-correlations`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Pulse service error:', error.message);
    res.status(500).json({ error: 'Failed to find correlations', details: error.message });
  }
});

export default router;