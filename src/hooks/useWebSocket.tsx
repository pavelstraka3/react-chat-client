import { useCallback, useEffect, useRef, useState } from "react";
import { Message, Room } from "@/lib/types.ts";

type WebSocketHookProps = {
  url: string;
  onMessageRecieved?: (message: Message) => void;
};

type UseWebSocketReturn = {
  isConnected: boolean;
  sendMessage: (message: Partial<Message>) => void;
  joinRoom: (room: Room) => void;
  sendTypingStatus: (isTyping: boolean) => void;
};

const useWebSocket = ({
  url,
  onMessageRecieved,
}: WebSocketHookProps): UseWebSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Websocket connection established");
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      console.log("Message recieved: ", event.data);
      if (onMessageRecieved) {
        try {
          const message = JSON.parse(event.data) as Message;
          onMessageRecieved(message);
        } catch (e) {
          console.error("Failed to parse message: ", e);
        }
      }
    };

    socket.onclose = () => {
      console.log("Websocket connection closed");
      setIsConnected(false);
    };

    socket.onerror = (error) => {
      console.log("Websocket error: ", error);
    };

    return () => {
      console.log("Closing WebSocket...");
      socket.close();
    };
  }, [url]);

  const sendMessage = useCallback((message: Partial<Message>) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected");
    }
  }, []);

  const joinRoom = useCallback(
    (room: Room) => {
      const msg: Partial<Message> = {
        room: room,
        type: "command",
        content: "join",
      };
      sendMessage(msg);
    },
    [sendMessage],
  );

  const sendTypingStatus = useCallback(
    (isTyping: boolean) => {
      const msg: Partial<Message> = {
        type: "typing",
        content: isTyping ? "true" : "false",
      };
      sendMessage(msg);
    },
    [sendMessage],
  );

  return { isConnected, sendMessage, joinRoom, sendTypingStatus };
};

export default useWebSocket;
