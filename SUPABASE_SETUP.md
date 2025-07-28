# Supabase Setup Guide for Aesyros Suite

This guide will help you set up Supabase for the Aesyros Suite project, including both local development and production deployment.

## Prerequisites

- Node.js 18+ and npm 8+
- Docker Desktop (for local Supabase development)
- Supabase CLI installed globally: `npm install -g supabase`

## Quick Start

### 1. Environment Setup

1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. For local development, the default values in `.env.example` will work with local Supabase.

3. For production, update the values with your Supabase project credentials:
   ```bash
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 2. Local Development Setup

1. Install dependencies:
   ```bash
   npm run install:all
   ```

2. Start local Supabase (first time setup):
   ```bash
   npm run db:start
   ```
   This will:
   - Start Supabase locally on Docker
   - Create the local database
   - Apply migrations
   - Set up authentication

3. Initialize the database with sample data:
   ```bash
   supabase db reset
   ```

4. Generate TypeScript types:
   ```bash
   npm run db:generate-types
   ```

### 3. Access Local Services

Once Supabase is running locally:

- **Supabase Studio**: http://localhost:54323
- **API Gateway**: http://localhost:54321
- **Database**: postgresql://postgres:postgres@localhost:54322/postgres
- **Inbucket (Email testing)**: http://localhost:54324

## Project Structure

```
/
├── .env.example                 # Environment template
├── .env.local                   # Local environment variables (gitignored)
├── database/
│   ├── migrations/              # Database migration files
│   │   ├── 001_drive_tables.sql
│   │   ├── 002_enhanced_features.sql
│   │   └── 003_missing_columns.sql
│   ├── schema.md               # Database schema documentation
│   └── supabase/
│       ├── config.toml         # Supabase configuration
│       └── seed.sql            # Sample data
├── packages/
│   └── supabase/               # Shared Supabase utilities
│       ├── src/
│       │   ├── client.ts       # Supabase client configuration
│       │   ├── types/
│       │   │   └── database.ts # Generated TypeScript types
│       │   ├── hooks/          # React hooks for auth and queries
│       │   ├── utils/          # Database utilities and services
│       │   └── index.ts        # Package exports
│       └── package.json
└── apps/
    ├── align/                  # Each app imports from @aesyros/supabase
    ├── drive/
    ├── pulse/
    ├── catalyst/
    ├── flow/
    └── foresight/
```

## Database Schema

The project includes comprehensive database schema for all 6 applications:

### Core Tables
- **Users**: User profiles and authentication
- **Companies**: Organization data

### App-Specific Tables
- **Align**: Goals, objectives, progress tracking
- **Drive**: Projects, tasks, time tracking, team management
- **Pulse**: KPIs, metrics, dashboards, data sources
- **Catalyst**: Change journeys, stakeholders, communications
- **Flow**: Documents, processes, compliance rules, workflows
- **Foresight**: Scenarios, variables, simulations, impact analysis

## Usage in Apps

### 1. Import Supabase Client
```typescript
import { supabase } from '@aesyros/supabase'
```

### 2. Use Authentication Hook
```typescript
import { useAuth } from '@aesyros/supabase'

function MyComponent() {
  const { user, signIn, signOut, loading } = useAuth()
  // ...
}
```

### 3. Query Data
```typescript
import { useSupabaseTable } from '@aesyros/supabase'

function ProjectsList() {
  const { data: projects, loading, error } = useSupabaseTable('drive_projects')
  // ...
}
```

### 4. Use Database Services
```typescript
import { driveProjectsService } from '@aesyros/supabase'

async function createProject(projectData) {
  const { data, error } = await driveProjectsService.create(projectData)
  return { data, error }
}
```

## Production Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your Project URL and API Key

### 2. Deploy Database Schema

1. Link your local project to remote:
   ```bash
   supabase link --project-ref your-project-id
   ```

2. Push migrations to production:
   ```bash
   supabase db push
   ```

3. Update environment variables:
   ```bash
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-production-anon-key
   ```

### 3. Configure Authentication

1. In Supabase Dashboard > Authentication > Settings
2. Configure your site URLs and redirect URLs
3. Enable desired auth providers (Google, GitHub, etc.)

### 4. Set Up Row Level Security (RLS)

The migrations include RLS policies for multi-tenant security. Each table is filtered by `company_id` to ensure data isolation.

## Common Commands

```bash
# Development
npm run db:start          # Start local Supabase
npm run db:stop           # Stop local Supabase
npm run db:reset          # Reset database with fresh schema and seed data
npm run db:generate-types # Generate TypeScript types from schema

# Production
supabase migration new <name>     # Create new migration
supabase db push                  # Push migrations to remote
supabase db pull                  # Pull schema changes from remote
```

## Authentication Flow

The suite uses Supabase Auth with the following flow:

1. **Sign Up**: Users register with email/password
2. **User Profile**: Automatic profile creation in `users` table
3. **Company Association**: Users are associated with companies
4. **Row Level Security**: All data is filtered by company_id

## Troubleshooting

### Common Issues

1. **Docker not running**: Ensure Docker Desktop is running before starting Supabase
2. **Port conflicts**: Check that ports 54321-54324 are available
3. **Environment variables**: Ensure `.env.local` is properly configured
4. **Migration errors**: Check migration files for syntax errors

### Useful Commands

```bash
# Check Supabase status
supabase status

# View logs
supabase logs

# Access database directly
supabase db shell
```

## Next Steps

1. **Set up authentication**: Configure auth providers and user management
2. **Add real-time subscriptions**: Use Supabase real-time for live updates
3. **Implement file storage**: Use Supabase Storage for file uploads
4. **Add edge functions**: Create serverless functions for complex operations
5. **Set up monitoring**: Configure logging and error tracking

For more detailed information, refer to the [Supabase Documentation](https://supabase.com/docs).