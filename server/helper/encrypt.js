var bcrypt   = require('bcrypt-nodejs');
exports.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

exports.validPassword = function(password, cpassword){
  return bcrypt.compareSync(password, cpassword);
};