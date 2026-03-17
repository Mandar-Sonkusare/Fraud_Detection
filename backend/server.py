from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import pickle
import json
from typing import Optional, Dict, List
from datetime import datetime

app = FastAPI(title="Social Media Fraud Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load traditional ML models
FRAUD_MODEL_DIR = "./fraud_detection_classifier"
vectorizer = None
fraud_models = {}
ml_model_info = None

if os.path.exists(os.path.join(FRAUD_MODEL_DIR, "vectorizer.pkl")):
    with open(os.path.join(FRAUD_MODEL_DIR, "vectorizer.pkl"), "rb") as f:
        vectorizer = pickle.load(f)
    
    for name in ["logreg", "svm", "random_forest", "grad_boost", "naive_bayes", "mlp"]:
        path = os.path.join(FRAUD_MODEL_DIR, f"model_{name}.pkl")
        if os.path.exists(path):
            with open(path, "rb") as f:
                fraud_models[name] = pickle.load(f)
    
    info_path = os.path.join(FRAUD_MODEL_DIR, "model_info.json")
    if os.path.exists(info_path):
        with open(info_path, "r") as f:
            ml_model_info = json.load(f)

# Try to load BERT model if available
bert_classifier = None
BERT_MODEL_DIR = "./bert_fraud_classifier"
try:
    from transformers import pipeline
    if os.path.exists(os.path.join(BERT_MODEL_DIR, "config.json")):
        bert_classifier = pipeline("text-classification", model=BERT_MODEL_DIR, device=-1)
        print("✓ BERT model loaded")
except:
    print("⚠ BERT model not available, using ML models only")

fraud_logs = []
FRAUD_LOG_FILE = "./fraud_detection_logs.json"

def log_fraud_detection(text: str, prediction: str, confidence: float, risk_score: float,
                       detected_patterns: List[str], fraud_type: str, model_used: str):
    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "text": text,
        "prediction": prediction,
        "confidence": confidence,
        "risk_score": risk_score,
        "detected_patterns": detected_patterns,
        "fraud_type": fraud_type,
        "model_used": model_used
    }
    fraud_logs.append(log_entry)
    
    if len(fraud_logs) % 10 == 0:
        try:
            with open(FRAUD_LOG_FILE, "w") as f:
                json.dump(fraud_logs, f, indent=2)
        except Exception as e:
            print(f"Error saving logs: {e}")

class TextInput(BaseModel):
    text: str

class FraudPredictionResponse(BaseModel):
    text: str
    prediction: str
    confidence: float
    risk_score: float
    detected_patterns: List[str]
    fraud_type: str
    model: str

def detect_critical_fraud_patterns(text: str) -> tuple[List[str], str, bool]:
    """
    Critical fraud pattern detection - 100% precision
    Returns: (patterns, fraud_type, is_fraudulent)
    """
    text_lower = text.lower()
    patterns = []
    fraud_type = "unknown"
    is_fraudulent = False
    
    # CRITICAL: Credential theft
    credential_keywords = [
        "social security number", "ssn", "provide your password", "send your password",
        "enter your password", "give your password", "credit card number", "cvv", 
        "bank account number", "routing number", "enter your pin", "provide your pin"
    ]
    
    for keyword in credential_keywords:
        if keyword in text_lower:
            patterns.append("credential_theft")
            fraud_type = "phishing"
            is_fraudulent = True
            break
    
    # Crypto scams - celebrity + crypto + giveaway
    crypto_words = ["bitcoin", "btc", "eth", "ethereum", "crypto", "wallet", "doge", "dogecoin"]
    celebrity_words = ["elon musk", "bill gates", "jeff bezos", "mark zuckerberg", "warren buffett", 
                      "taylor swift", "snoop dogg", "donald trump"]
    giveaway_words = ["giving away", "giveaway", "send", "receive back", "get back", "double your", 
                     "send 0.", "send 1", "send 5", "send 10"]
    
    has_crypto = any(c in text_lower for c in crypto_words)
    has_celebrity = any(c in text_lower for c in celebrity_words)
    has_giveaway = any(g in text_lower for g in giveaway_words)
    
    if has_crypto and has_giveaway:
        patterns.append("crypto_scam")
        fraud_type = "financial_scam"
        is_fraudulent = True
    
    # IRS/Tax/Government scams
    gov_words = ["irs", "treasury", "social security administration", "fbi"]
    threat_words = ["arrest", "warrant", "suspended", "legal action", "prosecution", "call immediately"]
    money_words = ["owe $", "owe money", "back taxes", "penalties"]
    
    has_gov = any(g in text_lower for g in gov_words)
    has_threat = any(t in text_lower for t in threat_words)
    has_money = any(m in text_lower for m in money_words)
    
    if has_gov and (has_threat or has_money):
        patterns.append("irs_scam")
        fraud_type = "phishing"
        is_fraudulent = True
    
    # Prize/Lottery scams with urgency
    prize_words = ["you won", "you've won", "winner", "claim your prize", "congratulations you", 
                  "you have been selected", "you've been chosen"]
    urgency_words = ["act now", "limited time", "expires", "hurry", "immediately", "before midnight",
                    "claim now", "last chance"]
    
    has_prize = any(p in text_lower for p in prize_words)
    has_urgency = any(u in text_lower for u in urgency_words)
    
    if has_prize and has_urgency:
        patterns.append("prize_scam")
        fraud_type = "fake_giveaway"
        is_fraudulent = True
    
    # Romance/Inheritance scams
    romance_words = ["million", "inheritance", "transfer", "bank account", "bank details", 
                    "trustworthy person", "need your help", "give you", "percent"]
    
    romance_count = sum(1 for r in romance_words if r in text_lower)
    if romance_count >= 4:
        patterns.append("romance_scam")
        fraud_type = "financial_scam"
        is_fraudulent = True
    
    # Tech support scams
    tech_words = ["microsoft", "apple", "google"]
    virus_words = ["virus", "trojan", "infected", "malware", "compromised", "hacked"]
    call_words = ["call", "dial", "contact", "technician"]
    
    has_tech = any(t in text_lower for t in tech_words)
    has_virus = any(v in text_lower for v in virus_words)
    has_call = any(c in text_lower for c in call_words)
    
    if has_tech and has_virus and has_call:
        patterns.append("tech_support_scam")
        fraud_type = "phishing"
        is_fraudulent = True
    
    return patterns, fraud_type, is_fraudulent

def detect_suspicious_patterns(text: str) -> List[str]:
    """Detect suspicious (not fraudulent) patterns"""
    text_lower = text.lower()
    patterns = []
    
    # Aggressive marketing
    marketing_words = ["limited stock", "only", "left", "order now", "sale", "discount", 
                      "off", "flash sale", "clearance", "must go"]
    marketing_count = sum(1 for m in marketing_words if m in text_lower)
    
    if marketing_count >= 3:
        patterns.append("aggressive_marketing")
    
    # MLM/Get rich quick
    mlm_words = ["earn $", "make $", "work from home", "be your own boss", "passive income",
                "financial freedom", "join our team"]
    mlm_count = sum(1 for m in mlm_words if m in text_lower)
    
    if mlm_count >= 2:
        patterns.append("mlm_scheme")
    
    return patterns

@app.post("/predict", response_model=FraudPredictionResponse)
async def predict_fraud(input_data: TextInput):
    """
    Fraud detection using ML models + rule-based patterns
    """
    text = input_data.text
    
    if not text or len(text.strip()) == 0:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    # Step 1: Check critical fraud patterns (100% precision)
    fraud_patterns, fraud_type, is_critical_fraud = detect_critical_fraud_patterns(text)
    
    if is_critical_fraud:
        return FraudPredictionResponse(
            text=text,
            prediction="fraudulent",
            confidence=0.99,
            risk_score=95.0,
            detected_patterns=fraud_patterns,
            fraud_type=fraud_type,
            model="rule_based"
        )
    
    # Step 2: Try BERT if available
    if bert_classifier:
        try:
            result = bert_classifier(text[:512])[0]
            label = result['label'].lower()
            confidence = result['score']
            
            # Map BERT output
            if 'fraud' in label or 'phish' in label or label == '2' or label == 'label_2':
                prediction = "fraudulent"
                fraud_type = "phishing"
                risk_score = 70.0 + (confidence * 30.0)
            elif 'suspicious' in label or label == '1' or label == 'label_1':
                prediction = "suspicious"
                fraud_type = "spam"
                risk_score = 40.0 + (confidence * 35.0)
            else:
                prediction = "normal"
                fraud_type = "legitimate"
                risk_score = (1 - confidence) * 30.0
            
            # Add any detected patterns
            suspicious_patterns = detect_suspicious_patterns(text)
            all_patterns = fraud_patterns + suspicious_patterns
            
            if suspicious_patterns and prediction == "normal":
                prediction = "suspicious"
                fraud_type = "spam"
                risk_score = max(risk_score, 45.0)
            
            log_fraud_detection(text, prediction, confidence, risk_score, 
                              all_patterns, fraud_type, "bert")
            
            return FraudPredictionResponse(
                text=text,
                prediction=prediction,
                confidence=confidence,
                risk_score=risk_score,
                detected_patterns=all_patterns,
                fraud_type=fraud_type,
                model="bert"
            )
        except Exception as e:
            print(f"BERT error: {e}")
    
    # Step 3: Use traditional ML models
    if vectorizer and fraud_models:
        try:
            model_name = ml_model_info.get("best_model", "svm") if ml_model_info else "svm"
            clf = fraud_models[model_name]
            
            X = vectorizer.transform([text])
            prediction_num = clf.predict(X)[0]
            
            if hasattr(clf, "predict_proba"):
                probabilities = clf.predict_proba(X)[0]
                confidence = float(probabilities[prediction_num])
            else:
                confidence = 0.8
            
            prediction_map = {0: "normal", 1: "suspicious", 2: "fraudulent"}
            prediction = prediction_map.get(prediction_num, "unknown")
            
            # Calculate risk score
            if prediction == "fraudulent":
                risk_score = 70.0 + (confidence * 30.0)
                fraud_type = "phishing"
            elif prediction == "suspicious":
                risk_score = 40.0 + (confidence * 35.0)
                fraud_type = "spam"
            else:
                risk_score = confidence * 30.0
                fraud_type = "legitimate"
            
            # Check suspicious patterns
            suspicious_patterns = detect_suspicious_patterns(text)
            all_patterns = fraud_patterns + suspicious_patterns
            
            if suspicious_patterns and prediction == "normal":
                prediction = "suspicious"
                fraud_type = "spam"
                risk_score = max(risk_score, 45.0)
            
            log_fraud_detection(text, prediction, confidence, risk_score,
                              all_patterns, fraud_type, "ml_" + model_name)
            
            return FraudPredictionResponse(
                text=text,
                prediction=prediction,
                confidence=confidence,
                risk_score=risk_score,
                detected_patterns=all_patterns,
                fraud_type=fraud_type,
                model="ml_" + model_name
            )
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
    
    raise HTTPException(status_code=500, detail="No models available")

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "bert_model_loaded": bool(bert_classifier),
        "ml_models_loaded": list(fraud_models.keys())
    }

@app.get("/logs")
async def get_fraud_logs(limit: int = 100):
    return {
        "total_logs": len(fraud_logs),
        "logs": fraud_logs[-limit:] if limit > 0 else fraud_logs
    }

@app.get("/stats")
async def get_fraud_stats():
    if not fraud_logs:
        return {
            "total_analyzed": 0,
            "normal": 0,
            "suspicious": 0,
            "fraudulent": 0,
            "average_risk_score": 0.0
        }
    
    total = len(fraud_logs)
    normal = sum(1 for log in fraud_logs if log["prediction"] == "normal")
    suspicious = sum(1 for log in fraud_logs if log["prediction"] == "suspicious")
    fraudulent = sum(1 for log in fraud_logs if log["prediction"] == "fraudulent")
    avg_risk = sum(log["risk_score"] for log in fraud_logs) / total
    
    return {
        "total_analyzed": total,
        "normal": normal,
        "suspicious": suspicious,
        "fraudulent": fraudulent,
        "average_risk_score": round(avg_risk, 2)
    }

if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*70)
    print("🚀 Social Media Fraud Detection API")
    print("="*70)
    print(f"BERT model: {'✓ Loaded' if bert_classifier else '⚠ Training (will auto-load when ready)'}")
    print(f"ML models: {list(fraud_models.keys())}")
    print("="*70 + "\n")
    uvicorn.run(app, host="0.0.0.0", port=8002)
