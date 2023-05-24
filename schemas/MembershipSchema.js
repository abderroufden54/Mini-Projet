const mongoose = require('mongoose');
const Invitation=require('./InvitationSchema');
const Memberschema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
  // additional fields if needed
}, { timestamps: true });
Memberschema.statics.accept = async (userId, clubId) => {
    var data = {
        userId: mongoose.Types.ObjectId(userId),
        clubId: mongoose.Types.ObjectId(clubId),
    };
    await Invitation.deleteOne(data).catch(error => console.log(error));
    return await Membership.create(data).catch(error => console.log(error));
}
var Membership =  mongoose.model('Membership', Memberschema);
module.exports =Membership;