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
  name: {type: String, unique: true},
  local: {
    email: String,
    password: String
  },
  rouletteGroup: [{ name: String, rouletteId: mongoose.Schema.Types.ObjectId}]
});

module.exports.User = db.model('User', UserSchema);
