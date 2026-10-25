
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_BASE_URL, {
    autoConnect: false,
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

export default socket;
