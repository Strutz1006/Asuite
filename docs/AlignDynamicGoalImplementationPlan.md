# Align App: Dynamic Goal Visualization Implementation Plan

## Overview
This document outlines the implementation plan for adding Dynamic Goal Visualization and Management features to the Align app, including Interactive Goal Hierarchy and SMART/OKR framework components.

## 1. Interactive Goal Hierarchy Visualization

### 1.1 Visualization Options

#### A. Tree Visualization (Primary)
- **Library**: React Flow or D3.js
- **Features**:
  - Collapsible/expandable nodes
  - Drag-and-drop to reorganize hierarchy
  - Zoom and pan controls
  - Node color coding by level/status
  - Progress indicators on nodes
  - Connection lines showing relationships

#### B. Sunburst Chart (Alternative View)
- **Library**: D3.js or Recharts
- **Features**:
  - Radial hierarchy visualization
  - Click to zoom into sections
  - Progress shown as arc fill
  - Tooltips with goal details

#### C. Mind Map View (Creative Mode)
- **Library**: React Mind Map or custom D3
- **Features**:
  - Central corporate goals branching out
  - Organic layout for brainstorming
  - Real-time collaboration indicators

### 1.2 Implementation Components

```
src/features/objectives/
├── components/
│   ├── visualizations/
│   │   ├── GoalTree/
│   │   │   ├── GoalTree.tsx
│   │   │   ├── GoalNode.tsx
│   │   │   ├── GoalConnection.tsx
│   │   │   └── TreeControls.tsx
│   │   ├── GoalSunburst/
│   │   │   ├── GoalSunburst.tsx
│   │   │   └── SunburstTooltip.tsx
│   │   └── GoalMindMap/
│   │       ├── GoalMindMap.tsx
│   │       └── MindMapNode.tsx
│   ├── VisualizationToggle.tsx
│   └── GoalVisualizationContainer.tsx
├── hooks/
│   ├── useGoalHierarchy.ts
│   ├── useVisualizationState.ts
│   └── useGoalDragDrop.ts
└── utils/
    ├── hierarchyTransformers.ts
    └── visualizationHelpers.ts
```

### 1.3 Key Features Implementation

#### Drag-and-Drop Reorganization
```typescript
interface DragDropHandlers {
  onNodeDragStart: (nodeId: string) => void;
  onNodeDragOver: (targetId: string) => boolean;
  onNodeDrop: (sourceId: string, targetId: string) => Promise<void>;
  validateDrop: (source: Objective, target: Objective) => boolean;
}
```

#### Real-time Updates
- WebSocket connection for live updates
- Optimistic UI updates with rollback
- Conflict resolution for concurrent edits

#### Performance Optimization
- Virtual rendering for large hierarchies (>100 nodes)
- Progressive loading of child nodes
- Memoization of expensive calculations
- Web Workers for layout calculations

## 2. SMART and OKR Framework Components

### 2.1 Unified Goal Creation Wizard

#### Component Structure
```
src/features/objectives/
├── components/
│   ├── GoalWizard/
│   │   ├── GoalWizard.tsx
│   │   ├── FrameworkSelector.tsx
│   │   ├── SMARTGoalForm.tsx
│   │   ├── OKRForm.tsx
│   │   ├── HybridGoalForm.tsx
│   │   └── GoalPreview.tsx
│   ├── validators/
│   │   ├── SMARTValidator.tsx
│   │   └── OKRValidator.tsx
│   └── templates/
│       ├── GoalTemplates.tsx
│       └── templateData.ts
```

### 2.2 SMART Goal Components

#### SMART Goal Builder
```typescript
interface SMARTGoal {
  specific: {
    what: string;
    who: string[];
    where?: string;
    why: string;
  };
  measurable: {
    metrics: Array<{
      name: string;
      currentValue: number;
      targetValue: number;
      unit: string;
    }>;
    trackingMethod: 'manual' | 'automated' | 'integrated';
  };
  achievable: {
    resources: string[];
    constraints: string[];
    dependencies: string[];
    feasibilityScore?: number; // AI-calculated
  };
  relevant: {
    alignmentScore: number; // How well it aligns with parent goals
    strategicPillars: string[];
    businessImpact: 'high' | 'medium' | 'low';
  };
  timeBound: {
    startDate: Date;
    endDate: Date;
    milestones: Array<{
      date: Date;
      description: string;
      deliverable: string;
    }>;
  };
}
```

#### SMART Validation UI
- Real-time validation indicators
- Guided prompts for each component
- AI-powered suggestions
- Progress indicators for completeness

### 2.3 OKR Framework Components

#### OKR Builder
```typescript
interface OKRObjective {
  id: string;
  title: string;
  description: string;
  type: 'aspirational' | 'committed' | 'learning';
  quarter: string;
  owner: User;
  keyResults: KeyResult[];
  confidence: number; // 0-100%
}

interface KeyResult {
  id: string;
  title: string;
  type: 'quantitative' | 'qualitative' | 'binary';
  startValue: number | string;
  currentValue: number | string;
  targetValue: number | string;
  unit?: string;
  updateFrequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
  dataSource?: 'manual' | 'api' | 'integration';
  initiatives: Initiative[];
}
```

#### OKR Features
- Confidence level tracking
- Check-in scheduling
- Initiative linking
- OKR scoring (Google's 0.0-1.0 scale)
- Cascade visualization

### 2.4 Hybrid Model Support

#### Hybrid Goal Interface
```typescript
interface HybridGoal extends Partial<SMARTGoal>, Partial<OKRObjective> {
  framework: 'SMART' | 'OKR' | 'HYBRID';
  conversionHistory?: Array<{
    from: 'SMART' | 'OKR';
    to: 'SMART' | 'OKR';
    date: Date;
    reason: string;
  }>;
}
```

## 3. Data Model Enhancements

### 3.1 Extended Objective Model
```typescript
interface EnhancedObjective extends Objective {
  // Existing fields...
  
  // New fields for visualization
  position?: { x: number; y: number }; // For manual positioning
  visualizationMeta?: {
    color?: string;
    icon?: string;
    size?: 'small' | 'medium' | 'large';
    expanded?: boolean;
  };
  
  // SMART/OKR fields
  framework: 'SMART' | 'OKR' | 'HYBRID' | 'BASIC';
  smartData?: SMARTGoal;
  okrData?: OKRObjective;
  
  // Relationship enhancements
  relatedGoals?: string[]; // Cross-functional dependencies
  blockers?: string[]; // Goals that block this one
  enables?: string[]; // Goals this enables
  
  // Collaboration
  contributors?: string[];
  watchers?: string[];
  comments?: Comment[];
  
  // Analytics
  viewCount?: number;
  lastModified?: Date;
  modificationHistory?: ModificationEvent[];
}
```

### 3.2 Database Schema Updates
```sql
-- New tables for enhanced features
CREATE TABLE goal_relationships (
  id UUID PRIMARY KEY,
  source_goal_id UUID REFERENCES align_objectives(id),
  target_goal_id UUID REFERENCES align_objectives(id),
  relationship_type ENUM('blocks', 'enables', 'related'),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE goal_visualization_state (
  goal_id UUID PRIMARY KEY REFERENCES align_objectives(id),
  position_x FLOAT,
  position_y FLOAT,
  expanded BOOLEAN DEFAULT true,
  custom_color VARCHAR(7),
  custom_icon VARCHAR(50),
  last_updated TIMESTAMP DEFAULT NOW()
);

CREATE TABLE smart_goal_data (
  goal_id UUID PRIMARY KEY REFERENCES align_objectives(id),
  specific_data JSONB,
  measurable_data JSONB,
  achievable_data JSONB,
  relevant_data JSONB,
  time_bound_data JSONB
);

CREATE TABLE okr_data (
  objective_id UUID PRIMARY KEY REFERENCES align_objectives(id),
  type VARCHAR(20),
  quarter VARCHAR(10),
  confidence INTEGER,
  scoring_method VARCHAR(20)
);
```

## 4. API Endpoints

### 4.1 Visualization APIs
```typescript
// Get hierarchy with visualization data
GET /api/align/objectives/hierarchy?view=tree&depth=all
Response: {
  nodes: EnhancedObjective[],
  edges: Relationship[],
  layout: LayoutData
}

// Update node position
PATCH /api/align/objectives/:id/position
Body: { x: number, y: number }

// Bulk update hierarchy
POST /api/align/objectives/reorganize
Body: { 
  moves: Array<{ nodeId: string, newParentId: string }> 
}
```

### 4.2 SMART/OKR APIs
```typescript
// Validate SMART goal
POST /api/align/goals/validate-smart
Body: SMARTGoal
Response: { 
  valid: boolean, 
  issues: ValidationIssue[],
  suggestions: Suggestion[] 
}

// Convert between frameworks
POST /api/align/goals/:id/convert
Body: { 
  from: 'SMART' | 'OKR',
  to: 'SMART' | 'OKR',
  preserveData: boolean 
}

// Get framework templates
GET /api/align/templates?framework=SMART&category=sales

// AI-powered goal suggestions
POST /api/align/goals/suggest
Body: { 
  context: string,
  parentGoalId?: string,
  framework: 'SMART' | 'OKR' 
}
```

## 5. Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
- [ ] Set up visualization libraries
- [ ] Create base visualization components
- [ ] Implement data transformers
- [ ] Add visualization toggle to existing UI

### Phase 2: Tree Visualization (Weeks 3-4)
- [ ] Implement interactive tree view
- [ ] Add drag-and-drop functionality
- [ ] Create node customization options
- [ ] Add zoom/pan controls

### Phase 3: SMART Framework (Weeks 5-6)
- [ ] Build SMART goal wizard
- [ ] Implement SMART validators
- [ ] Create guided forms
- [ ] Add AI suggestions

### Phase 4: OKR Framework (Weeks 7-8)
- [ ] Build OKR creation flow
- [ ] Implement key result tracking
- [ ] Add confidence scoring
- [ ] Create check-in system

### Phase 5: Integration & Polish (Weeks 9-10)
- [ ] Integrate all components
- [ ] Add alternative visualizations
- [ ] Performance optimization
- [ ] User testing and refinement

## 6. Technical Considerations

### Performance
- Lazy load visualization libraries
- Use React.memo for node components
- Implement virtual scrolling for large trees
- Cache layout calculations

### Accessibility
- Keyboard navigation for tree
- Screen reader support
- High contrast mode
- Focus management

### Mobile Responsiveness
- Touch-friendly interactions
- Simplified mobile views
- Gesture support for zoom/pan
- Responsive forms

## 7. Success Metrics

- **Adoption**: 80% of users interact with visualizations weekly
- **Efficiency**: 40% reduction in goal creation time
- **Quality**: 90% of goals pass SMART validation
- **Engagement**: 3x increase in goal updates/check-ins
- **Alignment**: 95% of goals properly linked to parent objectives

## 8. Future Enhancements

- AI-powered goal recommendations
- Predictive success scoring
- Integration with external tools (Jira, Asana)
- Advanced analytics dashboard
- Collaborative real-time editing
- Goal marketplace/templates