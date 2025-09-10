import { io, Socket } from 'socket.io-client';
import { SocketMessage, TypingUser } from '../types';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(token: string): void {
    if (this.socket?.connected) {
      return;
    }

    const serverUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
    
    this.socket = io(serverUrl, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
    });

    this.setupEventListeners();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Conectado al servidor de chat');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Desconectado del servidor de chat:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Error de conexión:', error);
      this.handleReconnect();
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Reconectado después de', attemptNumber, 'intentos');
      this.reconnectAttempts = 0;
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('Error de reconexión:', error);
      this.handleReconnect();
    });
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      setTimeout(() => {
        if (this.socket && !this.socket.connected) {
          this.socket.connect();
        }
      }, delay);
    }
  }

  // Chat events
  joinChat(username: string, rank: any): void {
    if (this.socket) {
      this.socket.emit('join-chat', { username, rank });
    }
  }

  sendMessage(username: string, rank: any, rankIcon: string, message: string): void {
    if (this.socket) {
      this.socket.emit('send-message', {
        username,
        rank,
        rankIcon,
        message,
      });
    }
  }

  onNewMessage(callback: (message: SocketMessage) => void): void {
    if (this.socket) {
      this.socket.on('new-message', callback);
    }
  }

  offNewMessage(callback: (message: SocketMessage) => void): void {
    if (this.socket) {
      this.socket.off('new-message', callback);
    }
  }

  // Typing events
  sendTyping(username: string, isTyping: boolean): void {
    if (this.socket) {
      this.socket.emit('typing', { username, isTyping });
    }
  }

  onUserTyping(callback: (data: TypingUser) => void): void {
    if (this.socket) {
      this.socket.on('user-typing', callback);
    }
  }

  offUserTyping(callback: (data: TypingUser) => void): void {
    if (this.socket) {
      this.socket.off('user-typing', callback);
    }
  }

  // Connection status
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Get socket instance for custom events
  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();
export default socketService;