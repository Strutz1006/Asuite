from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from scipy import stats
import uvicorn
import os

app = FastAPI(
    title="Aesyros Pulse Service",
    description="KPI Design and Tracking Analytics Service",
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
class KPIValue(BaseModel):
    kpi_id: str
    timestamp: str
    value: float
    target: Optional[float] = None
    category: str

class KPICalculationRequest(BaseModel):
    kpi_values: List[KPIValue]
    calculation_type: str  # "trend", "variance", "target_progress"

class AnomalyDetectionRequest(BaseModel):
    kpi_values: List[KPIValue]
    sensitivity: float = 0.1  # Lower = more sensitive

class TrendAnalysisRequest(BaseModel):
    kpi_values: List[KPIValue]
    time_period: int = 30  # days

class ForecastingRequest(BaseModel):
    kpi_values: List[KPIValue]
    forecast_horizon: int = 30  # days

class CorrelationRequest(BaseModel):
    kpi_datasets: List[List[KPIValue]]
    correlation_threshold: float = 0.7

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "pulse-service"}

@app.post("/calculate-kpis")
async def calculate_kpis(request: KPICalculationRequest):
    """Calculate KPI metrics and insights"""
    try:
        # Convert to DataFrame
        kpi_data = []
        for kpi in request.kpi_values:
            kpi_data.append({
                'kpi_id': kpi.kpi_id,
                'timestamp': pd.to_datetime(kpi.timestamp),
                'value': kpi.value,
                'target': kpi.target,
                'category': kpi.category
            })
        
        df = pd.DataFrame(kpi_data)
        
        results = {}
        
        if request.calculation_type == "trend":
            results = _calculate_trends(df)
        elif request.calculation_type == "variance":
            results = _calculate_variance(df)
        elif request.calculation_type == "target_progress":
            results = _calculate_target_progress(df)
        else:
            # Calculate all
            results = {
                "trends": _calculate_trends(df),
                "variance": _calculate_variance(df),
                "target_progress": _calculate_target_progress(df)
            }
        
        return results
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"KPI calculation failed: {str(e)}")

@app.post("/detect-anomalies")
async def detect_anomalies(request: AnomalyDetectionRequest):
    """Detect anomalies in KPI data using Isolation Forest"""
    try:
        kpi_data = []
        for kpi in request.kpi_values:
            kpi_data.append({
                'kpi_id': kpi.kpi_id,
                'timestamp': pd.to_datetime(kpi.timestamp),
                'value': kpi.value,
                'category': kpi.category
            })
        
        df = pd.DataFrame(kpi_data)
        anomalies = []
        
        # Group by KPI for anomaly detection
        for kpi_id in df['kpi_id'].unique():
            kpi_df = df[df['kpi_id'] == kpi_id].copy()
            
            if len(kpi_df) >= 10:  # Need sufficient data points
                # Prepare features for anomaly detection
                kpi_df = kpi_df.sort_values('timestamp')
                kpi_df['rolling_mean'] = kpi_df['value'].rolling(window=5, min_periods=1).mean()
                kpi_df['rolling_std'] = kpi_df['value'].rolling(window=5, min_periods=1).std()
                
                # Features: value, rolling mean, rolling std
                features = kpi_df[['value', 'rolling_mean', 'rolling_std']].fillna(0)
                
                # Isolation Forest
                iso_forest = IsolationForest(contamination=request.sensitivity, random_state=42)
                anomaly_labels = iso_forest.fit_predict(features)
                
                # Get anomalous points
                anomaly_indices = np.where(anomaly_labels == -1)[0]
                
                for idx in anomaly_indices:
                    row = kpi_df.iloc[idx]
                    anomalies.append({
                        'kpi_id': kpi_id,
                        'timestamp': row['timestamp'].isoformat(),
                        'value': float(row['value']),
                        'anomaly_score': float(iso_forest.decision_function(features.iloc[[idx]])[0]),
                        'severity': _get_anomaly_severity(row['value'], kpi_df['value'])
                    })
        
        return {
            'anomalies': anomalies,
            'total_anomalies': len(anomalies),
            'anomaly_summary': _summarize_anomalies(anomalies)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Anomaly detection failed: {str(e)}")

@app.post("/analyze-trends")
async def analyze_trends(request: TrendAnalysisRequest):
    """Analyze KPI trends and patterns"""
    try:
        kpi_data = []
        for kpi in request.kpi_values:
            kpi_data.append({
                'kpi_id': kpi.kpi_id,
                'timestamp': pd.to_datetime(kpi.timestamp),
                'value': kpi.value,
                'category': kpi.category
            })
        
        df = pd.DataFrame(kpi_data)
        
        # Filter to time period
        cutoff_date = df['timestamp'].max() - pd.Timedelta(days=request.time_period)
        df = df[df['timestamp'] >= cutoff_date]
        
        trend_results = []
        
        for kpi_id in df['kpi_id'].unique():
            kpi_df = df[df['kpi_id'] == kpi_id].copy()
            kpi_df = kpi_df.sort_values('timestamp')
            
            if len(kpi_df) >= 3:
                trend_analysis = _analyze_kpi_trend(kpi_df)
                trend_results.append({
                    'kpi_id': kpi_id,
                    **trend_analysis
                })
        
        return {
            'trends': trend_results,
            'period_days': request.time_period,
            'portfolio_trend': _calculate_portfolio_trend(trend_results)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Trend analysis failed: {str(e)}")

@app.post("/predict-values")
async def predict_values(request: ForecastingRequest):
    """Predict future KPI values using linear regression"""
    try:
        kpi_data = []
        for kpi in request.kpi_values:
            kpi_data.append({
                'kpi_id': kpi.kpi_id,
                'timestamp': pd.to_datetime(kpi.timestamp),
                'value': kpi.value,
                'category': kpi.category
            })
        
        df = pd.DataFrame(kpi_data)
        predictions = []
        
        for kpi_id in df['kpi_id'].unique():
            kpi_df = df[df['kpi_id'] == kpi_id].copy()
            kpi_df = kpi_df.sort_values('timestamp')
            
            if len(kpi_df) >= 5:  # Need minimum data for prediction
                prediction = _predict_kpi_values(kpi_df, request.forecast_horizon)
                predictions.append({
                    'kpi_id': kpi_id,
                    **prediction
                })
        
        return {
            'predictions': predictions,
            'forecast_horizon_days': request.forecast_horizon
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Forecasting failed: {str(e)}")

@app.post("/find-correlations")
async def find_correlations(request: CorrelationRequest):
    """Find correlations between different KPIs"""
    try:
        correlations = []
        
        # Convert datasets to DataFrames
        dfs = []
        for i, dataset in enumerate(request.kpi_datasets):
            kpi_data = []
            for kpi in dataset:
                kpi_data.append({
                    'timestamp': pd.to_datetime(kpi.timestamp),
                    'value': kpi.value,
                    'kpi_id': kpi.kpi_id
                })
            
            if kpi_data:
                df = pd.DataFrame(kpi_data)
                df = df.groupby(['timestamp', 'kpi_id'])['value'].mean().reset_index()
                dfs.append(df)
        
        # Find correlations between KPIs
        if len(dfs) >= 2:
            for i in range(len(dfs)):
                for j in range(i + 1, len(dfs)):
                    correlation = _calculate_correlation(dfs[i], dfs[j])
                    
                    if abs(correlation['correlation_coefficient']) >= request.correlation_threshold:
                        correlations.append(correlation)
        
        return {
            'correlations': correlations,
            'correlation_threshold': request.correlation_threshold,
            'strong_correlations': len([c for c in correlations if abs(c['correlation_coefficient']) >= 0.8])
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Correlation analysis failed: {str(e)}")

# Helper functions
def _calculate_trends(df):
    """Calculate trend metrics for KPIs"""
    trends = []
    
    for kpi_id in df['kpi_id'].unique():
        kpi_df = df[df['kpi_id'] == kpi_id].copy()
        kpi_df = kpi_df.sort_values('timestamp')
        
        if len(kpi_df) >= 2:
            # Calculate basic trend metrics
            values = kpi_df['value'].values
            
            # Linear trend
            x = np.arange(len(values))
            slope, intercept, r_value, p_value, std_err = stats.linregress(x, values)
            
            # Percent change
            pct_change = ((values[-1] - values[0]) / values[0]) * 100 if values[0] != 0 else 0
            
            trends.append({
                'kpi_id': kpi_id,
                'trend_direction': 'increasing' if slope > 0 else 'decreasing',
                'trend_strength': abs(r_value),
                'percent_change': float(pct_change),
                'slope': float(slope),
                'r_squared': float(r_value ** 2)
            })
    
    return trends

def _calculate_variance(df):
    """Calculate variance metrics for KPIs"""
    variance_metrics = []
    
    for kpi_id in df['kpi_id'].unique():
        kpi_df = df[df['kpi_id'] == kpi_id]
        values = kpi_df['value'].values
        
        variance_metrics.append({
            'kpi_id': kpi_id,
            'mean': float(np.mean(values)),
            'variance': float(np.var(values)),
            'std_deviation': float(np.std(values)),
            'coefficient_of_variation': float(np.std(values) / np.mean(values)) if np.mean(values) != 0 else 0,
            'volatility_level': _get_volatility_level(np.std(values) / np.mean(values) if np.mean(values) != 0 else 0)
        })
    
    return variance_metrics

def _calculate_target_progress(df):
    """Calculate progress toward targets"""
    progress_metrics = []
    
    for kpi_id in df['kpi_id'].unique():
        kpi_df = df[df['kpi_id'] == kpi_id]
        kpi_df = kpi_df.dropna(subset=['target'])
        
        if not kpi_df.empty:
            latest_value = kpi_df.iloc[-1]['value']
            target = kpi_df.iloc[-1]['target']
            
            if target != 0:
                progress_pct = (latest_value / target) * 100
                
                progress_metrics.append({
                    'kpi_id': kpi_id,
                    'current_value': float(latest_value),
                    'target_value': float(target),
                    'progress_percentage': float(progress_pct),
                    'target_status': _get_target_status(progress_pct),
                    'gap_to_target': float(target - latest_value)
                })
    
    return progress_metrics

def _get_anomaly_severity(value, series):
    """Determine anomaly severity"""
    z_score = abs((value - series.mean()) / series.std()) if series.std() > 0 else 0
    
    if z_score > 3:
        return 'high'
    elif z_score > 2:
        return 'medium'
    else:
        return 'low'

def _summarize_anomalies(anomalies):
    """Summarize anomaly detection results"""
    if not anomalies:
        return {'high': 0, 'medium': 0, 'low': 0}
    
    severity_counts = {}
    for anomaly in anomalies:
        severity = anomaly['severity']
        severity_counts[severity] = severity_counts.get(severity, 0) + 1
    
    return severity_counts

def _analyze_kpi_trend(kpi_df):
    """Analyze trend for a single KPI"""
    values = kpi_df['value'].values
    x = np.arange(len(values))
    
    # Linear regression
    slope, intercept, r_value, p_value, std_err = stats.linregress(x, values)
    
    # Moving averages
    ma_5 = kpi_df['value'].rolling(window=min(5, len(kpi_df))).mean().iloc[-1]
    ma_10 = kpi_df['value'].rolling(window=min(10, len(kpi_df))).mean().iloc[-1]
    
    # Trend classification
    trend_strength = abs(r_value)
    if trend_strength > 0.7:
        trend_confidence = 'high'
    elif trend_strength > 0.4:
        trend_confidence = 'medium'
    else:
        trend_confidence = 'low'
    
    return {
        'trend_direction': 'increasing' if slope > 0 else 'decreasing',
        'trend_strength': float(trend_strength),
        'trend_confidence': trend_confidence,
        'slope': float(slope),
        'moving_average_5': float(ma_5),
        'moving_average_10': float(ma_10),
        'recent_volatility': float(kpi_df['value'].tail(5).std())
    }

def _calculate_portfolio_trend(trend_results):
    """Calculate overall portfolio trend"""
    if not trend_results:
        return {'direction': 'stable', 'strength': 0}
    
    increasing_count = sum(1 for t in trend_results if t['trend_direction'] == 'increasing')
    total_count = len(trend_results)
    
    avg_strength = np.mean([t['trend_strength'] for t in trend_results])
    
    if increasing_count / total_count > 0.6:
        direction = 'mostly_increasing'
    elif increasing_count / total_count < 0.4:
        direction = 'mostly_decreasing'
    else:
        direction = 'mixed'
    
    return {
        'direction': direction,
        'average_strength': float(avg_strength),
        'increasing_ratio': float(increasing_count / total_count)
    }

def _predict_kpi_values(kpi_df, forecast_horizon):
    """Predict future KPI values"""
    values = kpi_df['value'].values
    x = np.arange(len(values)).reshape(-1, 1)
    
    # Linear regression model
    model = LinearRegression()
    model.fit(x, values)
    
    # Predict future values
    future_x = np.arange(len(values), len(values) + forecast_horizon).reshape(-1, 1)
    predictions = model.predict(future_x)
    
    # Calculate prediction intervals (simplified)
    residuals = values - model.predict(x)
    prediction_std = np.std(residuals)
    
    return {
        'predicted_values': [float(p) for p in predictions],
        'confidence_interval_lower': [float(p - 1.96 * prediction_std) for p in predictions],
        'confidence_interval_upper': [float(p + 1.96 * prediction_std) for p in predictions],
        'model_r_squared': float(model.score(x, values)),
        'prediction_uncertainty': float(prediction_std)
    }

def _calculate_correlation(df1, df2):
    """Calculate correlation between two KPI datasets"""
    # Merge on timestamp for correlation analysis
    merged = pd.merge(df1, df2, on='timestamp', suffixes=('_1', '_2'), how='inner')
    
    if len(merged) >= 3:
        correlation_coeff = merged['value_1'].corr(merged['value_2'])
        
        return {
            'kpi_1': merged['kpi_id_1'].iloc[0] if not merged.empty else 'unknown',
            'kpi_2': merged['kpi_id_2'].iloc[0] if not merged.empty else 'unknown',
            'correlation_coefficient': float(correlation_coeff),
            'correlation_strength': _get_correlation_strength(abs(correlation_coeff)),
            'data_points': len(merged)
        }
    
    return {
        'kpi_1': 'unknown',
        'kpi_2': 'unknown',
        'correlation_coefficient': 0.0,
        'correlation_strength': 'insufficient_data',
        'data_points': 0
    }

def _get_volatility_level(cv):
    """Get volatility level description"""
    if cv > 0.5:
        return 'high'
    elif cv > 0.2:
        return 'medium'
    else:
        return 'low'

def _get_target_status(progress_pct):
    """Get target achievement status"""
    if progress_pct >= 100:
        return 'achieved'
    elif progress_pct >= 80:
        return 'on_track'
    elif progress_pct >= 50:
        return 'at_risk'
    else:
        return 'off_track'

def _get_correlation_strength(abs_corr):
    """Get correlation strength description"""
    if abs_corr >= 0.8:
        return 'very_strong'
    elif abs_corr >= 0.6:
        return 'strong'
    elif abs_corr >= 0.4:
        return 'moderate'
    elif abs_corr >= 0.2:
        return 'weak'
    else:
        return 'very_weak'

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8002))
    uvicorn.run(app, host="0.0.0.0", port=port)