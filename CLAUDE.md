# Claude Configuration

## Model Selection
CLAUDE_MODEL: claude-sonnet-4

Always use Sonnet 4 for optimal performance on development tasks. If currently using Opus 4, switch to Sonnet 4 to maintain high quality while reducing costs.

## Project Context
This is the Aesyros Suite monorepo containing 6 enterprise applications:
- Align - Strategic goals and OKRs
- Drive - Task and project management  
- Pulse - KPI tracking and analytics
- Catalyst - Change management
- Flow - Process validation and compliance
- Foresight - Scenario planning and predictive analytics

## Development Guidelines
- Use dual navigation system (suite-level + app-level)
- Maintain glass morphism design pattern
- Follow app-specific color themes
- Ensure responsive design for all components
- Use TypeScript for type safety
- Implement proper error handling

## Testing Commands
Run these commands after making changes:
- `npm run lint` - Check code style
- `npm run typecheck` - Verify TypeScript types
- `npm test` - Run test suite (if available)

## Key Technologies
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- Lucide React for icons
- Supabase for backend services

## Recent Completions (July 31, 2025)
- Suite-wide licensing system with super admin mode
- Complete database integration for settings components
- Real milestone tracking replacing placeholder data
- User/department/team organizational workflow
- License validation and enforcement across all apps