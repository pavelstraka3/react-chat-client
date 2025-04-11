export type Message = {
  type: MessageType;
  content: string;
  sender: string;
  id: string;
  room: string;
  timestamp: number;
};

type MessageType = "regular" | "direct" | "invalid" | "command" | "system";
