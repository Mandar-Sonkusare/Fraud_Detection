"""
Behavioral Fraud Analysis Module
Analyzes user activity patterns to identify abnormal behavior
"""

from typing import Dict, List, Optional
from datetime import datetime, timedelta
from collections import defaultdict
import json

class BehavioralAnalyzer:
    """Analyzes user behavior patterns for fraud detection"""
    
    def __init__(self):
        self.user_activity = defaultdict(list)  # user_id -> list of activities
        self.message_patterns = defaultdict(list)  # user_id -> list of messages
    
    def analyze_user_behavior(self, user_id: str, message: str, timestamp: datetime, 
                             user_info: Optional[Dict] = None) -> Dict:
        """
        Analyze user behavior and return behavioral risk indicators
        
        Returns:
            Dict with behavioral risk score and detected anomalies
        """
        # Record activity
        activity = {
            "timestamp": timestamp.isoformat(),
            "message": message,
            "user_info": user_info or {}
        }
        self.user_activity[user_id].append(activity)
        self.message_patterns[user_id].append(message)
        
        # Analyze patterns
        anomalies = []
        risk_score = 0.0
        
        # Check for mass messaging behavior
        recent_messages = self._get_recent_messages(user_id, hours=1)
        if len(recent_messages) > 20:  # More than 20 messages in 1 hour
            anomalies.append("mass_messaging")
            risk_score += 25.0
        
        # Check for repeated scam messages
        if self._has_repeated_scam_patterns(user_id):
            anomalies.append("repeated_scam_messages")
            risk_score += 30.0
        
        # Check for newly created account with high activity
        if user_info:
            account_age_days = user_info.get("account_age_days", 365)
            if account_age_days < 7 and len(self.user_activity[user_id]) > 10:
                anomalies.append("new_account_high_activity")
                risk_score += 20.0
        
        # Check for unusual posting times (e.g., posting every minute)
        if self._has_unusual_posting_pattern(user_id):
            anomalies.append("unusual_posting_pattern")
            risk_score += 15.0
        
        # Check for identical or very similar messages
        if self._has_duplicate_messages(user_id):
            anomalies.append("duplicate_messages")
            risk_score += 20.0
        
        # Check for coordinated behavior (multiple accounts posting similar content)
        if self._has_coordinated_behavior(user_id, message):
            anomalies.append("coordinated_behavior")
            risk_score += 25.0
        
        return {
            "user_id": user_id,
            "behavioral_risk_score": min(100.0, risk_score),
            "anomalies": anomalies,
            "total_messages": len(self.user_activity[user_id]),
            "recent_message_count": len(recent_messages)
        }
    
    def _get_recent_messages(self, user_id: str, hours: int = 1) -> List[Dict]:
        """Get messages from the last N hours"""
        cutoff = datetime.now() - timedelta(hours=hours)
        activities = self.user_activity.get(user_id, [])
        return [
            act for act in activities 
            if datetime.fromisoformat(act["timestamp"]) > cutoff
        ]
    
    def _has_repeated_scam_patterns(self, user_id: str) -> bool:
        """Check if user has sent multiple scam-related messages"""
        messages = self.message_patterns.get(user_id, [])
        if len(messages) < 3:
            return False
        
        scam_keywords = [
            "free money", "click here", "verify account", "you have won",
            "urgent", "limited time", "guaranteed returns"
        ]
        
        scam_count = 0
        for message in messages[-10:]:  # Check last 10 messages
            message_lower = message.lower()
            if any(keyword in message_lower for keyword in scam_keywords):
                scam_count += 1
        
        return scam_count >= 3  # 3 or more scam-related messages
    
    def _has_unusual_posting_pattern(self, user_id: str) -> bool:
        """Check for unusual posting patterns (e.g., posting every minute)"""
        activities = self.user_activity.get(user_id, [])
        if len(activities) < 5:
            return False
        
        # Check if messages are posted at very regular intervals (bot-like behavior)
        recent_activities = sorted(activities[-10:], key=lambda x: x["timestamp"])
        if len(recent_activities) < 5:
            return False
        
        intervals = []
        for i in range(1, len(recent_activities)):
            t1 = datetime.fromisoformat(recent_activities[i-1]["timestamp"])
            t2 = datetime.fromisoformat(recent_activities[i]["timestamp"])
            intervals.append((t2 - t1).total_seconds())
        
        # If intervals are very similar (within 5 seconds), likely bot behavior
        if len(intervals) > 0:
            avg_interval = sum(intervals) / len(intervals)
            if avg_interval < 60:  # Less than 1 minute between posts
                variance = sum((x - avg_interval) ** 2 for x in intervals) / len(intervals)
                if variance < 25:  # Low variance = very regular pattern
                    return True
        
        return False
    
    def _has_duplicate_messages(self, user_id: str) -> bool:
        """Check if user has sent duplicate or very similar messages"""
        messages = self.message_patterns.get(user_id, [])
        if len(messages) < 2:
            return False
        
        # Simple similarity check (in production, use more sophisticated methods)
        seen_messages = set()
        for message in messages[-20:]:  # Check last 20 messages
            message_normalized = message.lower().strip()
            if message_normalized in seen_messages:
                return True
            seen_messages.add(message_normalized)
        
        return False
    
    def _has_coordinated_behavior(self, user_id: str, message: str) -> bool:
        """Check for coordinated behavior (simplified - in production, use ML)"""
        # This is a simplified check. In production, you'd compare across users
        # and use more sophisticated pattern matching
        message_lower = message.lower()
        
        # Check if message contains common scam phrases that appear in coordinated campaigns
        coordinated_patterns = [
            "click here to claim",
            "verify your account now",
            "limited time offer",
            "act now before it's too late"
        ]
        
        return any(pattern in message_lower for pattern in coordinated_patterns)
    
    def get_user_risk_profile(self, user_id: str) -> Dict:
        """Get comprehensive risk profile for a user"""
        activities = self.user_activity.get(user_id, [])
        messages = self.message_patterns.get(user_id, [])
        
        if not activities:
            return {
                "user_id": user_id,
                "risk_level": "low",
                "total_activities": 0,
                "anomalies": []
            }
        
        # Analyze behavior
        behavior_analysis = self.analyze_user_behavior(
            user_id, 
            messages[-1] if messages else "", 
            datetime.now()
        )
        
        # Determine overall risk level
        risk_score = behavior_analysis["behavioral_risk_score"]
        if risk_score > 70:
            risk_level = "high"
        elif risk_score > 40:
            risk_level = "medium"
        else:
            risk_level = "low"
        
        return {
            "user_id": user_id,
            "risk_level": risk_level,
            "behavioral_risk_score": risk_score,
            "total_activities": len(activities),
            "anomalies": behavior_analysis["anomalies"],
            "recent_message_count": behavior_analysis["recent_message_count"]
        }

# Global instance
behavioral_analyzer = BehavioralAnalyzer()
