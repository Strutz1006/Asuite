import { useState } from 'react'
import { 
  BookOpen, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Users,
  Zap,
  BarChart3,
  GitBranch,
  Layers
} from 'lucide-react'

export interface ChangeModel {
  id: string
  name: string
  author: string
  year: number
  description: string
  phases: ModelPhase[]
  pros: string[]
  cons: string[]
  bestFor: string[]
  icon: any
  color: string
}

export interface ModelPhase {
  id: string
  name: string
  description: string
  keyActivities: string[]
  outcomes: string[]
  order: number
}

const changeModels: ChangeModel[] = [
  {
    id: 'kotter',
    name: "Kotter's 8-Step Process",
    author: 'John Kotter',
    year: 1996,
    description: 'A comprehensive 8-step process for leading change, emphasizing urgency, coalition building, and anchoring change in culture.',
    icon: TrendingUp,
    color: 'purple',
    phases: [
      {
        id: 'urgency',
        name: 'Create Urgency',
        description: 'Help others see the need for change through a bold, aspirational opportunity statement that communicates the importance of acting immediately.',
        keyActivities: [
          'Identify potential threats and develop scenarios',
          'Examine opportunities that can be exploited',
          'Start honest discussions and give dynamic reasons to get people talking',
          'Request support from stakeholders and industry leaders'
        ],
        outcomes: ['75% of management convinced change is necessary'],
        order: 1
      },
      {
        id: 'coalition',
        name: 'Build a Guiding Coalition',
        description: 'Assemble a group with enough power to lead the change effort and encourage the group to work as a team.',
        keyActivities: [
          'Identify key stakeholders and leaders',
          'Form a powerful change coalition',
          'Get commitment from these key people',
          'Build emotional commitment to the change'
        ],
        outcomes: ['Strong leadership team formed', 'Coalition working outside normal hierarchy'],
        order: 2
      },
      {
        id: 'vision',
        name: 'Form a Strategic Vision',
        description: 'Create a vision to help direct the change effort and develop strategies for achieving that vision.',
        keyActivities: [
          'Determine the values central to the change',
          'Develop a short summary of the future',
          'Create a strategy to execute the vision',
          'Ensure coalition members can describe vision in 5 minutes'
        ],
        outcomes: ['Clear vision statement', 'Executable strategy'],
        order: 3
      },
      {
        id: 'enlist',
        name: 'Enlist a Volunteer Army',
        description: 'Communicate the vision throughout the organization and get as many people as possible acting in the same direction.',
        keyActivities: [
          'Communicate vision frequently and powerfully',
          'Use every vehicle possible to communicate',
          'Lead by example',
          'Address peoples anxieties openly and honestly'
        ],
        outcomes: ['Vision understood by majority', 'Volunteers stepping forward'],
        order: 4
      },
      {
        id: 'empower',
        name: 'Enable Action',
        description: 'Remove obstacles to change, change systems or structures undermining the vision, and encourage risk-taking.',
        keyActivities: [
          'Identify and remove barriers',
          'Change structures that undermine the vision',
          'Empower people to take action',
          'Recognize and reward early adopters'
        ],
        outcomes: ['Barriers removed', 'Risk-taking encouraged'],
        order: 5
      },
      {
        id: 'wins',
        name: 'Generate Short-Term Wins',
        description: 'Plan for and achieve visible performance improvements and recognize those involved in the improvements.',
        keyActivities: [
          'Look for sure-fire projects to implement',
          'Set up goals that are achievable',
          'Thoroughly analyze potential pros and cons of targets',
          'Reward people who help meet targets'
        ],
        outcomes: ['Early wins achieved', 'Momentum building'],
        order: 6
      },
      {
        id: 'sustain',
        name: 'Sustain Acceleration',
        description: 'Use increased credibility from early wins to change systems, structures, and policies undermining the vision.',
        keyActivities: [
          'Analyze what went right and what needs improving',
          'Set goals to continue building on momentum',
          'Keep ideas fresh by bringing in additional agents',
          'Build on the change with continuous improvement'
        ],
        outcomes: ['Change deepening', 'More people involved'],
        order: 7
      },
      {
        id: 'institute',
        name: 'Institute Change',
        description: 'Anchor new approaches in organizational culture for sustained change.',
        keyActivities: [
          'Reinforce changes through success stories',
          'Create plans to replace key leaders',
          'Ensure new behaviors lead to success',
          'Make connections between behaviors and success explicit'
        ],
        outcomes: ['Change anchored in culture', 'New way becomes "the way"'],
        order: 8
      }
    ],
    pros: [
      'Comprehensive and well-tested framework',
      'Clear sequential steps provide structure',
      'Emphasizes both leadership and management',
      'Addresses resistance and cultural change',
      'Proven track record in large organizations'
    ],
    cons: [
      'Can be time-consuming to implement fully',
      'Very linear - may not suit all contexts',
      'Requires strong top-down leadership',
      'May feel overwhelming for smaller changes',
      'Less flexible for iterative approaches'
    ],
    bestFor: [
      'Large-scale organizational transformations',
      'Culture change initiatives',
      'Major strategic shifts',
      'Crisis-driven change'
    ]
  },
  {
    id: 'lewin',
    name: "Lewin's 3-Stage Model",
    author: 'Kurt Lewin',
    year: 1947,
    description: 'A foundational model that views change as a three-stage process of unfreezing, changing, and refreezing organizational behaviors.',
    icon: Layers,
    color: 'blue',
    phases: [
      {
        id: 'unfreeze',
        name: 'Unfreeze',
        description: 'Prepare the organization to accept that change is necessary by breaking down existing status quo.',
        keyActivities: [
          'Determine what needs to change',
          'Ensure strong support from senior management',
          'Create compelling message about why change is needed',
          'Challenge beliefs, values, attitudes and behaviors',
          'Manage doubts and concerns'
        ],
        outcomes: ['Organization ready for change', 'Old patterns questioned'],
        order: 1
      },
      {
        id: 'change',
        name: 'Change (Transition)',
        description: 'Execute the intended change - people begin to resolve uncertainty and look for new ways to do things.',
        keyActivities: [
          'Communicate often about benefits of change',
          'Dispel rumors and empower action',
          'Involve people in the process',
          'Generate short-term wins',
          'Maintain clear vision of desired state'
        ],
        outcomes: ['New behaviors emerging', 'New processes implemented'],
        order: 2
      },
      {
        id: 'refreeze',
        name: 'Refreeze',
        description: 'Stabilize the organization in the new state of equilibrium to ensure changes are sustained.',
        keyActivities: [
          'Anchor changes in the culture',
          'Develop ways to sustain the change',
          'Provide support and training',
          'Celebrate success',
          'Establish feedback systems'
        ],
        outcomes: ['Changes become new normal', 'Sustained performance'],
        order: 3
      }
    ],
    pros: [
      'Simple and intuitive to understand',
      'Foundational - many other models build on it',
      'Emphasizes the human side of change',
      'Good for planned, deliberate change',
      'Clear beginning, middle, and end'
    ],
    cons: [
      'May be too simplistic for complex changes',
      'Assumes organizations are stable between changes',
      'Less suitable for continuous change environments',
      'Refreezing may inhibit future agility',
      'Linear approach may not reflect reality'
    ],
    bestFor: [
      'Smaller, focused changes',
      'Process improvements',
      'Department-level changes',
      'Changes with clear end states'
    ]
  },
  {
    id: 'adkar',
    name: 'ADKAR Model',
    author: 'Jeff Hiatt (Prosci)',
    year: 2006,
    description: 'A goal-oriented change management model that focuses on individual change as the foundation for organizational change.',
    icon: Users,
    color: 'green',
    phases: [
      {
        id: 'awareness',
        name: 'Awareness',
        description: 'Build awareness of the need for change at the individual level.',
        keyActivities: [
          'Communicate why change is needed',
          'Explain risks of not changing',
          'Share the vision for the future',
          'Address "What\'s in it for me?"',
          'Use multiple communication channels'
        ],
        outcomes: ['Individuals understand the need for change'],
        order: 1
      },
      {
        id: 'desire',
        name: 'Desire',
        description: 'Create desire to support and participate in the change.',
        keyActivities: [
          'Address personal motivators',
          'Remove barriers to change',
          'Demonstrate leadership commitment',
          'Create dissatisfaction with status quo',
          'Show personal benefits'
        ],
        outcomes: ['Personal commitment to change'],
        order: 2
      },
      {
        id: 'knowledge',
        name: 'Knowledge',
        description: 'Develop knowledge of how to change - skills and behaviors needed.',
        keyActivities: [
          'Provide training and education',
          'Share detailed information',
          'Offer job aids and resources',
          'Enable practice opportunities',
          'Clarify new roles and responsibilities'
        ],
        outcomes: ['People know how to change'],
        order: 3
      },
      {
        id: 'ability',
        name: 'Ability',
        description: 'Foster ability to implement required skills and behaviors.',
        keyActivities: [
          'Remove barriers to implementation',
          'Provide hands-on practice',
          'Offer coaching and mentoring',
          'Create safe environment for mistakes',
          'Provide necessary resources'
        ],
        outcomes: ['People can perform new behaviors'],
        order: 4
      },
      {
        id: 'reinforcement',
        name: 'Reinforcement',
        description: 'Reinforce to sustain the change and prevent reverting to old ways.',
        keyActivities: [
          'Celebrate successes',
          'Recognize and reward adoption',
          'Hold people accountable',
          'Audit compliance and correct gaps',
          'Make it harder to go back'
        ],
        outcomes: ['Change sustained over time'],
        order: 5
      }
    ],
    pros: [
      'Focus on individual change is powerful',
      'Sequential and measurable',
      'Can diagnose where change is failing',
      'Works well with other frameworks',
      'Practical and action-oriented'
    ],
    cons: [
      'May oversimplify complex organizational dynamics',
      'Less emphasis on organizational structure',
      'Assumes linear progression',
      'Requires significant time investment per person',
      'May miss systemic issues'
    ],
    bestFor: [
      'Technology implementations',
      'Process changes affecting daily work',
      'Changes requiring new skills',
      'Role or responsibility changes'
    ]
  },
  {
    id: 'bridges',
    name: 'Bridges Transition Model',
    author: 'William Bridges',
    year: 1991,
    description: 'Focuses on the psychological transition people go through during change, not just the change event itself.',
    icon: GitBranch,
    color: 'orange',
    phases: [
      {
        id: 'ending',
        name: 'Ending, Losing, Letting Go',
        description: 'Help people deal with their losses and prepare to move on.',
        keyActivities: [
          'Acknowledge what is being lost',
          'Honor the past appropriately',
          'Allow grieving for losses',
          'Communicate clearly about what is ending',
          'Define what is not changing'
        ],
        outcomes: ['Closure achieved', 'Ready to move forward'],
        order: 1
      },
      {
        id: 'neutral',
        name: 'The Neutral Zone',
        description: 'Support people through the uncertain in-between time when old ways are gone but new ways are not fully operational.',
        keyActivities: [
          'Normalize the neutral zone experience',
          'Create temporary structures',
          'Encourage innovation and creativity',
          'Provide extra support and communication',
          'Set short-term goals'
        ],
        outcomes: ['Creativity and innovation', 'Resilience built'],
        order: 2
      },
      {
        id: 'beginning',
        name: 'The New Beginning',
        description: 'Help people develop new identity, experience new energy, and discover new sense of purpose.',
        keyActivities: [
          'Celebrate the new beginning',
          'Communicate the vision clearly',
          'Give people a role in the new order',
          'Be consistent in messaging and actions',
          'Ensure quick wins'
        ],
        outcomes: ['New identity formed', 'Energy and commitment'],
        order: 3
      }
    ],
    pros: [
      'Addresses emotional/psychological aspects',
      'Recognizes change is a process, not event',
      'Helps manage resistance compassionately',
      'Good for mergers and reorganizations',
      'Validates peoples experiences'
    ],
    cons: [
      'Less structured than other models',
      'Can be hard to measure progress',
      'May extend timeline by focusing on emotions',
      'Requires high emotional intelligence',
      'Less clear on practical steps'
    ],
    bestFor: [
      'Mergers and acquisitions',
      'Downsizing or restructuring',
      'Leadership changes',
      'Cultural transformations'
    ]
  },
  {
    id: 'satir',
    name: 'Satir Change Model',
    author: 'Virginia Satir',
    year: 1991,
    description: 'A model that describes how people experience and process change, focusing on performance and emotional responses.',
    icon: BarChart3,
    color: 'pink',
    phases: [
      {
        id: 'status_quo',
        name: 'Late Status Quo',
        description: 'The stable state before change is introduced - familiar patterns and predictable performance.',
        keyActivities: [
          'Document current state performance',
          'Identify areas needing improvement',
          'Build case for change',
          'Prepare organization for disruption'
        ],
        outcomes: ['Baseline established', 'Readiness assessed'],
        order: 1
      },
      {
        id: 'resistance',
        name: 'Resistance',
        description: 'Initial reaction to foreign element - denial, anger, and attempts to avoid change.',
        keyActivities: [
          'Acknowledge resistance as natural',
          'Listen to concerns actively',
          'Provide clear information',
          'Maintain support systems',
          'Be patient with the process'
        ],
        outcomes: ['Resistance acknowledged', 'Trust maintained'],
        order: 2
      },
      {
        id: 'chaos',
        name: 'Chaos',
        description: 'Period of confusion and turmoil where old ways dont work but new ways arent established.',
        keyActivities: [
          'Provide extra support',
          'Encourage experimentation',
          'Tolerate mistakes',
          'Maintain clear vision',
          'Celebrate small improvements'
        ],
        outcomes: ['Learning occurring', 'New possibilities emerging'],
        order: 3
      },
      {
        id: 'integration',
        name: 'Integration',
        description: 'The transforming idea emerges and people begin to see how to make change work.',
        keyActivities: [
          'Support new ideas and methods',
          'Provide training and resources',
          'Reinforce positive changes',
          'Share success stories',
          'Build on what works'
        ],
        outcomes: ['New methods taking hold', 'Performance improving'],
        order: 4
      },
      {
        id: 'new_status',
        name: 'New Status Quo',
        description: 'New stability at higher performance level with new norms and expectations.',
        keyActivities: [
          'Standardize new processes',
          'Update policies and procedures',
          'Celebrate achievements',
          'Document lessons learned',
          'Prepare for next change'
        ],
        outcomes: ['Higher performance sustained', 'New normal established'],
        order: 5
      }
    ],
    pros: [
      'Acknowledges performance dips during change',
      'Normalizes chaos and confusion',
      'Based on family systems theory',
      'Helps set realistic expectations',
      'Good for understanding group dynamics'
    ],
    cons: [
      'Less prescriptive on actions',
      'Can be discouraging (expects performance drop)',
      'Timeline can be unpredictable',
      'Requires tolerance for ambiguity',
      'May not suit urgent changes'
    ],
    bestFor: [
      'Team dynamics changes',
      'Agile transformations',
      'Innovation initiatives',
      'Learning new technologies'
    ]
  },
  {
    id: 'kotter_dual',
    name: 'Kotter Dual Operating System',
    author: 'John Kotter',
    year: 2014,
    description: 'An evolution of the 8-step process designed for continuous change in fast-moving environments.',
    icon: Zap,
    color: 'indigo',
    phases: [
      {
        id: 'dual_structure',
        name: 'Create Dual Structure',
        description: 'Establish network structure alongside traditional hierarchy to enable agility.',
        keyActivities: [
          'Keep hierarchy for reliability',
          'Build volunteer network for speed',
          'Connect the two systems',
          'Define roles in each system',
          'Ensure executive support'
        ],
        outcomes: ['Dual system operational', 'Volunteers engaged'],
        order: 1
      },
      {
        id: 'big_opportunity',
        name: 'Focus on Big Opportunity',
        description: 'Identify and communicate a significant strategic opportunity to create energy.',
        keyActivities: [
          'Identify game-changing opportunity',
          'Create compelling narrative',
          'Connect to organizational purpose',
          'Generate excitement and urgency',
          'Get broad input and buy-in'
        ],
        outcomes: ['Clear opportunity defined', 'Energy and urgency created'],
        order: 2
      },
      {
        id: 'volunteer_army',
        name: 'Build Volunteer Army',
        description: 'Recruit passionate volunteers from all levels to drive initiatives.',
        keyActivities: [
          'Invite (dont assign) participation',
          'Look for passion and energy',
          'Include diverse perspectives',
          'Empower volunteers to act',
          'Celebrate volunteer contributions'
        ],
        outcomes: ['Engaged volunteer network', 'Cross-functional collaboration'],
        order: 3
      },
      {
        id: 'accelerate',
        name: 'Accelerate Movement',
        description: 'Use the network to rapidly iterate, learn, and implement changes.',
        keyActivities: [
          'Run multiple initiatives in parallel',
          'Fail fast and learn quickly',
          'Share learnings across network',
          'Remove barriers rapidly',
          'Scale what works'
        ],
        outcomes: ['Rapid implementation', 'Continuous improvement'],
        order: 4
      },
      {
        id: 'sustain_dual',
        name: 'Sustain Dual System',
        description: 'Maintain both systems for ongoing agility and stability.',
        keyActivities: [
          'Keep network energized',
          'Continuously identify new opportunities',
          'Integrate successes into hierarchy',
          'Develop network leadership',
          'Measure and communicate impact'
        ],
        outcomes: ['Sustained agility', 'Continuous change capability'],
        order: 5
      }
    ],
    pros: [
      'Built for continuous change',
      'Leverages volunteer energy',
      'Maintains stability while enabling agility',
      'Faster than traditional change',
      'Engages entire organization'
    ],
    cons: [
      'Can create confusion between systems',
      'Requires significant leadership commitment',
      'May be complex for smaller organizations',
      'Volunteers need time from regular duties',
      'Risk of network becoming bureaucratic'
    ],
    bestFor: [
      'Digital transformations',
      'Continuous improvement cultures',
      'Fast-changing industries',
      'Innovation initiatives'
    ]
  }
]

interface ChangeModelSelectorProps {
  onSelectModel: (model: ChangeModel) => void
  selectedModel?: ChangeModel
}

export default function ChangeModelSelector({ onSelectModel, selectedModel }: ChangeModelSelectorProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'compare'>('grid')
  const [expandedModel, setExpandedModel] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">Choose a Change Management Model</h2>
          <p className="text-slate-400">Select an academic framework to guide your change journey</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`glass-button px-4 py-2 ${viewMode === 'grid' ? 'text-purple-400 bg-purple-500/20' : 'text-slate-400'}`}
          >
            Grid View
          </button>
          <button
            onClick={() => setViewMode('compare')}
            className={`glass-button px-4 py-2 ${viewMode === 'compare' ? 'text-purple-400 bg-purple-500/20' : 'text-slate-400'}`}
          >
            Compare
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {changeModels.map((model) => (
            <div
              key={model.id}
              className={`glass-card p-6 cursor-pointer transition-all hover:scale-105 ${
                selectedModel?.id === model.id 
                  ? 'ring-2 ring-purple-500 bg-purple-500/20' 
                  : 'hover:bg-slate-800/40'
              }`}
              onClick={() => onSelectModel(model)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-${model.color}-500 rounded-full flex items-center justify-center`}>
                  <model.icon className="w-6 h-6 text-white" />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setExpandedModel(expandedModel === model.id ? null : model.id)
                  }}
                  className="text-slate-400 hover:text-slate-300"
                >
                  <Info className="w-5 h-5" />
                </button>
              </div>

              <h3 className="font-semibold text-slate-100 text-lg mb-1">{model.name}</h3>
              <p className="text-sm text-slate-400 mb-2">{model.author} ({model.year})</p>
              <p className="text-sm text-slate-300 mb-4">{model.description}</p>

              <div className="flex items-center gap-4 text-sm">
                <span className="text-slate-400">{model.phases.length} phases</span>
                <span className="text-slate-400">•</span>
                <span className="text-green-400">{model.pros.length} pros</span>
                <span className="text-slate-400">•</span>
                <span className="text-orange-400">{model.cons.length} cons</span>
              </div>

              {expandedModel === model.id && (
                <div className="mt-4 pt-4 border-t border-slate-700 space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Best For:</h4>
                    <ul className="text-sm text-slate-400 space-y-1">
                      {model.bestFor.map((use, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle2 className="w-3 h-3 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                          {use}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left p-4 text-slate-300">Model</th>
                <th className="text-left p-4 text-slate-300">Phases</th>
                <th className="text-left p-4 text-slate-300">Pros</th>
                <th className="text-left p-4 text-slate-300">Cons</th>
                <th className="text-left p-4 text-slate-300">Best For</th>
                <th className="text-center p-4 text-slate-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {changeModels.map((model) => (
                <tr key={model.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-${model.color}-500 rounded-full flex items-center justify-center`}>
                        <model.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-200">{model.name}</div>
                        <div className="text-sm text-slate-400">{model.author} ({model.year})</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-slate-300">{model.phases.length} phases</span>
                  </td>
                  <td className="p-4">
                    <ul className="text-sm space-y-1">
                      {model.pros.slice(0, 2).map((pro, idx) => (
                        <li key={idx} className="text-green-400">• {pro}</li>
                      ))}
                      {model.pros.length > 2 && (
                        <li className="text-slate-500">+{model.pros.length - 2} more</li>
                      )}
                    </ul>
                  </td>
                  <td className="p-4">
                    <ul className="text-sm space-y-1">
                      {model.cons.slice(0, 2).map((con, idx) => (
                        <li key={idx} className="text-orange-400">• {con}</li>
                      ))}
                      {model.cons.length > 2 && (
                        <li className="text-slate-500">+{model.cons.length - 2} more</li>
                      )}
                    </ul>
                  </td>
                  <td className="p-4">
                    <ul className="text-sm space-y-1">
                      {model.bestFor.slice(0, 2).map((use, idx) => (
                        <li key={idx} className="text-slate-300">• {use}</li>
                      ))}
                      {model.bestFor.length > 2 && (
                        <li className="text-slate-500">+{model.bestFor.length - 2} more</li>
                      )}
                    </ul>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => onSelectModel(model)}
                      className={`glass-button px-4 py-2 ${
                        selectedModel?.id === model.id 
                          ? 'text-purple-400 bg-purple-500/20' 
                          : 'text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      {selectedModel?.id === model.id ? 'Selected' : 'Select'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedModel && (
        <div className="glass-card p-6 bg-purple-500/10 border border-purple-500/30">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-6 h-6 text-purple-400" />
            <h3 className="text-lg font-semibold text-slate-100">
              {selectedModel.name} Selected
            </h3>
          </div>
          <p className="text-slate-300 mb-4">
            Your change journey will be structured using {selectedModel.phases.length} phases based on {selectedModel.author}'s framework.
            This model is particularly effective for {selectedModel.bestFor[0].toLowerCase()}.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <BookOpen className="w-4 h-4" />
            <span>The journey builder will guide you through each phase with specific activities and outcomes</span>
          </div>
        </div>
      )}
    </div>
  )
}