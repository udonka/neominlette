var socketio = require('socket.io');
var Wheel = require('./common/wheel').Wheel;

var wheel = new Wheel(0,0,["aiueo", "kaki", "kukeko", ]);
//! ラベルの設定はいつかやらなきゃな
var wheels = {};
//var wheel = {roomid:new Wheel(0,0), roomid2: wheel2, roomid3:wheel3};


function sio(server){
	sio = socketio.listen(server);
	sio.set('transports', [ 'websocket','polling' ]);// いらないっぽい
	//sio.set('transports', [ 'websocket' ]);// いらないっぽい


	//setInterval(function(){
  //    sio.sockets.emit('move', { f : wheel.getForces(), r : wheel.getAngle().get() })
  //  },10);
    
	// 接続
	sio.sockets.on('connection', function(socket){

      socket.on('hello', function(data){
        console.log(data);
        socket.join(data.room);
        wheels[data.room+''] = wheels[data.room+''] || new Wheel(0, 0,["", "", ""]);
        socket.emit('mymove', { f : 0, r : wheels[data.room+''].getAngle().get(), v : wheels[data.room+''].getVelocity() });

      });
		
		//console.log('Client connected. Type: '+sio.transports[socket.id].name);
		// スワイプを受信
		socket.on('swipe', function(data){
      wheels[data.room+''] = wheels[data.room+''] || new Wheel(0, 0,["", "", ""]); 
      var force = data.swipeData.f;
      wheels[data.room+''].addForce(force);
      console.log(wheels[data.room+'']);
//      wheel.addForce(force)
      console.log(data.room);
//      console.log("力受信: " + force);

      socket.join(data.room);
      socket.broadcast.to(data.room).emit('globalmove', { f : force, r : wheels[data.room+''].getAngle().get(), v : wheels[data.room+''].getVelocity() ,swipeData:data.swipeData});
      socket.emit('mymove', { f : force, r : wheels[data.room+''].getAngle().get(), v : wheels[data.room+''].getVelocity() ,swipeData:data.swipeData});

		});

		// 切断
		socket.on('disconnect', function(){});
	
	});
}


module.exports = sio;

