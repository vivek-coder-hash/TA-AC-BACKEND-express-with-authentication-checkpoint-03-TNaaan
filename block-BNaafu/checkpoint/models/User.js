/*Each user will have

Name
Email
Password
Age
Phone
Country */

var mongoose = require("mongoose")
var bcrypt = require("bcrypt")
var Schema = mongoose.Schema

var userSchema = new Schema({
    name:{type:String , required:true} , 
    email: {type:String , required:true , unique:true} ,
    password:{type:String , minlength:5} ,
    age:{type:Number},
    phone:{type:String , maxlength:12 , minlength:10} ,
    country:{type:String}

}, {timestamps:true})


//Custom pre saved hook defined before creating model
userSchema.pre("save" , function(next) {
    console.log(this , "inside pre saved hook before hashed") // this reffer to document to be saved in database
   if(this.password && this.isModified("password")) {
      bcrypt.hash(this.password ,10 ,(err , hashed)=> {
          if(err) return next(err)
          this.password =hashed
          next()
      } )
   }


    else{next()} // calling next will make document to saved in database

})  //saltround is integer from 8 to 32

userSchema.methods.verifyPassword = function(password,cb)  {
    bcrypt.compare(password , this.password , (err ,result)=> {
        return cb(err,result)
    })
}


var User = mongoose.model("User" , userSchema)

module.exports = User