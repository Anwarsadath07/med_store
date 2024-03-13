let mongoose = require('mongoose');


let articleSchema = mongoose.Schema({
    name:{
      type:String,
      required:true
    },
    password:{
      type:String,
      required:true
    }
    
});

module.exports = mongoose.model('users', articleSchema);