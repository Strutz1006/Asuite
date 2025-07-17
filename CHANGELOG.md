# Changelog

All notable changes to the Aesyros Suite project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Created complete Aesyros Suite monorepo structure with 6 enterprise applications
- Implemented Align app - Strategic goals and OKRs management
- Implemented Drive app - Task and project management  
- Implemented Pulse app - KPI tracking and analytics
- Implemented Catalyst app - Change management and stakeholder engagement
- Implemented Flow app - Process validation and compliance management
- Implemented Foresight app - Scenario planning and predictive analytics
- Added dual navigation system (suite-level + app-level) across all apps
- Implemented glass morphism design pattern throughout the suite
- Added responsive design with mobile menu support
- Created app-specific color themes:
  - Align: Emerald/Sky theme
  - Drive: Orange theme
  - Pulse: Blue theme  
  - Catalyst: Violet theme
  - Flow: Green theme
  - Foresight: Purple theme
- Added company message/slogan sections to all dashboards
- Implemented TypeScript support across all applications
- Added Tailwind CSS for consistent styling
- Integrated Lucide React icons
- Set up React Router for navigation
- Prepared Supabase integration
- Added CLAUDE.md configuration file for AI assistant settings

### Fixed
- Fixed UI consistency issues in Flow and Foresight apps
- Updated glass-card styling to match other apps (lighter backgrounds, stronger blur)
- Fixed darker appearance of navigation bars, sidebars, and cards in Flow/Foresight
- Standardized border colors and corner radius across all apps

### Changed
- Modified glass-card background from `bg-slate-900/20` to `bg-slate-800/60` in Flow/Foresight
- Updated backdrop blur from `backdrop-blur-sm` to `backdrop-blur-xl` for consistency
- Changed border styling from `border-slate-800/50` to `border-slate-700/80`
- Updated corner radius from `rounded-xl` to `rounded-2xl` 
- Added animation utilities and improved scrollbar styling

## [0.1.0] - 2024-07-17

### Initial Setup
- Created monorepo structure
- Set up base configuration files
- Established design system foundations