import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ChatUi() {
  const [selectedRoom, setSelectedRoom] = useState('general')
  const [message, setMessage] = useState('')
  
  // Mock data for rooms and messages
  const rooms = ['general', 'random', 'support']
  const messages = [
    { id: 1, room: 'general', sender: 'Alice', content: 'Hello everyone!' },
    { id: 2, room: 'general', sender: 'Bob', content: 'Hi Alice, how are you?' },
    { id: 3, room: 'general', sender: 'You', content: 'Hey folks, what\'s up?' },
    { id: 4, room: 'general', sender: 'Alice', content: 'Not much, just chatting here.' },
  ]

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the message to your backend
    console.log('Sending message:', message)
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
                msg.sender === 'You' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  msg.sender === 'You'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p className="font-semibold">{msg.sender}</p>
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