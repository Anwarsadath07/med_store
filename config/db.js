const mongoose = require('mongoose');

const db = async()=>{
 try {
  await mongoose.connect(process.env.MONGO_URl)
  console.log("connected to mongodb");
  
 } catch (err) {
  console.log(err);
  process.exit(1);
 }
}
db()