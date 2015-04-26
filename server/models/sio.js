var socketio = require('socket.io');
var Room = require('./room').Room;
var id2hue = require('./room').id2hue;


//連想配列のキーを部屋名にして、ホイールのモデルを保存する
var rooms = {};

function sio(HTTPserver){
  sio = socketio.listen(HTTPserver);
  //sio: Socket.io server.

  //あるユーザーが、サーバーに対してコネクションを申し込んできた。 
  //ここでは、そのユーザー(socket)とのやりとりを定義するのみ。こう言われたらこう返すと
  //sio.sockets はデフォルトのNamespace /らしい！
  sio.sockets.on('connection', function(socket){
    //socket オブジェクトは、サーバーとそのユーザーとのコネクションを表す。つまり、サーバーからしたらユーザーそのもの

    //クライアントから、初めの挨拶が送られてきたら
    //はじめの初期化
    //全然最初に呼ばれるとは限らない
    //クライアントは自信がなくなったらhelloするべき

    socket.on('hello', function(data){

      socket.mp = socket.mp || 0;

      //クライアントが希望してきた部屋に配属する。
      //この部屋は、URLを読んだHTTPServer側がクライアントに割り振ったもの。
      //以後、socketはこの部屋に限られる。
      console.log("hello, <"+ socket.id.slice(0,4)+">. your room is [" + data.room+"], OK?");
      console.log("Here it is your MP! <<" + socket.mp + ">>");

//joinすることにより、to('room')でこの部屋のを受け取れるようになる
      //こんにちは～
      //!!!!!!!!roomにいれたい
      socket.join(data.room);



      socket.room = rooms[ data.room+''] = 
        rooms[ data.room+''] || new Room(data.room, sio); //sio is for broadcast comm
       

      //つまらないものですがポイントどうぞ～
      socket.room.addMp(5); //ここでは送らない

      socket.room.emitMembers(); //はじめて送信

      socket.room.showMembers();

      //現在の状態を渡す
      socket.emit('mymove', { 
        f : 0, 
        v : socket.room.wheel.getVelocity(),
        r : socket.room.wheel.getAngle().get(), 
      });

      socket.room.emitMembers(data.room);
      
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
        socket.emitMembers(data.room);
      }
      */

      //joinすることにより、to('room')でこの部屋のを受け取れるようになる
      //helloでやってるけど一応やっとけ

      socket.join(data.room);

      socket.room = rooms[ data.room+''] = 
        rooms[ data.room+''] || new Room(data.room, sio); //sio is for broadcast comm
       

      console.log("");
      console.log( "hi, user <"+ socket.id.slice(0,4)+"> in room [" + socket.room.id
         + "]. good swipe! (force="+data.swipeData.f.toFixed(3)+")");


      socket.room.showMembers();
      socket.room.emitMembers();


      //モデルを取得



      //送られてきた力
      var force = data.swipeData.f;

      //モデルに対して力を行使
      socket.room.wheel.addForce(force);

      //送ってきたやつに返す
      
      var f = force;
      var r = socket.room.wheel.getAngle().get();
      var v = socket.room.wheel.getVelocity() ;
      var swipeData = data.swipeData; 

      console.log("("+ f +", "+ r +", "+ v +")");

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
        swipeData:swipeData,
        hue: id2hue(socket.client.id) / 360 //ユーザーの色
      });
    });


    socket.on('addmp', function(data){
      console.log("addmp pushed");

      var isMovable = socket.room.wheel.toggleMovable();


      var ret = {
        isMovable :isMovable
      };

      socket.emit('ack-addmp',ret);

      socket.broadcast.to(data.room).emit('ack-addmp',ret);


    });

    /*
    socket.on('addmp', function(data){

      console.log("ADD MP to everyone in room [" + socket.room.id + "]");

      socket.room.addMp(5);

      socket.room.wheel.setMovable(true);

      socket.room.startCountDown(15);

      socket.room.emitMembers();
    });
    */


    // 切断
    socket.on('disconnect', function(){
      console.log("bye bye, <"+socket.id.slice(0,4)+">");
      //この時点でroomは抜けているが、socket.roomに最後のご挨拶。ぬけまーす

      if(socket.room)
        socket.room.emitMembers();
    });
  });
}

module.exports = sio;

