var socketio = require('socket.io');
var Wheel = require('./common/wheel').Wheel;

var wheel = new Wheel(0,0,["aiueo", "kaki", "kukeko", ]);
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
		
		//console.log('Client connected. Type: '+sio.transports[socket.id].name);
		// スワイプを受信
		socket.on('swipe', function(data){
      var force = data.swipeData.f;
      wheel.addForce(force)
//      console.log("力受信: " + force);

      sio.sockets.emit('move', { f : force, r : wheel.getAngle().get(), v : wheel.getVelocity() });
			// 受信したものを配信
			//socket.broadcast.emit('move', { f : data.f });
			//sio.sockets.emit('move', { f : data.f, r : wheel.getAngle().get() });
		  // sio.sockets.in('room1').emit('msg','Hello!!'); //roomを指定する場合
		});

		// 切断
		socket.on('disconnect', function(){});
	
	});
}


module.exports = sio;

