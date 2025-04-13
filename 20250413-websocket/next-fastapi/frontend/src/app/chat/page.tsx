"use client";

import { useEffect, useRef } from "react";

export default function ChatPage() {
  const ws = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // WebSocket 接続
    ws.current = new WebSocket("ws://localhost:8000/ws"); // FastAPI URL
    ws.current.onmessage = (event) => {
      console.log("Chat response:", event.data); // 表示処理に接続
    };

    // マイク音声の録音
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      source.connect(processor);
      processor.connect(audioContext.destination);

      processor.onaudioprocess = (e) => {
        const input = e.inputBuffer.getChannelData(0);
        const pcm = new Int16Array(input.length);
        for (let i = 0; i < input.length; i++) {
          pcm[i] = input[i] * 0x7fff; // Float32 → PCM16
        }
        if (ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(pcm.buffer);
        }
      };
    });

    return () => {
      ws.current?.close();
      audioContextRef.current?.close();
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">🎙️ 音声チャット</h1>
      <p>マイクからの入力をリアルタイムに処理中...</p>
    </div>
  );
}
