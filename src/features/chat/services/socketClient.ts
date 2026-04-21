import { io, Socket } from 'socket.io-client';
let socket: Socket | null = null;
let currentToken: string | null = null;
export const initializeSocket = (token: string): Socket => {
  if (socket && currentToken === token && socket.connected) {
    return socket;
  }
  if (socket) {
    socket.disconnect();
  }
  currentToken = token;
  const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL || '';
  const socketUrl = apiBaseUrl.replace(/\/api\/?$/, '');
  socket = io(socketUrl, {
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });
  return socket;
};
export const getSocket = (): Socket | null => socket;
export const registerOnce = (event: string, handler: (...args: any[]) => void) => {
  if (!socket) return;
  socket.off(event); 
  socket.on(event, handler);
};
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
    currentToken = null;
  }
};
