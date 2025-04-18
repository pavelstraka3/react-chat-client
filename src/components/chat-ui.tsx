import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message, Room } from "@/lib/types.ts";
import { format, isThisWeek, isToday } from "date-fns";
import {Send} from "lucide-react";

type Props = {
  messages: Message[];
  user: string;
  sendMessage: (message: Partial<Message>) => void;
  onChangeRoom: (room: Room) => void;
  sendTypingStatus: (typingStatus: boolean) => void;
  typingUsers: Map<string, number>;
};

const rooms: Room[] = [
  {
    id: 0,
    name: "general",
  },
];

export function ChatUi({
  messages,
  user,
  sendMessage,
  onChangeRoom,
  sendTypingStatus,
  typingUsers,
}: Props) {
  const [selectedRoom, setSelectedRoom] = useState<Room>(rooms[0]);
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
      sendTypingStatus(false);
    }

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
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    if (e.target.value.length === 1 && !typingTimeoutRef.current) {
      sendTypingStatus(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStatus(false);
      typingTimeoutRef.current = null;
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        sendTypingStatus(false);
      }
    };
  }, [sendTypingStatus]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for room selection */}
      <div
        className={`w-64 sm:block ${sidebarOpen ? "block" : "hidden"} bg-white border-r border-gray-200`}
      >
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
      <div className="flex-1 flex flex-col w-full sm:w-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <button
            className="sm:hidden p-2 text-gray-600"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <h1 className="text-xl font-semibold">#{selectedRoom.name}</h1>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          {messages
            .filter((m) => m.room.name === selectedRoom.name)
            .map((msg) =>
              msg.type === "system" ? (
                <div key={msg.id} className="mb-4 text-center">
                  <span className="inline-block text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
                    {msg.content}
                  </span>
                </div>
              ) : (
                <div
                  key={msg.id}
                  className={`mb-4 ${
                    msg.sender === user ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block p-2 rounded-lg ${
                      msg.sender === user
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">
                      {formatMesssageDate(msg.timestamp)}
                    </p>
                    <p className="font-semibold">{msg.sender.split("@")[0]}</p>
                    <p>{msg.content}</p>
                  </div>
                </div>
              ),
            )}
        </ScrollArea>

        {typingUsers.size > 0 && (
          <div className="px-4 py-2 text-sm text-gray-600 italic">
            {Array.from(typingUsers.keys())
              .filter((typer) => typer !== user)
              .map((typer, index, array) => {
                if (array.length === 1) {
                  return `${typer} is typing...`;
                } else if (index === array.length - 1) {
                  return `and ${typer} are typing...`;
                } else if (index === 0) {
                  return `${typer} `;
                }
                return `${typer}, `;
              })}
          </div>
        )}

        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-gray-200"
        >
          <div className="flex">
            <Input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={handleInputChange}
              className="flex-1 mr-2"
            />
            <Button type="submit">
              <Send className="h-4 w-4 sm:hidden block" />
              <span className="sm:block hidden">Send</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
