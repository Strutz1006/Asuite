import express from 'express';
import axios from 'axios';

const router = express.Router();
const FORESIGHT_SERVICE_URL = process.env.FORESIGHT_SERVICE_URL || 'http://localhost:8005';

// Strategy Simulation & Impact Modeling Analytics
router.post('/scenarios/simulate', async (req, res) => {
  try {
    const response = await axios.post(`${FORESIGHT_SERVICE_URL}/simulate-scenarios`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Foresight service error:', error.message);
    res.status(500).json({ error: 'Failed to simulate scenarios', details: error.message });
  }
});

router.post('/impact/model', async (req, res) => {
  try {
    const response = await axios.post(`${FORESIGHT_SERVICE_URL}/model-impact`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Foresight service error:', error.message);
    res.status(500).json({ error: 'Failed to model impact', details: error.message });
  }
});

router.post('/risks/assess', async (req, res) => {
  try {
    const response = await axios.post(`${FORESIGHT_SERVICE_URL}/assess-risks`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Foresight service error:', error.message);
    res.status(500).json({ error: 'Failed to assess risks', details: error.message });
  }
});

router.post('/outcomes/predict', async (req, res) => {
  try {
    const response = await axios.post(`${FORESIGHT_SERVICE_URL}/predict-outcomes`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Foresight service error:', error.message);
    res.status(500).json({ error: 'Failed to predict outcomes', details: error.message });
  }
});

router.post('/monte-carlo/run', async (req, res) => {
  try {
    const response = await axios.post(`${FORESIGHT_SERVICE_URL}/run-monte-carlo`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Foresight service error:', error.message);
    res.status(500).json({ error: 'Failed to run Monte Carlo simulation', details: error.message });
  }
});

export default router;