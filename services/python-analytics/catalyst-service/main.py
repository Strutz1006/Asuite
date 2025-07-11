from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from textblob import TextBlob
import uvicorn
import os

app = FastAPI(
    title="Aesyros Catalyst Service",
    description="Change Management Analytics Service",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class Stakeholder(BaseModel):
    id: str
    name: str
    role: str
    influence_level: int  # 1-10
    support_level: int    # 1-10
    engagement_score: float

class ChangeJourney(BaseModel):
    id: str
    name: str
    phase: str
    progress: float
    stakeholders: List[Stakeholder]
    activities: List[Dict[str, Any]]

class ReadinessRequest(BaseModel):
    journey: ChangeJourney
    organizational_factors: Dict[str, Any]

class StakeholderAnalysisRequest(BaseModel):
    stakeholders: List[Stakeholder]
    journey_context: Dict[str, Any]

class SentimentAnalysisRequest(BaseModel):
    feedback_texts: List[str]
    context: str

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "catalyst-service"}

@app.post("/assess-readiness")
async def assess_readiness(request: ReadinessRequest):
    """Assess organizational readiness for change"""
    try:
        journey = request.journey
        org_factors = request.organizational_factors
        
        # Calculate stakeholder readiness
        stakeholder_readiness = _calculate_stakeholder_readiness(journey.stakeholders)
        
        # Calculate organizational readiness factors
        leadership_support = org_factors.get('leadership_support', 5) / 10
        resource_availability = org_factors.get('resource_availability', 5) / 10
        culture_alignment = org_factors.get('culture_alignment', 5) / 10
        communication_effectiveness = org_factors.get('communication_effectiveness', 5) / 10
        
        # Overall readiness score
        readiness_score = (
            stakeholder_readiness * 0.4 +
            leadership_support * 0.25 +
            resource_availability * 0.15 +
            culture_alignment * 0.15 +
            communication_effectiveness * 0.05
        )
        
        # Generate readiness insights
        readiness_level = _get_readiness_level(readiness_score)
        risk_factors = _identify_risk_factors(request)
        recommendations = _generate_readiness_recommendations(readiness_score, risk_factors)
        
        return {
            'readiness_score': float(readiness_score),
            'readiness_level': readiness_level,
            'component_scores': {
                'stakeholder_readiness': float(stakeholder_readiness),
                'leadership_support': float(leadership_support),
                'resource_availability': float(resource_availability),
                'culture_alignment': float(culture_alignment),
                'communication_effectiveness': float(communication_effectiveness)
            },
            'risk_factors': risk_factors,
            'recommendations': recommendations
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Readiness assessment failed: {str(e)}")

@app.post("/analyze-stakeholders")
async def analyze_stakeholders(request: StakeholderAnalysisRequest):
    """Analyze stakeholder influence and support patterns"""
    try:
        stakeholders = request.stakeholders
        
        # Convert to DataFrame for analysis
        stakeholder_data = []
        for stakeholder in stakeholders:
            stakeholder_data.append({
                'id': stakeholder.id,
                'name': stakeholder.name,
                'role': stakeholder.role,
                'influence': stakeholder.influence_level,
                'support': stakeholder.support_level,
                'engagement': stakeholder.engagement_score
            })
        
        df = pd.DataFrame(stakeholder_data)
        
        # Stakeholder mapping
        stakeholder_mapping = _create_stakeholder_mapping(df)
        
        # Influence analysis
        influence_analysis = _analyze_influence_patterns(df)
        
        # Risk assessment
        stakeholder_risks = _assess_stakeholder_risks(df)
        
        # Engagement strategies
        engagement_strategies = _generate_engagement_strategies(df)
        
        return {
            'stakeholder_mapping': stakeholder_mapping,
            'influence_analysis': influence_analysis,
            'stakeholder_risks': stakeholder_risks,
            'engagement_strategies': engagement_strategies,
            'total_stakeholders': len(stakeholders)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Stakeholder analysis failed: {str(e)}")

@app.post("/optimize-journey")
async def optimize_journey(request: Dict[str, Any]):
    """Optimize change journey activities and timeline"""
    try:
        journey_data = request.get('journey', {})
        constraints = request.get('constraints', {})
        
        # Analyze current activities
        activities = journey_data.get('activities', [])
        
        # Generate optimization recommendations
        optimizations = _optimize_change_activities(activities, constraints)
        
        # Timeline analysis
        timeline_analysis = _analyze_journey_timeline(activities)
        
        # Critical path identification
        critical_path = _identify_critical_path(activities)
        
        return {
            'optimizations': optimizations,
            'timeline_analysis': timeline_analysis,
            'critical_path': critical_path,
            'efficiency_score': _calculate_journey_efficiency(activities)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Journey optimization failed: {str(e)}")

@app.post("/analyze-sentiment")
async def analyze_sentiment(request: SentimentAnalysisRequest):
    """Analyze sentiment from feedback and communications"""
    try:
        feedback_texts = request.feedback_texts
        
        if not feedback_texts:
            return {
                'overall_sentiment': 'neutral',
                'sentiment_score': 0.0,
                'individual_sentiments': [],
                'sentiment_distribution': {'positive': 0, 'neutral': 0, 'negative': 0}
            }
        
        sentiments = []
        scores = []
        
        for text in feedback_texts:
            if text.strip():
                blob = TextBlob(text)
                sentiment_score = blob.sentiment.polarity
                
                # Classify sentiment
                if sentiment_score > 0.1:
                    sentiment_label = 'positive'
                elif sentiment_score < -0.1:
                    sentiment_label = 'negative'
                else:
                    sentiment_label = 'neutral'
                
                sentiments.append({
                    'text': text[:100] + '...' if len(text) > 100 else text,
                    'sentiment': sentiment_label,
                    'score': float(sentiment_score),
                    'subjectivity': float(blob.sentiment.subjectivity)
                })
                
                scores.append(sentiment_score)
        
        # Calculate overall metrics
        overall_score = np.mean(scores) if scores else 0.0
        
        # Determine overall sentiment
        if overall_score > 0.1:
            overall_sentiment = 'positive'
        elif overall_score < -0.1:
            overall_sentiment = 'negative'
        else:
            overall_sentiment = 'neutral'
        
        # Distribution
        distribution = {
            'positive': len([s for s in sentiments if s['sentiment'] == 'positive']),
            'neutral': len([s for s in sentiments if s['sentiment'] == 'neutral']),
            'negative': len([s for s in sentiments if s['sentiment'] == 'negative'])
        }
        
        return {
            'overall_sentiment': overall_sentiment,
            'sentiment_score': float(overall_score),
            'individual_sentiments': sentiments,
            'sentiment_distribution': distribution,
            'confidence': _calculate_sentiment_confidence(scores)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sentiment analysis failed: {str(e)}")

@app.post("/predict-resistance")
async def predict_resistance(request: Dict[str, Any]):
    """Predict potential resistance to change"""
    try:
        stakeholder_data = request.get('stakeholders', [])
        change_factors = request.get('change_factors', {})
        
        # Convert stakeholder data
        df = pd.DataFrame(stakeholder_data)
        
        if df.empty:
            return {
                'resistance_predictions': [],
                'overall_resistance_risk': 'low',
                'mitigation_strategies': []
            }
        
        # Predict resistance for each stakeholder
        resistance_predictions = []
        
        for _, stakeholder in df.iterrows():
            resistance_score = _calculate_resistance_probability(stakeholder, change_factors)
            
            resistance_predictions.append({
                'stakeholder_id': stakeholder.get('id', 'unknown'),
                'name': stakeholder.get('name', 'Unknown'),
                'resistance_probability': float(resistance_score),
                'resistance_level': _get_resistance_level(resistance_score),
                'key_concerns': _identify_key_concerns(stakeholder, change_factors)
            })
        
        # Overall risk assessment
        avg_resistance = np.mean([p['resistance_probability'] for p in resistance_predictions])
        overall_risk = _get_overall_resistance_risk(avg_resistance)
        
        # Generate mitigation strategies
        mitigation_strategies = _generate_mitigation_strategies(resistance_predictions, change_factors)
        
        return {
            'resistance_predictions': resistance_predictions,
            'overall_resistance_risk': overall_risk,
            'average_resistance_score': float(avg_resistance),
            'mitigation_strategies': mitigation_strategies
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resistance prediction failed: {str(e)}")

# Helper functions
def _calculate_stakeholder_readiness(stakeholders):
    """Calculate overall stakeholder readiness"""
    if not stakeholders:
        return 0.5
    
    total_influence = sum(s.influence_level for s in stakeholders)
    weighted_support = sum(s.support_level * s.influence_level for s in stakeholders)
    
    if total_influence == 0:
        return 0.5
    
    return (weighted_support / total_influence) / 10.0

def _get_readiness_level(score):
    """Get readiness level description"""
    if score >= 0.8:
        return 'high'
    elif score >= 0.6:
        return 'medium'
    elif score >= 0.4:
        return 'low'
    else:
        return 'very_low'

def _identify_risk_factors(request):
    """Identify potential risk factors"""
    risks = []
    
    # Check stakeholder support
    low_support_stakeholders = [
        s for s in request.journey.stakeholders 
        if s.support_level < 5 and s.influence_level >= 7
    ]
    
    if low_support_stakeholders:
        risks.append({
            'type': 'stakeholder_resistance',
            'severity': 'high',
            'description': f"{len(low_support_stakeholders)} high-influence stakeholders with low support"
        })
    
    # Check organizational factors
    org_factors = request.organizational_factors
    
    if org_factors.get('resource_availability', 5) < 4:
        risks.append({
            'type': 'resource_constraint',
            'severity': 'medium',
            'description': 'Limited resource availability'
        })
    
    if org_factors.get('culture_alignment', 5) < 4:
        risks.append({
            'type': 'culture_misalignment',
            'severity': 'high',
            'description': 'Poor culture alignment with change'
        })
    
    return risks

def _generate_readiness_recommendations(readiness_score, risk_factors):
    """Generate recommendations based on readiness assessment"""
    recommendations = []
    
    if readiness_score < 0.6:
        recommendations.append({
            'priority': 'high',
            'category': 'stakeholder_engagement',
            'action': 'Increase stakeholder engagement and communication'
        })
    
    for risk in risk_factors:
        if risk['type'] == 'stakeholder_resistance':
            recommendations.append({
                'priority': 'high',
                'category': 'resistance_management',
                'action': 'Develop targeted stakeholder engagement plan for resistant stakeholders'
            })
        elif risk['type'] == 'resource_constraint':
            recommendations.append({
                'priority': 'medium',
                'category': 'resource_planning',
                'action': 'Secure additional resources or adjust project scope'
            })
    
    return recommendations

def _create_stakeholder_mapping(df):
    """Create stakeholder influence/support mapping"""
    mapping = {
        'champions': [],  # High influence, high support
        'supporters': [], # Low influence, high support
        'blockers': [],   # High influence, low support
        'neutral': []     # Mixed or moderate levels
    }
    
    for _, stakeholder in df.iterrows():
        influence = stakeholder['influence']
        support = stakeholder['support']
        
        if influence >= 7 and support >= 7:
            mapping['champions'].append(stakeholder.to_dict())
        elif influence < 7 and support >= 7:
            mapping['supporters'].append(stakeholder.to_dict())
        elif influence >= 7 and support < 4:
            mapping['blockers'].append(stakeholder.to_dict())
        else:
            mapping['neutral'].append(stakeholder.to_dict())
    
    return mapping

def _analyze_influence_patterns(df):
    """Analyze stakeholder influence patterns"""
    total_influence = df['influence'].sum()
    avg_support = df['support'].mean()
    
    # Find most influential stakeholders
    top_influencers = df.nlargest(3, 'influence')[['name', 'influence', 'support']].to_dict('records')
    
    return {
        'total_influence_points': int(total_influence),
        'average_support_level': float(avg_support),
        'top_influencers': top_influencers,
        'influence_concentration': float(df.nlargest(3, 'influence')['influence'].sum() / total_influence) if total_influence > 0 else 0
    }

def _assess_stakeholder_risks(df):
    """Assess risks from stakeholder configuration"""
    risks = []
    
    # High influence, low support stakeholders
    blockers = df[(df['influence'] >= 7) & (df['support'] < 4)]
    if len(blockers) > 0:
        risks.append({
            'type': 'blocking_stakeholders',
            'count': len(blockers),
            'stakeholders': blockers['name'].tolist()
        })
    
    # Low overall engagement
    low_engagement = df[df['engagement'] < 5]
    if len(low_engagement) > len(df) * 0.5:
        risks.append({
            'type': 'low_engagement',
            'percentage': float((len(low_engagement) / len(df)) * 100)
        })
    
    return risks

def _generate_engagement_strategies(df):
    """Generate stakeholder engagement strategies"""
    strategies = []
    
    # For champions
    champions = df[(df['influence'] >= 7) & (df['support'] >= 7)]
    if len(champions) > 0:
        strategies.append({
            'stakeholder_group': 'champions',
            'strategy': 'Leverage as change advocates and ambassadors',
            'count': len(champions)
        })
    
    # For blockers
    blockers = df[(df['influence'] >= 7) & (df['support'] < 4)]
    if len(blockers) > 0:
        strategies.append({
            'stakeholder_group': 'blockers',
            'strategy': 'Direct engagement, address concerns, seek compromise',
            'count': len(blockers)
        })
    
    # For supporters
    supporters = df[(df['influence'] < 7) & (df['support'] >= 7)]
    if len(supporters) > 0:
        strategies.append({
            'stakeholder_group': 'supporters',
            'strategy': 'Keep informed and engaged as grassroots supporters',
            'count': len(supporters)
        })
    
    return strategies

def _optimize_change_activities(activities, constraints):
    """Optimize change activities"""
    optimizations = []
    
    # Simple optimization suggestions
    if len(activities) > 20:
        optimizations.append({
            'type': 'consolidation',
            'suggestion': 'Consider consolidating similar activities to reduce complexity'
        })
    
    # Check for resource constraints
    max_resources = constraints.get('max_concurrent_activities', 5)
    if len(activities) > max_resources:
        optimizations.append({
            'type': 'sequencing',
            'suggestion': f'Sequence activities to stay within {max_resources} concurrent activity limit'
        })
    
    return optimizations

def _analyze_journey_timeline(activities):
    """Analyze journey timeline"""
    if not activities:
        return {'total_duration': 0, 'phases': []}
    
    # Simplified timeline analysis
    total_duration = sum(activity.get('duration_days', 7) for activity in activities)
    
    return {
        'total_duration_days': total_duration,
        'activity_count': len(activities),
        'average_activity_duration': total_duration / len(activities) if activities else 0
    }

def _identify_critical_path(activities):
    """Identify critical path in change journey"""
    # Simplified critical path - just return longest activities
    if not activities:
        return []
    
    sorted_activities = sorted(activities, key=lambda x: x.get('duration_days', 7), reverse=True)
    
    return sorted_activities[:3]  # Top 3 longest activities

def _calculate_journey_efficiency(activities):
    """Calculate journey efficiency score"""
    if not activities:
        return 0.5
    
    # Simple efficiency calculation based on activity count and estimated duration
    efficiency = max(0.1, min(1.0, 1 - (len(activities) - 10) * 0.05))
    
    return float(efficiency)

def _calculate_sentiment_confidence(scores):
    """Calculate confidence in sentiment analysis"""
    if not scores:
        return 0.0
    
    # Higher confidence with more data and consistent scores
    data_confidence = min(1.0, len(scores) / 20)  # More confidence with more data
    consistency_confidence = 1 - np.std(scores) if len(scores) > 1 else 0.5
    
    return float((data_confidence + consistency_confidence) / 2)

def _calculate_resistance_probability(stakeholder, change_factors):
    """Calculate probability of resistance for a stakeholder"""
    # Base resistance from support level (inverted)
    base_resistance = (10 - stakeholder.get('support', 5)) / 10
    
    # Adjust for change factors
    change_magnitude = change_factors.get('magnitude', 5) / 10  # How big is the change
    change_pace = change_factors.get('pace', 5) / 10  # How fast is the change
    
    # Calculate overall resistance probability
    resistance_prob = (base_resistance + change_magnitude * 0.3 + change_pace * 0.2) / 1.5
    
    return min(1.0, max(0.0, resistance_prob))

def _get_resistance_level(score):
    """Get resistance level description"""
    if score >= 0.7:
        return 'high'
    elif score >= 0.4:
        return 'medium'
    else:
        return 'low'

def _identify_key_concerns(stakeholder, change_factors):
    """Identify key concerns for a stakeholder"""
    concerns = []
    
    if stakeholder.get('support', 5) < 4:
        concerns.append('Low initial support for change')
    
    if change_factors.get('magnitude', 5) >= 7:
        concerns.append('Significant change magnitude')
    
    if change_factors.get('pace', 5) >= 7:
        concerns.append('Rapid pace of change')
    
    return concerns

def _get_overall_resistance_risk(avg_resistance):
    """Get overall resistance risk level"""
    if avg_resistance >= 0.6:
        return 'high'
    elif avg_resistance >= 0.4:
        return 'medium'
    else:
        return 'low'

def _generate_mitigation_strategies(resistance_predictions, change_factors):
    """Generate strategies to mitigate resistance"""
    strategies = []
    
    high_resistance = [p for p in resistance_predictions if p['resistance_probability'] >= 0.6]
    
    if high_resistance:
        strategies.append({
            'target': 'high_resistance_stakeholders',
            'strategy': 'One-on-one engagement sessions to understand and address specific concerns',
            'stakeholder_count': len(high_resistance)
        })
    
    if change_factors.get('magnitude', 5) >= 7:
        strategies.append({
            'target': 'all_stakeholders',
            'strategy': 'Phased approach to reduce change magnitude impact',
            'rationale': 'High change magnitude detected'
        })
    
    return strategies

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8003))
    uvicorn.run(app, host="0.0.0.0", port=port)