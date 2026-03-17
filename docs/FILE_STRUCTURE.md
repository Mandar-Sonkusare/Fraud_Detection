# 📁 File Structure - Social Sentinel AI

## 🎯 Professional Organization

Clean, optimized structure with all redundant files removed.

---

## 📂 Root Directory

```
social-sentinel-ai/
├── backend/                    # Python backend (FastAPI + ML)
├── src/                        # React frontend source
├── public/                     # Static assets
├── docs/                       # Documentation
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
├── eslint.config.js            # ESLint configuration
├── postcss.config.js           # PostCSS configuration
├── index.html                  # HTML entry point
│
└── README.md                   # Main documentation
```

---

## 🐍 Backend Structure

```
backend/
├── server.py                           # Main FastAPI server (hybrid detection)
├── train_distilbert.py                 # BERT fine-tuning script
├── train_production_fraud_model.py     # Traditional ML training
├── requirements.txt                    # Python dependencies
├── __init__.py                         # Python package marker
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

### Backend Files

| File | Purpose | Usage |
|------|---------|-------|
| `server.py` | Main API server with hybrid detection | `python server.py` |
| `train_distilbert.py` | Train BERT model | `python train_distilbert.py` |
| `train_production_fraud_model.py` | Train traditional ML | `python train_production_fraud_model.py` |
| `requirements.txt` | Python dependencies | `pip install -r requirements.txt` |

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
│   │   ├── AnalysisHistory.tsx # History display with filters
│   │   ├── CategoryMatrix.tsx  # Category visualization
│   │   ├── ModerateButtons.tsx # Action buttons
│   │   ├── PostDetails.tsx     # Post information
│   │   └── SeverityScoring.tsx # Severity display
│   │
│   ├── settings/
│   │   └── ApiKeyConfig.tsx    # API configuration
│   │
│   └── ui/                     # Shadcn UI components (30+)
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── textarea.tsx
│       ├── alert.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── progress.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       └── ... (20+ more)
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

### Frontend Pages

| Page | Route | Purpose |
|------|-------|---------|
| `ModerationQueue.tsx` | `/moderation` | Main fraud detection interface |
| `Dashboard.tsx` | `/dashboard` | Analytics & statistics |
| `Settings.tsx` | `/settings` | Configuration |
| `NotFound.tsx` | `*` | 404 error page |

---

## 📚 Documentation Structure

```
docs/
├── SETUP_GUIDE.md              # Installation instructions
├── PROJECT_DOCUMENTATION.md    # Complete technical docs
├── FINAL_STATUS.md             # Project achievements
├── FILE_STRUCTURE.md           # This file
│
└── (Old versions for reference)
    ├── SETUP_GUIDE_OLD.md
    ├── PROJECT_SUMMARY_OLD.md
    └── FILE_STRUCTURE_OLD.md
```

---

## 🌐 Public Assets

```
public/
├── favicon.ico                 # Browser icon
├── placeholder.svg             # Placeholder image
└── robots.txt                  # SEO robots file
```

---

## 🗑️ Removed Files (Cleanup)

### ✅ Deleted Redundant Files

```
❌ backend/README.md                    # Wrong content (HateBERT)
❌ public/test.html                     # Empty, unused
❌ bun.lockb                            # Using npm, not bun
```

### ✅ Moved to docs/ (Organized)

```
✓ SETUP_GUIDE.md → docs/SETUP_GUIDE_OLD.md
✓ PROJECT_SUMMARY.md → docs/PROJECT_SUMMARY_OLD.md
✓ FILE_STRUCTURE.md → docs/FILE_STRUCTURE_OLD.md
✓ FINAL_STATUS.md → docs/FINAL_STATUS.md
```

---

## 📊 File Count Summary

### Production Files
- **Backend**: 3 scripts + 2 model directories
- **Frontend**: 4 pages + 40+ components
- **Documentation**: 4 essential docs
- **Configuration**: 8 config files

### Auto-Generated (Don't Commit)
- `node_modules/` - Node packages
- `__pycache__/` - Python cache
- `.DS_Store` - macOS metadata
- `*.log` - Log files

---

## 🎯 Key Directories

### Essential for Production
```
✅ backend/server.py                    # Main API
✅ backend/bert_fraud_classifier/       # BERT model
✅ backend/fraud_detection_classifier/  # ML models
✅ src/pages/                           # All pages used
✅ src/components/                      # All components used
✅ README.md                            # Main docs
```

### Development Only
```
🔧 backend/train_*.py                  # Training scripts
🔧 docs/                               # Documentation
🔧 *.config.ts                         # Build configs
```

---

## 📦 Dependencies

### Backend (requirements.txt)
```
fastapi>=0.104.0
uvicorn[standard]>=0.24.0
torch>=2.0.0
transformers>=4.35.0
scikit-learn>=1.3.0
pandas>=2.0.0
numpy>=1.24.0
pydantic>=2.0.0
python-multipart>=0.0.6
```

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2",
    "recharts": "^2.15.2",
    "@radix-ui/*": "Latest",
    "tailwindcss": "^3.4.11",
    "lucide-react": "^0.462.0"
  }
}
```

---

## 🚀 Quick Navigation

### Run Application
```bash
# Backend
cd backend && python server.py

# Frontend
npm run dev
```

### Train Models
```bash
# BERT (recommended)
cd backend && python train_distilbert.py

# Traditional ML (backup)
cd backend && python train_production_fraud_model.py
```

### View Documentation
- **Main**: `README.md`
- **Setup**: `docs/SETUP_GUIDE.md`
- **Technical**: `docs/PROJECT_DOCUMENTATION.md`
- **Status**: `docs/FINAL_STATUS.md`

---

## 📝 Naming Conventions

### Backend
- `server.py` - Main server
- `train_*.py` - Training scripts
- `*_classifier/` - Model directories
- `requirements.txt` - Dependencies

### Frontend
- `*.tsx` - React TypeScript components
- `*.css` - Stylesheets
- `*.ts` - TypeScript utilities
- `*.json` - Configuration

### Documentation
- `README.md` - Main docs
- `*_GUIDE.md` - Instructional
- `*_DOCUMENTATION.md` - Technical
- `*_STATUS.md` - Status reports

---

## ✅ Optimization Results

### Before Cleanup
- 📁 Redundant files: 3
- 📝 Scattered docs: 4 in root
- 🗂️ Disorganized structure

### After Cleanup ✨
- ✅ All redundant files removed
- ✅ Documentation organized in `/docs`
- ✅ Clean root directory
- ✅ Professional structure
- ✅ Clear separation of concerns

---

## 🎨 Component Organization

### Layout Components
- `MainLayout.tsx` - App shell

### Feature Components
- `ContentTester.tsx` - Fraud detection
- `AnalysisHistory.tsx` - History display
- `ThreatMeter.tsx` - Risk visualization

### UI Components (shadcn/ui)
- 30+ reusable components
- Fully typed with TypeScript
- Accessible and responsive

---

**Last Updated**: March 17, 2026  
**Status**: ✅ Optimized and Production Ready
