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
      email        : String,
      name         : String
    },
    google           : {
      id           : String,
      token        : String,
      email        : String,
      name         : String
    },
  },
  rouletteGroups: [
    {
      name: String,
			roulettes: [
				mongoose.Schema.Types.ObjectId
      ]
		}
  ]
});

UserSchema.virtual('auth_type')
  .get(function(){
    if(this.userinfo.local.id){
      return 'local';
    }else if(this.userinfo.facebook.id){
      return 'facebook';
    }else if(this.userinfo.twitter.id){
      return 'twitter';
    }
    return null;
  });

module.exports.User = db.model('User', UserSchema);
