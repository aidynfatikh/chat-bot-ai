import { useMutation } from '@tanstack/react-query';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export const useGemini = () => {
  return useMutation({
    mutationFn: async (text: string) => {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text }] }],
          }),
        }
      );

      if (!res.ok) throw new Error("Gemini API failed");
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    },
  });
};
