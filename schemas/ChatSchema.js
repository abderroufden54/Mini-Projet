const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    club:{type: Schema.Types.ObjectId, ref: 'club'},
    latestMessage: { type: Schema.Types.ObjectId, ref: 'Message' }
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);