# Shared utilities for Python services
import os
import logging
from typing import Dict, Any

def setup_logging(service_name: str):
    """Setup logging for a service"""
    logging.basicConfig(
        level=logging.INFO,
        format=f'%(asctime)s - {service_name} - %(levelname)s - %(message)s'
    )
    return logging.getLogger(service_name)

def get_port(default_port: int) -> int:
    """Get port from environment or use default"""
    return int(os.getenv("PORT", default_port))

def validate_request_data(data: Dict[str, Any], required_fields: list) -> tuple[bool, str]:
    """Validate request data has required fields"""
    missing_fields = []
    
    for field in required_fields:
        if field not in data or data[field] is None:
            missing_fields.append(field)
    
    if missing_fields:
        return False, f"Missing required fields: {', '.join(missing_fields)}"
    
    return True, ""

def calculate_confidence_score(data_points: int, variance: float) -> float:
    """Calculate confidence score based on data quality"""
    # More data points = higher confidence
    data_confidence = min(1.0, data_points / 100)
    
    # Lower variance = higher confidence  
    variance_confidence = max(0.1, 1 - variance)
    
    return (data_confidence + variance_confidence) / 2

def normalize_score(value: float, min_val: float = 0, max_val: float = 10) -> float:
    """Normalize a score to 0-1 range"""
    if max_val == min_val:
        return 0.5
    
    normalized = (value - min_val) / (max_val - min_val)
    return max(0.0, min(1.0, normalized))

class ResponseFormatter:
    """Utility class for formatting API responses"""
    
    @staticmethod
    def success(data: Any, message: str = "Success") -> Dict[str, Any]:
        return {
            "status": "success",
            "message": message,
            "data": data
        }
    
    @staticmethod
    def error(message: str, code: str = "GENERAL_ERROR") -> Dict[str, Any]:
        return {
            "status": "error", 
            "message": message,
            "error_code": code
        }
    
    @staticmethod
    def validation_error(errors: list) -> Dict[str, Any]:
        return {
            "status": "error",
            "message": "Validation failed",
            "error_code": "VALIDATION_ERROR",
            "errors": errors
        }