import { useEffect, useMemo, useState } from "react";
import useWebSocket from "@/hooks/useWebSocket.tsx";
import { useAuth } from "@/auth/auth.tsx";
import { Message, Room } from "@/lib/types.ts";
import { ChatUi } from "@/components/chat-ui.tsx";
import useJWT from "@/hooks/useJWT.tsx";

function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);

  const { token } = useAuth();
  const { email } = useJWT(token);

  useEffect(() => {
    const getMessages = async () => {
      const defaultRoom: Room = {
        id: 1,
        name: "general",
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/messages?roomId=${defaultRoom.id}`,
      );

      if (!response.ok) {
        console.error("Failed to fetch messages.");
        return;
      }

      const data = await response.json();

      if (!data) return;

      // Temporary solution until the types are the same on the frontend and backend
      const parsedMessages = data.map((d: Message) => {
        const message: Message = {
          id: d.id,
          content: d.content,
          room: d.room,
          type: d.type,
          sender: d.sender,
          timestamp: d.timestamp,
        };
        return message;
      });

      setMessages([...messages, ...parsedMessages]);
    };

    getMessages();
  }, [token]);

  const socketUrl = useMemo(
    () => `${import.meta.env.VITE_WS_URL}/ws?token=${token}`,
    [token],
  );

  const handleIncomingMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const { isConnected, sendMessage, joinRoom } = useWebSocket({
    url: socketUrl,
    onMessageRecieved: handleIncomingMessage,
  });

  const handleSendMessage = (message: Partial<Message>) => {
    sendMessage(message);
  };

  const handleChangeRoom = (room: Room) => {
    joinRoom(room);
  };

  if (!email || !isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mb-4" />
        <p className="text-gray-600 font-medium">Connecting...</p>
      </div>
    );
  }

  return (
    <ChatUi
      messages={messages}
      user={email || ""}
      sendMessage={handleSendMessage}
      onChangeRoom={handleChangeRoom}
    />
  );
}

export default Chat;
