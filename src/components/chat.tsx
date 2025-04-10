import { useEffect, useMemo, useState } from "react";
import { ChatUi } from "@/components/chat-ui.tsx";
import useWebSocket from "@/hooks/useWebSocket.tsx";
import { useAuth } from "@/auth/auth.tsx";
import { Message } from "@/lib/types.ts";

function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  const { username, token } = useAuth();

  const socketUrl = useMemo(
    () => `ws://localhost:8090/ws?token=${token}`,
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

  const handleChangeRoom = (room: string) => {
    joinRoom(room);
  };

  if (!username || !isConnected) {
    return <div>Loading...</div>;
  }

  return (
    <ChatUi
      messages={messages}
      user={username}
      sendMessage={handleSendMessage}
      onChangeRoom={handleChangeRoom}
    />
  );
}

export default Chat;
