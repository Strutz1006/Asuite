# Development Guide for Aesyros Suite

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm 8+
- Git

### Setup
```bash
# Clone repository
git clone https://github.com/Strutz1006/Asuite.git
cd aesyros-suite

# Install dependencies
npm run install:all

# Start all apps in development
npm run dev

# Or start individual apps
npm run dev:align    # http://localhost:5173
npm run dev:pulse    # http://localhost:5177  
npm run dev:catalyst # http://localhost:5174
npm run dev:flow     # http://localhost:5175
npm run dev:foresight # http://localhost:5176
```

## Project Structure

```
aesyros-suite/
├── apps/                    # Individual applications
│   ├── align/              # Strategic Goals & OKRs (port 5173)
│   ├── pulse/              # KPI Monitoring (port 5177)
│   ├── catalyst/           # Change Management (port 5174)
│   ├── flow/               # Process Validation (port 5175)
│   └── foresight/          # Strategy Simulation (port 5176)
├── packages/               # Shared packages
│   ├── ui/                 # Shared UI components
│   ├── types/              # TypeScript type definitions
│   └── hooks/              # Shared React hooks
├── supabase/               # Database schema and policies
├── docs/                   # Product documentation
├── CLAUDE.md               # Claude context file
├── API_PATTERNS.md         # API integration patterns
├── COMPONENT_PATTERNS.md   # UI component patterns
└── package.json            # Workspace configuration
```

## Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes in relevant app(s)
# Follow the established patterns in COMPONENT_PATTERNS.md

# Test your changes
npm run build          # Build all apps
npm run lint           # Check code quality
npm run type-check     # Validate TypeScript
```

### 2. App-Specific Development

#### Adding New Features to Apps
Each app follows the same feature-based structure:

```
src/
├── components/          # App-specific components
│   └── Layout.tsx      # App layout with navigation
├── features/           # Feature modules
│   ├── dashboard/
│   │   └── pages/
│   ├── [feature-name]/
│   │   ├── pages/      # Feature pages
│   │   └── components/ # Feature components (optional)
│   └── shared/
│       ├── components/ # Shared feature components
│       └── data/       # Mock data files
└── App.tsx            # React Router setup
```

#### Example: Adding a New Feature to Align
```typescript
// 1. Create feature structure
mkdir -p apps/align/src/features/reports/pages

// 2. Create page component
// apps/align/src/features/reports/pages/ReportsPage.tsx
import React from 'react'
import { PageLayout } from '@aesyros/ui'

export const ReportsPage: React.FC = () => {
  return (
    <PageLayout 
      title="Reports" 
      subtitle="Goal progress and analytics"
    >
      {/* Your content here */}
    </PageLayout>
  )
}

// 3. Add route to App.tsx
import ReportsPage from './features/reports/pages/ReportsPage'

// In your routes:
<Route path="reports" element={<ReportsPage />} />
```

### 3. Shared Component Development

#### Adding to UI Package
```typescript
// 1. Create component in packages/ui/src/components/
// packages/ui/src/components/DataTable.tsx
export const DataTable = () => {
  // Component implementation
}

// 2. Export from index
// packages/ui/src/index.ts
export { DataTable } from './components/DataTable'

// 3. Use in apps
import { DataTable } from '@aesyros/ui'
```

### 4. Type Management
```typescript
// 1. Add types to packages/types/src/index.ts
export interface Goal {
  id: string
  title: string
  // ... other properties
}

// 2. Use in apps
import type { Goal } from '@aesyros/types'
```

## Code Standards

### TypeScript
- Use strict mode
- Prefer `type` imports: `import type { Goal } from '@aesyros/types'`
- Use proper return types for functions
- Avoid `any` - use proper typing

### React Patterns
```typescript
// Prefer function components with TypeScript
interface ComponentProps {
  title: string
  optional?: boolean
}

export const Component: React.FC<ComponentProps> = ({ 
  title, 
  optional = false 
}) => {
  return <div>{title}</div>
}

// Use proper hooks
const [state, setState] = useState<StateType>(initialValue)
const { data, loading, error } = useQuery(...)
```

### Styling Guidelines
```typescript
// Use Tailwind utilities
<div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/80 rounded-2xl">

// For complex styles, use shared components
import { GlassCard } from '@aesyros/ui'
<GlassCard className="p-6">

// Glass morphism theme
bg-slate-800/60 backdrop-blur-xl border border-slate-700/80

// Active states (sky blue theme)
bg-sky-500/20 text-sky-300 border-sky-500/50
```

## Testing Strategy

### Unit Testing
```bash
# Run tests for specific app
cd apps/align && npm test

# Run all tests
npm run test --workspaces
```

### Integration Testing
```typescript
// Test component integration
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })
  
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  )
}
```

## Performance Guidelines

### Bundle Size
- Import only what you need: `import { Button } from '@aesyros/ui'`
- Use dynamic imports for heavy features: `const Component = lazy(() => import('./Component'))`
- Monitor bundle size: `npm run build` shows gzipped sizes

### React Performance
```typescript
// Memoize expensive computations
const expensiveValue = useMemo(() => {
  return heavyComputation(data)
}, [data])

// Memoize components when needed
const MemoizedComponent = React.memo(({ data }) => {
  return <div>{data}</div>
})

// Use callback for event handlers
const handleClick = useCallback(() => {
  // handler logic
}, [dependencies])
```

## Common Tasks

### Adding a New App
```bash
# 1. Create app structure
mkdir apps/new-app
cd apps/new-app
npm init -y

# 2. Copy package.json structure from existing app
# 3. Copy base App.tsx and Layout.tsx
# 4. Add to workspace package.json scripts
# 5. Add to navigation in packages/ui/src/components/AppNavigation.tsx
```

### Database Integration
```typescript
// 1. Update schema in supabase/schema.sql
// 2. Update permissions in supabase/permissions.sql
// 3. Generate types: npx supabase gen types typescript
// 4. Create service in app: services/YourService.ts
// 5. Create hooks: hooks/useYourData.ts
```

### Debugging

#### Common Issues
```bash
# TypeScript errors
npm run type-check

# Build errors  
npm run build --workspace=apps/your-app

# Navigation issues - check AppNavigation.tsx
# Port conflicts - check package.json dev scripts

# Clear node_modules and reinstall
npm run clean && npm run install:all
```

#### Debug Tools
- React DevTools
- Redux DevTools (if using Redux)
- Network tab for API calls
- Console for React Query cache

## Deployment

### Build Process
```bash
# Build all apps
npm run build

# Build specific app
npm run build --workspace=apps/align

# Preview built app
npm run preview --workspace=apps/align
```

### Environment Variables
```bash
# .env.local (each app)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Production environment
VITE_APP_ENV=production
```

## Git Workflow

### Commit Message Format
```bash
git commit -m "feat(align): add goal progress tracking

- Implement progress updates for goals
- Add validation for progress values
- Update UI components for better UX

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes  
- `refactor/description` - Code refactoring
- `docs/description` - Documentation updates

## Helpful Commands

```bash
# Development
npm run dev                    # Run all apps
npm run dev:align             # Run specific app
npm run build                 # Build all apps
npm run lint                  # Lint all code
npm run type-check           # Check TypeScript

# Maintenance  
npm run clean                # Clean all node_modules and dist
npm run fresh                # Clean + fresh install
npm run install:all          # Install all dependencies

# Individual app commands
cd apps/align
npm run dev                  # Start dev server
npm run build               # Build for production  
npm run preview             # Preview production build
```

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)