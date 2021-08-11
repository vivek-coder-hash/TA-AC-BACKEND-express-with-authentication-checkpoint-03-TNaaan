var mongooose = require("mongoose");
var Schema = mongooose.Schema;
var bcrypt = require("bcrypt");

var emailVerify = new Schema({
  email: { type: String, required: true },
  otp: { type: String },
  startDate: { type: Number },
  endDate: { type: Number },
});

emailVerify.pre("save", function(next){
    if (this.otp && this.isModified("otp")) {
        bcrypt.hash(String(this.otp), 10, (err, hashed) => {
          if (err) return next(err);
          this.otp = hashed;
          console.log(this.otp);
          return next();
        });
      } else {
        next();
      }
});

emailVerify.methods.verifyOtp = function (otp, cb) {
  bcrypt.compare(otp, String(this.otp), (err, verifyotp) => {
      console.log(otp, this.otp)
    return cb(err, verifyotp);
  });
};

module.exports = mongooose.model("EmailVerify", emailVerify);