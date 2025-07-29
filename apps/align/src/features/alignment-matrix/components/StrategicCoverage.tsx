import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Target } from 'lucide-react';

interface StrategicCoverageProps {
  filterLevel: string;
  filterDepartment: string;
}

export function StrategicCoverage({}: StrategicCoverageProps) {
  const strategicPillars = [
    {
      id: 1,
      name: 'Digital Transformation',
      coverage: 95,
      goalCount: 8,
      status: 'excellent',
      gaps: []
    },
    {
      id: 2,
      name: 'Customer Experience',
      coverage: 35,
      goalCount: 2,
      status: 'critical',
      gaps: ['Mobile app optimization', 'Customer feedback system']
    },
    {
      id: 3,
      name: 'Operational Excellence',
      coverage: 78,
      goalCount: 5,
      status: 'good',
      gaps: ['Process automation']
    },
    {
      id: 4,
      name: 'Market Expansion',
      coverage: 60,
      goalCount: 3,
      status: 'moderate',
      gaps: ['Local partnerships', 'Regulatory compliance']
    },
    {
      id: 5,
      name: 'Innovation & R&D',
      coverage: 88,
      status: 'excellent',
      goalCount: 6,
      gaps: []
    },
    {
      id: 6,
      name: 'Talent Development',
      coverage: 42,
      goalCount: 3,
      status: 'needs-attention',
      gaps: ['Succession planning', 'Skills assessment framework']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'needs-attention': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
      case 'good':
        return <CheckCircle className="h-4 w-4" />;
      case 'moderate':
      case 'needs-attention':
      case 'critical':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const getProgressColor = (coverage: number) => {
    if (coverage >= 80) return 'bg-green-500';
    if (coverage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Coverage Overview */}
      <div className="grid gap-4">
        {strategicPillars.map(pillar => (
          <Card key={pillar.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{pillar.name}</CardTitle>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(pillar.status)}`}>
                  {getStatusIcon(pillar.status)}
                  <span className="text-sm font-medium capitalize">
                    {pillar.status.replace('-', ' ')}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Coverage Progress</span>
                <span className="font-medium">{pillar.coverage}%</span>
              </div>
              <div className="relative">
                <Progress value={pillar.coverage} className="h-2" />
                <div 
                  className={`absolute top-0 left-0 h-2 rounded-full ${getProgressColor(pillar.coverage)}`}
                  style={{ width: `${pillar.coverage}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{pillar.goalCount} goals</Badge>
                </div>
                {pillar.gaps.length > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {pillar.gaps.length} gaps identified
                  </Badge>
                )}
              </div>

              {pillar.gaps.length > 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <span className="font-medium">Coverage gaps:</span> {pillar.gaps.join(', ')}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Coverage Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">2</div>
              <div className="text-sm text-muted-foreground">Excellently Covered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">2</div>
              <div className="text-sm text-muted-foreground">Need Attention</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">1</div>
              <div className="text-sm text-muted-foreground">Critical Gaps</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <span className="font-medium">Priority:</span> Create goals for Customer Experience pillar. 
                Only 35% coverage with critical gaps in mobile optimization and feedback systems.
              </AlertDescription>
            </Alert>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <span className="font-medium">Action needed:</span> Talent Development requires additional 
                goals for succession planning and skills assessment frameworks.
              </AlertDescription>
            </Alert>
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <span className="font-medium">Well covered:</span> Digital Transformation and Innovation 
                pillars have excellent goal alignment and coverage.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}