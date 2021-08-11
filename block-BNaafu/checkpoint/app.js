var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose")
var session = require("express-session")
var MongoStore = require("connect-mongo")
var flash = require("connect-flash")

require("dotenv").config()

//connect to database
mongoose.connect("mongodb://localhost/checkpoint" , {useNewUrlParser:true , useUnifiedTopology:true} , (err)=> {
  console.log(err ? err : "connected to database")
})


//require passport
require("./modules/passport")  // with this line , app.js know that there is strategy defined in modules/passport
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var auth = require("./middlewares/auth") //required auth from middleware folder
var verifyemailRouter = require('./routes/verifyEmail');

const passport = require('passport');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//session add or session middleware
app.use(session({
  secret: process.env.SECRET , 
  resave:false ,
  saveUninitialized:false ,
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost/checkpoint',
    autoRemove: 'native' // Default
  })
}))

//passport-initialize middleware
app.use(passport.initialize()) //passport uses session by default . If you use passport for authorization, it grab user information and put in session .
app.use(passport.session()) // This middleware is important for retreiving already logged in user information session

//conncet-flash middleware
app.use(flash())


//placing userInfo middleware
app.use(auth.userInfo)  // Any router request to  /  , /users , /articles first have to go through  auth.userInfor 

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/verifyEmail', verifyemailRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
