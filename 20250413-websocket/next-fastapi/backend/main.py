from fastapi import FastAPI, WebSocket
from openai import OpenAI
import tempfile, aiofiles

app = FastAPI()
openai_client = OpenAI()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    # セッションループ
    buffer = b""
    while True:
        data = await websocket.receive_bytes()
        buffer += data

        # チャンクサイズで切る or 明示的に切るロジック（例: silence区間）
        if len(buffer) > 16000 * 2 * 3:  # 16kHz, 16bit, mono * 3秒
            with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
                tmp.write(buffer)
                audio_path = tmp.name

            async with aiofiles.open(audio_path, 'rb') as f:
                response = openai_client.audio.transcriptions.create(
                    model="whisper-1", file=await f.read()
                )
            text = response.text

            # Chat API に投げる
            completion = openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": text}],
                stream=True,
            )

            # ストリーミングでレスポンスをWebSocket経由で返す
            async for chunk in completion:
                if chunk.choices[0].delta.content:
                    await websocket.send_text(chunk.choices[0].delta.content)

            buffer = b""  # リセット
