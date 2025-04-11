import {useEffect, useMemo, useState} from "react";
import useWebSocket from "@/hooks/useWebSocket.tsx";
import {useAuth} from "@/auth/auth.tsx";
import {Message} from "@/lib/types.ts";
import {ChatUi} from "@/components/chat-ui.tsx";
import useJWT from "@/hooks/useJWT.tsx";

function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  const { token } = useAuth();
  const { email } = useJWT(token);

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

  if (!email || !isConnected) {
    return <div>Loading...</div>;
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
