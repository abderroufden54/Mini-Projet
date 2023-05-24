const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PublicationSchema = new Schema({
    article: { type: String, trim: true },
    image:{type:String},
    club_des: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Club'
    },
    submit_by: { type: mongoose.Schema.Types.ObjectId,
        ref: 'User',required:true},
    liked_by:[{ type: mongoose.Schema.Types.ObjectId,
        ref: 'User'}]
}, { timestamps: true });

var Publication = mongoose.model('publication', PublicationSchema);
module.exports = Publication;