import React from "react";
import type { Chat } from "./types";

type Props = {
  chat: Chat | null;
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
};

const ChatWindow: React.FC<Props> = ({ chat, input, setInput, onSend }) => {
  if (!chat) {
    return (
      <main className="flex flex-col w-full h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 text-gray-400 mb-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2M12 12v.01M12 16h.01M8 12h.01M16 12h.01"
            />
          </svg>
          <h2 className="text-2xl font-semibold text-gray-500 mb-2">
            Select a chat
          </h2>
          <p className="text-gray-400">
            Choose a conversation from the sidebar to start messaging.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col w-full h-screen bg-gray-100">
      {/* Chat header */}
      <div className="p-4 border-b bg-white shadow">
        <h2 className="text-lg font-semibold">
          {chat?.name ?? "Select a chat"}
        </h2>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {chat?.messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-xl text-xl shadow ${
                msg.fromMe
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none border"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Chat input */}
      <div className="p-5 border-t bg-white flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder="Type a message..."
          className="flex-grow px-4 py-2 border rounded-full outline-none text-xl"
        />
        <button
          onClick={onSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </main>
  );
};

export default ChatWindow;
