import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://umeko.io.vn';
export const getSocket = (userId: string): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      query: { userId },
      transports: ['websocket'],
      secure: true,
    });
  }
  return socket;
};
