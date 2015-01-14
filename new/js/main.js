//main
//すべてをつなげる処理

$(function(){

/* 通信系処理 封印しとこう
	var roomname = window.location.host;
	var socket = io.connect(
		roomname,//これが部屋名
		{transports : ["websocket", "polling"]});

	function sendForce(force){
		socket.emit(roomname,{f:force,who:0},function(data){
			//who:自分が誰なのか

		});
	}
	*/


	var container = $("#rouletteContainer");
	var width = container.width();
	var height = $("html").height() - 200;
	var length = Math.min(width,height);
	var snap = Snap("#rouletteArea");
	snap.dom = document.getElementById("rouletteArea");
	snap.attr({"style": "width:"+length+"px; height:"+length+"px;"});

    var labels = [
        "ごにょごにょ",
        "うっきー",
        "石井",
        "後藤",
        "宮下",
    ];

	var roulette = new Roulette(snap,length,labels);
	//var rouletteView = new RouletteView(roulette, s, Math.min(width,height) / 2 * 0.8, width/2,height/2);

	var w = 5;
	var h = 50;

	snap.rect(length / 2 - w/2, 0, w, h);
	snap.attr({
		fill: "#700"
	})

	var angle = 0;


	setInterval(function() {
		angle += Math.PI/6;
		roulette.setAngle(angle);
		roulette.render();

		console.log('setInterval');

	}, 1000);


	var finger = new RouletteFinger(snap, snap.dom, roulette.x, roulette.y);
	// layer.add(circle);
	// layer.add(text);
	// stage.add(layer);
});
