#!/bin/bash

# Start the development server from the project root
cd "$(dirname "$0")"

echo "🌱 Starting Smart Watering System..."
echo ""
echo "Frontend will be available at: http://localhost:8000/frontend/"
echo "Backend API should run on: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start Python HTTP server from project root
python3 -m http.server 8000

