from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity
import uvicorn
import os

app = FastAPI(
    title="Aesyros Align Service",
    description="Strategic Goals & OKRs Analytics Service",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class Objective(BaseModel):
    id: str
    title: str
    description: str
    category: str
    priority: int
    progress: float
    target_date: str
    key_results: List[Dict[str, Any]]

class AlignmentRequest(BaseModel):
    objectives: List[Objective]
    strategic_themes: List[str]
    business_priorities: List[Dict[str, Any]]

class ProgressRequest(BaseModel):
    historical_data: List[Dict[str, Any]]
    current_objectives: List[Objective]
    time_horizon: int  # days

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "align-service"}

@app.post("/analyze-objectives")
async def analyze_objectives(request: AlignmentRequest):
    """Analyze objectives for strategic alignment and clustering"""
    try:
        # Convert objectives to DataFrame
        obj_data = []
        for obj in request.objectives:
            obj_data.append({
                'id': obj.id,
                'title': obj.title,
                'category': obj.category,
                'priority': obj.priority,
                'progress': obj.progress,
                'kr_count': len(obj.key_results)
            })
        
        df = pd.DataFrame(obj_data)
        
        # Perform clustering analysis
        features = df[['priority', 'progress', 'kr_count']].values
        scaler = StandardScaler()
        features_scaled = scaler.fit_transform(features)
        
        # K-means clustering
        n_clusters = min(3, len(df))
        kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        clusters = kmeans.fit_predict(features_scaled)
        
        # Add cluster labels
        df['cluster'] = clusters
        
        # Calculate cluster insights
        cluster_insights = []
        for i in range(n_clusters):
            cluster_data = df[df['cluster'] == i]
            cluster_insights.append({
                'cluster_id': i,
                'objective_count': len(cluster_data),
                'avg_priority': float(cluster_data['priority'].mean()),
                'avg_progress': float(cluster_data['progress'].mean()),
                'characteristics': _get_cluster_characteristics(cluster_data)
            })
        
        return {
            'analysis': {
                'total_objectives': len(df),
                'clusters': cluster_insights,
                'objective_clusters': df[['id', 'cluster']].to_dict('records')
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/calculate-alignment")
async def calculate_alignment(request: AlignmentRequest):
    """Calculate strategic alignment scores"""
    try:
        alignment_scores = []
        
        for obj in request.objectives:
            # Calculate alignment with strategic themes
            theme_alignment = _calculate_theme_alignment(obj, request.strategic_themes)
            
            # Calculate priority alignment
            priority_alignment = _calculate_priority_alignment(obj, request.business_priorities)
            
            # Overall alignment score
            overall_score = (theme_alignment + priority_alignment) / 2
            
            alignment_scores.append({
                'objective_id': obj.id,
                'theme_alignment': theme_alignment,
                'priority_alignment': priority_alignment,
                'overall_alignment': overall_score,
                'alignment_level': _get_alignment_level(overall_score)
            })
        
        # Calculate portfolio-level metrics
        avg_alignment = np.mean([score['overall_alignment'] for score in alignment_scores])
        
        return {
            'portfolio_alignment': avg_alignment,
            'objective_alignments': alignment_scores,
            'recommendations': _generate_alignment_recommendations(alignment_scores)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Alignment calculation failed: {str(e)}")

@app.post("/predict-progress")
async def predict_progress(request: ProgressRequest):
    """Predict objective progress using historical data"""
    try:
        predictions = []
        
        # Convert historical data to DataFrame
        if request.historical_data:
            hist_df = pd.DataFrame(request.historical_data)
            hist_df['date'] = pd.to_datetime(hist_df['date'])
            
            for obj in request.current_objectives:
                # Filter historical data for this objective
                obj_history = hist_df[hist_df['objective_id'] == obj.id].copy()
                
                if len(obj_history) >= 3:  # Need at least 3 data points
                    # Simple linear regression prediction
                    prediction = _predict_objective_progress(obj_history, request.time_horizon)
                    
                    predictions.append({
                        'objective_id': obj.id,
                        'current_progress': obj.progress,
                        'predicted_progress': prediction['predicted_progress'],
                        'confidence': prediction['confidence'],
                        'trend': prediction['trend'],
                        'completion_probability': prediction['completion_probability']
                    })
                else:
                    # Insufficient data - provide baseline prediction
                    predictions.append({
                        'objective_id': obj.id,
                        'current_progress': obj.progress,
                        'predicted_progress': obj.progress + 10,  # Assume 10% growth
                        'confidence': 0.3,
                        'trend': 'insufficient_data',
                        'completion_probability': 0.5
                    })
        
        return {
            'predictions': predictions,
            'portfolio_completion_probability': np.mean([p['completion_probability'] for p in predictions]) if predictions else 0
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Progress prediction failed: {str(e)}")

@app.post("/optimize-okrs")
async def optimize_okrs(request: AlignmentRequest):
    """Optimize OKR structure and recommendations"""
    try:
        optimizations = []
        
        for obj in request.objectives:
            # Analyze key results
            kr_analysis = _analyze_key_results(obj.key_results)
            
            # Generate optimization recommendations
            recommendations = _generate_okr_recommendations(obj, kr_analysis)
            
            optimizations.append({
                'objective_id': obj.id,
                'current_kr_count': len(obj.key_results),
                'recommended_kr_count': kr_analysis['recommended_count'],
                'kr_quality_score': kr_analysis['quality_score'],
                'recommendations': recommendations
            })
        
        return {
            'optimizations': optimizations,
            'portfolio_recommendations': _generate_portfolio_recommendations(optimizations)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OKR optimization failed: {str(e)}")

# Helper functions
def _get_cluster_characteristics(cluster_data):
    """Generate characteristics for a cluster"""
    avg_priority = cluster_data['priority'].mean()
    avg_progress = cluster_data['progress'].mean()
    
    if avg_priority >= 8 and avg_progress >= 70:
        return "High-priority, high-performing objectives"
    elif avg_priority >= 8 and avg_progress < 50:
        return "High-priority objectives needing attention"
    elif avg_priority < 5 and avg_progress >= 70:
        return "Lower-priority but well-performing objectives"
    else:
        return "Mixed performance objectives"

def _calculate_theme_alignment(objective, themes):
    """Calculate alignment with strategic themes"""
    # Simple text similarity - in production, use more sophisticated NLP
    alignment_score = 0.5  # Base score
    
    for theme in themes:
        if theme.lower() in objective.title.lower() or theme.lower() in objective.description.lower():
            alignment_score += 0.2
    
    return min(alignment_score, 1.0)

def _calculate_priority_alignment(objective, business_priorities):
    """Calculate alignment with business priorities"""
    # Weighted alignment based on priority scores
    if not business_priorities:
        return 0.5
    
    priority_weights = {p['name']: p['weight'] for p in business_priorities}
    alignment = objective.priority / 10.0  # Normalize to 0-1
    
    return min(alignment, 1.0)

def _get_alignment_level(score):
    """Get alignment level description"""
    if score >= 0.8:
        return "Highly Aligned"
    elif score >= 0.6:
        return "Well Aligned"
    elif score >= 0.4:
        return "Moderately Aligned"
    else:
        return "Poorly Aligned"

def _generate_alignment_recommendations(alignment_scores):
    """Generate alignment improvement recommendations"""
    recommendations = []
    
    poorly_aligned = [s for s in alignment_scores if s['overall_alignment'] < 0.6]
    
    if poorly_aligned:
        recommendations.append({
            'type': 'alignment_improvement',
            'priority': 'high',
            'message': f"{len(poorly_aligned)} objectives need alignment improvement",
            'affected_objectives': [obj['objective_id'] for obj in poorly_aligned]
        })
    
    return recommendations

def _predict_objective_progress(obj_history, time_horizon):
    """Predict objective progress based on historical data"""
    # Simple linear trend analysis
    obj_history = obj_history.sort_values('date')
    
    # Calculate progress velocity
    progress_values = obj_history['progress'].values
    days_elapsed = (obj_history['date'].max() - obj_history['date'].min()).days
    
    if days_elapsed > 0:
        velocity = (progress_values[-1] - progress_values[0]) / days_elapsed
        predicted_progress = progress_values[-1] + (velocity * time_horizon)
        
        # Calculate confidence based on consistency
        progress_diffs = np.diff(progress_values)
        consistency = 1 - (np.std(progress_diffs) / np.mean(np.abs(progress_diffs)) if np.mean(np.abs(progress_diffs)) > 0 else 0)
        confidence = max(0.1, min(0.9, consistency))
        
        completion_probability = min(1.0, max(0.0, predicted_progress / 100.0))
        
        return {
            'predicted_progress': float(predicted_progress),
            'confidence': float(confidence),
            'trend': 'increasing' if velocity > 0 else 'decreasing',
            'completion_probability': float(completion_probability)
        }
    
    return {
        'predicted_progress': float(progress_values[-1]),
        'confidence': 0.3,
        'trend': 'stable',
        'completion_probability': 0.5
    }

def _analyze_key_results(key_results):
    """Analyze key results quality and structure"""
    kr_count = len(key_results)
    
    # Optimal KR count is 3-5
    count_score = 1.0 if 3 <= kr_count <= 5 else max(0.3, 1 - abs(kr_count - 4) * 0.2)
    
    # Analyze KR quality (simplified)
    quality_score = count_score  # In production, analyze metrics, targets, etc.
    
    recommended_count = max(3, min(5, kr_count))
    
    return {
        'quality_score': quality_score,
        'recommended_count': recommended_count
    }

def _generate_okr_recommendations(objective, kr_analysis):
    """Generate OKR optimization recommendations"""
    recommendations = []
    
    if kr_analysis['quality_score'] < 0.7:
        recommendations.append({
            'type': 'improve_kr_quality',
            'message': "Consider improving key result specificity and measurability"
        })
    
    if len(objective.key_results) > 5:
        recommendations.append({
            'type': 'reduce_kr_count',
            'message': "Consider consolidating key results (optimal: 3-5 KRs)"
        })
    elif len(objective.key_results) < 3:
        recommendations.append({
            'type': 'increase_kr_count',
            'message': "Consider adding more key results for better measurability"
        })
    
    return recommendations

def _generate_portfolio_recommendations(optimizations):
    """Generate portfolio-level OKR recommendations"""
    avg_quality = np.mean([opt['kr_quality_score'] for opt in optimizations])
    
    recommendations = []
    
    if avg_quality < 0.6:
        recommendations.append({
            'type': 'portfolio_quality',
            'priority': 'high',
            'message': "Portfolio-wide KR quality improvement needed"
        })
    
    return recommendations

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)