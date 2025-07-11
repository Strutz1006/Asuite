# Aesyros Suite Services Architecture

This directory contains the microservices architecture for complex analytics and business logic in the Aesyros Suite.

## Architecture Overview

```
Frontend (React Apps) ↔ API Gateway (Node.js) ↔ Python Analytics Services
```

## Services

### API Gateway
- **Port**: 3001
- **Technology**: Node.js + Express
- **Purpose**: Route requests, authentication, rate limiting
- **Location**: `services/gateway/`

### Python Analytics Services

#### Align Service (Port 8001)
- **Purpose**: Strategic Goals & OKRs Analytics
- **Features**: 
  - Objective alignment analysis
  - Progress prediction
  - OKR optimization
  - Strategic clustering

#### Pulse Service (Port 8002)
- **Purpose**: KPI Design and Tracking Analytics
- **Features**:
  - KPI calculations and trends
  - Anomaly detection
  - Forecasting
  - Correlation analysis

#### Catalyst Service (Port 8003)
- **Purpose**: Change Management Analytics
- **Features**:
  - Readiness assessment
  - Stakeholder analysis
  - Sentiment analysis
  - Resistance prediction

#### Flow Service (Port 8004)
- **Purpose**: Process Validation & Optimization
- **Features**:
  - Process analysis
  - Bottleneck detection
  - Efficiency calculations
  - Compliance checking

#### Foresight Service (Port 8005)
- **Purpose**: Strategy Simulation & Impact Modeling
- **Features**:
  - Scenario simulation
  - Impact modeling
  - Risk assessment
  - Monte Carlo analysis

## Quick Start

### Option 1: Local Development
```bash
# Install dependencies
npm run services:install
npm run services:install:python

# Run all services
npm run services:dev

# Run with frontend
npm run full-stack
```

### Option 2: Docker
```bash
# Build and run with Docker
npm run docker:build
npm run docker:up

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```

## API Usage Examples

### Gateway Health Check
```bash
curl http://localhost:3001/health
```

### Strategic Alignment Analysis
```bash
curl -X POST http://localhost:3001/api/align/objectives/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "objectives": [...],
    "strategic_themes": ["growth", "efficiency"],
    "business_priorities": [...]
  }'
```

### KPI Anomaly Detection
```bash
curl -X POST http://localhost:3001/api/pulse/anomalies/detect \
  -H "Content-Type: application/json" \
  -d '{
    "kpi_values": [...],
    "sensitivity": 0.1
  }'
```

## Development Guidelines

### Adding New Endpoints
1. Add route to appropriate gateway router (`services/gateway/src/routes/`)
2. Implement endpoint in corresponding Python service
3. Update API documentation

### Python Service Structure
```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Service Name")
app.add_middleware(CORSMiddleware, allow_origins=["*"])

@app.post("/endpoint")
async def endpoint_handler(request: RequestModel):
    # Analytics logic here
    return {"result": "data"}
```

### Environment Variables
- `PORT`: Service port (defaults: gateway=3001, services=8001-8005)
- `NODE_ENV`: Environment (development/production)
- `*_SERVICE_URL`: Service URLs for gateway routing

## Monitoring and Observability

### Health Checks
All services expose `/health` endpoints:
- Gateway: http://localhost:3001/health
- Services: http://localhost:800X/health

### Logging
- Gateway: Morgan HTTP logging
- Python services: Structured logging with service names

## Database Integration (Future)
- PostgreSQL for persistent data
- Redis for caching
- Connection strings configured via environment variables

## Security Considerations
- CORS configured for development origins
- Rate limiting on API gateway
- Input validation on all endpoints
- Container security with non-root users

## Scaling Considerations
- Each service can be scaled independently
- Load balancer can be added in front of gateway
- Database connection pooling
- Caching strategies for expensive computations