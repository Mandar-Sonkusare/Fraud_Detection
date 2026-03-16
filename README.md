# Social Media Fraud Detection System

## Project Overview

**Fraudulent and Suspicious Behaviour Detection on Social Media Using NLP and Machine Learning**

This system automatically detects fraudulent activities such as phishing scams, impersonation attacks, fake giveaways, financial fraud promotions, and social engineering attacks on social media platforms using advanced Natural Language Processing and Machine Learning techniques.

## Key Features

### 🔍 NLP-Based Text Processing
- Advanced text cleaning and normalization for social media content
- Tokenization, stop-word removal, and lemmatization
- Handling of slang, abbreviations, emojis, and noisy text
- Multi-language support for fraud detection

### 🎯 Fraud-Oriented Content Detection
- **Phishing Detection**: Identifies messages requesting personal/financial information
- **Scam Recognition**: Detects fake giveaways and investment fraud schemes
- **Impersonation Analysis**: Recognizes fake bank, customer care, and public figure accounts
- **Social Engineering**: Identifies manipulation tactics and trust exploitation

### 🤖 Machine Learning Classification
- TF-IDF and advanced feature extraction techniques
- Multi-class classification: **Normal**, **Suspicious**, **Fraudulent**
- Ensemble methods: Logistic Regression, Naive Bayes, Random Forest, SVM
- Real-time fraud probability scoring

### 📊 Behavioral Fraud Analysis
- User activity pattern analysis for abnormal behavior detection
- Mass messaging and repeated scam message identification
- New account anomaly detection with unusual activity patterns
- Coordinated fraud campaign recognition

### ⚠️ Fraud Risk Scoring System
- Comprehensive risk assessment based on:
  - Textual fraud probability
  - Keyword and pattern matching
  - Behavioral anomalies
  - Account credibility metrics
- Priority-based investigation queue

### 🔬 Cyber Forensic Support
- Complete logging and storage of suspicious content
- Digital evidence preservation for investigations
- Fraud pattern analysis and reporting
- Integration with cybercrime investigation workflows

## Applications

### 📱 Social Media Platforms
- Automated fraud content detection and removal
- Fake account and coordinated campaign identification
- User protection from financial scams

### 🚔 Cyber Crime & Forensic Departments
- Early fraud pattern detection
- Digital evidence collection and analysis
- Investigation support tools

### 🏦 Financial Institutions
- Bank impersonation scam prevention
- Payment app fraud detection
- Social engineering attack mitigation

### 🛡️ Public Safety & User Protection
- Phishing and identity theft prevention
- Financial and emotional harm reduction
- Community safety enhancement

### 🏢 Enterprise & Brand Protection
- Fake promotion and brand impersonation detection
- Fraudulent advertisement monitoring
- Brand reputation protection

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for modern styling
- **shadcn/ui** component library
- **Recharts** for data visualization
- **React Hook Form** with Zod validation

### Backend
- **FastAPI** for high-performance APIs
- **Python 3.x** with async support
- **Pydantic** for data validation
- **Uvicorn** ASGI server

### Machine Learning
- **scikit-learn** for classical ML algorithms
- **Transformers** for BERT-based models
- **PyTorch** for deep learning
- **Pandas/NumPy** for data processing
- **NLTK/spaCy** for NLP tasks

### Development & Deployment
- **Docker** containerization
- **Git** version control
- **ESLint/Prettier** code quality
- **Jest** testing framework

## Getting Started

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Quick Setup (Automated)

**Windows:**
```bash
setup.bat
```

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

### Manual Installation

```bash
# 1. Backend Setup
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# OR
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
cd ..

# 2. Frontend Setup
npm install

# 3. Start Backend (Terminal 1)
cd backend
venv\Scripts\activate  # Windows
python server.py
# Backend runs on http://localhost:8000

# 4. Start Frontend (Terminal 2)
npm run dev
# Frontend runs on http://localhost:5173
```

### First Time Setup
Models are already trained and included. If you need to retrain:
```bash
cd backend
python train_fraud_real_datasets.py --mlp_epochs 10
```

**📖 For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)**

### Training Models

Models are already trained with 25,514 real samples (99.67% accuracy).

If you need to retrain:

```bash
cd backend
python train_fraud_real_datasets.py --mlp_epochs 10
```

This trains 6 models:
- Logistic Regression
- Support Vector Machine (SVM) - Best: 99.67%
- Random Forest
- Gradient Boosting
- Naive Bayes
- Multi-Layer Perceptron (MLP)

Training takes ~2 minutes and automatically selects the best model.

## System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API    │    │  ML Pipeline    │
│   Dashboard     │◄──►│   FastAPI        │◄──►│  Fraud Models   │
│   React/TS      │    │   Python         │    │  NLP Engine     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Input    │    │   Data Storage   │    │  Model Training │
│   Text Analysis │    │   JSON Logs      │    │  Evaluation     │
│   Risk Scoring  │    │   Forensic Data  │    │  Optimization   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌──────────────────┐
│  Behavioral     │    │  Cyber Forensic  │
│  Analysis       │    │  Support         │
└─────────────────┘    └──────────────────┘
```

## Fraud Detection Workflow

1. **Text Input**: User submits social media content for analysis
2. **NLP Preprocessing**: Text is cleaned, tokenized, and normalized
3. **Pattern Detection**: Fraud-specific keywords and patterns are identified
4. **ML Classification**: Models classify content as Normal, Suspicious, or Fraudulent
5. **Behavioral Analysis**: User activity patterns are analyzed for anomalies
6. **Risk Scoring**: Comprehensive risk score (0-100) is calculated
7. **Forensic Logging**: All detections are logged for investigation
8. **Dashboard Display**: Results are displayed with risk classification and patterns

## API Endpoints

### POST `/predict`
Analyze text for fraud detection.

**Request:**
```json
{
  "text": "URGENT: Your account has been suspended. Click here to verify.",
  "model_name": "mlp",
  "user_info": {
    "user_id": "user123",
    "account_age_days": 5
  }
}
```

**Response:**
```json
{
  "text": "URGENT: Your account has been suspended...",
  "prediction": "fraudulent",
  "confidence": 0.92,
  "risk_score": 85.5,
  "detected_patterns": ["phishing", "impersonation"],
  "model": "mlp",
  "model_accuracy": 0.91
}
```

### GET `/health`
Check API health and loaded models.

### GET `/stats`
Get fraud detection statistics.

### GET `/logs?limit=100`
Retrieve fraud detection logs for forensic analysis.

### GET `/behavioral/{user_id}`
Get behavioral risk profile for a specific user.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/b64ea14f-ce49-4992-8344-e8e30b9c4126) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes it is!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
