import express from 'express';
import axios from 'axios';

const router = express.Router();
const FLOW_SERVICE_URL = process.env.FLOW_SERVICE_URL || 'http://localhost:8004';

// Process Validation & Optimization Analytics
router.post('/processes/analyze', async (req, res) => {
  try {
    const response = await axios.post(`${FLOW_SERVICE_URL}/analyze-processes`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Flow service error:', error.message);
    res.status(500).json({ error: 'Failed to analyze processes', details: error.message });
  }
});

router.post('/bottlenecks/detect', async (req, res) => {
  try {
    const response = await axios.post(`${FLOW_SERVICE_URL}/detect-bottlenecks`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Flow service error:', error.message);
    res.status(500).json({ error: 'Failed to detect bottlenecks', details: error.message });
  }
});

router.post('/optimization/suggest', async (req, res) => {
  try {
    const response = await axios.post(`${FLOW_SERVICE_URL}/suggest-optimizations`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Flow service error:', error.message);
    res.status(500).json({ error: 'Failed to suggest optimizations', details: error.message });
  }
});

router.post('/compliance/check', async (req, res) => {
  try {
    const response = await axios.post(`${FLOW_SERVICE_URL}/check-compliance`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Flow service error:', error.message);
    res.status(500).json({ error: 'Failed to check compliance', details: error.message });
  }
});

router.post('/efficiency/calculate', async (req, res) => {
  try {
    const response = await axios.post(`${FLOW_SERVICE_URL}/calculate-efficiency`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Flow service error:', error.message);
    res.status(500).json({ error: 'Failed to calculate efficiency', details: error.message });
  }
});

export default router;