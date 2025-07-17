import { TrendingUp, BarChart3, PieChart, Activity, Target, Brain, Lightbulb, AlertTriangle, Download, Calendar, Clock, Users } from 'lucide-react'
import { useState } from 'react'

const performanceMetrics = [
  {
    name: 'Forecast Accuracy',
    value: 89,
    change: '+7%',
    changeType: 'increase',
    target: 95,
    description: 'Average accuracy across all prediction models',
  },
  {
    name: 'Scenario Confidence',
    value: 84,
    change: '+12%',
    changeType: 'increase',
    target: 90,
    description: 'Average confidence level in active scenarios',
  },
  {
    name: 'Risk Prediction Rate',
    value: 76,
    change: '+5%',
    changeType: 'increase',
    target: 85,
    description: 'Success rate of risk event predictions',
  },
  {
    name: 'Model Performance',
    value: 91,
    change: '+3%',
    changeType: 'increase',
    target: 95,
    description: 'Overall AI model performance score',
  },
]

const scenarioPerformance = [
  {
    name: 'Economic Recession Impact',
    accuracy: 89,
    confidence: 87,
    dataPoints: 15674,
    predictions: 23,
    successRate: 91,
    lastUpdated: '2024-07-15',
    trend: 'up',
  },
  {
    name: 'Market Expansion Strategy',
    accuracy: 76,
    confidence: 78,
    dataPoints: 12456,
    predictions: 18,
    successRate: 83,
    lastUpdated: '2024-07-14',
    trend: 'stable',
  },
  {
    name: 'Supply Chain Disruption',
    accuracy: 92,
    confidence: 94,
    dataPoints: 23891,
    predictions: 31,
    successRate: 95,
    lastUpdated: '2024-07-13',
    trend: 'up',
  },
  {
    name: 'Technology Adoption',
    accuracy: 81,
    confidence: 85,
    dataPoints: 8934,
    predictions: 15,
    successRate: 88,
    lastUpdated: '2024-07-12',
    trend: 'up',
  },
]

const insightCategories = [
  { category: 'Financial', count: 45, accuracy: 89, impact: 'high', color: 'bg-green-500' },
  { category: 'Operational', count: 38, accuracy: 84, impact: 'medium', color: 'bg-blue-500' },
  { category: 'Strategic', count: 32, accuracy: 91, impact: 'high', color: 'bg-purple-500' },
  { category: 'Market', count: 28, accuracy: 76, impact: 'medium', color: 'bg-orange-500' },
  { category: 'Technology', count: 21, accuracy: 88, impact: 'low', color: 'bg-teal-500' },
]

const timeSeriesData = [
  { month: 'Jan', accuracy: 78, scenarios: 12, insights: 145 },
  { month: 'Feb', accuracy: 81, scenarios: 15, insights: 162 },
  { month: 'Mar', accuracy: 79, scenarios: 18, insights: 178 },
  { month: 'Apr', accuracy: 84, scenarios: 21, insights: 195 },
  { month: 'May', accuracy: 87, scenarios: 19, insights: 218 },
  { month: 'Jun', accuracy: 89, scenarios: 24, insights: 234 },
]

const predictionAccuracy = [
  { timeframe: '1 Month', accuracy: 94, predictions: 156, correct: 147 },
  { timeframe: '3 Months', accuracy: 89, predictions: 234, correct: 208 },
  { timeframe: '6 Months', accuracy: 84, predictions: 189, correct: 159 },
  { timeframe: '12 Months', accuracy: 76, predictions: 98, correct: 74 },
]

const riskFactors = [
  { factor: 'Data Quality', impact: 'high', probability: 23, mitigation: 'Enhanced validation' },
  { factor: 'Model Drift', impact: 'medium', probability: 45, mitigation: 'Regular retraining' },
  { factor: 'External Volatility', impact: 'high', probability: 67, mitigation: 'Adaptive algorithms' },
  { factor: 'Computational Load', impact: 'low', probability: 34, mitigation: 'Infrastructure scaling' },
]

export default function AnalyticsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('6m')
  const [selectedMetric, setSelectedMetric] = useState('accuracy')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Analytics</h1>
          <p className="text-slate-400 mt-1">
            Performance metrics and predictive analytics insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            <option value="1m">Last Month</option>
            <option value="3m">Last 3 Months</option>
            <option value="6m">Last 6 Months</option>
            <option value="1y">Last Year</option>
          </select>
          <button className="glass-button text-purple-300 hover:text-purple-200 px-4 py-2 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <div key={index} className="glass-card p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-400">{metric.name}</h3>
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold text-slate-100">{metric.value}%</span>
              <span className={`text-sm font-medium ${
                metric.changeType === 'increase' ? 'text-green-400' : 'text-red-400'
              }`}>
                {metric.change}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">{metric.description}</p>
            <div className="w-full bg-slate-700/50 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  metric.value >= metric.target ? 'bg-green-500' : 
                  metric.value >= metric.target * 0.8 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Target: {metric.target}%</p>
          </div>
        ))}
      </div>

      {/* Performance Trends Chart */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100">Performance Trends</h2>
          <div className="flex items-center gap-3">
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-1 bg-slate-800/50 border border-slate-700 rounded text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="accuracy">Accuracy</option>
              <option value="scenarios">Scenarios</option>
              <option value="insights">Insights</option>
            </select>
          </div>
        </div>
        
        <div className="h-64 flex items-end justify-between gap-4">
          {timeSeriesData.map((data, index) => {
            const value = data[selectedMetric as keyof typeof data] as number
            const maxValue = Math.max(...timeSeriesData.map(d => d[selectedMetric as keyof typeof d] as number))
            const height = (value / maxValue) * 100
            
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="w-full flex items-end h-48">
                  <div
                    className={`w-full rounded-t transition-all duration-300 ${
                      selectedMetric === 'accuracy' ? 'bg-purple-500' :
                      selectedMetric === 'scenarios' ? 'bg-blue-500' : 'bg-green-500'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                </div>
                <div className="mt-2 text-center">
                  <div className="text-sm font-medium text-slate-100">{value}{selectedMetric === 'accuracy' ? '%' : ''}</div>
                  <div className="text-xs text-slate-400">{data.month}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Scenario Performance */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100">Scenario Performance</h2>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-slate-400">By Scenario</span>
          </div>
        </div>

        <div className="space-y-4">
          {scenarioPerformance.map((scenario, index) => (
            <div key={index} className="glass-card p-4 bg-slate-800/40">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-medium text-slate-100">{scenario.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <BarChart3 className="w-4 h-4" />
                      {scenario.dataPoints.toLocaleString()} data points
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {scenario.predictions} predictions
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(scenario.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    scenario.trend === 'up' ? 'text-green-400' : 
                    scenario.trend === 'down' ? 'text-red-400' : 'text-slate-400'
                  }`}>
                    {scenario.trend === 'up' ? '↗' : scenario.trend === 'down' ? '↘' : '→'} {scenario.successRate}%
                  </div>
                  <div className="text-xs text-slate-500">success rate</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Accuracy</span>
                    <span className="text-sm font-medium text-slate-100">{scenario.accuracy}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        scenario.accuracy >= 90 ? 'bg-green-500' : 
                        scenario.accuracy >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${scenario.accuracy}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Confidence</span>
                    <span className="text-sm font-medium text-slate-100">{scenario.confidence}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        scenario.confidence >= 85 ? 'bg-green-500' : 
                        scenario.confidence >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${scenario.confidence}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights Categories and Prediction Accuracy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Insights Categories */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-slate-100 mb-6">Insights by Category</h2>
          <div className="space-y-4">
            {insightCategories.map((category, index) => (
              <div key={index} className="glass-card p-4 bg-slate-800/40">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-slate-100">{category.category}</h3>
                  <span className={`text-sm font-medium ${
                    category.impact === 'high' ? 'text-red-400' :
                    category.impact === 'medium' ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {category.impact} impact
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Accuracy</span>
                  <span className="text-sm font-medium text-slate-100">{category.accuracy}%</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2 mb-3">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${category.color}`}
                    style={{ width: `${category.accuracy}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Insights Generated</span>
                  <span className="font-medium text-slate-100">{category.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prediction Accuracy by Timeframe */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-slate-100 mb-6">Prediction Accuracy by Timeframe</h2>
          <div className="space-y-4">
            {predictionAccuracy.map((pred, index) => (
              <div key={index} className="glass-card p-4 bg-slate-800/40">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-slate-100">{pred.timeframe}</h3>
                  <span className="text-sm font-medium text-slate-100">{pred.accuracy}%</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2 mb-3">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      pred.accuracy >= 90 ? 'bg-green-500' : 
                      pred.accuracy >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${pred.accuracy}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center">
                    <div className="text-slate-400">Total Predictions</div>
                    <div className="font-medium text-slate-100">{pred.predictions}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-slate-400">Correct</div>
                    <div className="font-medium text-green-400">{pred.correct}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Factors */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Risk Factors
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {riskFactors.map((risk, index) => (
            <div key={index} className="glass-card p-4 bg-slate-800/40">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-slate-100">{risk.factor}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  risk.impact === 'high' ? 'bg-red-500/20 text-red-400' :
                  risk.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {risk.impact} impact
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Probability</span>
                <span className="text-sm font-medium text-slate-100">{risk.probability}%</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2 mb-3">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    risk.probability >= 60 ? 'bg-red-500' : 
                    risk.probability >= 30 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${risk.probability}%` }}
                />
              </div>
              <div className="text-sm text-slate-400">
                <span className="font-medium">Mitigation:</span> {risk.mitigation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 hover:bg-slate-800/40 transition-colors cursor-pointer">
          <BarChart3 className="w-8 h-8 text-purple-400 mb-3" />
          <h3 className="text-lg font-semibold text-slate-100 mb-2">Model Performance</h3>
          <p className="text-slate-400 text-sm">Deep dive into AI model performance metrics</p>
        </div>
        
        <div className="glass-card p-6 hover:bg-slate-800/40 transition-colors cursor-pointer">
          <PieChart className="w-8 h-8 text-blue-400 mb-3" />
          <h3 className="text-lg font-semibold text-slate-100 mb-2">Scenario Analytics</h3>
          <p className="text-slate-400 text-sm">Comprehensive scenario performance analysis</p>
        </div>
        
        <div className="glass-card p-6 hover:bg-slate-800/40 transition-colors cursor-pointer">
          <Activity className="w-8 h-8 text-green-400 mb-3" />
          <h3 className="text-lg font-semibold text-slate-100 mb-2">Real-time Monitoring</h3>
          <p className="text-slate-400 text-sm">Monitor predictive models in real-time</p>
        </div>
      </div>
    </div>
  )
}