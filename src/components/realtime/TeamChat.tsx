import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Smile, Paperclip, MoreVertical, Hash, AtSign, MessageCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/appStore';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'file' | 'system';
  edited?: boolean;
}

interface TeamChatProps {
  className?: string;
}

export const TeamChat = ({ className }: TeamChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: '1',
      userName: 'Sarah Chen',
      message:
        'Hey team! Just finished the homepage mockups. Take a look when you have a chance! 🎨',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: 'text',
    },
    {
      id: '2',
      userId: '2',
      userName: 'Alex Rodriguez',
      message: 'Looks amazing! The color scheme really works well with our brand.',
      timestamp: new Date(Date.now() - 3 * 60 * 1000),
      type: 'text',
    },
    {
      id: '3',
      userId: 'system',
      userName: 'System',
      message: 'Emily Johnson joined the conversation',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      type: 'system',
    },
    {
      id: '4',
      userId: '3',
      userName: 'Emily Johnson',
      message: 'Thanks for adding me! Excited to collaborate on this project.',
      timestamp: new Date(Date.now() - 1 * 60 * 1000),
      type: 'text',
    },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers] = useState([
    { id: '1', name: 'Sarah Chen', avatar: '', status: 'online' },
    { id: '2', name: 'Alex Rodriguez', avatar: '', status: 'online' },
    { id: '3', name: 'Emily Johnson', avatar: '', status: 'away' },
  ]);

  const user = useAuthStore(state => state.user);
  const { teamMembers } = useAppStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: user?.id || 'current-user',
      userName: user?.name || 'You',
      userAvatar: user?.avatar,
      message: newMessage.trim(),
      timestamp: new Date(),
      type: 'text',
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    inputRef.current?.focus();

    // Simulate typing indicator from others
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <Card className={`flex h-[600px] flex-col ${className}`}>
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <CardTitle className="text-lg">Team Chat</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {onlineUsers.filter(u => u.status === 'online').length} online
            </Badge>
          </div>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Real-time team communication</CardDescription>

        {/* Online Users */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Online:</span>
          <div className="flex -space-x-2">
            {onlineUsers.slice(0, 5).map(user => (
              <div key={user.id} className="relative">
                <Avatar className="h-6 w-6 border-2 border-background">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-xs">{getUserInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div
                  className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-background ${getStatusColor(user.status)}`}
                />
              </div>
            ))}
            {onlineUsers.length > 5 && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted">
                <span className="text-xs">+{onlineUsers.length - 5}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-col p-0">
        {/* Messages Area */}
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 py-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'system' ? 'justify-center' : ''}`}
              >
                {message.type === 'system' ? (
                  <div className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                    {message.message}
                  </div>
                ) : (
                  <>
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={message.userAvatar} />
                      <AvatarFallback className="text-xs">
                        {getUserInitials(message.userName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-baseline gap-2">
                        <span className="text-sm font-medium">{message.userName}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(message.timestamp)}
                        </span>
                        {message.edited && (
                          <Badge variant="outline" className="px-1 py-0 text-xs">
                            edited
                          </Badge>
                        )}
                      </div>
                      <div className="break-words text-sm">{message.message}</div>
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {getUserInitials('Team Member')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <span>Someone is typing</span>
                  <div className="flex gap-1">
                    <div className="h-1 w-1 animate-bounce rounded-full bg-current" />
                    <div className="h-1 w-1 animate-bounce rounded-full bg-current delay-100" />
                    <div className="h-1 w-1 animate-bounce rounded-full bg-current delay-200" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex items-end gap-2">
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message... (@ to mention, # for channels)"
                className="resize-none pr-20"
                maxLength={1000}
              />
              <div className="absolute right-2 top-1/2 flex -translate-y-1/2 gap-1">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Paperclip className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              size="sm"
              className="flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Hash className="h-3 w-3" />
                #general
              </span>
              <span className="flex items-center gap-1">
                <AtSign className="h-3 w-3" />
                Mentions
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{newMessage.length}/1000</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
