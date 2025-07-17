export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'admin' | 'manager' | 'member'
  createdAt: string
  updatedAt: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  description?: string
  logo?: string
  createdAt: string
  updatedAt: string
}

export interface Goal {
  id: string
  title: string
  description: string
  status: 'draft' | 'active' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'critical'
  category: 'strategic' | 'operational' | 'financial' | 'customer' | 'learning'
  progress: number
  startDate: string
  dueDate: string
  ownerId: string
  organizationId: string
  createdAt: string
  updatedAt: string
}

export interface KeyResult {
  id: string
  goalId: string
  title: string
  description?: string
  target: number
  current: number
  unit: string
  progress: number
  status: 'not-started' | 'on-track' | 'at-risk' | 'completed'
  createdAt: string
  updatedAt: string
}

export interface ProgressUpdate {
  id: string
  goalId: string
  keyResultId?: string
  value: number
  note?: string
  userId: string
  createdAt: string
}