import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Send as SendIcon,
  EmojiEmotions as EmojiIcon,
  AttachFile as AttachIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { socketService } from '../services/socket';
import { chatAPI, userAPI } from '../services/api';
import { Message, OnlineUser, SocketMessage, TypingUser } from '../types';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const { currentUser } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (currentUser) {
      initializeChat();
    }
    return () => {
      socketService.disconnect();
    };
  }, [currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    try {
      setIsLoading(true);
      
      // Connect to socket
      const token = localStorage.getItem('token');
      if (token) {
        socketService.connect(token);
        
        // Join chat
        socketService.joinChat(currentUser!.username, currentUser!.rank);
        
        // Set up socket listeners
        socketService.onNewMessage(handleNewMessage);
        socketService.onUserTyping(handleUserTyping);
      }

      // Load messages
      const messagesResponse = await chatAPI.getMessages();
      setMessages(messagesResponse.messages);

      // Load online users
      const onlineUsersResponse = await userAPI.getOnlineUsers();
      setOnlineUsers(onlineUsersResponse.onlineUsers);

    } catch (err: any) {
      setError(err.message || 'Error al cargar el chat');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewMessage = (socketMessage: SocketMessage) => {
    const newMessage: Message = {
      id: socketMessage.id.toString(),
      user: {
        id: '',
        username: socketMessage.username,
        firstName: '',
        lastName: '',
        fullName: socketMessage.username,
        profilePicture: '',
      },
      rank: socketMessage.rank,
      rankName: socketMessage.rank.name,
      rankIcon: socketMessage.rankIcon,
      content: socketMessage.message,
      type: 'text',
      attachments: [],
      isEdited: false,
      reactions: [],
      createdAt: socketMessage.timestamp.toISOString(),
      formattedTime: socketMessage.timestamp.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      formattedDate: socketMessage.timestamp.toLocaleDateString('es-ES'),
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const handleUserTyping = (data: TypingUser) => {
    if (data.isTyping) {
      setTypingUsers(prev => [...prev.filter(user => user !== data.username), data.username]);
    } else {
      setTypingUsers(prev => prev.filter(user => user !== data.username));
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;

    try {
      // Send via socket for real-time
      socketService.sendMessage(
        currentUser.username,
        currentUser.rank,
        currentUser.rank.icon,
        newMessage.trim()
      );

      // Also save to database
      await chatAPI.sendMessage(newMessage.trim());

      setNewMessage('');
      setIsTyping(false);
      socketService.sendTyping(currentUser.username, false);

    } catch (err: any) {
      setError(err.message || 'Error al enviar mensaje');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (!isTyping && currentUser) {
      setIsTyping(true);
      socketService.sendTyping(currentUser.username, true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      if (currentUser) {
        setIsTyping(false);
        socketService.sendTyping(currentUser.username, false);
      }
    }, 1000);
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else {
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', pt: 7, pb: 7 }}>
      {/* Chat Messages */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 0,
            borderBottom: '1px solid #e0e0e0',
          }}
        >
          <Typography variant="h6" component="h1">
            Chat General - Las Empoderás
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {onlineUsers.length} usuarios en línea
          </Typography>
        </Paper>

        {/* Messages */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            p: 2,
            backgroundColor: '#fafafa',
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {messages.map((message) => (
            <Box key={message.id} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: '0.875rem',
                    bgcolor: 'primary.main',
                  }}
                >
                  {message.user.fullName.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {message.user.fullName}
                    </Typography>
                    <Chip
                      label={message.rankName}
                      size="small"
                      icon={<span>{message.rankIcon}</span>}
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        '& .MuiChip-icon': {
                          fontSize: '0.8rem',
                        },
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatMessageTime(message.createdAt)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                    {message.content}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}

          {/* Typing indicator */}
          {typingUsers.length > 0 && (
            <Box sx={{ mb: 2, ml: 5 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                {typingUsers.join(', ')} está{typingUsers.length > 1 ? 'n' : ''} escribiendo...
              </Typography>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Message Input */}
        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 0,
            borderTop: '1px solid #e0e0e0',
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
            <IconButton size="small">
              <AttachIcon />
            </IconButton>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Escribe tu mensaje..."
              value={newMessage}
              onChange={handleTyping}
              onKeyPress={handleKeyPress}
              disabled={!currentUser}
              variant="outlined"
              size="small"
            />
            <IconButton size="small">
              <EmojiIcon />
            </IconButton>
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || !currentUser}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Box>

      {/* Online Users Sidebar */}
      <Paper
        elevation={1}
        sx={{
          width: 250,
          borderRadius: 0,
          borderLeft: '1px solid #e0e0e0',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="subtitle1" fontWeight="bold">
            En Línea ({onlineUsers.length})
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <List dense>
            {onlineUsers.map((user) => (
              <ListItem key={user.id} sx={{ py: 0.5 }}>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      fontSize: '0.75rem',
                      bgcolor: 'primary.main',
                    }}
                  >
                    {user.fullName.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2" noWrap>
                        {user.fullName}
                      </Typography>
                      <Chip
                        label={user.rank.displayName}
                        size="small"
                        icon={<span>{user.rank.icon}</span>}
                        sx={{
                          height: 16,
                          fontSize: '0.6rem',
                          '& .MuiChip-icon': {
                            fontSize: '0.7rem',
                          },
                        }}
                      />
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatPage;