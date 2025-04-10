export type Message = {
  type: MessageType;
  content: string;
  sender: string;
  id: string;
  room: string;
};

type MessageType = "regular" | "direct" | "invalid" | "command" | "system";
