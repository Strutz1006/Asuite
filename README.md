# Aesyros Suite

A strategic operating system for modern organizations, consisting of 6 integrated applications that help businesses align strategy with execution.

## 🌟 Applications

1. **Align** (port 5173) - Strategic Goals & OKRs
2. **Drive** (port 5179) - Task & Project Management  
3. **Pulse** (port 5177) - KPI Design and Tracking
4. **Catalyst** (port 5174) - Change Management
5. **Flow** (port 5175) - Process Validation & Optimization
6. **Foresight** (port 5176) - Strategy Simulation & Impact Modeling

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 8+

### Installation

```bash
# Clone the repository
git clone https://github.com/aesyros/aesyros-suite.git
cd aesyros-suite

# Install all dependencies
npm install

# Start all applications
npm run dev

# Or start a specific app
npm run dev:align
```

### Development URLs

- **Align**: http://localhost:5173
- **Drive**: http://localhost:5179
- **Pulse**: http://localhost:5177
- **Catalyst**: http://localhost:5174
- **Flow**: http://localhost:5175
- **Foresight**: http://localhost:5176

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: TailwindCSS v4 with glass morphism design
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Architecture**: Monorepo with npm workspaces

## 📁 Project Structure

```
aesyros-suite/
├── apps/                    # Individual applications
│   ├── align/              # Strategic Goals & OKRs
│   ├── drive/              # Task & Project Management
│   ├── pulse/              # KPI Monitoring
│   ├── catalyst/           # Change Management
│   ├── flow/               # Process Validation
│   └── foresight/          # Strategy Simulation
├── packages/               # Shared packages
│   ├── ui/                 # Shared UI components
│   ├── types/              # TypeScript definitions
│   └── hooks/              # Shared React hooks
├── services/               # Python backend services
├── supabase/               # Database schema
└── docs/                   # Documentation
```

## 🎨 Design System

The Aesyros Suite uses a modern glass morphism design with:

- **Colors**: Professional palette with sky blue accents
- **Glass Effects**: `bg-slate-800/60 backdrop-blur-xl border border-slate-700/80`
- **Typography**: Clean, modern fonts with proper hierarchy
- **Icons**: Lucide React for consistent iconography

## 🔧 Development

### Scripts

```bash
# Start all apps
npm run dev

# Start individual apps
npm run dev:align
npm run dev:drive
npm run dev:pulse
npm run dev:catalyst
npm run dev:flow
npm run dev:foresight

# Build all apps
npm run build

# Lint all code
npm run lint

# Type check all code
npm run type-check
```

### Environment Setup

1. Copy `.env.example` to `.env` in each app directory
2. Configure your Supabase credentials
3. Start the development server

### Database Setup

1. Create a Supabase project
2. Copy the schema from `supabase/` directory
3. Configure RLS policies for security
4. Update environment variables

## 🏗️ Architecture

### Monorepo Structure

- **Self-contained apps**: Each app can run independently
- **Shared packages**: Common components, types, and hooks
- **Integration points**: Apps communicate through shared state and navigation

### Data Flow

1. **Align** → **Drive**: Goals become tasks and projects
2. **Drive** → **Pulse**: Task completion feeds KPI tracking
3. **Pulse** → **Foresight**: KPI data informs scenario modeling
4. **Foresight** → **Catalyst**: Scenarios drive change management
5. **Catalyst** → **Flow**: Change activities update processes

## 📚 Documentation

- [Journey Documentation](docs/aesyros_journey.md)
- [Product Definitions](docs/aesyros_apps.md)
- [Development Guide](CLAUDE.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🌐 Links

- [Website](https://aesyros.com)
- [Documentation](https://docs.aesyros.com)
- [Support](https://support.aesyros.com)

---

**Current Status**: ✅ Align app foundation complete with React 19, TailwindCSS v4, and Supabase integration ready.