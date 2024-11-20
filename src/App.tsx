import './App.css'
import {useEffect, useState} from "react";
import UserInput from "@/components/userInput.tsx";
import RoomInput from "@/components/ui/roomInput.tsx";
import {ChatUi} from "@/components/chat-ui.tsx";

export type Message = {
  type: "chat" | "system"
  content: string,
  sender: string,
  id: string,
  room: string
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8090/ws");

    socket.onopen = () => {
      console.log("Websocket connection established");

      if (username) {
        socket.send(username);
      }
    }

    socket.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);

      if (message.type === "chat") {
        message.room = "general"
        setMessages(prevMessages => [...prevMessages, message]);
      }
    }

    socket.onclose = () => {
      console.log("Websocket connection closed");
    }

    socket.onerror = (error) => {
      console.log("Websocket error: ", error);
    }

    setWs(socket);

    return () => {
      if (socket) {
        socket.close();
      }
    }
  }, [username]);

  const sendMessage = (message: string) => {
    if (ws && message) {
      ws.send(message);
    }
  }

  const handleRoomSubmit = (rm: string) => {
    setRoom(rm);
    if (ws) {
      sendMessage(`/join ${rm}`);
    }
  }

  const handleSendMessage = (message: string) => {
    if (ws && message) {
      sendMessage(message);
    }
  }

  const handleUsernameSubmit = (usr: string) => {
    console.log("Username submitted: ", usr);
    setUsername(usr);
    if (ws) {
      sendMessage(usr);
    }
  }

  return (
    <div>
      <h1>WebSocket Chat</h1>
      {!username ? (
        <UserInput handleUsernameSubmit={handleUsernameSubmit}/>
      ) : !room ? (
        <RoomInput handleRoomSubmit={handleRoomSubmit}/>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Type a message"
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button onClick={() => handleSendMessage(inputMessage)}>Send</button>
        </div>
      )}
      <ChatUi messages={messages} user={username} sendMessage={handleSendMessage}/>
    </div>
  );
}

export default App
