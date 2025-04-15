export type Message = {
  type: MessageType;
  content: string;
  sender: string;
  id: string;
  room: Room;
  target?: string;
  timestamp: number;
  command?: string;
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
  created_at?: string;
};
