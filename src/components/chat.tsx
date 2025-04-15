import { useEffect, useMemo, useState } from "react";
import useWebSocket from "@/hooks/useWebSocket.tsx";
import { useAuth } from "@/auth/auth.tsx";
import { Message, Room } from "@/lib/types.ts";
import { ChatUi } from "@/components/chat-ui.tsx";
import useJWT from "@/hooks/useJWT.tsx";

function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<Map<string, number>>(new Map());

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

      const data = await response.json() as Message[];

      if (!data) return;

      setMessages([...messages, ...data]);
    };

    getMessages();
  }, [token]);

  const socketUrl = useMemo(
    () => `${import.meta.env.VITE_WS_URL}/ws?token=${token}`,
    [token],
  );

  const handleIncomingMessage = (message: Message) => {
    if (message.type === "typing") {
      const newTypingUsers = new Map(typingUsers);

      if (message.content === "is typing..." && message.sender) {
        newTypingUsers.set(message.sender, Date.now())
      } else if (message.sender) {
        newTypingUsers.delete(message.sender);
      }

      setTypingUsers(newTypingUsers);
      return;
    }

    // First check if message isn't already there
    const messageExists = messages.some((msg) => msg.id === message.id);

    if (messageExists) {
      return;
    }

    setMessages((prevMessages) => [...prevMessages, message]);
  };

  // Cleanup users that didn't send typing update
  useEffect(() => {
    const interval = setInterval(() => {
      setTypingUsers(prevTypingUsers => {
        const newTypingUsers = new Map(prevTypingUsers);
        const now = Date.now();

        // Remove users who haven't updated their typing status for 3 seconds
        for (const [user, timestamp] of newTypingUsers.entries()) {
          if (now - timestamp > 3000) {
            newTypingUsers.delete(user);
          }
        }

        return newTypingUsers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const { isConnected, sendMessage, joinRoom, sendTypingStatus } = useWebSocket({
    url: socketUrl,
    onMessageRecieved: handleIncomingMessage,
  });

  const handleSendMessage = (message: Partial<Message>) => {
    sendMessage(message);
  };

  const handleChangeRoom = (room: Room) => {
    joinRoom(room);
  };

  const handleChangeTypingStatus = (typingStatus: boolean) => {
    sendTypingStatus(typingStatus);
  }

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
      sendTypingStatus={handleChangeTypingStatus}
      typingUsers={typingUsers}
    />
  );
}

export default Chat;
