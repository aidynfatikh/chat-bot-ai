// ChatPage.tsx
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import type { Chat, Message } from "./types";
import ChatWindow from "./ChatWindow"; // <-- your existing ChatWindow component

// A helper mutation hook (you can also factor this out into hooks/useGemini.ts)
const useGeminiMutation = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  return useMutation({
    mutationFn: async (promptText: string) => {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
          }),
        }
      );

      if (!res.ok) {
        throw new Error(`Gemini API error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      // Drill down to the first candidate’s text (or fallback)
      const aiText =
        data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "[Gemini did not return a response. Please try rephrasing your question.]";
      return aiText;
    },
  });
};

type Props = {
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
};

const ChatPage = ({ chats, setChats }: Props) => {
  const { chatId } = useParams<{ chatId: string }>();
  const chat = chats.find((c) => c.id === chatId);
  const [input, setInput] = useState("");

  // Instantiate the Gemini mutation
  const gemini = useGeminiMutation();

  const sendMessage = async () => {
    if (!chat || !input.trim()) return;

    // 1. Push user message immediately
    const newMessage: Message = { text: input, fromMe: true };
    setChats((prev) =>
      prev.map((c) =>
        c.id === chat.id ? { ...c, messages: [...c.messages, newMessage] } : c
      )
    );
    setInput("");

    // 2. If chat.isAi, fire off Gemini mutation
    if (chat.isAi) {
      try {
        // mutateAsync returns the AI text or throws on error
        const aiText = await gemini.mutateAsync(input);

        const aiMessage: Message = {
          text: aiText,
          fromMe: false,
        };

        // Append the AI message
        setChats((prev) =>
          prev.map((c) =>
            c.id === chat.id
              ? { ...c, messages: [...c.messages, aiMessage] }
              : c
          )
        );
      } catch (error) {
        // On error, push a visible error message
        const errorMessage: Message = {
          text: `[Error fetching Gemini response: ${
            error instanceof Error ? error.message : String(error)
          }]`,
          fromMe: false,
        };
        setChats((prev) =>
          prev.map((c) =>
            c.id === chat.id
              ? { ...c, messages: [...c.messages, errorMessage] }
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
