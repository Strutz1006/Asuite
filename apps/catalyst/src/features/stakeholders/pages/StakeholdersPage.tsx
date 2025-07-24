import { Users, Plus, Filter, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import StakeholderManager from '../components/StakeholderManager'

const stakeholders = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Department Head',
    department: 'Marketing',
    email: 'sarah.johnson@company.com',
    engagement: 'high',
    influence: 'high',
    support: 'champion',
    initiatives: 3,
    lastActivity: '2024-07-17',
    changeReadiness: 92,
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Team Lead',
    department: 'Engineering',
    email: 'michael.chen@company.com',
    engagement: 'high',
    influence: 'medium',
    support: 'supporter',
    initiatives: 2,
    lastActivity: '2024-07-16',
    changeReadiness: 88,
  },
  {
    id: '3',
    name: 'Lisa Rodriguez',
    role: 'Individual Contributor',
    department: 'Sales',
    email: 'lisa.rodriguez@company.com',
    engagement: 'medium',
    influence: 'low',
    support: 'neutral',
    initiatives: 1,
    lastActivity: '2024-07-15',
    changeReadiness: 65,
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'Manager',
    department: 'Operations',
    email: 'david.kim@company.com',
    engagement: 'low',
    influence: 'medium',
    support: 'resistant',
    initiatives: 2,
    lastActivity: '2024-07-14',
    changeReadiness: 45,
  },
  {
    id: '5',
    name: 'Amanda Foster',
    role: 'Director',
    department: 'HR',
    email: 'amanda.foster@company.com',
    engagement: 'high',
    influence: 'high',
    support: 'champion',
    initiatives: 4,
    lastActivity: '2024-07-17',
    changeReadiness: 95,
  },
]

const getSupportColor = (support: string) => {
  switch (support) {
    case 'champion':
      return 'bg-green-500/20 text-green-400'
    case 'supporter':
      return 'bg-blue-500/20 text-blue-400'
    case 'neutral':
      return 'bg-yellow-500/20 text-yellow-400'
    case 'resistant':
      return 'bg-red-500/20 text-red-400'
    default:
      return 'bg-slate-500/20 text-slate-400'
  }
}

const getEngagementColor = (engagement: string) => {
  switch (engagement) {
    case 'high':
      return 'bg-green-500/20 text-green-400'
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-400'
    case 'low':
      return 'bg-red-500/20 text-red-400'
    default:
      return 'bg-slate-500/20 text-slate-400'
  }
}

export default function StakeholdersPage() {
  return <StakeholderManager />
}