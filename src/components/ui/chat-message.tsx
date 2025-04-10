import { Message } from "@/App.tsx";

type Props = {
  message: Message;
};

const ChatMessage = ({ message }: Props) => {
  return (
    <div
      className={`flex ${message.username === "Pavel" ? "justify-end" : ""}`}
    >
      <span className="font-bold">{message.username}: </span>
      <div className="bg-blue-500 rounded-2xl text-white p-2 ml-2">
        {message.content}
      </div>
    </div>
  );
};

export default ChatMessage;
