var passport  = require("passport")
var GitHubStrategy = require('passport-github').Strategy;
var User = require("../models/User")


passport.use(new GitHubStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
  },
  (accessToken , refreshToken , profile , done)=> {
      console.log(profile) //This data coming from github server . Either it's going to fail or success.
      var profileData  = {
          name: profile.displayName ,
          username: profile.username ,
          email:profile._json.email ,
          photo:profile._json.avatar_url
      }
      console.log(profileData)

      User.findOne({email : profile._json.email} , (err,user)=> {
          console.log(err,user)
          if(err) return done(err)
          if(!user)  {
              //if this user is login for first time
              User.create(profileData , (err,addedUser)=> {
                  console.log(err,addedUser)
                if(err) return done(err)
                return done(null ,addedUser)
              })
          }

          //else user already loggedin or registered

           done(null,user)  //we have to call done in order to move out of github strategy
      })

     
  }
));

//handle session for passport by serializeUser

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });   