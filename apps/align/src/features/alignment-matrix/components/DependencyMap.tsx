import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowRight, AlertTriangle, Clock, Users } from 'lucide-react';

interface DependencyMapProps {
  filterLevel: string;
  filterDepartment: string;
}

export function DependencyMap({ filterDepartment }: DependencyMapProps) {
  const dependencies = [
    {
      id: 1,
      sourceGoal: 'Launch Customer Portal 2.0',
      sourceDepartment: 'engineering',
      targetGoal: 'Increase Customer Satisfaction by 25%',
      targetDepartment: 'sales',
      type: 'blocking',
      strength: 'critical',
      timeline: '2 weeks',
      status: 'at-risk'
    },
    {
      id: 2,
      sourceGoal: 'Implement Cloud Infrastructure',
      sourceDepartment: 'engineering',
      targetGoal: 'Scale Operations to 50k Users',
      targetDepartment: 'operations',
      type: 'enabling',
      strength: 'high',
      timeline: '1 month',
      status: 'on-track'
    },
    {
      id: 3,
      sourceGoal: 'AI-Powered Analytics',
      sourceDepartment: 'engineering',
      targetGoal: 'Personalized Marketing Campaigns',
      targetDepartment: 'marketing',
      type: 'supporting',
      strength: 'medium',
      timeline: '6 weeks',
      status: 'on-track'
    },
    {
      id: 4,
      sourceGoal: 'Leadership Training Program',
      sourceDepartment: 'hr',
      targetGoal: 'Improve Team Productivity by 20%',
      targetDepartment: 'operations',
      type: 'enabling',
      strength: 'medium',
      timeline: '3 months',
      status: 'planned'
    },
    {
      id: 5,
      sourceGoal: 'Enter Asian Markets',
      sourceDepartment: 'sales',
      targetGoal: 'Localize Product Features',
      targetDepartment: 'engineering',
      type: 'requiring',
      strength: 'high',
      timeline: '8 weeks',
      status: 'at-risk'
    }
  ];

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'at-risk': return 'bg-red-50 border-red-200';
      case 'on-track': return 'bg-green-50 border-green-200';
      case 'planned': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'blocking': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'enabling': return <ArrowRight className="h-4 w-4 text-blue-500" />;
      case 'supporting': return <Users className="h-4 w-4 text-green-500" />;
      case 'requiring': return <Clock className="h-4 w-4 text-orange-500" />;
      default: return <ArrowRight className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredDependencies = dependencies.filter(dep => {
    if (filterDepartment !== 'all') {
      return dep.sourceDepartment === filterDepartment || dep.targetDepartment === filterDepartment;
    }
    return true;
  });

  const departmentStats = {
    engineering: { outgoing: 3, incoming: 1, critical: 1 },
    sales: { outgoing: 1, incoming: 1, critical: 0 },
    operations: { outgoing: 0, incoming: 2, critical: 0 },
    marketing: { outgoing: 0, incoming: 1, critical: 0 },
    hr: { outgoing: 1, incoming: 0, critical: 0 }
  };

  return (
    <div className="space-y-6">
      {/* Department Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(departmentStats).map(([dept, stats]) => (
          <Card key={dept}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base capitalize">{dept}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Outgoing dependencies</span>
                  <span className="font-medium">{stats.outgoing}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Incoming dependencies</span>
                  <span className="font-medium">{stats.incoming}</span>
                </div>
                {stats.critical > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Critical dependencies</span>
                    <Badge variant="destructive" className="text-xs">
                      {stats.critical}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dependencies List */}
      <div className="space-y-4">
        {filteredDependencies.map(dependency => (
          <Card key={dependency.id} className={`border-l-4 ${getStatusColor(dependency.status)}`}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(dependency.type)}
                    <span className="text-sm font-medium capitalize">{dependency.type} Dependency</span>
                    <Badge className={getStrengthColor(dependency.strength)}>
                      {dependency.strength}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Source Goal</div>
                      <div className="font-medium">{dependency.sourceGoal}</div>
                      <Badge variant="outline" className="text-xs">
                        {dependency.sourceDepartment}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Target Goal</div>
                      <div className="font-medium">{dependency.targetGoal}</div>
                      <Badge variant="outline" className="text-xs">
                        {dependency.targetDepartment}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Timeline: {dependency.timeline}</span>
                    <span>Status: <span className="capitalize">{dependency.status.replace('-', ' ')}</span></span>
                  </div>
                </div>
                
                <ArrowRight className="h-5 w-5 text-muted-foreground mt-8" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDependencies.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No dependencies match the selected filters
        </div>
      )}

      {/* Risk Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Dependency Risk Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <span className="font-medium">High Risk:</span> Customer Portal 2.0 launch is critical 
                for sales team's customer satisfaction goal. Current timeline shows 2-week dependency 
                that's currently at risk.
              </AlertDescription>
            </Alert>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <span className="font-medium">Resource Bottleneck:</span> Engineering team has 3 outgoing 
                dependencies with 1 critical priority. Consider resource allocation review.
              </AlertDescription>
            </Alert>
            
            <Alert className="border-green-200 bg-green-50">
              <Users className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <span className="font-medium">Recommendation:</span> Cloud infrastructure and AI analytics 
                dependencies are on track and will enable multiple downstream goals.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Dependency Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm">Blocking</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Enabling</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-500" />
              <span className="text-sm">Supporting</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-sm">Requiring</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}