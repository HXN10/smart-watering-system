#!/bin/bash

# Start both frontend and backend development servers

cd "$(dirname "$0")"

echo "🌱 Starting Smart Watering System Development Servers..."
echo ""

# Kill any existing servers
pkill -f "python3 -m http.server 8000" 2>/dev/null
pkill -f "nodemon.*server.js" 2>/dev/null
pkill -f "node.*server.js" 2>/dev/null

# Start Frontend Server
echo "📱 Starting Frontend server on http://localhost:8000..."
cd frontend
python3 -m http.server 8000 > /tmp/frontend-server.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Start Backend Server
echo "🔧 Starting Backend server on http://localhost:3001..."
cd smart-watering-system/backend
npm run dev > /tmp/backend-server.log 2>&1 &
BACKEND_PID=$!
cd ../..

sleep 2

# Check if servers started
if curl -s http://localhost:8000/login.html > /dev/null; then
    echo "✅ Frontend: http://localhost:8000/login.html"
else
    echo "❌ Frontend failed to start"
fi

if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ Backend: http://localhost:3001/health"
else
    echo "⚠️  Backend starting... (may take a few seconds)"
fi

echo ""
echo "📝 Logs:"
echo "   Frontend: tail -f /tmp/frontend-server.log"
echo "   Backend:  tail -f /tmp/backend-server.log"
echo ""
echo "🛑 To stop: pkill -f 'python3 -m http.server 8000' && pkill -f 'nodemon'"
echo ""
echo "Press Ctrl+C to stop (servers will continue in background)"

# Wait for interrupt
trap "echo ''; echo 'Stopping servers...'; kill $FRONTEND_PID $BACKEND_PID 2>/dev/null; exit" INT
wait

