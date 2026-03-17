# Setup Guide - Social Sentinel AI

## 📋 Prerequisites

- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **Node.js 16+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/downloads/)

---

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/social-sentinel-ai.git
cd social-sentinel-ai
```

### 2. Backend Setup
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

### 3. Frontend Setup
```bash
cd ..
npm install
```

### 4. Start Application

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate  # Windows
# OR
source venv/bin/activate  # Mac/Linux
python server.py
```
Backend runs on http://localhost:8002

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Frontend runs on http://localhost:3001

---

## 🔧 Model Training (Optional)

Models are already trained. To retrain:

### BERT Model (Recommended)
```bash
cd backend
python train_distilbert.py
```
Takes ~45 minutes on CPU

### Traditional ML Models (Backup)
```bash
cd backend
python train_production_fraud_model.py
```
Takes ~2 minutes

---

## ✅ Verify Installation

1. Open http://localhost:3001
2. Go to Fraud Detection page
3. Click "Load Fraudulent Sample"
4. Click "Analyze Content"
5. Should show: Fraudulent (95-100 risk score)

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows:
netstat -ano | findstr :8002
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:8002 | xargs kill -9
```

### Missing Dependencies
```bash
# Backend:
cd backend
pip install -r requirements.txt

# Frontend:
rm -rf node_modules package-lock.json
npm install
```

---

## 📦 Project Structure

```
social-sentinel-ai/
├── backend/                    # Python API + ML models
│   ├── server.py              # Main API server
│   ├── bert_fraud_classifier/ # BERT model (268MB)
│   └── fraud_detection_classifier/ # Traditional ML models
├── src/                       # React frontend
│   ├── pages/                 # Page components
│   └── components/            # Reusable components
├── docs/                      # Documentation
└── README.md                  # Main documentation
```

---

**For detailed documentation, see [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md)**
