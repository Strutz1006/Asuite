import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Clock, Target, AlertTriangle, Calendar, CheckCircle } from 'lucide-react';
import { ProgressOverview } from '../components/ProgressOverview';
import { ProgressHistory } from '../components/ProgressHistory';
import { MilestoneTracker } from '../components/MilestoneTracker';
import { ProgressUpdateModal } from '../components/ProgressUpdateModal';

export function ProgressTrackingPage() {
  const [selectedView, setSelectedView] = useState('overview');
  const [filterPeriod, setFilterPeriod] = useState('current-quarter');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">Progress Tracking</h1>
          <p className="text-slate-400 mt-2">
            Real-time monitoring and analysis of goal progress across your organization
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Report
          </Button>
          <Button onClick={() => setIsUpdateModalOpen(true)}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Update Progress
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Overall Progress</CardTitle>
            <Target className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">73%</div>
            <p className="text-xs text-slate-400">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">On Track Goals</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">28</div>
            <p className="text-xs text-slate-400">Out of 42 total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">At Risk Goals</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">8</div>
            <p className="text-xs text-slate-400">Need attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Avg Velocity</CardTitle>
            <Clock className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">12%</div>
            <p className="text-xs text-slate-400">Per week</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Select value={filterPeriod} onValueChange={setFilterPeriod}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current-quarter">Current Quarter</SelectItem>
            <SelectItem value="last-quarter">Last Quarter</SelectItem>
            <SelectItem value="current-year">Current Year</SelectItem>
            <SelectItem value="last-30-days">Last 30 Days</SelectItem>
            <SelectItem value="last-90-days">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filterDepartment} onValueChange={setFilterDepartment}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="operations">Operations</SelectItem>
            <SelectItem value="hr">Human Resources</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedView} onValueChange={setSelectedView} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Progress Overview</TabsTrigger>
          <TabsTrigger value="history">Progress History</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" currentValue={selectedView} className="space-y-4">
          <ProgressOverview 
            filterPeriod={filterPeriod}
            filterDepartment={filterDepartment}
          />
        </TabsContent>

        <TabsContent value="history" currentValue={selectedView} className="space-y-4">
          <ProgressHistory 
            filterPeriod={filterPeriod}
            filterDepartment={filterDepartment}
          />
        </TabsContent>

        <TabsContent value="milestones" currentValue={selectedView} className="space-y-4">
          <MilestoneTracker 
            filterPeriod={filterPeriod}
            filterDepartment={filterDepartment}
          />
        </TabsContent>
      </Tabs>

      {/* Progress Update Modal */}
      <ProgressUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSubmit={(data) => {
          console.log('Progress update:', data);
          setIsUpdateModalOpen(false);
        }}
      />
    </div>
  );
}