
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const http = require('http')
require('dotenv').config()

const { initializeSocket } = require('./src/socket/socket')

const app = express()
const server = http.createServer(app)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT || 8000

app.get('/', (request, response) => {
    response.send('Server is running')
})

// Initialize Socket.IO
initializeSocket(server)

// Routes
require('./src/routes/user.routes')(app)
require('./src/routes/message.routes')(app)

// Image folder
app.use('/uploads/user', express.static('uploads/user'))

// MongoDB connection
mongoose.connect(process.env.DB)
    .then(() => {
        console.log('Database connected')
    })
    .catch((error) => {
        console.error('Database connection error:', error)
    })

// Start HTTP server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
