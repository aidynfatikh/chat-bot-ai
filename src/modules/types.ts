export type Message = {
  text: string;
  fromMe: boolean;
};

export type Chat = {
  id: string;
  name: string;
  messages: Message[];
  isAi: boolean;
};
