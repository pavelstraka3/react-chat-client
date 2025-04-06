import {Message} from "@/App.tsx";
import {Card, CardContent} from "@/components/ui/card.tsx";
import ChatMessage from "@/components/ui/chat-message.tsx";

const Messages: Message[] = [
  {
    type: "chat",
    content: "Hello, World!",
    username: "Pavel"
  },
  {
    type: "chat",
    content: "How are you?",
    username: "John"
  },
  {
    type: "system",
    content: "User has joined the chat"
  }
];

const ChatWindow = () => {
  return (
    <Card>
      <CardContent className="flex flex-col gap-2 p-4">
        {Messages.map((message, index) => (
          <div key={index}>
            {message.type === "chat" ? (
              <ChatMessage message={message} />
            ) : (
              <div className="text-center text-gray-500">{message.content}</div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ChatWindow;