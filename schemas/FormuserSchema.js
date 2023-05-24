const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const FormUserSchema = new Schema({
    questions_radio:[{question:String,resp_don:[{type:String}],is_other:Boolean,resp_given:String}],
    questions_text:[{question:String,type_don:{type:String},resp_given:String}],
    questions_check:[{question:String,resp_don:[{type:String}],resp_given:[String]}],
    user:{required:true,type:mongoose.Types.ObjectId,ref: 'User'},
    club:{required:true,type:mongoose.Types.ObjectId,ref: 'club'}
    
}, { timestamps: true });
FormUserSchema.index({'user': 1, 'club': 1}, {unique: true});


var FormUser = mongoose.model('formuser', FormUserSchema);
module.exports = FormUser;