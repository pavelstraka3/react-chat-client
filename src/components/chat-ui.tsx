import {useState} from 'react'
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Message} from "@/App.tsx";

type Props = {
  messages: Message[],
  user: string
  sendMessage: (message: string) => void;
}

export function ChatUi({messages, user, sendMessage}: Props) {
  const [selectedRoom, setSelectedRoom] = useState('general')
  const [message, setMessage] = useState('')

  // Mock data for rooms and messages
  const rooms = ['general', 'random', 'support']

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the message to your backend
    sendMessage(message)
    setMessage('')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for room selection */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Rooms</h2>
          <ul>
            {rooms.map((room) => (
              <li key={room}>
                <Button
                  variant={selectedRoom === room ? "default" : "ghost"}
                  className="w-full justify-start mb-2"
                  onClick={() => setSelectedRoom(room)}
                >
                  # {room}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold">#{selectedRoom}</h1>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          {messages.filter(m => m.room === selectedRoom).map((msg) => (
            <div
              key={msg.id}
              className={`mb-4 ${
                msg.sender === user ? 'text-right' : msg.sender === 'system' ? 'text-center' : 'text-left'
              }`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  msg.sender === user
                    ? 'bg-blue-500 text-white'
                    : msg.sender === 'system' ? 'bg-gray-100 text-gray-800' : 'bg-gray-200 text-gray-800'
                }`}
              >
                {msg.sender !== "system" && <p className="font-semibold">{msg.sender}</p>}
                <p>{msg.content}</p>
              </div>
            </div>
          ))}
        </ScrollArea>

        {/* Input for new message */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
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
  )
}