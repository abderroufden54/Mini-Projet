const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    date_debut: { type: Date, required: true, trim: true},
    date_fin: { type: Date, required: true, trim: true },
    image:{type:Buffer,required:true},
    club:{ type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Club'},
    venue: { type: String, required: true },
    passed:{type:Boolean,default:false},
    proposed_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    accepted_by: { type: mongoose.Schema.Types.ObjectId,
        ref: 'User'},
    

  
}, { timestamps: true });

var Event = mongoose.model('event', EventSchema);
module.exports = Event;