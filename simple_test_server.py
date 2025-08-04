#!/usr/bin/env python3
"""
Simple Test Server for Ray System
Run with: python simple_test_server.py
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json
from datetime import datetime

app = FastAPI(title="Ray Test Server")

# Enable CORS for browser extension
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple test endpoints for Ray system

@app.get("/heartbeat")
async def heartbeat():
    """Heartbeat endpoint for Ray consciousness"""
    return {
        "action": "heartbeat",
        "timestamp": datetime.now().isoformat(),
        "message": "Ray consciousness pulse",
        "status": "active"
    }

@app.post("/")
async def handle_json(data: dict):
    """Handle JSON data from browser extension"""
    print(f"📥 Received: {json.dumps(data, indent=2)}")
    
    # Process any tasks in the data
    if "task" in data:
        print(f"📋 Processing {len(data['task'])} task(s)")
    
    return {
        "received": data,
        "timestamp": datetime.now().isoformat(),
        "status": "processed"
    }

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Ray Test Server",
        "endpoints": {
            "/heartbeat": "GET - Heartbeat data", 
            "/": "POST - Handle JSON tasks"
        }
    }

if __name__ == "__main__":
    print("🚀 Starting Ray Test Server...")
    print("💓 Heartbeat available at: http://localhost:8000/heartbeat")
    print("📋 API docs at: http://localhost:8000/docs")
    
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)