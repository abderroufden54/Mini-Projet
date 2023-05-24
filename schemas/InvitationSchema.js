const mongoose = require('mongoose');

const InvitationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
  // additional fields if needed
}, { timestamps: true });
var Invitation=mongoose.model('Invitation', InvitationSchema)

module.exports = Invitation;