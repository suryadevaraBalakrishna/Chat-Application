
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const path = require('path');
require('dotenv').config();

const { initializeSocket } = require('./src/socket/socket');

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
    'http://localhost:5173',
    'https://chat-application-front-end-two.vercel.app',
    process.env.origin?.replace(/\/$/, ''),
].filter(Boolean);

// Express CORS
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (request, response) => {
    response.send('Server is running');
});

// Initialize Socket.IO on the same HTTP server
initializeSocket(server);

// Register routes
require('./src/routes/user.routes')(app);
require('./src/routes/message.routes')(app);

// Serve uploaded user images
app.use(
    '/uploads/user',
    express.static(path.join(__dirname, 'uploads/user'))
);

// Connect MongoDB
mongoose.connect(process.env.DB)
    .then(() => {
        console.log('Database connected');
    })
    .catch((error) => {
        console.error('Database connection error:', error);
    });

// Start server
const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
