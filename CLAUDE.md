# Claude Context File for Aesyros Suite

## Project Overview
Aesyros Suite is a strategic operating system for modern organizations, consisting of 5 integrated applications that help businesses align strategy with execution.

## Architecture
- **Monorepo**: Uses npm workspaces with apps/* and packages/*
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS with glass morphism design
- **Navigation**: Shared navigation component with inter-app routing
- **Data**: Currently using mock data, planned migration to Supabase

## Applications (in navigation order)
1. **Align** (port 5173) - Strategic Goals & OKRs
2. **Pulse** (port 5177) - KPI Design and Tracking  
3. **Catalyst** (port 5174) - Change Management
4. **Flow** (port 5175) - Process Validation & Optimization
5. **Foresight** (port 5176) - Strategy Simulation & Impact Modeling

## Development Commands
```bash
# Run all apps simultaneously
npm run dev

# Run individual apps
npm run dev:align
npm run dev:pulse
npm run dev:catalyst
npm run dev:flow
npm run dev:foresight

# Build all apps
npm run build

# Lint and type check
npm run lint
npm run type-check
```

## Key Packages
- `@aesyros/ui` - Shared UI components (AppNavigation, GlassCard, Icon)
- `@aesyros/types` - Shared TypeScript types
- `@aesyros/hooks` - Shared React hooks

## Feature Structure (per app)
```
src/
├── components/          # App-specific components (Layout)
├── features/            # Feature-based organization
│   ├── dashboard/pages/
│   ├── [feature]/pages/
│   ├── shared/
│   │   ├── components/  # Feature-scoped components
│   │   └── data/        # Mock data files
└── App.tsx             # React Router setup
```

## Styling Guidelines
- Use TailwindCSS utility classes
- Glass morphism: `bg-slate-800/60 backdrop-blur-xl border border-slate-700/80`
- Color scheme: Sky blue for active states, slate grays for backgrounds
- Icons: Use Heroicons path strings in custom Icon components

## Testing & Quality
- TypeScript strict mode enabled
- ESLint configuration shared across workspace
- All apps must build successfully before commits

## Database Schema
- **Production Schema**: Uses app-prefixed table names (align_*, pulse_*, catalyst_*, flow_*, foresight_*)
- **Advanced Features**: Cross-app linking, AI coach interactions, notifications system
- **Compliance**: Dedicated compliance frameworks and checking system
- **Analytics**: Anomaly detection, value impact tracking, activity logging
- **Survey System**: Built-in survey creation and response collection

## Key Database Tables by App
- **Align**: align_objectives, align_key_results, align_progress_updates
- **Pulse**: pulse_kpis, pulse_kpi_values, pulse_anomalies  
- **Catalyst**: catalyst_journeys, catalyst_stakeholders, catalyst_activities, catalyst_surveys
- **Flow**: flow_documents, flow_issues, flow_compliance_frameworks, flow_compliance_checks
- **Foresight**: foresight_scenarios, foresight_business_levers, foresight_outcomes, foresight_risk_factors

## Cross-App Features
- **cross_app_links**: Link entities between different applications
- **value_impacts**: Track real-world impact metrics across apps
- **coach_interactions**: AI assistant conversations and context
- **notifications**: System-wide notification management
- **activity_logs**: Comprehensive audit trail

## Future Roadmap
- [ ] Real-time collaboration features enhancement
- [ ] Advanced AI Coach capabilities
- [ ] Mobile responsive design improvements
- [ ] Enhanced cross-app analytics
- [ ] API integrations for external data sources