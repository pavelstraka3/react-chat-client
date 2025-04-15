export type Message = {
  type: MessageType;
  content: string;
  sender: string;
  id: string;
  room: string;
  timestamp: number;
};

export type MessageType =
  | "regular"
  | "direct"
  | "invalid"
  | "command"
  | "system";

export type Room = {
  id: number;
  name: string;
};
