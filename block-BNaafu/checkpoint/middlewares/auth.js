var User = require("../models/User")

module.exports=  {
    loggedInUser : (req,res,next) => {
        if(req.session && req.session.userId){
            next()
        }

        else {
            res.redirect("/users/login")
        }

    } ,

    userInfo: (req,res,next)=> {
        var userId = req.session && req.session.userId
        if(userId)  {
          User.findById(userId , "name email" ,(err ,user)=> {
              if(err) return next()
              req.user = user // pass user information in key of req which is user.
              res.locals.user =user // in locals passing user in each and every templates .ejs
              //Therefore,we can access this user in header.ejs
              next()

          })
        }

        else {
            req.user = null 
            res.locals.user = null
            next()  //we are calling next in both conditions because we want to request to move always , not to stand at one place.
        }
    }
}