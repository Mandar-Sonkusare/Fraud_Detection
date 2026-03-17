# 🤖 AI Assistant Prompt for New Laptop Setup

Copy and paste this entire prompt to your AI assistant on the new laptop:

---

# PROJECT CONTEXT: Social Sentinel AI - Fraud Detection System

I have cloned a fraud detection project and need help understanding and running it. Here's the complete context:

## PROJECT OVERVIEW

**Name**: Social Sentinel AI  
**Purpose**: Advanced fraud detection system using deep learning and NLP  
**Tech Stack**: Python (FastAPI + PyTorch + DistilBERT) + React (TypeScript + Vite)  
**GitHub**: https://github.com/Mandar-Sonkusare/Fraud_Detection.git

### What It Does
- Detects fraudulent content in social media messages, emails, and SMS
- Uses 3-layer hybrid detection: Rule-based + BERT + Traditional ML
- Classifies content as: Normal, Suspicious, or Fraudulent
- Identifies 6 fraud types: Phishing, Smishing, Spam, Financial Scams, Fake Giveaways, Impersonation
- Provides risk scoring (0-100) and confidence percentages
- Real-time analysis with history tracking and CSV export

### Key Features
- Fine-tuned DistilBERT model (98.6% F1 score)
- Trained on 5,572 real SMS messages + augmented examples
- Hybrid 3-layer detection system
- Dynamic dashboard with analytics
- Analysis history with localStorage persistence

---

## FILE STRUCTURE

```
social-sentinel-ai/
├── backend/                           # Python FastAPI backend
│   ├── server.py                      # Main API server (CRITICAL)
│   ├── train_distilbert.py            # BERT training script
│   ├── train_production_fraud_model.py # Traditional ML training
│   ├── requirements.txt               # Python dependencies
│   ├── README.md                      # Backend documentation
│   ├── bert_fraud_classifier/         # BERT model (created after training)
│   ├── fraud_detection_classifier/    # ML models (created after training)
│   └── fraud_detection_logs.json      # Analysis logs
│
├── src/                               # React frontend
│   ├── pages/
│   │   ├── Dashboard.tsx              # Analytics dashboard
│   │   ├── ModerationQueue.tsx        # Main fraud detection page
│   │   ├── Settings.tsx               # Configuration page
│   │   └── NotFound.tsx               # 404 page
│   ├── components/
│   │   ├── layout/
│   │   │   └── MainLayout.tsx         # App shell with navigation
│   │   ├── dashboard/
│   │   │   └── ThreatMeter.tsx        # Risk visualization
│   │   ├── moderation/
│   │   │   ├── ContentTester.tsx      # Text analysis interface
│   │   │   ├── AnalysisHistory.tsx    # History display
│   │   │   ├── CategoryMatrix.tsx     # Category visualization
│   │   │   ├── ModerateButtons.tsx    # Action buttons
│   │   │   ├── PostDetails.tsx        # Post information
│   │   │   └── SeverityScoring.tsx    # Severity display
│   │   ├── settings/
│   │   │   └── ApiKeyConfig.tsx       # API configuration
│   │   └── ui/                        # 30+ shadcn/ui components
│   ├── lib/
│   │   ├── analysisHistory.ts         # localStorage manager
│   │   └── utils.ts                   # Helper functions
│   ├── App.tsx                        # Main app with routing
│   ├── App.css                        # Global styles
│   ├── index.css                      # Tailwind imports
│   └── main.tsx                       # React entry point
│
├── docs/                              # Documentation
│   ├── SETUP_GUIDE.md                 # Installation instructions
│   ├── PROJECT_DOCUMENTATION.md       # Technical documentation
│   ├── FILE_STRUCTURE.md              # File organization
│   ├── FINAL_STATUS.md                # Project achievements
│   ├── CLEANUP_SUMMARY.md             # Cleanup report
│   └── REQUIRED_FILES.md              # Required files guide
│
├── public/                            # Static assets
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
│
├── node_modules/                      # Node packages (auto-generated)
├── package.json                       # Node dependencies
├── package-lock.json                  # Locked versions
├── vite.config.ts                     # Vite build config
├── tailwind.config.ts                 # Tailwind CSS config
├── tsconfig.json                      # TypeScript config
├── components.json                    # Shadcn UI config
├── eslint.config.js                   # ESLint config
├── postcss.config.js                  # PostCSS config
├── index.html                         # HTML entry point
├── .gitignore                         # Git ignore rules
└── README.md                          # Main documentation
```

---

## SYSTEM ARCHITECTURE

### 3-Layer Hybrid Detection System

**Layer 1: Rule-Based Detection (100% Precision)**
- Purpose: Catch critical patterns with certainty
- Patterns: credential theft (SSN, passwords), crypto scams, IRS scams, prize scams
- Confidence: 99% when triggered
- Risk Score: 95/100

**Layer 2: DistilBERT Deep Learning (Primary)**
- Model: Fine-tuned DistilBERT-base-uncased
- Training: 5 epochs on 5,572 real SMS messages
- Performance: 98.6% F1 score, 98.58% accuracy
- Purpose: Semantic understanding, context-aware detection
- Use Case: Primary detection for all messages

**Layer 3: Traditional ML (Fallback)**
- Models: 6 trained models (Logistic Regression, SVM, Random Forest, Gradient Boosting, Naive Bayes, MLP)
- Purpose: Backup when BERT unavailable
- Performance: 99.6% accuracy on training data

### Data Flow
```
User Input (Text)
    ↓
Layer 1: Rule-Based Check
    ↓
Layer 2: BERT Analysis (Primary)
    ↓
Layer 3: Traditional ML (Fallback)
    ↓
Risk Score (0-100) + Fraud Type + Patterns
    ↓
Frontend Display + localStorage
```

---

## BACKEND DETAILS

### Main Files

**server.py** (Main API Server)
- FastAPI application
- Loads BERT model and traditional ML models
- Implements 3-layer hybrid detection
- Endpoints: /predict, /health, /stats, /logs
- Runs on port 8002
- CORS enabled for frontend

**train_distilbert.py** (BERT Training)
- Fine-tunes DistilBERT on SMS Spam Collection dataset
- 5 epochs, ~45 minutes on CPU
- Creates bert_fraud_classifier/ directory
- Saves model, tokenizer, and training metadata

**train_production_fraud_model.py** (Traditional ML Training)
- Trains 6 traditional ML models
- Uses TF-IDF vectorization
- ~2 minutes training time
- Creates fraud_detection_classifier/ directory

### API Endpoints

**POST /predict**
```json
Request:
{
  "text": "URGENT: Your account has been suspended...",
  "model_name": "bert"
}

Response:
{
  "prediction": "fraudulent",
  "confidence": 0.9938,
  "risk_score": 99.8,
  "fraud_type": "phishing",
  "detected_patterns": ["phishing", "urgency"],
  "model": "bert",
  "model_accuracy": 0.9858
}
```

**GET /health** - Check API status and loaded models  
**GET /stats** - Get fraud detection statistics  
**GET /logs?limit=100** - Retrieve forensic logs

### Dependencies (requirements.txt)
```
fastapi>=0.104.0
uvicorn[standard]>=0.24.0
pydantic>=2.0.0
python-multipart>=0.0.6
torch>=2.0.0
transformers>=4.35.0
scikit-learn>=1.3.0
pandas>=2.0.0
numpy>=1.24.0
tqdm>=4.66.0
datasets>=2.14.0
```

---

## FRONTEND DETAILS

### Technology Stack
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- shadcn/ui + Radix UI (components)
- Recharts (data visualization)
- React Router v6 (routing)
- React Hook Form + Zod (forms)

### Pages (Routes)

**ModerationQueue.tsx** (`/moderation`)
- Main fraud detection interface
- Text input area for analysis
- Sample message buttons (random examples)
- Real-time analysis results
- Risk level display with color coding

**Dashboard.tsx** (`/dashboard`)
- Analytics dashboard
- Total analyses count
- Risk distribution pie chart
- Average risk score
- Fraud types bar chart
- Common patterns bar chart
- Dynamic data from localStorage

**Settings.tsx** (`/settings`)
- Configuration page (placeholder)

**NotFound.tsx** (`*`)
- 404 error page

### Key Components

**ContentTester.tsx**
- Text analysis interface
- Sample message buttons
- Analyze button
- Results display with risk meter
- Pattern detection display

**AnalysisHistory.tsx**
- Displays past analyses from localStorage
- Filter by risk level (All, Normal, Suspicious, Fraudulent)
- CSV export functionality
- Clear history button
- Stores up to 1,000 records

**ThreatMeter.tsx**
- Circular risk meter visualization
- Color-coded by risk level
- Animated progress

**MainLayout.tsx**
- App shell with sidebar navigation
- Header with logo
- Responsive design

### State Management
- React Hooks (useState, useEffect)
- localStorage for analysis history
- No Redux (not needed for this app)

### Styling
- Tailwind CSS utility classes
- Custom animations in App.css
- Glassmorphism effects
- Gradient backgrounds
- Color-coded risk levels:
  - Green: Normal (0-30)
  - Yellow: Suspicious (30-70)
  - Red: Fraudulent (70-100)

---

## SETUP INSTRUCTIONS

### Prerequisites
1. Python 3.8+
2. Node.js 16+
3. Git

### Step 1: Clone Repository
```bash
git clone https://github.com/Mandar-Sonkusare/Fraud_Detection.git
cd Fraud_Detection/social-sentinel-ai
```

### Step 2: Backend Setup
```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 3: Train Models (REQUIRED - Models not in repo)
```bash
# Train BERT model (~45 minutes on CPU)
python train_distilbert.py

# Train traditional ML models (~2 minutes)
python train_production_fraud_model.py
```

### Step 4: Start Backend
```bash
python server.py
```
Backend runs on http://localhost:8002

### Step 5: Frontend Setup (New Terminal)
```bash
cd Fraud_Detection/social-sentinel-ai
npm install
npm run dev
```
Frontend runs on http://localhost:3001

### Step 6: Open Browser
Go to http://localhost:3001

---

## IMPORTANT NOTES

### Models NOT in Repository
- BERT model (268MB) and traditional ML models are excluded from Git
- They MUST be trained after cloning
- Training takes ~47 minutes total (BERT: 45 min, ML: 2 min)
- Models are saved in:
  - `backend/bert_fraud_classifier/`
  - `backend/fraud_detection_classifier/`

### Auto-Generated Folders (Don't Commit)
- `node_modules/` - Created by `npm install`
- `__pycache__/` - Created by Python
- `venv/` - Created by `python -m venv venv`
- `.DS_Store` - macOS metadata

### Configuration Files (Required)
- `package.json` - Node dependencies
- `vite.config.ts` - Vite build config
- `tailwind.config.ts` - Tailwind CSS config
- `tsconfig.json` - TypeScript config
- All config files are required for the app to run

---

## TESTING THE APPLICATION

### Quick Test
1. Open http://localhost:3001
2. Go to "Fraud Detection" page
3. Click "Load Fraudulent Sample"
4. Click "Analyze Content"
5. Should show: Fraudulent (95-100 risk score)

### Test Cases

**Fraudulent - Phishing**
```
Input: "URGENT: Your PayPal account has been suspended. Click here to verify your information immediately."
Expected: Fraudulent (99.38% confidence, 99.8 risk score)
Model: BERT
```

**Fraudulent - Crypto Scam**
```
Input: "BREAKING: Elon Musk is giving away 5000 BTC! Send 0.1 BTC to claim your share."
Expected: Fraudulent (99% confidence, 95 risk score)
Model: Rule-based (crypto_scam pattern detected)
```

**Normal - Appointment**
```
Input: "Hi! Your appointment is scheduled for tomorrow at 3 PM. See you then!"
Expected: Normal (86% confidence, 3.9 risk score)
Model: BERT
```

**Suspicious - Marketing**
```
Input: "LIMITED STOCK! Only 3 items left. Buy now or miss out forever!"
Expected: Suspicious (81% confidence, 68.4 risk score)
Model: BERT + aggressive_marketing pattern
```

---

## COMMON ISSUES & SOLUTIONS

### Issue: Port Already in Use
```bash
# Windows
netstat -ano | findstr :8002
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8002 | xargs kill -9
```

### Issue: Models Not Found
```bash
# Train models
cd backend
python train_distilbert.py
python train_production_fraud_model.py
```

### Issue: npm install fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Python dependencies fail
```bash
# Upgrade pip and reinstall
python -m pip install --upgrade pip
pip install -r requirements.txt
```

---

## PERFORMANCE METRICS

### BERT Model
```
              precision    recall  f1-score   support
      normal       0.99      0.99      0.99       969
  suspicious       0.73      0.85      0.79        13
  fraudulent       0.95      0.95      0.95       147

    accuracy                           0.99      1129
weighted avg       0.99      0.99      0.99      1129
```

### Training Details
- Dataset: 5,572 real SMS messages + augmented examples
- Training Time: ~45 minutes on CPU
- Epochs: 5
- Best F1: 0.9860
- Final Accuracy: 98.58%

---

## WHAT I NEED HELP WITH

Please help me:
1. Understand the project structure
2. Verify all files are in place
3. Run the setup commands correctly
4. Train the models successfully
5. Start both backend and frontend
6. Test the application
7. Troubleshoot any issues that arise
8. Understand how to modify or extend the code if needed

---

## ADDITIONAL CONTEXT

- This is a production-ready fraud detection system
- Uses real datasets (SMS Spam Collection from UCI ML Repository)
- Implements state-of-the-art deep learning (DistilBERT)
- Has comprehensive documentation in `/docs` folder
- All code is clean and well-organized
- Backend runs on port 8002, frontend on port 3001
- No external API calls (privacy-focused)
- All processing done locally

---

**Please guide me through the setup process step by step and help me understand the codebase!**
