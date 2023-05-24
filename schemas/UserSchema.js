const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true, unique: true },
    birthday:{type:Date,required:false},
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    salt:{type:String,required:true},
    mobile: { type: Number, required: false },
    facebook_url: { type: String, required: false },
    twitter_url: { type: String, required: false },
    token:{type:String,required:false},
    is_activated:{type:Boolean,default:false},
    instagram_url: { type: String, required: false },
    linkedin_url: { type: String, required: false },
    address: { type: String, required: false },
    statut:{type: String, required: true,enum:['enseignant','etudiant','idara']},
    Role:{ type: String, required: true,enum: ['admin', 'simple']},
    profilePic: { type: String,required:false },
    coverPhoto: { type: String,required:false },

  
}, { timestamps: true });

var User = mongoose.model('user', UserSchema);
module.exports = User;