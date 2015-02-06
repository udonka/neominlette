var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt-nodejs');
var url = 'mongodb://localhost/minlette';
var db = mongoose.createConnection(url, function(err, res){
  if(err){
    console.log('Error connected: ' + url + ' - ' + err);
  }else{
    console.log('Success connected: ' + url);
  }
});

var UserSchema = new mongoose.Schema({
  userinfo: {
    auth_type: String,
    local: {
      id           : String,
      email        : String,
      password     : String,
      name         : String
    },
    facebook         : {
      id           : String,
      token        : String,
      email        : String,
      name         : String
    },
    twitter          : {
      id           : String,
      token        : String,
      displayName  : String,
      username     : String
    },
    google           : {
      id           : String,
      token        : String,
      email        : String,
      name         : String
    },
  },
  rouletteGroup: [{ name: String, rouletteId: mongoose.Schema.Types.ObjectId}]
});

module.exports.User = db.model('User', UserSchema);
