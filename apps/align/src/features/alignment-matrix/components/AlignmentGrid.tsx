import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface AlignmentGridProps {
  filterLevel: string;
  filterDepartment: string;
}

export function AlignmentGrid({ filterLevel, filterDepartment }: AlignmentGridProps) {
  // Mock data for strategic pillars and goals
  const strategicPillars = [
    { id: 1, name: 'Digital Transformation', shortName: 'Digital' },
    { id: 2, name: 'Customer Experience', shortName: 'Customer' },
    { id: 3, name: 'Operational Excellence', shortName: 'Operations' },
    { id: 4, name: 'Market Expansion', shortName: 'Market' },
    { id: 5, name: 'Innovation & R&D', shortName: 'Innovation' },
    { id: 6, name: 'Talent Development', shortName: 'Talent' }
  ];

  const goals = [
    { 
      id: 1, 
      name: 'Implement Cloud Infrastructure', 
      department: 'engineering',
      level: 'department',
      alignments: { 1: 'strong', 3: 'medium' }
    },
    { 
      id: 2, 
      name: 'Launch Customer Portal 2.0', 
      department: 'engineering',
      level: 'company',
      alignments: { 1: 'strong', 2: 'strong' }
    },
    { 
      id: 3, 
      name: 'Reduce Response Time by 50%', 
      department: 'operations',
      level: 'department',
      alignments: { 2: 'strong', 3: 'strong' }
    },
    { 
      id: 4, 
      name: 'Enter Asian Markets', 
      department: 'sales',
      level: 'company',
      alignments: { 4: 'strong', 5: 'weak' }
    },
    { 
      id: 5, 
      name: 'AI-Powered Analytics', 
      department: 'engineering',
      level: 'team',
      alignments: { 1: 'medium', 5: 'strong' }
    },
    { 
      id: 6, 
      name: 'Leadership Training Program', 
      department: 'hr',
      level: 'department',
      alignments: { 6: 'strong', 3: 'weak' }
    }
  ];

  // Filter goals based on selected filters
  const filteredGoals = goals.filter(goal => {
    if (filterLevel !== 'all' && goal.level !== filterLevel) return false;
    if (filterDepartment !== 'all' && goal.department !== filterDepartment) return false;
    return true;
  });

  const getAlignmentColor = (strength?: string) => {
    switch (strength) {
      case 'strong': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'weak': return 'bg-orange-500';
      default: return 'bg-gray-100';
    }
  };

  const getAlignmentLabel = (strength?: string) => {
    switch (strength) {
      case 'strong': return 'Strong';
      case 'medium': return 'Medium';
      case 'weak': return 'Weak';
      default: return 'None';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left p-3 border-b font-medium">Goals</th>
            {strategicPillars.map(pillar => (
              <th key={pillar.id} className="text-center p-3 border-b font-medium min-w-[100px]">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="cursor-help">
                      {pillar.shortName}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{pillar.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredGoals.map(goal => (
            <tr key={goal.id} className="hover:bg-gray-50">
              <td className="p-3 border-b">
                <div className="space-y-1">
                  <p className="font-medium">{goal.name}</p>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {goal.department}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {goal.level}
                    </Badge>
                  </div>
                </div>
              </td>
              {strategicPillars.map(pillar => {
                const alignment = goal.alignments[pillar.id as keyof typeof goal.alignments];
                return (
                  <td key={pillar.id} className="p-3 border-b text-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div
                            className={cn(
                              'w-8 h-8 rounded-full mx-auto',
                              getAlignmentColor(alignment)
                            )}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Alignment: {getAlignmentLabel(alignment)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {filteredGoals.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No goals match the selected filters
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 flex items-center gap-6 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500" />
          <span className="text-sm">Strong Alignment</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-500" />
          <span className="text-sm">Medium Alignment</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-orange-500" />
          <span className="text-sm">Weak Alignment</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-100" />
          <span className="text-sm">No Alignment</span>
        </div>
      </div>
    </div>
  );
}