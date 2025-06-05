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

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) return saved === "true";
    return true; // default to dark mode
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const deleteChat = (id: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== id));
  };

  return (
    <div
      style={{ background: "var(--bg-secondary)" }}
      className="flex h-screen relative"
    >
      {/* Mobile menu toggle button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 px-3 py-2 rounded-full border bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow hover:bg-gray-300 dark:hover:bg-gray-700 transition"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? "✕" : "☰"}
      </button>

      {/* Dark mode toggle button */}
      <button
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-full border bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow hover:bg-gray-300 dark:hover:bg-gray-700 transition"
        onClick={() => setDarkMode((prev) => !prev)}
        aria-label="Toggle dark mode"
      >
        {darkMode ? "🌙 Dark" : "☀️ Light"}
      </button>

      {/* Sidebar with mobile responsiveness */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out`}
      >
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
            setIsSidebarOpen(false); // Close sidebar on mobile after adding chat
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
            setIsSidebarOpen(false); // Close sidebar on mobile after adding chat
          }}
          onAddAIChatWithName={(name: string) => {
            const aiChat: Chat = {
              id: "ai-" + Date.now().toString(),
              name,
              messages: [
                {
                  text: `Hello! I am ${name}. How can I help you today?`,
                  fromMe: false,
                },
              ],
              isAi: true,
            };
            setChats([...chats, aiChat]);
            setIsSidebarOpen(false); // Close sidebar on mobile after adding chat
          }}
          onDeleteChat={deleteChat}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 w-full">
        <Routes>
          <Route
            path="/chat/:chatId"
            element={<ChatPage chats={chats} setChats={setChats} />}
          />
          <Route
            path="*"
            element={
              <main
                style={{ background: "var(--bg-secondary)" }}
                className="flex flex-col w-full h-screen items-center justify-center p-4"
              >
                <div className="flex flex-col items-center text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 sm:h-20 sm:w-20 mb-4 sm:mb-6"
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
                    className="text-xl sm:text-2xl font-semibold mb-2"
                  >
                    Select a chat
                  </h2>
                  <p
                    style={{ color: "var(--text-secondary)" }}
                    className="text-sm sm:text-base"
                  >
                    Choose a conversation from the sidebar to start messaging.
                  </p>
                </div>
              </main>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
