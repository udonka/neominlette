var mongoose = require('mongoose');
var url = 'mongodb://localhost/minlette';
var db = mongoose.createConnection(url, function(err, res){
  if(err){
    console.log('Error connected: ' + url + ' - ' + err);
  }else{
    console.log('Success connected: ' + url);
  }
});

var RouletteSchema = new mongoose.Schema({
  name: {type: String, unique: true},
  author: {type: String, unique: false},
  tags: [String]
});

module.exports.Roulette = db.model('Roulette', RouletteSchema);
