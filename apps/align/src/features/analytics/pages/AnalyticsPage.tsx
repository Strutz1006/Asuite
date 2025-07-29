import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Calendar, 
  Users, 
  Download,
  RefreshCw,
  Filter,
  PieChart,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { PerformanceMetrics } from '../components/PerformanceMetrics';
import { ProgressTrends } from '../components/ProgressTrends';
import { GoalAnalysis } from '../components/GoalAnalysis';
import { TeamPerformance } from '../components/TeamPerformance';
import { PredictiveAnalytics } from '../components/PredictiveAnalytics';

export default function AnalyticsPage() {
  const [selectedView, setSelectedView] = useState('overview');
  const [timePeriod, setTimePeriod] = useState('current-quarter');
  const [department, setDepartment] = useState('all');

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">Analytics Dashboard</h1>
          <p className="text-slate-400 mt-2">
            Comprehensive insights and performance analysis for your organization's goals
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Filter className="h-4 w-4 mr-2" />
            Custom Report
          </Button>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total Goals</CardTitle>
            <Target className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">42</div>
            <p className="text-xs text-slate-400">+4 this quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Completion Rate</CardTitle>
            <PieChart className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">74%</div>
            <p className="text-xs text-green-400">+8.1% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Avg Progress</CardTitle>
            <Activity className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">68%</div>
            <p className="text-xs text-green-400">+5.4% improvement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">At Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">8</div>
            <p className="text-xs text-red-400">Need attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium textslate-200">Teams Active</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">6</div>
            <p className="text-xs text-slate-400">All departments</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Select value={timePeriod} onValueChange={setTimePeriod}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current-quarter">Current Quarter</SelectItem>
            <SelectItem value="last-quarter">Last Quarter</SelectItem>
            <SelectItem value="current-year">Current Year</SelectItem>
            <SelectItem value="last-30-days">Last 30 Days</SelectItem>
            <SelectItem value="last-90-days">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={department} onValueChange={setDepartment}>
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

      {/* Main Analytics Tabs */}
      <Tabs value={selectedView} onValueChange={setSelectedView} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Performance Overview</TabsTrigger>
          <TabsTrigger value="trends">Progress Trends</TabsTrigger>
          <TabsTrigger value="analysis">Goal Analysis</TabsTrigger>
          <TabsTrigger value="teams">Team Performance</TabsTrigger>
          <TabsTrigger value="predictions">Predictive Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" currentValue={selectedView} className="space-y-4">
          <PerformanceMetrics 
            timePeriod={timePeriod}
            department={department}
          />
        </TabsContent>

        <TabsContent value="trends" currentValue={selectedView} className="space-y-4">
          <ProgressTrends 
            timePeriod={timePeriod}
            department={department}
          />
        </TabsContent>

        <TabsContent value="analysis" currentValue={selectedView} className="space-y-4">
          <GoalAnalysis 
            timePeriod={timePeriod}
            department={department}
          />
        </TabsContent>

        <TabsContent value="teams" currentValue={selectedView} className="space-y-4">
          <TeamPerformance 
            timePeriod={timePeriod}
            department={department}
          />
        </TabsContent>

        <TabsContent value="predictions" currentValue={selectedView} className="space-y-4">
          <PredictiveAnalytics 
            timePeriod={timePeriod}
            department={department}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}