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
      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
            apiKey,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: input }],
                },
              ],
            }),
          }
        );
        const data = await response.json();
        const aiText =
          data.candidates?.[0]?.content?.parts?.[0]?.text ||
          "[No response from Gemini]";
        const aiMessage: Message = {
          text: aiText,
          fromMe: false,
        };
        setChats((prev) =>
          prev.map((c) =>
            c.id === chat.id
              ? {
                  ...c,
                  messages: [...c.messages, aiMessage],
                }
              : c
          )
        );
      } catch (error) {
        const errorMessage: Message = {
          text: "[Error fetching Gemini response]",
          fromMe: false,
        };
        setChats((prev) =>
          prev.map((c) =>
            c.id === chat.id
              ? {
                  ...c,
                  messages: [...c.messages, errorMessage],
                }
              : c
          )
        );
      }
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
