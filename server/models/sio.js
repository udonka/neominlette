var socketio = require('socket.io');
var Wheel = require('./common/wheel').Wheel;

var wheel = new Wheel(0,0,["aiueo", "kaki", "kukeko", ]);
//! ラベルの設定はいつかやらなきゃな
var wheels = {};


function sio(server){
  sio = socketio.listen(server);
  sio.set('transports', [ 'websocket','polling' ]);// いらないっぽい

  // 接続
  sio.sockets.on('connection', function(socket){

    //はじめの初期化
    socket.on('hello', function(data){
      console.log(data);
      socket.join(data.room);
      var wheel = wheels[ data.room+''] = 
        wheels[ data.room+''] || new Wheel(0, 0,["", "", ""]);

      socket.emit('mymove', { 
        f : 0, 
        v : wheel.getVelocity(),
        r : wheel.getAngle().get(), 
      });
    });

    // スワイプを受信
    socket.on('swipe', function(data){
      //モデルを取得
      var wheel = wheels[data.room+''] = 
        wheels[data.room+''] || new Wheel(0, 0,["", "", ""]); 

      //送られてきた力
      var force = data.swipeData.f;

      //モデルに対して力を行使
      wheel.addForce(force);

      //送ってきたやつに返す
      socket.emit('mymove', { 
        f : force,
        r : wheel.getAngle().get(),
        v : wheel.getVelocity() ,
        swipeData:data.swipeData //知ってるわって感じだけど。いらないかしら。
      });

      //他の奴らに返す
      socket.join(data.room);
      socket.broadcast.to(data.room).emit('globalmove', { 
        f : force,
        r : wheel.getAngle().get(),
        v : wheel.getVelocity(),
        swipeData:data.swipeData
      });
    });

    // 切断
    socket.on('disconnect', function(){});

  });
}


module.exports = sio;

