from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import pickle
import json
from typing import Optional, Dict, List
from datetime import datetime

# Import behavioral analysis (handle import error gracefully)
try:
    from behavioral_analysis import behavioral_analyzer
    BEHAVIORAL_ANALYSIS_AVAILABLE = True
except ImportError:
    BEHAVIORAL_ANALYSIS_AVAILABLE = False
    print("Warning: Behavioral analysis module not available")

app = FastAPI(title="Social Media Fraud Detection API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Fraud detection model paths
FRAUD_MODEL_DIR = "./fraud_detection_classifier"

# Load fraud detection models
vectorizer = None
fraud_models = {}
model_info = None

# Load fraud detection models
if os.path.exists(os.path.join(FRAUD_MODEL_DIR, "vectorizer.pkl")):
    with open(os.path.join(FRAUD_MODEL_DIR, "vectorizer.pkl"), "rb") as f:
        vectorizer = pickle.load(f)
    
    for name in ["logreg", "svm", "random_forest", "grad_boost", "naive_bayes", "mlp"]:
        path = os.path.join(FRAUD_MODEL_DIR, f"model_{name}.pkl")
        if os.path.exists(path):
            with open(path, "rb") as f:
                fraud_models[name] = pickle.load(f)
    
    # Load model info if available
    info_path = os.path.join(FRAUD_MODEL_DIR, "model_info.json")
    if os.path.exists(info_path):
        with open(info_path, "r") as f:
            model_info = json.load(f)

# Fraud detection logging (for cyber forensic support)
fraud_logs = []
FRAUD_LOG_FILE = "./fraud_detection_logs.json"

def log_fraud_detection(text: str, prediction: str, confidence: float, risk_score: float, 
                       detected_patterns: List[str], fraud_type: str, user_info: Optional[Dict] = None):
    """Log fraud detection results for forensic analysis"""
    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "text": text,
        "prediction": prediction,
        "confidence": confidence,
        "risk_score": risk_score,
        "detected_patterns": detected_patterns,
        "fraud_type": fraud_type,
        "user_info": user_info or {}
    }
    fraud_logs.append(log_entry)
    
    # Save to file periodically (in production, use proper database)
    if len(fraud_logs) % 10 == 0:
        try:
            with open(FRAUD_LOG_FILE, "w") as f:
                json.dump(fraud_logs, f, indent=2)
        except Exception as e:
            print(f"Error saving fraud logs: {e}")

# Pydantic models
class TextInput(BaseModel):
    text: str
    model_name: Optional[str] = None  # one of: logreg, svm, random_forest, grad_boost, naive_bayes, mlp
    user_info: Optional[Dict] = None  # For behavioral analysis

class FraudPredictionResponse(BaseModel):
    text: str
    prediction: str  # normal, suspicious, fraudulent
    confidence: float
    risk_score: float
    detected_patterns: List[str]
    fraud_type: str  # legitimate, spam, phishing, smishing, financial_scam, fake_giveaway
    model: str
    model_accuracy: Optional[float] = None

def normalize_leetspeak(text: str) -> str:
    """
    Normalize leetspeak and obfuscated text to standard form.
    This helps catch scams that use creative spelling to evade detection.
    """
    import re
    
    # Common leetspeak substitutions
    replacements = {
        '0': 'o',
        '1': 'i',
        '3': 'e',
        '4': 'a',
        '5': 's',
        '7': 't',
        '8': 'b',
        '@': 'a',
        '$': 's',
        '!': 'i',
        '|': 'l',
        '()': 'o',
        '[]': 'i',
        '<': 'c',
        '>': 'c',
        '—': ' ',  # em dash
        '–': ' ',  # en dash
        '_': ' ',
    }
    
    normalized = text.lower()
    for old, new in replacements.items():
        normalized = normalized.replace(old, new)
    
    # Remove spaces between letters (e.g., "f r e e" -> "free")
    # This catches obfuscation like "F r e e  g i f t"
    normalized = re.sub(r'(?<=\w)\s+(?=\w)', '', normalized)
    
    # Remove excessive spaces
    normalized = ' '.join(normalized.split())
    
    return normalized

def detect_fraud_patterns(text: str) -> tuple[List[str], str]:
    """
    Detect specific fraud patterns in text.
    Returns: (patterns_list, fraud_type)
    """
    text_lower = text.lower()
    
    # Normalize leetspeak for better detection
    text_normalized = normalize_leetspeak(text)
    
    # Use normalized text for pattern matching
    text_for_matching = text_normalized
    
    patterns = []
    fraud_type = "unknown"
    
    # URL Analysis - check for suspicious URLs
    import re
    url_pattern = r'https?://[^\s]+'
    urls = re.findall(url_pattern, text_lower)
    
    suspicious_url = False
    shortened_url = False
    
    if urls:
        for url in urls:
            # Check for shortened URLs
            shortened_domains = ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly', 
                               'is.gd', 'buff.ly', 'adf.ly', 'sm.in', 'short.link']
            if any(domain in url for domain in shortened_domains):
                shortened_url = True
                patterns.append("shortened_url")
            
            # Check for suspicious TLDs
            suspicious_tlds = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.work']
            if any(tld in url for tld in suspicious_tlds):
                suspicious_url = True
                patterns.append("suspicious_domain")
    
    # Check for "click here" patterns (common in scams)
    click_patterns = ['click here', 'click now', 'click below', 'click link', 'click the link',
                     'tap here', 'tap now', 'press here']
    if any(pattern in text_for_matching for pattern in click_patterns):
        patterns.append("click_bait")
    
    # Money amount detection
    money_pattern = r'\$\s*\d+|\d+\s*\$|\d+\s*dollars?|\d+\s*usd'
    money_matches = re.findall(money_pattern, text_lower)
    has_money_amount = len(money_matches) > 0
    
    if has_money_amount:
        patterns.append("money_amount")
        # Extract amount
        try:
            amount_str = re.findall(r'\d+', money_matches[0])[0]
            amount = int(amount_str)
            if amount >= 50:  # Amounts over $50 are more suspicious
                patterns.append("large_amount")
        except:
            pass
    
    # CRITICAL: Credential theft patterns (highest priority)
    credential_theft_keywords = [
        "social security number", "ssn", "social security", "give your password",
        "provide your password", "send your password", "enter your pin",
        "credit card number", "cvv", "card details", "bank account number",
        "routing number", "give your", "provide your", "send your",
        "enter your password", "confirm password", "type your password"
    ]
    
    # Personal information requests
    personal_info_keywords = [
        "date of birth", "mother's maiden name", "driver's license",
        "passport number", "tax id", "ein number", "full name and address"
    ]
    
    # Voucher and gift card scams
    voucher_scam_keywords = [
        "redeem voucher", "gift card", "play store voucher", "app store voucher",
        "google play", "steam card", "itunes card", "amazon gift card",
        "redeem code", "voucher code", "gift code", "promo code",
        "claim voucher", "free voucher", "win voucher", "get voucher"
    ]
    
    # Prize and giveaway scams
    prize_keywords = [
        "you won", "you've won", "winner", "congratulations you",
        "claim your prize", "claim prize", "you have won", "selected winner",
        "lucky winner", "prize winner", "won the", "winning notification"
    ]
    
    # Money offer keywords
    money_offer_keywords = [
        "free money", "easy money", "quick money", "earn money",
        "make money", "get paid", "cash reward", "money reward",
        "directly into your account", "into your account", "to your account",
        "transfer to", "deposit to", "credited to"
    ]
    
    # Urgency and pressure tactics
    urgency_keywords = [
        "act now", "limited time", "expires soon", "hurry", "quick",
        "immediately", "urgent", "don't miss", "last chance", "today only",
        "limited offer", "offer expires", "act fast", "right now"
    ]
    
    # Phishing patterns
    phishing_keywords = [
        "verify your account", "suspended account", "click here immediately",
        "urgent action required", "confirm your identity", "update your information",
        "your account will be closed", "unauthorized login attempt", "security alert",
        "verify your email", "confirm your password", "account verification",
        "suspicious activity detected", "login from new device", "protect your account",
        "restore access", "limited access", "unusual activity", "account has been locked",
        "verify now", "confirm now", "act immediately", "within 24 hours"
    ]
    
    # Smishing patterns (SMS-style)
    smishing_keywords = [
        "txt", "msg", "reply", "text back", "sms", "call now", "dial",
        "contact us at", "reply yes", "reply stop", "text to", "call immediately"
    ]
    
    # Impersonation patterns
    impersonation_keywords = [
        "official bank", "customer care", "support team", "verified account",
        "this is your bank", "we are contacting you from", "bank representative",
        "customer service", "official support", "trusted partner", "authorized dealer"
    ]
    
    # Scam patterns
    scam_keywords = [
        "free money", "get rich quick", "guaranteed returns", "no risk investment",
        "limited time offer", "act now", "exclusive opportunity", "you have won",
        "claim your prize", "inheritance", "lottery winner", "congratulations you won",
        "claim your reward", "free gift", "winner selected"
    ]
    
    # Financial fraud patterns
    financial_keywords = [
        "send money", "wire transfer", "bitcoin", "cryptocurrency investment",
        "double your money", "investment opportunity", "trading signals",
        "forex trading", "binary options", "pyramid scheme", "ponzi scheme",
        "multi-level marketing", "mlm opportunity", "passive income", "earn $",
        "make money", "profit guaranteed", "risk free"
    ]
    
    # Fake giveaway patterns
    giveaway_keywords = [
        "free iphone", "free ipad", "free laptop", "giveaway", "contest winner",
        "retweet to win", "share to win", "like and share", "tag friends to win",
        "you won", "winner alert", "prize notification", "claim prize"
    ]
    
    # Spam patterns
    spam_keywords = [
        "buy now", "limited time", "offer expires", "discount", "sale",
        "subscribe", "unsubscribe", "promotion", "advertisement", "deal"
    ]
    
    # Count matches and determine fraud type (use normalized text)
    credential_score = sum(1 for kw in credential_theft_keywords if kw in text_for_matching)
    personal_info_score = sum(1 for kw in personal_info_keywords if kw in text_for_matching)
    voucher_score = sum(1 for kw in voucher_scam_keywords if kw in text_for_matching)
    prize_score = sum(1 for kw in prize_keywords if kw in text_for_matching)
    money_offer_score = sum(1 for kw in money_offer_keywords if kw in text_for_matching)
    urgency_score = sum(1 for kw in urgency_keywords if kw in text_for_matching)
    phishing_score = sum(1 for kw in phishing_keywords if kw in text_for_matching)
    smishing_score = sum(1 for kw in smishing_keywords if kw in text_for_matching)
    impersonation_score = sum(1 for kw in impersonation_keywords if kw in text_for_matching)
    scam_score = sum(1 for kw in scam_keywords if kw in text_for_matching)
    financial_score = sum(1 for kw in financial_keywords if kw in text_for_matching)
    giveaway_score = sum(1 for kw in giveaway_keywords if kw in text_for_matching)
    spam_score = sum(1 for kw in spam_keywords if kw in text_for_matching)
    
    # Determine primary fraud type (credential theft gets highest priority)
    scores = {
        'credential_theft': credential_score * 3,  # 3x weight for credential theft
        'voucher_scam': (voucher_score + prize_score) * 2.5,  # 2.5x weight for voucher scams
        'money_offer': money_offer_score * 2,  # 2x weight for money offers
        'phishing': phishing_score + impersonation_score,
        'smishing': smishing_score,
        'financial_scam': financial_score,
        'fake_giveaway': giveaway_score + scam_score,
        'spam': spam_score
    }
    
    if max(scores.values()) > 0:
        fraud_type = max(scores, key=scores.get)
        # Map back to standard fraud types
        if fraud_type == 'credential_theft':
            fraud_type = 'phishing'
        elif fraud_type == 'voucher_scam':
            fraud_type = 'fake_giveaway'
        elif fraud_type == 'money_offer':
            fraud_type = 'financial_scam'
    
    # Add detected patterns
    if credential_score > 0 or personal_info_score > 0:
        patterns.append("credential_theft")
    if voucher_score > 0:
        patterns.append("voucher_scam")
    if prize_score > 0:
        patterns.append("prize_scam")
    if money_offer_score > 0:
        patterns.append("money_offer")
    if urgency_score > 0:
        patterns.append("urgency_tactics")
    if phishing_score > 0:
        patterns.append("phishing")
    if smishing_score > 0:
        patterns.append("smishing")
    if impersonation_score > 0:
        patterns.append("impersonation")
    if scam_score > 0 or giveaway_score > 0:
        patterns.append("scam")
    if financial_score > 0:
        patterns.append("financial_fraud")
    if spam_score > 0:
        patterns.append("spam")
    
    return patterns, fraud_type

def analyze_url_risk(text: str) -> float:
    """Calculate risk score based on URL analysis"""
    import re
    risk = 0.0
    
    url_pattern = r'https?://[^\s]+'
    urls = re.findall(url_pattern, text.lower())
    
    if urls:
        for url in urls:
            # Shortened URLs are highly suspicious
            shortened_domains = ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly', 
                               'is.gd', 'buff.ly', 'adf.ly', 'sm.in', 'short.link']
            if any(domain in url for domain in shortened_domains):
                risk += 25.0
            
            # Suspicious TLDs
            suspicious_tlds = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.work', '.in']
            if any(tld in url for tld in suspicious_tlds):
                risk += 15.0
            
            # IP address in URL
            if re.search(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', url):
                risk += 20.0
    
    return min(risk, 40.0)  # Cap at 40

def analyze_money_risk(text: str) -> float:
    """Calculate risk score based on money mentions"""
    import re
    risk = 0.0
    
    money_pattern = r'\$\s*\d+|\d+\s*\$|\d+\s*dollars?|\d+\s*usd'
    money_matches = re.findall(money_pattern, text.lower())
    
    if money_matches:
        try:
            # Extract the highest amount mentioned
            amounts = []
            for match in money_matches:
                amount_str = re.findall(r'\d+', match)[0]
                amounts.append(int(amount_str))
            
            max_amount = max(amounts)
            
            # Risk increases with amount
            if max_amount >= 1000:
                risk = 25.0
            elif max_amount >= 500:
                risk = 20.0
            elif max_amount >= 100:
                risk = 15.0
            elif max_amount >= 50:
                risk = 10.0
            else:
                risk = 5.0
        except:
            risk = 5.0
    
    return risk

def calculate_risk_score(prediction: str, confidence: float, patterns: List[str], 
                        text: str, behavioral_score: float = 0.0) -> float:
    """Calculate fraud risk score (0-100)"""
    base_score = 0.0
    
    # Base score from prediction
    if prediction == "fraudulent":
        base_score = 70.0 + (confidence * 30.0)  # 70-100
    elif prediction == "suspicious":
        base_score = 40.0 + (confidence * 35.0)  # 40-75 (increased from 30-70)
    else:
        base_score = confidence * 30.0  # 0-30
    
    # Add pattern-based risk
    pattern_risk = {
        "credential_theft": 30.0,  # Highest risk
        "voucher_scam": 25.0,  # Very high risk
        "prize_scam": 25.0,
        "money_offer": 20.0,
        "money_amount": 10.0,
        "large_amount": 15.0,
        "shortened_url": 20.0,
        "suspicious_domain": 15.0,
        "click_bait": 15.0,  # Click here/now patterns
        "urgency_tactics": 10.0,
        "phishing": 15.0,
        "smishing": 15.0,
        "impersonation": 20.0,
        "scam": 15.0,
        "financial_fraud": 25.0,
        "spam": 5.0
    }
    
    for pattern in patterns:
        base_score += pattern_risk.get(pattern, 0.0)
    
    # Add URL risk
    url_risk = analyze_url_risk(text)
    base_score += url_risk
    
    # Add money risk
    money_risk = analyze_money_risk(text)
    base_score += money_risk
    
    # Add behavioral risk (weighted 20% of behavioral score)
    base_score += behavioral_score * 0.2
    
    return min(100.0, base_score)

@app.post("/predict", response_model=FraudPredictionResponse)
async def predict_fraud(input_data: TextInput):
    """
    Predict fraud classification: Normal, Suspicious, or Fraudulent
    
    Returns:
    - prediction: normal, suspicious, or fraudulent
    - confidence: model confidence (0-1)
    - risk_score: fraud risk score (0-100)
    - detected_patterns: list of detected fraud patterns
    - fraud_type: specific type of fraud detected
    - model: which model was used
    """
    
    if not vectorizer or not fraud_models:
        raise HTTPException(status_code=500, detail="Models not loaded")
    
    text = input_data.text
    
    if not text or len(text.strip()) == 0:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    # Detect fraud patterns
    detected_patterns, fraud_type = detect_fraud_patterns(text)
    
    # RULE-BASED OVERRIDE: Force fraudulent classification for critical patterns
    force_fraudulent = False
    override_reason = None
    
    # Normalize text for rule checking
    text_normalized = normalize_leetspeak(text)
    
    # Check for critical fraud indicators that should always be flagged
    critical_indicators = [
        ("social security", "SSN request detected"),
        ("give your password", "Password request detected"),
        ("provide your password", "Password request detected"),
        ("send your password", "Password request detected"),
        ("credit card number", "Credit card request detected"),
        ("bank account number", "Bank account request detected"),
        ("cvv", "CVV request detected"),
        ("routing number", "Routing number request detected"),
        ("enter your pin", "PIN request detected"),
    ]
    
    # Voucher/Prize scam indicators (combination required)
    # Check for individual words that when combined indicate scams
    voucher_indicators = ["redeem", "voucher", "gift card", "play store", "claim prize", "you won", "free gift", 
                         "freegift", "gift", "prize", "won", "winner", "congratulations", "selected", "chosen",
                         "youhavebeenselected", "youhavebeenchosen", "youarewinner"]
    money_indicators = ["$", "dollar", "usd", "money", "cash", "prize", "reward", "free"]
    url_indicators = ["http://", "https://", "bit.ly", "tinyurl", ".in", ".tk", "click", "link", "here", "below", "check"]
    urgency_indicators = ["now", "immediately", "quick", "hurry", "limited", "today", "expires", "before", "urgent"]
    
    # Check critical indicators (use normalized text)
    for indicator, reason in critical_indicators:
        if indicator in text_normalized:
            force_fraudulent = True
            override_reason = reason
            if "credential_theft" not in detected_patterns:
                detected_patterns.append("credential_theft")
            break
    
    # Check voucher/prize scam combination (use normalized text)
    if not force_fraudulent:
        has_voucher = any(v in text_normalized for v in voucher_indicators)
        has_money = any(m in text_normalized for m in money_indicators)
        has_url = any(u in text_normalized for u in url_indicators)
        has_urgency = any(u in text_normalized for u in urgency_indicators)
        
        # AGGRESSIVE: If has "selected/chosen/winner" + "link/click/check" = scam
        selection_words = ["selected", "chosen", "winner", "youhavebeenselected", "youhavebeenchosen"]
        has_selection = any(s in text_normalized for s in selection_words)
        
        if has_selection and has_url:
            force_fraudulent = True
            override_reason = "Selection scam detected (selected/chosen + link)"
            if "voucher_scam" not in detected_patterns:
                detected_patterns.append("voucher_scam")
        # If message has prize/gift + (money OR urgency) + (url OR click) = likely scam
        elif has_voucher and (has_money or has_urgency) and has_url:
            force_fraudulent = True
            override_reason = "Prize/gift scam pattern detected (prize + urgency/money + link)"
            if "voucher_scam" not in detected_patterns:
                detected_patterns.append("voucher_scam")
        # Or just prize + click + urgency (even without explicit URL)
        elif has_voucher and has_urgency and "click" in text_normalized:
            force_fraudulent = True
            override_reason = "Prize scam with urgency and click detected"
            if "voucher_scam" not in detected_patterns:
                detected_patterns.append("voucher_scam")
    
    # Calculate behavioral risk if user info provided
    behavioral_score = 0.0
    if BEHAVIORAL_ANALYSIS_AVAILABLE and input_data.user_info:
        try:
            behavioral_score = behavioral_analyzer.calculate_risk_score(input_data.user_info)
        except Exception as e:
            print(f"Behavioral analysis error: {e}")
    
    # Select model
    model_name = input_data.model_name
    if not model_name or model_name not in fraud_models:
        # Use best model from training
        model_name = model_info.get("best_model", "logreg") if model_info else "logreg"
    
    clf = fraud_models[model_name]
    
    # Vectorize and predict
    try:
        X = vectorizer.transform([text])
        prediction_num = clf.predict(X)[0]
        
        # APPLY RULE-BASED OVERRIDE
        if force_fraudulent and prediction_num != 2:
            print(f"OVERRIDE: Forcing fraudulent classification - {override_reason}")
            prediction_num = 2  # Force fraudulent
            confidence = 0.95  # High confidence for rule-based detection
        else:
            # Get confidence (probability)
            if hasattr(clf, "predict_proba"):
                probabilities = clf.predict_proba(X)[0]
                confidence = float(probabilities[prediction_num])
            elif hasattr(clf, "decision_function"):
                # For SVM
                decision = clf.decision_function(X)[0]
                if len(decision.shape) == 0 or decision.shape[0] == 1:
                    confidence = float(abs(decision))
                else:
                    confidence = float(max(abs(decision)))
                confidence = min(1.0, confidence / 2.0)  # Normalize
            else:
                confidence = 0.8  # Default confidence
        
        # Map prediction to label
        prediction_map = {0: "normal", 1: "suspicious", 2: "fraudulent"}
        prediction = prediction_map.get(prediction_num, "unknown")
        
        # If no patterns detected but predicted as fraudulent, set generic fraud type
        if prediction == "fraudulent" and fraud_type == "unknown":
            fraud_type = "phishing"  # Default to phishing
        elif prediction == "suspicious" and fraud_type == "unknown":
            fraud_type = "spam"
        elif prediction == "normal":
            fraud_type = "legitimate"
        
        # Calculate risk score
        risk_score = calculate_risk_score(prediction, confidence, detected_patterns, text, behavioral_score)
        
        # Get model accuracy
        model_accuracy = None
        if model_info and "all_results" in model_info:
            model_results = model_info["all_results"].get(model_name, {})
            model_accuracy = model_results.get("accuracy")
        
        # Log detection
        log_fraud_detection(text, prediction, confidence, risk_score, detected_patterns, fraud_type, input_data.user_info)
        
        return FraudPredictionResponse(
            text=text,
            prediction=prediction,
            confidence=confidence,
            risk_score=risk_score,
            detected_patterns=detected_patterns,
            fraud_type=fraud_type,
            model=model_name,
            model_accuracy=model_accuracy
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/health")
async def health_check():
    """Check API health and loaded models"""
    return {
        "status": "healthy",
        "fraud_models_loaded": list(fraud_models.keys()),
        "vectorizer_loaded": bool(vectorizer),
        "model_info": model_info
    }

@app.get("/logs")
async def get_fraud_logs(limit: int = 100):
    """Get fraud detection logs for forensic analysis"""
    return {
        "total_logs": len(fraud_logs),
        "logs": fraud_logs[-limit:] if limit > 0 else fraud_logs
    }

@app.get("/stats")
async def get_fraud_stats():
    """Get fraud detection statistics"""
    if not fraud_logs:
        return {
            "total_analyzed": 0,
            "normal": 0,
            "suspicious": 0,
            "fraudulent": 0,
            "average_risk_score": 0.0,
            "common_patterns": []
        }
    
    total = len(fraud_logs)
    normal = sum(1 for log in fraud_logs if log["prediction"] == "normal")
    suspicious = sum(1 for log in fraud_logs if log["prediction"] == "suspicious")
    fraudulent = sum(1 for log in fraud_logs if log["prediction"] == "fraudulent")
    
    avg_risk = sum(log["risk_score"] for log in fraud_logs) / total if total > 0 else 0.0
    
    # Count pattern occurrences
    pattern_counts = {}
    for log in fraud_logs:
        for pattern in log["detected_patterns"]:
            pattern_counts[pattern] = pattern_counts.get(pattern, 0) + 1
    
    common_patterns = sorted(pattern_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    
    return {
        "total_analyzed": total,
        "normal": normal,
        "suspicious": suspicious,
        "fraudulent": fraudulent,
        "average_risk_score": round(avg_risk, 2),
        "common_patterns": [{"pattern": p, "count": c} for p, c in common_patterns]
    }

@app.get("/behavioral/{user_id}")
async def get_user_behavioral_profile(user_id: str):
    """Get behavioral risk profile for a specific user"""
    if not BEHAVIORAL_ANALYSIS_AVAILABLE:
        raise HTTPException(status_code=501, detail="Behavioral analysis not available")
    
    try:
        profile = behavioral_analyzer.get_user_profile(user_id)
        return profile
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving profile: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*70)
    print("🚀 Starting Social Media Fraud Detection API")
    print("="*70)
    print(f"Fraud models loaded: {list(fraud_models.keys())}")
    print("="*70 + "\n")
    uvicorn.run(app, host="0.0.0.0", port=8000)
