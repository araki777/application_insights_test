import json
import httpx
import asyncio
from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

APP_ID = os.getenv("APPLICATION_INSIGHTS_APP_ID")
API_KEY = os.getenv("APPLICATION_INSIGHTS_API_KEY")
LOG_QUERY = "customEvents | top 10 by timestamp desc | project timestamp, name, customDimensions"

app = FastAPI()

active_connections = []

app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:5173", "http://127.0.0.1:5173",],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
  await websocket.accept()
  active_connections.append(websocket)
  try:
    while True:
      await asyncio.sleep(10)
      logs = await get_application_insights_logs()
      if "error" in logs:
          await websocket.send_text(json.dumps({"error": "Failed to fetch logs"}))
      else:
          await broadcast(logs)
  except Exception as e:
    print(f"WebSocket: error: {repr(e)}")
  finally:
      if websocket in active_connections:
          active_connections.remove(websocket)

async def get_application_insights_logs():
  url = f"https://api.applicationinsights.io/v1/apps/{APP_ID}/query"
  headers = {"x-api-key": API_KEY}
  params = {"query": LOG_QUERY}

  async with httpx.AsyncClient(timeout=httpx.Timeout(10.0, connect=5.0)) as client:
    response = await client.get(url, headers=headers, params=params)

  if response.status_code == 200:
      return response.json()
  else:
      return {"error": f"Failed to fetch logs, status code {response.status_code}"}

async def broadcast(message):
  for connection in active_connections:
    await connection.send_text(json.dumps(message))

@app.get("/logs")
async def get_logs():
  logs = await get_application_insights_logs()
  return logs