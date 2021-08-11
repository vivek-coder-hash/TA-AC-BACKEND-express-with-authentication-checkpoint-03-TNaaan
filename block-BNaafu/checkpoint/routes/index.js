var express = require('express');
var router = express.Router();
var auth = require("../middlewares/auth")
var passport = require("passport")

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user) //to check whether user logged in or not
  res.render('index', { title: 'Express' });  // we must be able to use name and email of user in index.ejs from line 18 in auth.js
});

/*make route only accessible to logged in use*/
/*Authorization*/

router.get("/protected" , auth.loggedInUser , (req,res)=> {
 //console.log(req.session)   //userId available inside req.session
   res.send("protected routes")
})   //every protected request has to pass from auth.loggedInUser first . next() will pass execution from auth.loggedInUser to req,res . 


/*Github */

/*router.get("/success" , (req,res)=> {
  res.render("success.ejs")
})

router.get("/fail" , (req,res)=> {
  res.render("fail.ejs")
})*/

router.get('/auth/github',
  passport.authenticate('github')); //from this route we'll make request to github server  // when we hit login with github , request will come to this line and it will look for strategy in /modules/passport.js


router.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect:'/users/login' ,  session:false}),  // session:false will do =>  passport will not look for session now 
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });  // In this route github will return us fail or success


module.exports = router;
