
const { Server } = require('socket.io');

const allowedOrigins = [
    'http://localhost:5173',
    'https://chat-application-front-end-two.vercel.app',
    process.env.origin?.replace(/\/$/, ''),
].filter(Boolean);

let io;

// Map: userId -> Set of socket IDs
const onlineUsers = new Map();

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: allowedOrigins,
            methods: ['GET', 'POST'],
        },
        transports: ['websocket', 'polling'],
    });

    // Log Socket.IO connection errors
    io.engine.on('connection_error', (err) => {
        console.error('Socket connection error:', {
            code: err.code,
            message: err.message,
            context: err.context,
        });
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // User joins their personal room
        socket.on('join', (userId) => {
            if (!userId) {
                console.log('Join event received without userId');
                return;
            }

            const id = String(userId);
            socket.data.userId = id;

            if (!onlineUsers.has(id)) {
                onlineUsers.set(id, new Set());
            }

            const connections = onlineUsers.get(id);
            const wasOffline = connections.size === 0;

            connections.add(socket.id);
            socket.join(id);

            console.log('User joined:', id);

            // Notify clients when a user comes online
            if (wasOffline) {
                io.emit('userStatus', {
                    userId: id,
                    online: true,
                });
            }

            // Send online users to this socket
            socket.emit(
                'onlineUsers',
                Array.from(onlineUsers.keys())
            );
        });

        // Client requests online users
        socket.on('requestOnlineUsers', () => {
            socket.emit(
                'onlineUsers',
                Array.from(onlineUsers.keys())
            );
        });

        // Send a real-time message to sender and receiver
        socket.on('sendMessage', (message) => {
            if (!message?.senderId || !message?.receiverId) {
                console.log('Invalid sendMessage payload');
                return;
            }

            const senderId = String(
                typeof message.senderId === 'object'
                    ? message.senderId._id
                    : message.senderId
            );

            const receiverId = String(
                typeof message.receiverId === 'object'
                    ? message.receiverId._id
                    : message.receiverId
            );

            // Deliver to receiver's personal room
            io.to(receiverId).emit('newMessage', message);

            // Deliver to sender's other sessions, excluding this socket
            io.to(senderId)
                .except(socket.id)
                .emit('newMessage', message);

            console.log('Real-time message event:', {
                senderId,
                receiverId,
            });
        });

        // Handle disconnect
        socket.on('disconnect', (reason) => {
            const userId = socket.data.userId;

            if (userId && onlineUsers.has(userId)) {
                const connections = onlineUsers.get(userId);

                connections.delete(socket.id);

                // Mark offline only when the last connection closes
                if (connections.size === 0) {
                    onlineUsers.delete(userId);

                    io.emit('userStatus', {
                        userId,
                        online: false,
                    });
                }
            }

            console.log('User disconnected:', socket.id, reason);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.IO has not been initialized');
    }

    return io;
};

module.exports = {
    initializeSocket,
    getIO,
};
