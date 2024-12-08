import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NODE_ENV === 'production'
  ? import.meta.env?.VITE_SOCKET_URL
  : 'http://localhost:5001';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    if (!SOCKET_URL) {
      console.error('Socket URL is not defined');
      return;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });
  }

  joinChat(chatId: string) {
    if (this.socket?.connected) {
      this.socket.emit('join chat', chatId);
    }
  }

  sendMessage(message: any) {
    if (this.socket?.connected) {
      this.socket.emit('new message', message);
    }
  }

  onMessageReceived(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.on('message received', callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
export default socketService;