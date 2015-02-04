var socketio = require('socket.io');
var Wheel = require('./common/wheel').Wheel;

//! ラベルの設定はいつかやらなきゃな

var wheels = {};//連想配列のキーを部屋名にして、ホイールのモデルを保存する


function sio(server){
  sio = socketio.listen(server);
  //sio.set('transports', [ 'websocket','polling' ]);// いらないっぽい

  //あるユーザーが、サーバーに対してコネクションを申し込んできた。 
  //ここでは、そのユーザー(socket)とのやりとりを定義するのみ。こう言われたらこう返すと
  //sio.sockets はデフォルトのNamespace /らしい！
  sio.sockets.on('connection', function(socket){
    //socket オブジェクトは、サーバーとそのユーザーとのコネクションを表す。

    //クライアントから、初めの挨拶が送られてきたら
    //はじめの初期化
    socket.on('hello', function(data){
      //クライアントが希望してきた部屋に配属する。
      //以後、socketはこの部屋に限られる。
      console.log("hello, <"+ socket.id.slice(0,4)+">. your room is ["+data.room+"], OK?");


      //joinすることにより、to('room')でこの部屋のを受け取れるようになる
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

      
      //joinすることにより、to('room')でこの部屋のを受け取れるようになる
      //helloでやってるけど一応やっとけ
      socket.join(data.room);

      console.log("");
      console.log("hi, user <"+socket.id.slice(0,4)+"> in room [" + data.room.slice(0,4) + "]. good swipe! (force="+data.swipeData.f.toFixed(3)+")");

      var room_members = sio.sockets.adapter.rooms[data.room];

      //部屋が存在しなければundefined
      if(room_members){
        console.log("your room mate [" + data.room + "] is");
        var i = 0;
        for(socketid in sio.sockets.connected){
          if(room_members[socketid]){

            console.log("\t" + i++ + ": <" + socketid.slice(0,4)+">");
          }

        }
      }


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
      socket.broadcast.to(data.room).emit('globalmove', { 
        f : force,
        r : wheel.getAngle().get(),
        v : wheel.getVelocity(),
        swipeData:data.swipeData
      });
    });

    // 切断
    socket.on('disconnect', function(){
      console.log("bye bye, <"+socket.id.slice(0,4)+">");

    });

  });
}



module.exports = sio;

