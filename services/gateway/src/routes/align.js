import express from 'express';
import axios from 'axios';

const router = express.Router();
const ALIGN_SERVICE_URL = process.env.ALIGN_SERVICE_URL || 'http://localhost:8001';

// Strategic Goals & OKRs Analytics
router.post('/objectives/analyze', async (req, res) => {
  try {
    const response = await axios.post(`${ALIGN_SERVICE_URL}/analyze-objectives`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Align service error:', error.message);
    res.status(500).json({ error: 'Failed to analyze objectives', details: error.message });
  }
});

router.post('/alignment/calculate', async (req, res) => {
  try {
    const response = await axios.post(`${ALIGN_SERVICE_URL}/calculate-alignment`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Align service error:', error.message);
    res.status(500).json({ error: 'Failed to calculate alignment', details: error.message });
  }
});

router.post('/progress/predict', async (req, res) => {
  try {
    const response = await axios.post(`${ALIGN_SERVICE_URL}/predict-progress`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Align service error:', error.message);
    res.status(500).json({ error: 'Failed to predict progress', details: error.message });
  }
});

router.post('/okrs/optimize', async (req, res) => {
  try {
    const response = await axios.post(`${ALIGN_SERVICE_URL}/optimize-okrs`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Align service error:', error.message);
    res.status(500).json({ error: 'Failed to optimize OKRs', details: error.message });
  }
});

export default router;