# Clone to New Laptop - Quick Checklist

## ✅ Before You Start

### On Current Laptop:
- [ ] Commit all changes: `git add . && git commit -m "Ready to clone"`
- [ ] Choose transfer method (GitHub, USB, or Cloud)
- [ ] If using GitHub: Push code `git push origin main`
- [ ] If using USB/Cloud: Copy entire `social-sentinel-ai` folder

---

## ✅ On New Laptop

### 1. Prerequisites (5 minutes)
- [ ] Install Python 3.8+ → [python.org](https://python.org)
- [ ] Install Node.js 16+ → [nodejs.org](https://nodejs.org)
- [ ] Install Git (if cloning) → [git-scm.com](https://git-scm.com)
- [ ] Verify: `python --version`, `node --version`, `git --version`

### 2. Get the Code (2 minutes)
Choose one:
- [ ] **GitHub:** `git clone https://github.com/YOUR_USERNAME/social-sentinel-ai.git`
- [ ] **USB:** Copy folder from USB drive
- [ ] **Cloud:** Download and extract from cloud storage

### 3. Quick Setup (5 minutes)
```bash
cd social-sentinel-ai

# Windows:
setup.bat

# Mac/Linux:
chmod +x setup.sh
./setup.sh
```

**OR Manual Setup:**
```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
cd ..

# Frontend
npm install
```

### 4. Verify Models (1 minute)
- [ ] Check `backend/fraud_detection_classifier/` folder exists
- [ ] Should contain: `model_svm.pkl`, `vectorizer.pkl`, etc.
- [ ] If missing: `python backend/train_fraud_real_datasets.py --mlp_epochs 10`

### 5. Start Servers (2 minutes)

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate  # Windows
python server.py
```
- [ ] See: "Fraud models loaded: ['logreg', 'svm', ...]"
- [ ] Running on: http://localhost:8000

**Terminal 2 - Frontend:**
```bash
npm run dev
```
- [ ] See: "Local: http://localhost:5173"
- [ ] Running on: http://localhost:5173

### 6. Test (2 minutes)
- [ ] Open: http://localhost:5173
- [ ] Go to "Fraud Detection" page
- [ ] Click "Load Fraudulent Sample"
- [ ] Click "Analyze Content"
- [ ] Should show: **Fraudulent (100/100)**
- [ ] Go to Dashboard
- [ ] Should see: Threat meter and charts

---

## ✅ Success Criteria

All these should be ✅:
- [ ] Backend running (http://localhost:8000)
- [ ] Frontend running (http://localhost:5173)
- [ ] Fraud detection works (100/100 for SSN request)
- [ ] Dashboard displays correctly
- [ ] No errors in console

---

## 🐛 Quick Fixes

### Backend won't start?
```bash
cd backend
pip install -r requirements.txt
```

### Frontend won't start?
```bash
rm -rf node_modules
npm install
```

### Models missing?
```bash
cd backend
python train_fraud_real_datasets.py --mlp_epochs 10
```

### Port in use?
```bash
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:8000 | xargs kill -9
```

---

## 📚 Documentation

- **Setup Guide:** [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed instructions
- **Project Summary:** [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Complete overview
- **Improvements:** [UPGRADES_APPLIED.md](UPGRADES_APPLIED.md) - All features
- **README:** [README.md](README.md) - Quick start

---

## ⏱️ Total Time: ~15 minutes

1. Prerequisites: 5 min
2. Get code: 2 min
3. Setup: 5 min
4. Start servers: 2 min
5. Test: 2 min

---

## 🎉 Done!

Your fraud detection system is now running on the new laptop!

**Access:** http://localhost:5173

**Features:**
- ✅ 99.67% accuracy fraud detection
- ✅ 100% credential theft detection
- ✅ Real-time threat monitoring
- ✅ Analysis history with CSV export
- ✅ Dynamic dashboard with charts
