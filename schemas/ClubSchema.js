const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const categories=['IT','EA','CIVIL','BIO'];
const file_choices=['PDF','IMAGE'];
const ClubSchema = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    slogan: { type: String, required: false, trim: true },
    logo: { type: String, required: false },
    category: { type: String, required: false,enum:categories },
    created_by: { type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'},
    form_submite:[{question:String,response:[{type:String}],is_other:{type:Boolean,default:false},is_required:{type:Boolean,default:true}}],
    text_submite:[{question:String,typetext:{type:String,enum:['LONG','SHORT']},is_required:{type:Boolean,default:true}}],
    check_submite:[{question:String,response:[{type:String}],is_required:{type:Boolean,default:true}}],
    facebook_url: { type: String, required: false },
    twitter_url: { type: String, required: false },
    instagram_url: { type: String, required: false },
    linkedin_url: { type: String, required: false },
    admins:[{type:mongoose.Types.ObjectId,ref:"User"}]
}, { timestamps: true });
ClubSchema.set('toObject', { virtuals: true });
ClubSchema.set('toJSON', { virtuals: true });
ClubSchema.virtual("members", {
    ref : "Membership", 
    foreignField: "clubId", 
    localField : "_id"
   });
   ClubSchema.virtual("publications", {
    ref : "publication", 
    foreignField: "club_des", 
    localField : "_id"
   });
   ClubSchema.virtual("inviters", {
    ref : "Invitation", 
    foreignField: "clubId", 
    localField : "_id"
   });
var Club = mongoose.model('club', ClubSchema);
module.exports = Club;