const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');

require('dotenv').config()
require("./config/db.js")

const app = express();


const medicineRouter = require('./routes/medicine.js')
const userRouter = require('./routes/user.js');
const isLogin = require('./middlewares/isLogin.js');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

app.use(flash());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect('/user')
})

app.use('/user',userRouter)
app.use('/medicine', isLogin, medicineRouter)



const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
