"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<string>("");
  const [recording, setRecording] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:8000/ws/chat");
    wsRef.current.onmessage = (event) => {
      if (event.data === "[END]") return;
      setMessages((prev) => prev + event.data);
    };
    // return () => {
    //   wsRef.current?.close();
    // };
  }, []);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    let chunks: BlobPart[] = [];

    recorder.onstart = () => {
      chunks = [];
    };
    recorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "audio/webm" });

      // 🧪 ここでは簡易的にテキストに置き換えた処理
      const dummyText = "今話した内容を文字起こししました。";
      wsRef.current?.send(dummyText);
      chunks = [];
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">🎙️ 音声チャットBot</h1>
      <div className="mb-4 space-x-2">
        <button
          onClick={recording ? stopRecording : startRecording}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {recording ? "Stop" : "Start"} Recording
        </button>
      </div>
      <div className="border p-4 rounded h-40 overflow-auto whitespace-pre-wrap">
        {messages}
      </div>
    </div>
  );
}
