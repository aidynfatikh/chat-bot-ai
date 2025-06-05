import { useParams } from "react-router-dom";
import ChatWindow from "./ChatWindow";
import type { Chat, Message } from "./types";
import { useState } from "react";
import axios from "axios";

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
        // Prepare messages for Gemini
        const contents = [...chat.messages, newMessage].map((msg) => ({
          role: msg.fromMe ? "user" : "model",
          parts: [{ text: msg.text }],
        }));

        const GEMINI_API_KEY = "AIzaSyBmI8GVuiRa-6DknREGe8utBD7lSt7Qynk";
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            contents,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const aiText =
          response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (aiText) {
          setChats((prev) =>
            prev.map((c) =>
              c.id === chat.id
                ? {
                    ...c,
                    messages: [...c.messages, { text: aiText, fromMe: false }],
                  }
                : c
            )
          );
        }
      } catch (err: any) {
        console.error("Gemini API error:", err?.response?.data || err);
        setChats((prev) =>
          prev.map((c) =>
            c.id === chat.id
              ? {
                  ...c,
                  messages: [
                    ...c.messages,
                    {
                      text:
                        "AI error: Could not get response. " +
                        (err?.response?.data?.error?.message ||
                          err.message ||
                          ""),
                      fromMe: false,
                    },
                  ],
                }
              : c
          )
        );
      }
    }
  };

  return (
    <ChatWindow
      chat={chat ?? null}
      input={input}
      setInput={setInput}
      onSend={sendMessage}
    />
  );
};

export default ChatPage;
