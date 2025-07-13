import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import alignRoutes from './routes/align.js';
import pulseRoutes from './routes/pulse.js';
import catalystRoutes from './routes/catalyst.js';
import flowRoutes from './routes/flow.js';
import foresightRoutes from './routes/foresight.js';
import geminiRoutes from './routes/gemini.js';
import { authenticate, authorize, requireOrganization, optionalAuth } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:5173', // Align
    'http://localhost:5174', // Catalyst
    'http://localhost:5175', // Flow
    'http://localhost:5176', // Foresight
    'http://localhost:5177', // Pulse
  ],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    services: {
      gateway: 'running',
      align: 'available',
      pulse: 'available', 
      catalyst: 'available',
      flow: 'available',
      foresight: 'available'
    }
  });
});

// Authentication routes (no auth required)
app.use('/api/auth', authRoutes);

// Protected API Routes (require authentication + organization access)
app.use('/api/align', authenticate, requireOrganization, alignRoutes);
app.use('/api/pulse', authenticate, requireOrganization, pulseRoutes);
app.use('/api/catalyst', authenticate, requireOrganization, catalystRoutes);
app.use('/api/flow', authenticate, requireOrganization, flowRoutes);
app.use('/api/foresight', authenticate, requireOrganization, foresightRoutes);

// Gemini route can be accessed by any authenticated user (no org requirement for AI assistance)
app.use('/api/gemini', authenticate, geminiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Gateway Error:', err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});