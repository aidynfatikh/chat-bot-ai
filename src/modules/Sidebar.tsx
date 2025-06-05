import { Link } from "react-router-dom";
import type { Chat } from "./types";
import { useState } from "react";

const Sidebar = ({
  chats,
  onAddChat,
  onAddAIChat,
  onDeleteChat,
}: {
  chats: Chat[];
  onAddChat: (name: string) => void;
  onAddAIChat: () => void;
  onDeleteChat: (id: string) => void;
}) => {
  const [newChatName, setNewChatName] = useState("");
  const [search, setSearch] = useState("");

  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(search.toLowerCase()) ||
      chat.messages[chat.messages.length - 1]?.text
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  const aiChats = filteredChats.filter((chat) => chat.isAi);
  const userChats = filteredChats.filter((chat) => !chat.isAi);

  return (
    <aside className="w-[30%] h-full bg-gray-100 border-r p-4">
      <h2 className="text-xl font-bold mb-4">Chats</h2>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search chats..."
        className="w-full mb-4 px-3 py-2 border rounded-full outline-none text-sm"
      />
      <ul className="space-y-2">
        {userChats.length > 0 && (
          <>
            <li className="text-xl text-gray-500 pl-2 pb-1">Your Chats</li>
            {userChats.map((chat) => (
              <li key={chat.id} className="flex items-center group min-w-0">
                <Link
                  to={`/chat/${chat.id}`}
                  className="block p-3 rounded bg-white hover:bg-gray-200 flex-1 w-full min-w-0"
                >
                  <div className="font-semibold">{chat.name}</div>
                  <div className="text-sm text-gray-600 truncate w-full max-w-full overflow-hidden whitespace-nowrap block">
                    {chat.messages[chat.messages.length - 1]?.text}
                  </div>
                </Link>
                <button
                  className="ml-2 text-red-600 hover:text-white hover:bg-red-600 rounded-full w-8 h-8 flex items-center justify-center text-2xl font-bold shadow transition border border-red-200 group-hover:opacity-100 opacity-100"
                  title="Delete chat"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Are you sure you want to delete chat '${chat.name}'?`
                      )
                    ) {
                      onDeleteChat(chat.id);
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
            <li className="text-xl text-green-600 pl-2 pb-1 mt-4">AI Chats</li>
            {aiChats.map((chat) => (
              <li key={chat.id} className="flex items-center group min-w-0">
                <Link
                  to={`/chat/${chat.id}`}
                  className="block p-3 rounded bg-white hover:bg-gray-200 flex-1 w-full min-w-0"
                >
                  <div className="font-semibold">{chat.name}</div>
                  <div className="text-sm text-gray-600 truncate w-full max-w-full overflow-hidden whitespace-nowrap block">
                    {chat.messages[chat.messages.length - 1]?.text}
                  </div>
                </Link>
                <button
                  className="ml-2 text-red-600 hover:text-white hover:bg-red-600 rounded-full w-8 h-8 flex items-center justify-center text-2xl font-bold shadow transition border border-red-200 group-hover:opacity-100 opacity-100"
                  title="Delete chat"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Are you sure you want to delete chat '${chat.name}'?`
                      )
                    ) {
                      onDeleteChat(chat.id);
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
          className="flex-1 px-3 py-2 border rounded-full outline-none text-sm"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
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
      {/* AI Chat Button */}
      <div className="mt-8 flex justify-center">
        <button
          className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition shadow"
          onClick={onAddAIChat}
        >
          Chat with AI
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
