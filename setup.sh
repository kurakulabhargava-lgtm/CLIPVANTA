#!/usr/bin/env bash
set -e

echo "=== ClipVanta Environment Setup ==="

echo "1. Configuring Backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

echo "2. Configuring Frontend..."
cd frontend
npm install
cd ..

echo "3. Initializing Local Storage..."
mkdir -p storage/uploads storage/audio storage/clips

echo "=== Setup Complete! ==="
