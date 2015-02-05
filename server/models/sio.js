var socketio = require('socket.io');
var Wheel = require('./common/wheel').Wheel;

//! ラベルの設定はいつかやらなきゃな

var wheels = {};//連想配列のキーを部屋名にして、ホイールのモデルを保存する


function sio(server){
  sio = socketio.listen(server);

  //あるユーザーが、サーバーに対してコネクションを申し込んできた。 
  //ここでは、そのユーザー(socket)とのやりとりを定義するのみ。こう言われたらこう返すと
  //sio.sockets はデフォルトのNamespace /らしい！
  sio.sockets.on('connection', function(socket){
    //socket オブジェクトは、サーバーとそのユーザーとのコネクションを表す。

    
    var getRoomMembers = function(room){
      var room_members = sio.sockets.adapter.rooms[room];

      var members_array = []
      //部屋が存在しなければundefined
      if(room_members){
        for(socketid in room_members){
          members_array.push(sio.sockets.connected[socketid])
        }
      }

      return members_array;
    }

    //部屋のメンバーを見せる
    var showRoomMembers = function(room){
      console.log("your room mates [" + room + "] are");
      var members = getRoomMembers(room);

      if(members){
        for(i in members){
            console.log("\t" + i + ": <" + members[i].id.slice(0,4)+">");
        }
      }
      else{
        console.log("no members in room [" +room+ "]");
      }
    }

    //member に変化がおこったときにルームメンバーに送る
    socket.emitRoomMembers = function(room){
      
      console.log(room);
      var members = getRoomMembers(room);
      var members_array = [];
      for(i in members){
        members_array.push(members[i].id );
      }

      //socket.broadcast.to(room).emit('members', {members: members_array});
      sio.in(room).emit('members', {members: members_array});
    }

    //クライアントから、初めの挨拶が送られてきたら
    //はじめの初期化
    //全然最初に呼ばれるとは限らないクライアントは自信がなくなったらhelloするべき
    socket.on('hello', function(data){
      //クライアントが希望してきた部屋に配属する。
      //以後、socketはこの部屋に限られる。
      console.log("hello, <"+ socket.id.slice(0,4)+">. your room is ["+data.room+"], OK?");


      console.log(wheels);
      //joinすることにより、to('room')でこの部屋のを受け取れるようになる
      socket.join(data.room);
      var wheel = wheels[ data.room+''] = 
        wheels[ data.room+''] || new Wheel(0, 0,["", "", ""]);

      showRoomMembers(data.room);

      //現在の状態を渡す
      socket.emit('mymove', { 
        f : 0, 
        v : wheel.getVelocity(),
        r : wheel.getAngle().get(), 
      });

      socket.emitRoomMembers(data.room);
    });

    // スワイプを受信
    socket.on('swipe', function(data){

      
      //joinすることにより、to('room')でこの部屋のを受け取れるようになる
      //helloでやってるけど一応やっとけ
      socket.join(data.room);

      console.log("");
      console.log("hi, user <"+socket.id.slice(0,4)+"> in room [" + data.room.slice(0,4) + "]. good swipe! (force="+data.swipeData.f.toFixed(3)+")");


      showRoomMembers(data.room);
      socket.emitRoomMembers(data.room);
      console.log(socket.room);
      console.log(socket.rooms);


      //モデルを取得
      var wheel = wheels[data.room+''] = 
        wheels[data.room+''] || new Wheel(0, 0,["", "", ""]); 

      //送られてきた力
      var force = data.swipeData.f;

      //モデルに対して力を行使
      wheel.addForce(force);

      //送ってきたやつに返す
      
      var f = force;
      var r = wheel.getAngle().get();
      var v = wheel.getVelocity() ;
      var swipeData = data.swipeData; 

      socket.emit('mymove', { 
        f : f,
        r : r,
        v : v,
        //swipeData:swipeData 自分にはswipeDataは送らない。どうせ描画は済んでるし無駄だから
      });

      //他の奴らに返す
      socket.broadcast.to(data.room).emit('globalmove', { 
        f : f,
        r : r,
        v : v,
        swipeData:swipeData 
      });

    });



    // 切断
    socket.on('disconnect', function(){
      console.log("bye bye, <"+socket.id.slice(0,4)+">");

      //この時点でroomは抜けている
      //
      //byebyeメッセージが必要かもな
      /*
      console.log(socket.rooms);
      //あばよ
      for(i in socket.rooms){
        var roomname = socket.rooms[i];
        console.log("emit");
        socket.emitRoomMembers(roomname);
        socket.leave(roomname);
      }
      */

    });

  });
}



module.exports = sio;

