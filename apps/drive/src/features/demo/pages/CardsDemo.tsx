import { useState } from 'react'
import ProjectCard, { Project } from '../../projects/components/ProjectCard'
import TaskCard, { Task } from '../../tasks/components/TaskCard'

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign Project',
    description: 'Complete overhaul of the company website with modern design and improved user experience.',
    status: 'active',
    health: 'good',
    priority: 'high',
    owner: {
      id: '1',
      name: 'Sarah Chen',
    },
    alignGoal: {
      id: 'g1',
      title: 'Improve Digital Presence'
    },
    department: {
      id: 'd1',
      name: 'Marketing'
    },
    team: {
      id: 't1',
      name: 'Digital Team'
    },
    startDate: '2024-01-01',
    dueDate: '2024-06-30',
    budgetAllocated: 50000,
    budgetSpent: 18500,
    progressPercentage: 35,
    riskLevel: 'medium',
    tags: ['website', 'redesign', 'ux'],
    taskCount: 24,
    completedTaskCount: 8,
    teamMemberCount: 6
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Native iOS and Android apps for customer engagement.',
    status: 'planning',
    health: 'excellent',
    priority: 'medium',
    owner: {
      id: '2',
      name: 'Mike Rodriguez',
    },
    department: {
      id: 'd2',
      name: 'Engineering'
    },
    startDate: '2024-02-01',
    dueDate: '2024-08-15',
    budgetAllocated: 120000,
    budgetSpent: 5000,
    progressPercentage: 10,
    riskLevel: 'low',
    tags: ['mobile', 'ios', 'android'],
    taskCount: 0,
    completedTaskCount: 0,
    teamMemberCount: 8
  },
  {
    id: '3',
    name: 'Customer Portal Enhancement',
    description: 'Adding new features and improving performance of the customer portal.',
    status: 'active',
    health: 'at-risk',
    priority: 'critical',
    owner: {
      id: '3',
      name: 'Jennifer Liu',
    },
    alignGoal: {
      id: 'g2',
      title: 'Enhance Customer Experience'
    },
    team: {
      id: 't2',
      name: 'Platform Team'
    },
    startDate: '2023-11-01',
    dueDate: '2024-02-28',
    budgetAllocated: 75000,
    budgetSpent: 68000,
    progressPercentage: 78,
    riskLevel: 'high',
    tags: ['portal', 'enhancement', 'critical'],
    taskCount: 18,
    completedTaskCount: 14,
    teamMemberCount: 4
  }
]

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design new homepage layout',
    description: 'Create modern, responsive homepage design with improved navigation and call-to-action elements.',
    status: 'in-progress',
    priority: 'high',
    assignee: {
      id: '1',
      name: 'Alex Johnson',
    },
    project: {
      id: '1',
      name: 'Website Redesign Project'
    },
    alignGoal: {
      id: 'g1',
      title: 'Improve Digital Presence'
    },
    dueDate: '2024-02-15',
    estimatedHours: 16,
    actualHours: 8,
    progressPercentage: 60,
    tags: ['design', 'homepage'],
    commentCount: 5,
    attachmentCount: 3
  },
  {
    id: '2',
    title: 'Implement user authentication',
    description: 'Set up secure authentication system with OAuth2 and two-factor authentication support.',
    status: 'todo',
    priority: 'critical',
    assignee: {
      id: '2',
      name: 'Maria Garcia',
    },
    project: {
      id: '2',
      name: 'Mobile App Development'
    },
    dueDate: '2024-03-01',
    estimatedHours: 40,
    progressPercentage: 0,
    tags: ['backend', 'security', 'auth'],
    dependencies: ['3', '4'],
    isBlocked: true
  },
  {
    id: '3',
    title: 'Fix performance issues in dashboard',
    description: 'Optimize database queries and implement caching to improve dashboard loading times.',
    status: 'review',
    priority: 'high',
    assignee: {
      id: '3',
      name: 'David Kim',
    },
    project: {
      id: '3',
      name: 'Customer Portal Enhancement'
    },
    dueDate: '2024-01-20',
    estimatedHours: 8,
    actualHours: 12,
    progressPercentage: 90,
    tags: ['performance', 'optimization'],
    commentCount: 12,
    attachmentCount: 2,
    isOverdue: true
  },
  {
    id: '4',
    title: 'Write user documentation',
    description: 'Create comprehensive user guide for the new features.',
    status: 'done',
    priority: 'medium',
    assignee: {
      id: '4',
      name: 'Emma Wilson',
    },
    completionDate: '2024-01-10',
    estimatedHours: 12,
    actualHours: 10,
    progressPercentage: 100,
    tags: ['documentation'],
    commentCount: 3
  }
]

export default function CardsDemo() {
  const [selectedProjectVariant, setSelectedProjectVariant] = useState<'default' | 'compact'>('default')
  const [selectedTaskVariant, setSelectedTaskVariant] = useState<'default' | 'compact' | 'kanban'>('default')

  const handleProjectStatusChange = (project: Project, status: Project['status']) => {
    console.log('Project status changed:', project.name, status)
  }

  const handleTaskStatusChange = (task: Task, status: Task['status']) => {
    console.log('Task status changed:', task.title, status)
  }

  return (
    <div className="space-y-8 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Drive Cards Demo</h1>
        <p className="text-slate-400">Showcase of Project and Task card components</p>
      </div>

      {/* Project Cards Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-100">Project Cards</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedProjectVariant('default')}
              className={`glass-button px-4 py-2 ${
                selectedProjectVariant === 'default' 
                  ? 'text-orange-400 bg-orange-500/20' 
                  : 'text-slate-400'
              }`}
            >
              Default
            </button>
            <button
              onClick={() => setSelectedProjectVariant('compact')}
              className={`glass-button px-4 py-2 ${
                selectedProjectVariant === 'compact' 
                  ? 'text-orange-400 bg-orange-500/20' 
                  : 'text-slate-400'
              }`}
            >
              Compact
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {mockProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              variant={selectedProjectVariant}
              onStatusChange={handleProjectStatusChange}
              onEdit={(p) => console.log('Edit project:', p.name)}
            />
          ))}
        </div>
      </section>

      {/* Task Cards Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-100">Task Cards</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedTaskVariant('default')}
              className={`glass-button px-4 py-2 ${
                selectedTaskVariant === 'default' 
                  ? 'text-orange-400 bg-orange-500/20' 
                  : 'text-slate-400'
              }`}
            >
              Default
            </button>
            <button
              onClick={() => setSelectedTaskVariant('compact')}
              className={`glass-button px-4 py-2 ${
                selectedTaskVariant === 'compact' 
                  ? 'text-orange-400 bg-orange-500/20' 
                  : 'text-slate-400'
              }`}
            >
              Compact
            </button>
            <button
              onClick={() => setSelectedTaskVariant('kanban')}
              className={`glass-button px-4 py-2 ${
                selectedTaskVariant === 'kanban' 
                  ? 'text-orange-400 bg-orange-500/20' 
                  : 'text-slate-400'
              }`}
            >
              Kanban
            </button>
          </div>
        </div>

        <div className={selectedTaskVariant === 'kanban' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
          {mockTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              variant={selectedTaskVariant}
              onStatusChange={handleTaskStatusChange}
              onEdit={(t) => console.log('Edit task:', t.title)}
              showProject={true}
            />
          ))}
        </div>
      </section>

      {/* Mixed View Example */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-100">Mixed View Example</h2>
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Website Redesign Project</h3>
          
          {/* Project Summary */}
          <ProjectCard
            project={mockProjects[0]}
            variant="compact"
            onStatusChange={handleProjectStatusChange}
          />
          
          {/* Related Tasks */}
          <div className="mt-6">
            <h4 className="font-medium text-slate-200 mb-3">Related Tasks</h4>
            <div className="space-y-2">
              {mockTasks
                .filter(task => task.project?.id === '1')
                .map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    variant="compact"
                    onStatusChange={handleTaskStatusChange}
                    showProject={false}
                  />
                ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}