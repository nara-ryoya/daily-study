# backend/main.py
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import openai
import asyncio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 必要に応じて限定
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

openai_client = openai.AsyncOpenAI()

@app.websocket("/ws/chat")
async def chat_ws(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # 音声の文字列として受信（シンプル化のため文字で送っている）
            message = await websocket.receive_text()
            print("User input:", message)

            # OpenAIへstreamingリクエスト送信
            response = await openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": message}],
                stream=True,
            )

            # トークンごとにフロントに送り返す
            async for chunk in response:
                print("chunk:", chunk)
                delta = chunk.choices[0].delta.content or ""
                if delta:
                    await websocket.send_text(delta)
            await websocket.send_text("[END]")

    except Exception as e:
        print("WebSocket error:", e)
        await websocket.close()
