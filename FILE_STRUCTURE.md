# 📁 Social Sentinel AI - Optimized File Structure

## 🎯 Project Organization

This document outlines the clean, optimized file structure after removing redundant files.

---

## 📂 Root Directory

```
social-sentinel-ai/
├── backend/                    # Python backend (FastAPI + ML models)
├── src/                        # React frontend source code
├── public/                     # Static assets
├── node_modules/               # Node dependencies (auto-generated)
├── .git/                       # Git repository
│
├── .gitignore                  # Git ignore rules
├── package.json                # Node dependencies & scripts
├── package-lock.json           # Locked dependency versions
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite build configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── components.json             # Shadcn UI configuration
│
├── README.md                   # Main project documentation
├── SETUP_GUIDE.md              # Setup instructions
├── PROJECT_SUMMARY.md          # Comprehensive project overview
└── FINAL_STATUS.md             # Current project status & achievements
```

---

## 🐍 Backend Structure

```
backend/
├── server.py                           # Main FastAPI server (hybrid detection)
├── train_distilbert.py                 # BERT fine-tuning script
├── train_production_fraud_model.py     # Traditional ML training
├── requirements.txt                    # Python dependencies
├── README.md                           # Backend documentation
│
├── bert_fraud_classifier/              # Fine-tuned BERT model
│   ├── config.json                     # Model configuration
│   ├── model.safetensors               # Model weights (268MB)
│   ├── tokenizer.json                  # Tokenizer
│   ├── tokenizer_config.json           # Tokenizer config
│   └── model_info.json                 # Training metadata
│
├── fraud_detection_classifier/         # Traditional ML models
│   ├── model_logreg.pkl                # Logistic Regression
│   ├── model_svm.pkl                   # Support Vector Machine
│   ├── model_random_forest.pkl         # Random Forest
│   ├── model_grad_boost.pkl            # Gradient Boosting
│   ├── model_naive_bayes.pkl           # Naive Bayes
│   ├── model_mlp.pkl                   # Multi-layer Perceptron
│   ├── vectorizer.pkl                  # TF-IDF vectorizer
│   ├── model_info.json                 # Model metadata
│   └── metrics.json                    # Performance metrics
│
├── fraud_detection_logs.json           # Analysis logs
└── __pycache__/                        # Python cache (auto-generated)
```

### Backend Files Explained

| File | Purpose | When to Use |
|------|---------|-------------|
| `server.py` | Main API server | Run for production |
| `train_distilbert.py` | Train BERT model | Retrain with new data |
| `train_production_fraud_model.py` | Train traditional ML | Backup model training |
| `requirements.txt` | Dependencies | Install packages |

---

## ⚛️ Frontend Structure

```
src/
├── pages/                      # Page components (routes)
│   ├── Dashboard.tsx           # Analytics dashboard
│   ├── ModerationQueue.tsx     # Main fraud detection page
│   ├── Settings.tsx            # Configuration page
│   └── NotFound.tsx            # 404 error page
│
├── components/                 # Reusable components
│   ├── layout/
│   │   └── MainLayout.tsx      # App shell with navigation
│   │
│   ├── dashboard/
│   │   └── ThreatMeter.tsx     # Risk meter visualization
│   │
│   ├── moderation/
│   │   ├── ContentTester.tsx   # Text analysis interface
│   │   └── AnalysisHistory.tsx # History display with filters
│   │
│   └── ui/                     # Shadcn UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── textarea.tsx
│       ├── alert.tsx
│       └── ... (30+ components)
│
├── lib/                        # Utility functions
│   ├── analysisHistory.ts      # localStorage management
│   └── utils.ts                # Helper functions
│
├── App.tsx                     # Main app component with routing
├── App.css                     # Global styles & animations
├── index.css                   # Tailwind imports & base styles
└── main.tsx                    # React entry point
```

### Frontend Pages Explained

| Page | Route | Purpose |
|------|-------|---------|
| `ModerationQueue.tsx` | `/moderation` | Main fraud detection interface |
| `Dashboard.tsx` | `/dashboard` | Analytics & statistics |
| `Settings.tsx` | `/settings` | Configuration (placeholder) |
| `NotFound.tsx` | `*` | 404 error page |

---

## 🗑️ Removed Redundant Files

### ❌ Deleted Files (No Longer Needed)

```
✅ Removed from root:
   - QUICK_TEST_GUIDE.md          (redundant with SETUP_GUIDE.md)
   - setup.bat                     (not needed for demo)
   - setup.sh                      (not needed for demo)

✅ Removed from src/pages:
   - FlaggedUsers.tsx              (not in routing)
   - Overview.tsx                  (not in routing)
   - Index.tsx                     (not in routing)
   - App-backup.tsx                (backup file)

✅ Removed from backend:
   - train_production_model.py     (redundant with train_distilbert.py)
   - behavioral_analysis.py        (not used)
   - harmful_content_classifier/   (not used for fraud detection)
```

---

## 📊 File Count Summary

### Before Cleanup
- **Root docs**: 5 markdown files
- **Backend scripts**: 4 training scripts
- **Frontend pages**: 7 page components
- **Total redundant**: 9 files

### After Cleanup ✨
- **Root docs**: 4 markdown files (essential only)
- **Backend scripts**: 2 training scripts (BERT + traditional ML)
- **Frontend pages**: 4 page components (all used)
- **Total removed**: 9 redundant files

---

## 🎯 Key Directories

### Production Files (Keep These)
```
✅ backend/server.py                    # Main API
✅ backend/bert_fraud_classifier/       # BERT model
✅ backend/fraud_detection_classifier/  # Traditional ML models
✅ src/pages/                           # All 4 pages are used
✅ src/components/                      # All components are used
✅ README.md                            # Main documentation
✅ FINAL_STATUS.md                      # Project status
```

### Development Files (Keep These)
```
✅ backend/train_distilbert.py          # BERT training
✅ backend/train_production_fraud_model.py  # ML training
✅ package.json                         # Dependencies
✅ vite.config.ts                       # Build config
✅ tailwind.config.ts                   # Styling config
```

### Auto-Generated (Don't Commit)
```
⚠️ node_modules/                       # Node packages
⚠️ __pycache__/                        # Python cache
⚠️ .DS_Store                           # macOS metadata
⚠️ *.log                               # Log files
```

---

## 🚀 Quick Navigation

### To Run the App
```bash
# Backend
cd backend
python server.py

# Frontend
npm run dev
```

### To Train Models
```bash
# BERT model (recommended)
cd backend
python train_distilbert.py

# Traditional ML models (backup)
python train_production_fraud_model.py
```

### To View Documentation
- **Setup**: `SETUP_GUIDE.md`
- **Overview**: `PROJECT_SUMMARY.md`
- **Status**: `FINAL_STATUS.md`
- **This file**: `FILE_STRUCTURE.md`

---

## 📝 File Naming Conventions

### Backend
- `server.py` - Main server file
- `train_*.py` - Training scripts
- `*_classifier/` - Model directories
- `requirements.txt` - Dependencies

### Frontend
- `*.tsx` - React TypeScript components
- `*.css` - Stylesheets
- `*.ts` - TypeScript utilities
- `*.json` - Configuration files

### Documentation
- `README.md` - Main docs
- `*_GUIDE.md` - Instructional guides
- `*_SUMMARY.md` - Overview documents
- `*_STATUS.md` - Status reports

---

## 🎨 Component Organization

### Layout Components
- `MainLayout.tsx` - App shell with sidebar & header

### Feature Components
- `ContentTester.tsx` - Fraud detection interface
- `AnalysisHistory.tsx` - History with filters & export
- `ThreatMeter.tsx` - Risk visualization

### UI Components (Shadcn)
- 30+ reusable UI components
- All in `src/components/ui/`
- Fully typed with TypeScript

---

## 📦 Dependencies

### Backend (Python)
- FastAPI - Web framework
- PyTorch - Deep learning
- Transformers - BERT models
- scikit-learn - Traditional ML
- pandas - Data processing

### Frontend (Node)
- React 18 - UI framework
- TypeScript - Type safety
- Vite - Build tool
- Tailwind CSS - Styling
- Recharts - Data visualization
- Shadcn UI - Component library

---

## ✅ Optimization Results

### Before
- 📁 Total files: ~150
- 🗑️ Redundant files: 9
- 📊 Unused pages: 3
- 📝 Duplicate docs: 2

### After
- 📁 Total files: ~141
- ✨ All files used: Yes
- 🎯 Clean structure: Yes
- 📚 Clear docs: Yes

---

**Last Updated**: March 17, 2026  
**Status**: ✅ Optimized and Production Ready
