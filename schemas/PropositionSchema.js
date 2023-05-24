const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PropSchema = new Schema({
 name: { type: String, required: true, trim: true },
description: { type: String, required: true, trim: true },
created_by: { type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'},
        club_des: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
}, { timestamps: true });

var Prop = mongoose.model('proposition', PropSchema);
module.exports = Prop;