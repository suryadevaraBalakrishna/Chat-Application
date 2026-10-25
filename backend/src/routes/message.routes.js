
const express = require('express');
const router = express.Router();

const {
    sendMessage,getMessages
} = require('../controllers/message.controller');

module.exports = (server) => {
    router.post('/send', sendMessage);
    router.get('/conversation/:senderId/:receiverId', getMessages);

    server.use('/api/website/message', router);
};
