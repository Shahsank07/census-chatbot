"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [messages, setMessages] = useState<{ from: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("en");

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages([...messages, userMsg]);
    setInput("");

    const res = await axios.post("/api/ask", { message: input, language });
    const botMsg = { from: "bot", text: res.data.reply };
    setMessages((prev) => [...prev, botMsg]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4 text-green-700">EduCensusBot</h1>
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-2 mb-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-2 rounded-lg max-w-[80%] ${
                msg.from === "user"
                  ? "bg-green-200 self-end text-right ml-auto"
                  : "bg-gray-200 self-start text-left mr-auto"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border rounded p-1"
          >
            <option value="en">English</option>
            <option value="kn">Kannada</option>
          </select>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded p-2"
          />
          <button
            onClick={sendMessage}
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
