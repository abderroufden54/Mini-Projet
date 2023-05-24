const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    name: { type: String, required: true, trim: true },
    deadline: { type: Date, required: true, trim: true },
    details:{type:String,required:false},
    status:{type:String,enum:['completed','pending','incomplete'],default:"pending"},
    assigned_from: { type: mongoose.Schema.Types.ObjectId,ref: 'User',required:true},
    assigned_to: { type: mongoose.Schema.Types.ObjectId,ref: 'User',required:true },
    club:{type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Club'},
    
    

  
}, { timestamps: true });

var Task = mongoose.model('task', taskSchema);
module.exports = Task;