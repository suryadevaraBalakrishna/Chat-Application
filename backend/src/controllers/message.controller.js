
const messageModel = require('../models/messageModel');
const conversationModel = require('../models/conversationModel');
const userModel = require('../models/userModel');
const { getIO } = require('../socket/socket');

exports.sendMessage = async (request, response) => {
    try {
        const { senderId, receiverId, message } = request.body;

        if (!senderId || !receiverId || !message?.trim()) {
            return response.status(400).send({
                status: false,
                message: 'senderId, receiverId and message are required'
            });
        }

        // Check whether both users exist
        const sender = await userModel.findById(senderId);
        const receiver = await userModel.findById(receiverId);

        if (!sender || !receiver) {
            return response.status(404).send({
                status: false,
                message: 'Sender or receiver not found'
            });
        }

        // Save message in MongoDB
        const newMessage = await messageModel.create({
            senderId,
            receiverId,
            message: message.trim()
        });

        // Update conversation
        let conversation = await conversationModel.findOne({
            participants: {
                $all: [senderId, receiverId],
                $size: 2
            }
        });

        if (!conversation) {
            await conversationModel.create({
                participants: [senderId, receiverId],
                messages: [newMessage._id]
            });
        } else {
            conversation.messages.push(newMessage._id);
            await conversation.save();
        }

        // Emit the saved message to both users' rooms
        const io = getIO();

        io.to(String(receiverId)).emit('newMessage', newMessage);
        io.to(String(senderId)).emit('newMessage', newMessage);

        console.log('Message emitted:', {
    messageId: newMessage._id,
    senderId,
    receiverId
});


        return response.status(201).send({
            status: true,
            message: 'Message sent successfully',
            data: newMessage
        });

    } catch (error) {
        console.error('Send message error:', error);

        return response.status(500).send({
            status: false,
            message: error.message
        });
    }
};


exports.getMessages = async (request, response) => {
    try {
        const { senderId, receiverId } = request.params;

        const messages = await messageModel.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ createdAt: 1 });

        return response.status(200).send({
            status: true,
            message: 'Messages fetched successfully',
            data: messages
        });

    } catch (error) {
        return response.status(500).send({
            status: false,
            message: error.message
        });
    }
};
