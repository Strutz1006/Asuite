// Shared configuration for services
export const SERVICE_CONFIG = {
  gateway: {
    port: process.env.GATEWAY_PORT || 3001,
    host: '0.0.0.0'
  },
  services: {
    align: {
      url: process.env.ALIGN_SERVICE_URL || 'http://localhost:8001',
      port: 8001
    },
    pulse: {
      url: process.env.PULSE_SERVICE_URL || 'http://localhost:8002', 
      port: 8002
    },
    catalyst: {
      url: process.env.CATALYST_SERVICE_URL || 'http://localhost:8003',
      port: 8003
    },
    flow: {
      url: process.env.FLOW_SERVICE_URL || 'http://localhost:8004',
      port: 8004
    },
    foresight: {
      url: process.env.FORESIGHT_SERVICE_URL || 'http://localhost:8005',
      port: 8005
    }
  },
  cors: {
    origins: [
      'http://localhost:5173', // Align
      'http://localhost:5174', // Catalyst
      'http://localhost:5175', // Flow
      'http://localhost:5176', // Foresight
      'http://localhost:5177', // Pulse
    ]
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // requests per window
  }
};

export default SERVICE_CONFIG;