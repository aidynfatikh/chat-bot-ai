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
          element={<div className="ml-72 p-6">Select a chat</div>}
        />
      </Routes>
    </div>
  );
};

export default App;
