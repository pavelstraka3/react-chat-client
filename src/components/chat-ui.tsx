import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {Message, Room} from "@/lib/types.ts";
import {format, isThisWeek, isToday} from "date-fns";

type Props = {
  messages: Message[];
  user: string;
  sendMessage: (message: Partial<Message>) => void;
  onChangeRoom: (room: Room) => void;
};

const rooms: Room[] = [
  {
    id: 0,
    name: "general"
  }
]

export function ChatUi({ messages, user, sendMessage, onChangeRoom }: Props) {
  const [selectedRoom, setSelectedRoom] = useState<Room>(rooms[0]);
  const [message, setMessage] = useState("");

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage({
      content: message,
      room: selectedRoom,
      sender: user,
      type: "regular",
    });
    setMessage("");
  };

  const handleChangeRoom = (room: Room) => {
    setSelectedRoom(room);
    onChangeRoom(room);
  };

  const formatMesssageDate = (timestamp: number): string => {
    const date = new Date(timestamp);

    // If today, show only time
    if (isToday(date)) {
      return format(date, "HH:mm");
    }

    // if is this week, show day and hour
    if (isThisWeek(date)) {
      return format(date, "eee HH:mm");
    }

    return format(date, "d. M. yyyy HH:mm");
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for room selection */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Rooms</h2>
          <ul>
            {rooms.map((room) => (
              <li key={room.id}>
                <Button
                  variant={selectedRoom === room ? "default" : "ghost"}
                  className="w-full justify-start mb-2"
                  onClick={() => handleChangeRoom(room)}
                >
                  # {room.name}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold">#{selectedRoom.name}</h1>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          {messages
            .filter((m) => m.room === selectedRoom)
            .map((msg) => (
              <div
                key={msg.id}
                className={`mb-4 ${
                  msg.sender === user
                    ? "text-right"
                    : msg.sender === "system"
                      ? "text-center"
                      : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-2 rounded-lg ${
                    msg.sender === user
                      ? "bg-blue-500 text-white"
                      : msg.sender === "system"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <p className="text-sm">
                    {formatMesssageDate(msg.timestamp)}
                  </p>
                  {msg.sender !== "system" && (
                    <p className="font-semibold">{msg.sender}</p>
                  )}
                  <p>{msg.content}</p>
                </div>
                <div ref={messagesEndRef} />
              </div>
            ))}
        </ScrollArea>

        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-gray-200"
        >
          <div className="flex">
            <Input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 mr-2"
            />
            <Button type="submit">Send</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
