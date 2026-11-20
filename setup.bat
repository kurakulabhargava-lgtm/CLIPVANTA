@echo off
echo ==============================================
echo   Setting up ClipVanta Local Environment
echo ==============================================

echo [1/3] Checking Python & Virtualenv...
cd backend
python -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt
cd ..

echo [2/3] Setting up Frontend...
cd frontend
call npm install
cd ..

echo [3/3] Creating Storage Directories...
mkdir storage\uploads 2>nul
mkdir storage\audio 2>nul
mkdir storage\clips 2>nul

echo ==============================================
echo Setup Complete!
echo Run 'python backend/run.py' and 'cd frontend && npm run dev'
echo ==============================================
pause
