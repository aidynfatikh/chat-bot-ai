import React, { useEffect, useRef, useState } from "react";
import type { Chat } from "./types";

type Props = {
  chat: Chat | null;
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
};

const ChatWindow: React.FC<Props> = ({ chat, input, setInput, onSend }) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(30); // Number of messages to show initially

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat?.messages.length]);

  useEffect(() => {
    setVisibleCount(30); // Reset visible messages when chat changes
  }, [chat?.id]);

  // Infinite scroll handler for messages (load more on scroll to top)
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    if (messagesContainerRef.current.scrollTop === 0) {
      setVisibleCount((prev) => {
        if (!chat) return prev;
        return Math.min(prev + 30, chat.messages.length);
      });
    }
  };

  if (!chat) {
    return (
      <main
        style={{ background: "var(--bg-secondary)" }}
        className="flex flex-col w-full h-screen items-center justify-center"
      >
        <div className="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 mb-6"
            style={{ color: "var(--text-secondary)" }}
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
          <h2
            style={{ color: "var(--text-secondary)" }}
            className="text-2xl font-semibold mb-2"
          >
            Select a chat
          </h2>
          <p style={{ color: "var(--text-secondary)" }}>
            Choose a conversation from the sidebar to start messaging.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{ background: "var(--bg-secondary)" }}
      className="flex flex-col w-full h-screen"
    >
      {/* Chat header */}
      <div
        style={{
          background: "var(--bg-primary)",
          borderBottom: "1px solid var(--border-color)",
        }}
        className="p-6 shadow"
      >
        <h2
          style={{ color: "var(--text-primary)" }}
          className="text-lg font-semibold"
        >
          {chat?.name ?? "Select a chat"}
        </h2>
      </div>

      {/* Message list */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-2"
        style={{ maxHeight: "calc(100vh - 180px)" }}
      >
        {chat?.messages.slice(-visibleCount).map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}
          >
            <div
              style={
                msg.fromMe
                  ? { background: "var(--primary-blue)", color: "#fff" }
                  : {
                      background: "var(--message-in)",
                      color: "var(--text-primary)",
                      border: "1px solid var(--border-color)",
                    }
              }
              className={`max-w-[75%] px-4 py-2 rounded-xl text-xl shadow ${
                msg.fromMe ? "rounded-br-none" : "rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat input */}
      <div
        style={{
          background: "var(--bg-primary)",
          borderTop: "1px solid var(--border-color)",
        }}
        className="p-5 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder="Type a message..."
          style={{
            background: "var(--bg-secondary)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-color)",
          }}
          className="flex-grow px-4 py-2 rounded-full outline-none text-xl"
        />
        <button
          onClick={onSend}
          style={{ background: "var(--primary-blue)" }}
          className="text-white px-4 py-2 rounded-full hover:brightness-90 transition"
        >
          Send
        </button>
      </div>
    </main>
  );
};

export default ChatWindow;
