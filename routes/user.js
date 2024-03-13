const express = require("express");
const bcrypt = require("bcryptjs");


const userRouter = express.Router();

const User = require("../models/Schema.js");

userRouter.get('/', (req, res) => {
  res.render('firstpage');
});

userRouter.get('/login', (req, res) => {
  res.render("login", { message: req.flash('message') });
});

userRouter.get('/signup', (req, res) => {
  res.render("signup", { message: req.flash('message') });
});

userRouter.get('/home', (req, res) => {
  res.render('home');
});

userRouter.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ name: username });

    if (existingUser) {
      req.flash('message', 'User already registered');
      return res.redirect('/user/login');
    }

    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      name: username,
      password: hashPassword,
    });

    console.log(newUser);
    req.session.userId = newUser._id
    req.session.username= newUser.name
    req.flash('message', 'User registered successfully');
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    req.flash('message', 'Internal Server Error');
    res.redirect('/signup');
  }
});

userRouter.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ name: username });

    if (!existingUser) {
      req.flash('message', 'User not found');
      return res.redirect('/user/login');
    }

    const isPasswordMatch = await bcrypt.compare(password, existingUser.password);

    if (isPasswordMatch) {
      req.session.userId = existingUser._id
      req.session.username= existingUser.name
      res.redirect("/medicine/dashboard");
    } else {
      req.flash('message', 'Wrong password');
      res.redirect('/user/login');
    }
  } catch (error) {
    console.error(error);
    req.flash('message', 'Internal Server Error');
  }
});

userRouter.get('/logout', (req, res) => {
  req.session.destroy(function () {
    console.log("User Logged Out!!!");
  });
  res.redirect("/user/login");
});



module.exports = userRouter;
