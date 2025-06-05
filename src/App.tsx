import { Routes, Route } from "react-router-dom";
import Sidebar from "./modules/Sidebar";
import { useState, useEffect } from "react";
import type { Chat } from "./modules/types";
import ChatPage from "./modules/ChatPage";

const App = () => {
  const [chats, setChats] = useState<Chat[]>(() => {
    const saved = localStorage.getItem("chats");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [
      {
        id: "0",
        name: "Bob",
        messages: [{ text: "Hi I am Bob!", fromMe: false }],
        isAi: false,
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  const deleteChat = (id: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== id));
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        chats={chats}
        onAddChat={(name: string) => {
          const newChat: Chat = {
            id: Date.now().toString(),
            name,
            messages: [],
            isAi: false,
          };
          setChats([...chats, newChat]);
        }}
        onAddAIChat={() => {
          const aiChat: Chat = {
            id: "ai-" + Date.now().toString(),
            name: "AI Assistant",
            messages: [
              {
                text: "Hello! I am your AI assistant. How can I help you today?",
                fromMe: false,
              },
            ],
            isAi: true,
          };
          setChats([...chats, aiChat]);
        }}
        onDeleteChat={deleteChat}
      />
      <Routes>
        <Route
          path="/chat/:chatId"
          element={<ChatPage chats={chats} setChats={setChats} />}
        />
        <Route
          path="*"
          element={<main className="flex flex-col w-full h-screen items-center justify-center bg-gray-100">
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
        }
        />
      </Routes>
    </div>
  );
};

export default App;
