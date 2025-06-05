import { Link, useNavigate } from "react-router-dom";
import type { Chat } from "./types";
import { useState, useRef } from "react";

const Sidebar = ({
  chats,
  onAddChat,
  onAddAIChat,
  onDeleteChat,
  onAddAIChatWithName,
}: {
  chats: Chat[];
  onAddChat: (name: string) => void;
  onAddAIChat: () => void;
  onDeleteChat: (id: string) => void;
  onAddAIChatWithName?: (name: string) => void;
}) => {
  const [newChatName, setNewChatName] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(20); // Number of chats to show initially
  const chatListRef = useRef<HTMLDivElement | null>(null);
  const [aiAgentName, setAIAgentName] = useState("");

  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(search.toLowerCase()) ||
      chat.messages[chat.messages.length - 1]?.text
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  const aiChats = filteredChats.filter((chat) => chat.isAi);
  const userChats = filteredChats.filter((chat) => !chat.isAi);

  // Infinite scroll handler
  const handleScroll = () => {
    if (!chatListRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatListRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setVisibleCount((prev) => Math.min(prev + 20, filteredChats.length));
    }
  };

  return (
    <aside
      style={{
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border-color)",
        width: 350,
        minWidth: 350,
        maxWidth: 350,
      }}
      className="h-screen p-4 flex flex-col"
    >
      <h2
        style={{ color: "var(--text-primary)" }}
        className="text-xl font-bold mb-4"
      >
        Chats
      </h2>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search chats..."
        style={{
          background: "var(--bg-primary)",
          color: "var(--text-primary)",
          border: "1px solid var(--border-color)",
        }}
        className="w-full mb-4 px-3 py-2 rounded-full outline-none text-sm"
      />
      <div
        ref={chatListRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto mb-4"
      >
        <ul className="space-y-2">
          {userChats.length > 0 && (
            <>
              <li
                style={{ color: "var(--text-secondary)" }}
                className="text-xl pl-2 pb-1"
              >
                Your Chats
              </li>
              {userChats.slice(0, visibleCount).map((chat) => (
                <li key={chat.id} className="flex items-center group min-w-0">
                  <Link
                    to={`/chat/${chat.id}`}
                    style={{
                      background: "var(--bg-primary)",
                      color: "var(--text-primary)",
                      border: "1px solid var(--border-color)",
                      minWidth: 0,
                      maxWidth: "100%",
                    }}
                    className="block p-3 rounded hover:brightness-95 flex-1 w-full min-w-0 max-w-full"
                  >
                    <div
                      style={{
                        color: "var(--text-primary)",
                        minWidth: 0,
                        maxWidth: "100%",
                      }}
                      className="font-semibold truncate"
                    >
                      {chat.name}
                    </div>
                    <div
                      style={{
                        color: "var(--text-secondary)",
                        maxWidth: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        minWidth: 0,
                      }}
                      className="text-sm truncate w-full block"
                    >
                      {chat.messages[chat.messages.length - 1]?.text}
                    </div>
                  </Link>
                  <button
                    style={{ color: "#e53935", border: "1px solid #e53935" }}
                    className="ml-2 hover:text-white hover:bg-red-600 rounded-full w-8 h-8 flex items-center justify-center text-2xl font-bold shadow transition group-hover:opacity-100 opacity-100"
                    title="Delete chat"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete chat '${chat.name}'?`
                        )
                      ) {
                        onDeleteChat(chat.id);
                        navigate("/");
                      }
                    }}
                  >
                    &times;
                  </button>
                </li>
              ))}
            </>
          )}
          {aiChats.length > 0 && (
            <>
              <li
                style={{ color: "#22c55e" }}
                className="text-xl pl-2 pb-1 mt-4"
              >
                AI Chats
              </li>
              {aiChats.slice(0, visibleCount).map((chat) => (
                <li key={chat.id} className="flex items-center group min-w-0">
                  <Link
                    to={`/chat/${chat.id}`}
                    style={{
                      background: "var(--bg-primary)",
                      color: "var(--text-primary)",
                      border: "1px solid var(--border-color)",
                      minWidth: 0,
                      maxWidth: "100%",
                    }}
                    className="block p-3 rounded hover:brightness-95 flex-1 w-full min-w-0 max-w-full"
                  >
                    <div
                      style={{
                        color: "var(--text-primary)",
                        minWidth: 0,
                        maxWidth: "100%",
                      }}
                      className="font-semibold truncate"
                    >
                      {chat.name}
                    </div>
                    <div
                      style={{
                        color: "var(--text-secondary)",
                        maxWidth: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        minWidth: 0,
                      }}
                      className="text-sm truncate w-full block"
                    >
                      {chat.messages[chat.messages.length - 1]?.text}
                    </div>
                  </Link>
                  <button
                    style={{ color: "#e53935", border: "1px solid #e53935" }}
                    className="ml-2 hover:text-white hover:bg-red-600 rounded-full w-8 h-8 flex items-center justify-center text-2xl font-bold shadow transition group-hover:opacity-100 opacity-100"
                    title="Delete chat"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete chat '${chat.name}'?`
                        )
                      ) {
                        onDeleteChat(chat.id);
                        navigate("/");
                      }
                    }}
                  >
                    &times;
                  </button>
                </li>
              ))}
            </>
          )}
        </ul>
      </div>
      <div className="flex gap-2 mt-8">
        <input
          type="text"
          value={newChatName}
          onChange={(e) => setNewChatName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && newChatName.trim()) {
              onAddChat(newChatName.trim());
              setNewChatName("");
            }
          }}
          placeholder="New chat name"
          style={{
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-color)",
          }}
          className="flex-1 px-3 py-2 rounded-full outline-none text-sm"
        />
        <button
          style={{ background: "var(--primary-blue)" }}
          className="text-white px-4 py-2 rounded-full hover:brightness-90 transition"
          onClick={() => {
            if (newChatName.trim()) {
              onAddChat(newChatName.trim());
              setNewChatName("");
            }
          }}
        >
          Add
        </button>
      </div>
      {/* AI Chat Name Input and Button */}
      <div className="flex gap-2 mt-4 ">
        <input
          type="text"
          value={aiAgentName}
          onChange={(e) => setAIAgentName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && aiAgentName.trim()) {
              if (typeof onAddAIChatWithName === "function") {
                onAddAIChatWithName(aiAgentName.trim());
              } else {
                onAddAIChat();
              }
              setAIAgentName("");
            }
          }}
          placeholder="AI agent name"
          style={{
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-color)",
          }}
          className="flex-1 px-3 py-2 rounded-full outline-none text-sm"
        />
        <button
          style={{ background: "#22c55e" }}
          className="text-white px-4 py-2 rounded-full hover:brightness-90 transition"
          onClick={() => {
            if (aiAgentName.trim()) {
              if (typeof onAddAIChatWithName === "function") {
                onAddAIChatWithName(aiAgentName.trim());
              } else {
                onAddAIChat();
              }
              setAIAgentName("");
            }
          }}
        >
          Add
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
