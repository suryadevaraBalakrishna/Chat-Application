
const { Server } = require('socket.io')
require('dotenv').config()

const allowedOrigins = [
    'http://localhost:5173',
    'https://chat-application-front-end-two.vercel.app',
    process.env.origin?.replace(/\/$/, ''),
].filter(Boolean)

let io

const onlineUsers = new Map()

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: allowedOrigins,
            methods: ['GET', 'POST'],
        },
    })

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id)

        // User joins their personal room
        socket.on('join', (userId) => {
            if (!userId) return

            const id = String(userId)
            socket.data.userId = id

            if (!onlineUsers.has(id)) {
                onlineUsers.set(id, new Set())
            }

            const connections = onlineUsers.get(id)
            const wasOffline = connections.size === 0

            connections.add(socket.id)
            socket.join(id)

            console.log('User joined:', id)

            // Notify clients when a user comes online
            if (wasOffline) {
                io.emit('userStatus', {
                    userId: id,
                    online: true,
                })
            }

            // Send the current online-user list
            socket.emit(
                'onlineUsers',
                Array.from(onlineUsers.keys())
            )
        })

        // Client requests online users
        socket.on('requestOnlineUsers', () => {
            socket.emit(
                'onlineUsers',
                Array.from(onlineUsers.keys())
            )
        })

        // Existing real-time message event
        socket.on('sendMessage', (message) => {
            if (!message?.senderId || !message?.receiverId) return

            const senderId = String(
                typeof message.senderId === 'object'
                    ? message.senderId._id
                    : message.senderId
            )

            const receiverId = String(
                typeof message.receiverId === 'object'
                    ? message.receiverId._id
                    : message.receiverId
            )

            io.to(receiverId).emit('newMessage', message)

            io.to(senderId)
                .except(socket.id)
                .emit('newMessage', message)
        })

        // Handle disconnection
        socket.on('disconnect', () => {
            const userId = socket.data.userId

            if (userId && onlineUsers.has(userId)) {
                const connections = onlineUsers.get(userId)

                connections.delete(socket.id)

                // Mark offline only after the last connection closes
                if (connections.size === 0) {
                    onlineUsers.delete(userId)

                    io.emit('userStatus', {
                        userId,
                        online: false,
                    })
                }
            }

            console.log('User disconnected:', socket.id)
        })
    })

    return io
}

const getIO = () => {
    if (!io) {
        throw new Error('Socket.IO has not been initialized')
    }

    return io
}

module.exports = {
    initializeSocket,
    getIO,
}
