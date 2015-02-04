var socketio = require('socket.io');
var Wheel = require('./common/wheel').Wheel;

var wheel = new Wheel(0,0,["aiueo", "kaki", "kukeko", ]);
//! ラベルの設定はいつかやらなきゃな

var wheels = {};//連想配列のキーを部屋名にして、ホイールのモデルを保存する


function sio(server){
  sio = socketio.listen(server);
  //sio.set('transports', [ 'websocket','polling' ]);// いらないっぽい

  //あるユーザーが、サーバーに対してコネクションを申し込んできた。 
  //ここでは、そのユーザー(socket)とのやりとりを定義するのみ。こう言われたらこう返すと
  sio.sockets.on('connection', function(socket){
    //socket オブジェクトは、サーバーとそのユーザーとのコネクションを表す。

    //クライアントから、初めの挨拶が送られてきたら
    //はじめの初期化
    socket.on('hello', function(data){
      //クライアントが希望してきた部屋に配属する。
      //以後、socketはこの部屋に限られる。
      console.log("hello, "+ socket.id.slice(0,4)+". your room is "+data.room+", OK?");
      socket.join(data.room);
      var wheel = wheels[ data.room+''] = 
        wheels[ data.room+''] || new Wheel(0, 0,["", "", ""]);

      //
      socket.emit('mymove', { 
        f : 0, 
        v : wheel.getVelocity(),
        r : wheel.getAngle().get(), 
      });
    });

    // スワイプを受信
    socket.on('swipe', function(data){
      console.log("hi, <"+socket.id.slice(0,4)+">. good swipe! (force="+data.swipeData.f.toFixed(4)+") in room "+data.room);
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

