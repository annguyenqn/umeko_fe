import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (userId: string): Socket => {
  if (!socket) {
    socket = io('http://14.225.217.126:8084', {
      query: { userId },
      transports: ['websocket'],
    });
  }
  return socket;
};
