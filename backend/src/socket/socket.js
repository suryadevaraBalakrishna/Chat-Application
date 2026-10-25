
const { Server } = require('socket.io')
require('dotenv').config()

const origin_url=process.env.origin;

let io

const onlineUsers = new Map()

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: origin_url,
            methods: ['GET', 'POST']
        }
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

            // Notify everyone when this user becomes online
            if (wasOffline) {
                io.emit('userStatus', {
                    userId: id,
                    online: true
                })
            }

            // Send current online users to this client
            socket.emit('onlineUsers', Array.from(onlineUsers.keys()))
        })

        // Client can request the current online-user list
        socket.on('requestOnlineUsers', () => {
            socket.emit('onlineUsers', Array.from(onlineUsers.keys()))
        })

        // Keep your existing message event
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
            io.to(senderId).except(socket.id).emit('newMessage', message)
        })

        socket.on('disconnect', () => {
            const userId = socket.data.userId

            if (userId && onlineUsers.has(userId)) {
                const connections = onlineUsers.get(userId)

                connections.delete(socket.id)

                // Only mark offline after their last connection closes
                if (connections.size === 0) {
                    onlineUsers.delete(userId)

                    io.emit('userStatus', {
                        userId,
                        online: false
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
    getIO
}
