const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],

    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
    }],




}, { timestamps: true });

const conversationModal = mongoose.model('Conversation', conversationSchema);

module.exports = conversationModal;


