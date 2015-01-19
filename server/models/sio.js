var socketio = require('socket.io');

//exports.listen = function(server){
module.exports = sio;
function sio(server){
	sio = socketio.listen(server);
	//console.log("socket server starting...");
	//sio.set('transports', [ 'websocket','polling' ]);// いらないっぽい
	sio.set('transports', [ 'websocket' ]);// いらないっぽい

	// 接続
	sio.sockets.on('connection', function(socket){

    socket.on('hello', function(data){
      socket.join(data.room);
      console.log("hello user");
    });
		
		//console.log('Client connected. Type: '+sio.transports[socket.id].name);
		// スワイプを受信
		socket.on('swipe', function(data){
			
			// 受信したものを配信
			socket.join(data.room);
			socket.broadcast.to(data.room).emit('move', { f : data.f });
			console.log(data.room);
			console.log(data.f);
		
		});

		// 切断
		socket.on('disconnect', function(){});
	
	});
}

