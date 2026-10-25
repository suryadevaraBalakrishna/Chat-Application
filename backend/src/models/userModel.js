const mongoose=require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
      
    },

    username: {
        type: String,
        required: true,
        unique: true,
    },

    image: {
        type: String,
        default: ''
    },

    password: {
        type: String,
        required: true
    },

    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    }

}, { timestamps: true });

const userModal = mongoose.model('User', userSchema);

module.exports = userModal;


