import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Search, MoreVertical, Send, Phone, Video } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const conversations = [
  {
    id: 1,
    name: 'Tennis Group',
    lastMessage: 'Great game today everyone!',
    time: '2m ago',
    unread: 3,
    isGroup: true,
    avatar: ''
  },
  {
    id: 2,
    name: 'Alex Chen',
    lastMessage: 'See you at the court tomorrow',
    time: '1h ago',
    unread: 0,
    isGroup: false,
    avatar: ''
  },
  {
    id: 3,
    name: 'Basketball Squad',
    lastMessage: 'Who\'s bringing the ball?',
    time: '3h ago',
    unread: 1,
    isGroup: true,
    avatar: ''
  },
  {
    id: 4,
    name: 'Maria Santos',
    lastMessage: 'Thanks for the workout tips!',
    time: '1d ago',
    unread: 0,
    isGroup: false,
    avatar: ''
  }
];

const currentChat = {
  name: 'Tennis Group',
  isGroup: true,
  participants: 8,
  messages: [
    {
      id: 1,
      sender: 'Alex Chen',
      content: 'Great game today everyone! Really enjoyed the matches.',
      time: '10:30 AM',
      isOwn: false
    },
    {
      id: 2,
      sender: 'You',
      content: 'Same here! My backhand is finally improving 😊',
      time: '10:32 AM',
      isOwn: true
    },
    {
      id: 3,
      sender: 'Maria Santos',
      content: 'We should definitely do this again next week. Same time?',
      time: '10:35 AM',
      isOwn: false
    },
    {
      id: 4,
      sender: 'You',
      content: 'I\'m in! Let me check the court availability.',
      time: '10:37 AM',
      isOwn: true
    }
  ]
};

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [showChatList, setShowChatList] = useState(true);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message
      setNewMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-4">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Messages</h1>
        </div>
      </div>

      <div className="flex h-[calc(100vh-140px)]">
        {/* Chat List */}
        <div className={`${showChatList ? 'block' : 'hidden md:block'} w-full md:w-80 border-r border-border/50`}>
          <div className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
              />
            </div>
            
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <Card
                  key={conversation.id}
                  className={`cursor-pointer transition-colors border-border/50 ${
                    selectedChat === conversation.id ? 'bg-primary/10 border-primary/20' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => {
                    setSelectedChat(conversation.id);
                    setShowChatList(false);
                  }}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={conversation.avatar} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {conversation.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-sm truncate">{conversation.name}</h3>
                          <span className="text-xs text-muted-foreground">{conversation.time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                          {conversation.unread > 0 && (
                            <Badge className="ml-2 bg-sport-red text-white h-5 w-5 flex items-center justify-center p-0 text-xs">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className={`${showChatList ? 'hidden md:block' : 'block'} flex-1 flex flex-col`}>
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50 bg-card">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setShowChatList(true)}
              >
                ←
              </Button>
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {currentChat.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{currentChat.name}</h3>
                {currentChat.isGroup && (
                  <p className="text-xs text-muted-foreground">{currentChat.participants} participants</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentChat.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isOwn
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {!message.isOwn && currentChat.isGroup && (
                    <p className="text-xs font-semibold mb-1 text-primary">{message.sender}</p>
                  )}
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-border/50 bg-card">
            <div className="flex items-center gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button size="icon" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}