#!/bin/bash

echo "========================================"
echo "Social Sentinel AI - Setup Script"
echo "========================================"
echo ""

echo "[1/4] Setting up Backend..."
cd backend
echo "Creating virtual environment..."
python3 -m venv venv
echo "Activating virtual environment..."
source venv/bin/activate
echo "Installing Python dependencies..."
pip install -r requirements.txt
cd ..
echo "Backend setup complete!"
echo ""

echo "[2/4] Setting up Frontend..."
echo "Installing Node.js dependencies..."
npm install
echo "Frontend setup complete!"
echo ""

echo "[3/4] Verifying models..."
if [ -f "backend/fraud_detection_classifier/model_svm.pkl" ]; then
    echo "Models found!"
else
    echo "WARNING: Models not found. You may need to train them."
    echo "Run: python backend/train_fraud_real_datasets.py --mlp_epochs 10"
fi
echo ""

echo "[4/4] Setup Complete!"
echo "========================================"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  python server.py"
echo ""
echo "Terminal 2 - Frontend:"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:5173"
echo "========================================"
