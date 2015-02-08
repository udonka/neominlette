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

      var member_sockets = [];
      //部屋が存在しなければundefined
      if(room_members){
        for(socketid in room_members){
          member_sockets.push(sio.sockets.connected[socketid])
        }
      }

      return member_sockets;
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



    function id2hue(idstr){

      var sum = 0;
      for(i = 0; i < idstr.length; i++){

        sum += idstr.charCodeAt(i);
      }

      var hue = sum % 24;

      return hue /24  * 360;
    }

    //member に変化がおこったときにルームメンバーに送る
    socket.emitRoomMembers = function(room){

      
      var member_sockets = getRoomMembers(room);
      var members_array = {};

      for(i in member_sockets){
        var member_socket = member_sockets[i];
        members_array[member_socket.client.id] = {
          hue : id2hue(member_socket.client.id),
          mp : member_socket.mp
        }
      }

      //socket.broadcast.to(room).emit('members', {members: members_array});
      sio.in(room).emit('members', {members: members_array});

    }

    //クライアントから、初めの挨拶が送られてきたら
    //はじめの初期化
    //全然最初に呼ばれるとは限らないクライアントは自信がなくなったらhelloするべき
    socket.on('hello', function(data){


      socket.mp = socket.mp || 0;

      //クライアントが希望してきた部屋に配属する。
      //この部屋は、URLを読んだHTTPServer側がクライアントに割り振ったもの。
      //以後、socketはこの部屋に限られる。
      console.log("hello, <"+ socket.id.slice(0,4)+">. your room is [" + data.room+"], OK?");
      console.log("Here it is your MP! <<" + socket.mp + ">>");


      //joinすることにより、to('room')でこの部屋のを受け取れるようになる
      //こんにちは～
      socket.join(data.room);

      //つまらないものですがポイントどうぞ～
      addmp(data.room, 5);

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

      /*
      //mpがないと何も出来ない
      if(socket.mp <= 0){
        return;
      }
      else{
        socket.mp --;
        socket.emitRoomMembers(data.room);
      }
      */

      
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

    function addmp(room, mp){
      //share mp to room members
      //
      //mp should be number;
      
      var members_socket = getRoomMembers(room);
      for(i in members_socket){
        members_socket[i].mp += mp;
      }
    }

    socket.on('addmp', function(data){
      console.log("ADDMP!! " + data.room);
      addmp(data.room, 5);

      wheels[data.room].setMovable(true);

      var count = 20;
      var timer = setInterval(function(){
        console.log("count :" + count);
        if(count <= 0){
          wheels[data.room].setMovable(false);
          clearInterval(timer);
        }

        sio.in(data.room).emit('timer', {count: count});

        count--;

      }, 1000);

      socket.emitRoomMembers(data.room);
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

