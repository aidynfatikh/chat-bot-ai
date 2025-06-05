import { useParams } from "react-router-dom";
import ChatWindow from "./ChatWindow";
import type { Chat, Message } from "./types";
import { useState } from "react";

const ChatPage = ({
  chats,
  setChats,
}: {
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
}) => {
  const { chatId } = useParams();
  const chat = chats.find((c) => c.id === chatId);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!chat || !input.trim()) return;

    const newMessage: Message = { text: input, fromMe: true };

    setChats((prev) =>
      prev.map((c) =>
        c.id === chat.id ? { ...c, messages: [...c.messages, newMessage] } : c
      )
    );
    setInput("");

    // If this is an AI chat, get AI response
    if (chat.isAi) {
      // Instead of calling the API, just add a dummy AI response
      const dummyAIResponse: Message = {
        text: "This is a dummy AI response.",
        fromMe: false,
      };
      setChats((prev) =>
        prev.map((c) =>
          c.id === chat.id
            ? {
                ...c,
                messages: [...c.messages, dummyAIResponse],
              }
            : c
        )
      );
    }
  };

  return chat ? (
    <ChatWindow
      chat={chat}
      input={input}
      setInput={setInput}
      onSend={sendMessage}
    />
  ) : (
    <div style={{ padding: 32, textAlign: "center" }}>
      <h2>Select a chat to start messaging</h2>
    </div>
  );
};

export default ChatPage;
