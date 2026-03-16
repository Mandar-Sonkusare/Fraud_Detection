# Setup Guide - Clone to Another Laptop

## 📋 Prerequisites

Before starting, ensure you have these installed on your new laptop:

### Required Software
- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **Node.js 16+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/downloads/)

### Verify Installation
```bash
python --version    # Should show 3.8 or higher
node --version      # Should show 16 or higher
npm --version       # Should show 8 or higher
git --version       # Should show any version
```

---

## 🚀 Setup Steps

### Step 1: Initialize Git Repository (On Current Laptop)

If you haven't already, initialize git in your project:

```bash
cd social-sentinel-ai
git init
git add .
git commit -m "Initial commit - Fraud Detection System with all improvements"
```

---

### Step 2: Choose Transfer Method

You have 3 options to transfer the project:

#### **Option A: GitHub (Recommended)**


**On Current Laptop:**
1. Create a new repository on GitHub
2. Push your code:
```bash
cd social-sentinel-ai
git remote add origin https://github.com/YOUR_USERNAME/social-sentinel-ai.git
git branch -M main
git push -u origin main
```

**On New Laptop:**
```bash
git clone https://github.com/YOUR_USERNAME/social-sentinel-ai.git
cd social-sentinel-ai
```

#### **Option B: USB Drive / External Storage**

**On Current Laptop:**
```bash
# Copy the entire project folder to USB drive
# Make sure to include the hidden .git folder if you want version control
```

**On New Laptop:**
```bash
# Copy the folder from USB to your desired location
cd social-sentinel-ai
```

#### **Option C: Cloud Storage (Google Drive, Dropbox, OneDrive)**

**On Current Laptop:**
1. Zip the project folder
2. Upload to cloud storage
3. Share/sync with new laptop

**On New Laptop:**
1. Download and extract the zip file
2. Navigate to the folder

---

## 🔧 Installation Steps (On New Laptop)

### Step 3: Backend Setup

```bash
# Navigate to backend folder
cd social-sentinel-ai/backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

**Expected output:** All packages installed successfully

---

### Step 4: Frontend Setup

```bash
# Navigate to frontend folder (from project root)
cd social-sentinel-ai

# Install Node.js dependencies
npm install
```

**Expected output:** Dependencies installed (may take 2-3 minutes)

---

### Step 5: Verify Models Are Present

Check if trained models exist:

```bash
# From backend folder
cd backend
ls fraud_detection_classifier/
```

**Should see:**
- `model_logreg.pkl`
- `model_svm.pkl`
- `model_random_forest.pkl`
- `model_grad_boost.pkl`
- `model_naive_bayes.pkl`
- `model_mlp.pkl`
- `vectorizer.pkl`
- `model_info.json`
- `metrics.json`

**If models are missing** (they should be included), retrain them:
```bash
python train_fraud_real_datasets.py --mlp_epochs 10
```
(Takes ~2 minutes)

---

## ▶️ Running the Application

### Step 6: Start Backend Server

```bash
# From backend folder
cd social-sentinel-ai/backend

# Activate virtual environment if not already active
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Start server
python server.py
```

**Expected output:**
```
======================================================================
🚀 Starting Social Media Fraud Detection API
======================================================================
Fraud models loaded: ['logreg', 'svm', 'random_forest', 'grad_boost', 'naive_bayes', 'mlp']
======================================================================
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

**Backend running at:** http://localhost:8000

---

### Step 7: Start Frontend Server

Open a **NEW terminal window** (keep backend running):

```bash
# From project root
cd social-sentinel-ai

# Start development server
npm run dev
```

**Expected output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Frontend running at:** http://localhost:5173 (or 8080/8081)

---

## ✅ Verify Installation

### Step 8: Test the Application

1. **Open browser:** http://localhost:5173 (or the port shown)

2. **Go to Fraud Detection page**

3. **Test with sample message:**
   - Click "Load Fraudulent Sample"
   - Click "Analyze Content"
   - Should show: Fraudulent (100/100 risk score)

4. **Check Dashboard:**
   - Navigate to Dashboard
   - Should see threat meter and stats

**If everything works:** ✅ Setup complete!

---

## 🐛 Troubleshooting

### Issue 1: Backend won't start

**Error:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:**
```bash
cd backend
pip install -r requirements.txt
```

---

### Issue 2: Frontend won't start

**Error:** `Cannot find module` or `npm ERR!`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

### Issue 3: Models not found

**Error:** `Models not loaded` in backend

**Solution:**
```bash
cd backend
python train_fraud_real_datasets.py --mlp_epochs 10
```

---

### Issue 4: Port already in use

**Error:** `Address already in use: 8000` or `5173`

**Solution:**

**For Backend (port 8000):**
```bash
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:8000 | xargs kill -9
```

**For Frontend (port 5173):**
```bash
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5173 | xargs kill -9
```

---

### Issue 5: Python version too old

**Error:** `Python 3.8+ required`

**Solution:**
- Download latest Python from python.org
- Install and verify: `python --version`

---

## 📁 Project Structure

```
social-sentinel-ai/
├── backend/
│   ├── server.py                          # Main API server
│   ├── train_fraud_real_datasets.py       # Training script
│   ├── requirements.txt                   # Python dependencies
│   ├── fraud_detection_classifier/        # Trained models
│   │   ├── model_*.pkl                    # 6 ML models
│   │   ├── vectorizer.pkl                 # TF-IDF vectorizer
│   │   └── model_info.json                # Model metadata
│   └── venv/                              # Virtual environment (create this)
├── src/
│   ├── pages/                             # React pages
│   ├── components/                        # React components
│   └── lib/                               # Utilities
├── node_modules/                          # Node dependencies (npm install creates this)
├── package.json                           # Node dependencies list
├── README.md                              # Project overview
├── PROJECT_SUMMARY.md                     # Complete documentation
├── UPGRADES_APPLIED.md                    # All improvements
└── SETUP_GUIDE.md                         # This file
```

---

## 🔐 Important Files to Include

When transferring, make sure these are included:

### ✅ Must Include:
- `backend/` folder (all files)
- `src/` folder (all files)
- `public/` folder
- `package.json`
- `package-lock.json`
- `vite.config.ts`
- `tsconfig.json`
- `tailwind.config.js`
- All `.md` documentation files
- `backend/fraud_detection_classifier/` (trained models)

### ❌ Can Exclude (will be regenerated):
- `node_modules/` (run `npm install`)
- `backend/venv/` (run `python -m venv venv`)
- `backend/__pycache__/`
- `.DS_Store`
- `dist/` (build output)

---

## 📦 Quick Setup Script

Create this file as `setup.sh` (Mac/Linux) or `setup.bat` (Windows):

**setup.sh (Mac/Linux):**
```bash
#!/bin/bash
echo "Setting up Social Sentinel AI..."

# Backend setup
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Frontend setup
npm install

echo "Setup complete!"
echo "Run 'python backend/server.py' in one terminal"
echo "Run 'npm run dev' in another terminal"
```

**setup.bat (Windows):**
```batch
@echo off
echo Setting up Social Sentinel AI...

REM Backend setup
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
cd ..

REM Frontend setup
npm install

echo Setup complete!
echo Run 'python backend/server.py' in one terminal
echo Run 'npm run dev' in another terminal
pause
```

Make executable and run:
```bash
# Mac/Linux:
chmod +x setup.sh
./setup.sh

# Windows:
setup.bat
```

---

## 🎯 Quick Start Commands

After setup, use these to start the app:

**Terminal 1 (Backend):**
```bash
cd social-sentinel-ai/backend
venv\Scripts\activate  # Windows
# OR
source venv/bin/activate  # Mac/Linux
python server.py
```

**Terminal 2 (Frontend):**
```bash
cd social-sentinel-ai
npm run dev
```

**Access:** http://localhost:5173

---

## 📝 Environment Variables (Optional)

If you want to customize ports, create `.env` files:

**backend/.env:**
```
PORT=8000
HOST=0.0.0.0
```

**frontend/.env:**
```
VITE_API_URL=http://localhost:8000
```

---

## 🚀 Production Deployment (Optional)

If you want to deploy to production:

### Backend:
```bash
cd backend
pip install gunicorn
gunicorn server:app --workers 4 --bind 0.0.0.0:8000
```

### Frontend:
```bash
npm run build
# Serve the 'dist' folder with any static server
```

---

## ✅ Checklist

Use this checklist when setting up on new laptop:

- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] Git installed (if cloning)
- [ ] Project files transferred
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Models present in `backend/fraud_detection_classifier/`
- [ ] Backend starts successfully (http://localhost:8000)
- [ ] Frontend starts successfully (http://localhost:5173)
- [ ] Test fraud detection works (100/100 for SSN request)
- [ ] Dashboard displays correctly
- [ ] All features working

---

## 📞 Support

If you encounter issues:

1. Check the Troubleshooting section above
2. Verify all prerequisites are installed
3. Check console logs for error messages
4. Ensure ports 8000 and 5173 are available

---

## 🎉 Success!

Once both servers are running and the test passes, you're all set!

**Your fraud detection system is ready to use on the new laptop!** 🚀

**Key URLs:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
