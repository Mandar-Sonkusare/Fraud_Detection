# Backend - Social Sentinel AI

## 🎯 Overview

FastAPI backend with hybrid fraud detection system combining rule-based detection, fine-tuned DistilBERT, and traditional machine learning models.

---

## 🏗️ Architecture

### 3-Layer Hybrid Detection

1. **Rule-Based Detection** (Layer 1)
   - 100% precision for critical patterns
   - Detects: credential theft, crypto scams, IRS scams, prize scams
   - Confidence: 99% | Risk Score: 95/100

2. **DistilBERT Deep Learning** (Layer 2 - Primary)
   - Fine-tuned on 5,572 real SMS messages
   - Semantic understanding and context-aware
   - Accuracy: 98.58% | F1 Score: 98.6%

3. **Traditional ML** (Layer 3 - Fallback)
   - 6 models: Logistic Regression, SVM, Random Forest, Gradient Boosting, Naive Bayes, MLP
   - Backup when BERT unavailable
   - Accuracy: 99.6% on training data

---

## 📁 Structure

```
backend/
├── server.py                           # Main API server
├── train_distilbert.py                 # BERT training
├── train_production_fraud_model.py     # Traditional ML training
├── requirements.txt                    # Dependencies
│
├── bert_fraud_classifier/              # BERT model (268MB)
│   ├── config.json
│   ├── model.safetensors
│   ├── tokenizer.json
│   └── model_info.json
│
└── fraud_detection_classifier/         # Traditional ML models
    ├── model_*.pkl                     # 6 models
    ├── vectorizer.pkl
    └── model_info.json
```

---

## 🚀 Quick Start

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Run Server
```bash
python server.py
```
Server runs on http://localhost:8002

---

## 📡 API Endpoints

### POST `/predict`
Analyze text for fraud detection.

**Request:**
```json
{
  "text": "URGENT: Your account has been suspended...",
  "model_name": "bert"
}
```

**Response:**
```json
{
  "prediction": "fraudulent",
  "confidence": 0.9938,
  "risk_score": 99.8,
  "fraud_type": "phishing",
  "detected_patterns": ["phishing", "urgency"],
  "model": "bert"
}
```

### GET `/health`
Check API status and loaded models.

### GET `/stats`
Get fraud detection statistics.

### GET `/logs?limit=100`
Retrieve forensic logs.

**Interactive docs**: http://localhost:8002/docs

---

## 🎓 Training Models

### BERT Model (Recommended)
```bash
python train_distilbert.py
```
- Training time: ~45 minutes on CPU
- Dataset: 5,572 real SMS messages + augmented examples
- Output: `bert_fraud_classifier/` directory

### Traditional ML Models (Backup)
```bash
python train_production_fraud_model.py
```
- Training time: ~2 minutes
- Output: `fraud_detection_classifier/` directory

---

## 📊 Model Performance

### BERT (Primary)
```
              precision    recall  f1-score
      normal       0.99      0.99      0.99
  suspicious       0.73      0.85      0.79
  fraudulent       0.95      0.95      0.95

    accuracy                           0.99
```

### Traditional ML (Fallback)
- Best model: SVM
- Accuracy: 99.6%
- 6 models available

---

## 🔧 Dependencies

```
fastapi>=0.104.0          # Web framework
uvicorn[standard]>=0.24.0 # ASGI server
torch>=2.0.0              # Deep learning
transformers>=4.35.0      # BERT models
scikit-learn>=1.3.0       # Traditional ML
pandas>=2.0.0             # Data processing
numpy>=1.24.0             # Numerical computing
pydantic>=2.0.0           # Data validation
python-multipart>=0.0.6   # File uploads
```

---

## 🎯 Fraud Detection Rules

### Critical Patterns (Layer 1)
- **Credential Theft**: SSN, password, credit card requests
- **Crypto Scams**: Celebrity + crypto + giveaway
- **IRS Scams**: Government threats + money demands
- **Prize Scams**: Urgency + prizes + claims
- **Romance Scams**: Love + money + urgency
- **Tech Support**: Microsoft/Apple + urgent + payment

---

## 📈 Performance Metrics

- **Detection Speed**: <1 second per message
- **Memory Usage**: ~500MB (BERT loaded)
- **CPU Usage**: Low (inference only)
- **Accuracy**: 98.6% F1 score
- **Model Size**: 268MB (BERT) + 5MB (Traditional ML)

---

## 🔒 Security

- ✅ CORS enabled for frontend
- ✅ Input validation with Pydantic
- ✅ No external API calls
- ✅ All processing done locally
- ✅ Comprehensive error handling

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :8002
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8002 | xargs kill -9
```

### Missing Dependencies
```bash
pip install -r requirements.txt
```

### BERT Model Not Found
```bash
python train_distilbert.py
```

---

**Last Updated**: March 17, 2026  
**Status**: ✅ Production Ready
