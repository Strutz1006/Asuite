import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlignLeft, Target, GitBranch, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AlignmentGrid } from '../components/AlignmentGrid';
import { StrategicCoverage } from '../components/StrategicCoverage';
import { DependencyMap } from '../components/DependencyMap';

export function AlignmentMatrixPage() {
  const [selectedView, setSelectedView] = useState('matrix');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alignment Matrix</h1>
          <p className="text-muted-foreground mt-2">
            Visualize how goals align with strategic objectives across your organization
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <GitBranch className="h-4 w-4 mr-2" />
            Export View
          </Button>
          <Button>
            <Target className="h-4 w-4 mr-2" />
            Analyze Gaps
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alignment Score</CardTitle>
            <AlignLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">+5% from last quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Strategic Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">Across 6 pillars</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coverage Gaps</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Strategic areas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dependencies</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Cross-functional</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Select value={filterLevel} onValueChange={setFilterLevel}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="company">Company</SelectItem>
            <SelectItem value="department">Department</SelectItem>
            <SelectItem value="team">Team</SelectItem>
            <SelectItem value="individual">Individual</SelectItem>
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
          <TabsTrigger value="matrix">Alignment Matrix</TabsTrigger>
          <TabsTrigger value="coverage">Strategic Coverage</TabsTrigger>
          <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
        </TabsList>

        <TabsContent value="matrix" currentValue={selectedView} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Goal-Strategy Alignment Matrix</CardTitle>
              <CardDescription>
                Shows how operational goals align with strategic objectives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlignmentGrid 
                filterLevel={filterLevel}
                filterDepartment={filterDepartment}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coverage" currentValue={selectedView} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Strategic Coverage Analysis</CardTitle>
              <CardDescription>
                Identifies gaps and overlaps in strategic objective coverage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StrategicCoverage 
                filterLevel={filterLevel}
                filterDepartment={filterDepartment}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dependencies" currentValue={selectedView} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cross-Functional Dependencies</CardTitle>
              <CardDescription>
                Visualizes dependencies between goals across departments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DependencyMap 
                filterLevel={filterLevel}
                filterDepartment={filterDepartment}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Insights Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Alignment Insights</CardTitle>
          <CardDescription>Key findings and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Strong alignment in Engineering</p>
                <p className="text-sm text-muted-foreground">
                  95% of engineering goals directly support digital transformation initiatives
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="font-medium">Customer Experience gap identified</p>
                <p className="text-sm text-muted-foreground">
                  Only 2 goals currently address the "Enhance Customer Experience" strategic pillar
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="font-medium">High dependency risk in Q4 planning</p>
                <p className="text-sm text-muted-foreground">
                  Marketing campaign launch depends on 3 engineering deliverables with tight deadlines
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}