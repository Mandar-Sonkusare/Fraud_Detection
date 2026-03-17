# Required Files - Social Sentinel AI

## ✅ REQUIRED Files (Keep These)

### Root Directory
```
social-sentinel-ai/
├── .gitignore                  ✅ Git ignore rules
├── package.json                ✅ Node dependencies
├── package-lock.json           ✅ Locked versions
├── tsconfig.json               ✅ TypeScript config
├── tsconfig.app.json           ✅ TypeScript app config
├── tsconfig.node.json          ✅ TypeScript node config
├── vite.config.ts              ✅ Vite build config
├── tailwind.config.ts          ✅ Tailwind CSS config
├── components.json             ✅ Shadcn UI config
├── eslint.config.js            ✅ ESLint config
├── postcss.config.js           ✅ PostCSS config
├── index.html                  ✅ HTML entry point
└── README.md                   ✅ Main documentation
```

### Backend Folder
```
backend/
├── server.py                   ✅ Main API server (REQUIRED)
├── train_distilbert.py         ✅ BERT training script
├── train_production_fraud_model.py  ✅ Traditional ML training
├── requirements.txt            ✅ Python dependencies
├── README.md                   ✅ Backend documentation
├── __init__.py                 ✅ Python package marker
├── bert_fraud_classifier/      ✅ BERT model (268MB)
├── fraud_detection_classifier/ ✅ Traditional ML models
└── fraud_detection_logs.json   ✅ Analysis logs
```

### Frontend Folder
```
src/
├── pages/                      ✅ All 4 pages (Dashboard, ModerationQueue, Settings, NotFound)
├── components/                 ✅ All components (layout, moderation, dashboard, ui)
├── lib/                        ✅ Utilities (analysisHistory.ts, utils.ts)
├── App.tsx                     ✅ Main app component
├── App.css                     ✅ Global styles
├── index.css                   ✅ Tailwind imports
├── main.tsx                    ✅ React entry point
└── vite-env.d.ts               ✅ Vite types
```

### Documentation Folder
```
docs/
├── SETUP_GUIDE.md              ✅ Installation instructions
├── PROJECT_DOCUMENTATION.md    ✅ Technical documentation
├── FILE_STRUCTURE.md           ✅ File organization
├── FINAL_STATUS.md             ✅ Project status
├── CLEANUP_SUMMARY.md          ✅ Cleanup report
└── REQUIRED_FILES.md           ✅ This file
```

### Public Folder
```
public/
├── favicon.ico                 ✅ Browser icon
├── placeholder.svg             ✅ Placeholder image
└── robots.txt                  ✅ SEO robots file
```

---

## ❌ NOT REQUIRED (Already Deleted)

### From Root Directory (Outside social-sentinel-ai)
```
❌ best_model.pkl                    # Old model file
❌ logistic_regression_model.pkl     # Old model file
❌ random_forest_model.pkl           # Old model file
❌ hicode.ipynb                      # Old notebook
❌ newbook.ipynb                     # Old notebook
❌ model_evaluation.png              # Old evaluation image
❌ model_evaluation_full.png         # Old evaluation image
❌ model_evaluation_multilabel.png   # Old evaluation image
❌ CORE_TOOLS_AND_LIBRARIES.md       # Redundant documentation
❌ PROJECT_REQUIREMENTS.md           # Redundant documentation
❌ FRAUD_DETECTION_RECONFIGURATION.md # Redundant documentation
❌ IMPROVEMENTS_AND_ANALYSIS_REPORT.md # Redundant documentation
❌ TRANSFER_INSTRUCTIONS.md          # Redundant documentation
❌ /not folder (entire folder)       # Old experimental code
```

### From social-sentinel-ai/docs
```
❌ SETUP_GUIDE_OLD.md               # Archived version
❌ PROJECT_SUMMARY_OLD.md           # Archived version
❌ FILE_STRUCTURE_OLD.md            # Archived version
```

### From social-sentinel-ai/
```
❌ bun.lockb                        # Using npm, not bun
❌ public/test.html                 # Empty test file
❌ backend/README.md (old)          # Had wrong content (HateBERT)
```

---

## 🗂️ Auto-Generated (Don't Commit)

These folders are auto-generated and should NOT be committed to Git:

```
⚠️ node_modules/                    # Node packages (npm install)
⚠️ __pycache__/                     # Python cache
⚠️ .venv/                           # Python virtual environment
⚠️ venv/                            # Python virtual environment
⚠️ env/                             # Python virtual environment
⚠️ .DS_Store                        # macOS metadata
⚠️ dist/                            # Build output
```

These are already in `.gitignore`.

---

## 📊 File Count Summary

### Required Files
- **Root config files**: 14 files
- **Backend files**: 3 scripts + 2 model directories + 3 other files
- **Frontend files**: 4 pages + 40+ components + 2 utilities
- **Documentation**: 6 files
- **Public assets**: 3 files

### Total Required: ~70 files (excluding node_modules and models)

### Deleted Files: 19 files + 1 folder (/not with 13 files) = 32 files removed

---

## 🎯 What Each File Does

### Configuration Files (Root)
| File | Purpose |
|------|---------|
| `package.json` | Node dependencies and scripts |
| `package-lock.json` | Locked dependency versions |
| `tsconfig.json` | TypeScript compiler settings |
| `vite.config.ts` | Vite build tool configuration |
| `tailwind.config.ts` | Tailwind CSS styling configuration |
| `components.json` | Shadcn UI component configuration |
| `eslint.config.js` | Code linting rules |
| `postcss.config.js` | CSS processing configuration |
| `.gitignore` | Files to exclude from Git |
| `index.html` | HTML entry point for app |

### Backend Files
| File | Purpose |
|------|---------|
| `server.py` | Main FastAPI server (REQUIRED TO RUN) |
| `train_distilbert.py` | Train BERT model (optional, models already trained) |
| `train_production_fraud_model.py` | Train traditional ML models (optional) |
| `requirements.txt` | Python dependencies list |
| `README.md` | Backend documentation |

### Frontend Files
| File | Purpose |
|------|---------|
| `App.tsx` | Main app component with routing |
| `main.tsx` | React entry point |
| `App.css` | Global styles and animations |
| `index.css` | Tailwind imports and base styles |

### Documentation Files
| File | Purpose |
|------|---------|
| `README.md` | Main project documentation |
| `SETUP_GUIDE.md` | Installation instructions |
| `PROJECT_DOCUMENTATION.md` | Technical documentation |
| `FILE_STRUCTURE.md` | File organization overview |
| `FINAL_STATUS.md` | Project achievements |
| `CLEANUP_SUMMARY.md` | Cleanup report |

---

## 🚀 Minimum Files to Run

To run the application, you ONLY need:

### Backend (Minimum)
```
backend/
├── server.py                   # Main server
├── requirements.txt            # Dependencies
├── bert_fraud_classifier/      # BERT model
└── fraud_detection_classifier/ # ML models
```

### Frontend (Minimum)
```
src/                            # All source files
package.json                    # Dependencies
vite.config.ts                  # Build config
index.html                      # Entry point
```

### Commands
```bash
# Backend
cd backend
pip install -r requirements.txt
python server.py

# Frontend
npm install
npm run dev
```

---

## 📝 Optional Files

These files are optional but recommended:

### Training Scripts (Optional)
- `train_distilbert.py` - Only needed if retraining BERT
- `train_production_fraud_model.py` - Only needed if retraining ML models

### Documentation (Optional but Recommended)
- All files in `/docs` folder
- `README.md` in root

### Configuration (Optional)
- `eslint.config.js` - Code linting (development only)
- `tsconfig.*.json` - TypeScript configs (development only)

---

## ✅ Final Structure (Clean)

```
social-sentinel-ai/
├── backend/                    # Python API + ML models
│   ├── server.py              # ✅ REQUIRED
│   ├── bert_fraud_classifier/ # ✅ REQUIRED
│   └── fraud_detection_classifier/ # ✅ REQUIRED
├── src/                       # React frontend
│   ├── pages/                 # ✅ REQUIRED
│   ├── components/            # ✅ REQUIRED
│   └── lib/                   # ✅ REQUIRED
├── docs/                      # Documentation
├── public/                    # Static assets
├── package.json               # ✅ REQUIRED
├── vite.config.ts             # ✅ REQUIRED
├── index.html                 # ✅ REQUIRED
└── README.md                  # ✅ REQUIRED
```

---

## 🎯 Summary

**Total Files in Project**: ~70 files (excluding node_modules)  
**Required to Run**: ~50 files  
**Optional (Training/Docs)**: ~20 files  
**Deleted (Redundant)**: 32 files  

**Status**: ✅ Clean and Professional Structure

---

**Last Updated**: March 17, 2026  
**Status**: ✅ All Unnecessary Files Removed
