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

	var width  = $(window).width();
	var height = $(window).height();

	var minlength = Math.min(width,height);
	$("svg").attr("width" , minlength);
	$("svg").attr("height", minlength);

	$("#container").attr("style", "width:" + width + "px; width:" + height + "px");

	//snapsvgのインスタンス
	var snap = Snap("#rouletteArea");

    var labels = [
        "ごにょごにょ",
        "うっきー",
        "石井",
        "後藤",
        "宮下",
    ];

	var roulette = new Roulette(snap,labels);
	//var rouletteView = new RouletteView(roulette, s, Math.min(width,height) / 2 * 0.8, width/2,height/2);

	var w = 5;
	var h = 50;

	snap.rect(minlength / 2 - w/2, 0, w, h);
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


	var calcSpeed = function(centerX, centerY, startX, startY, endX, endY, timeStampX, timeStampY) {
		// TODO
		var vec1 = new Vec2(startX - centerX, startY - centerY);
		var vec2 = new Vec2(endX - centerX, endY - centerY);
		var timeDiff = (timeStampY - timeStampX);
		var theta1 = Angle.createAbsAngle(vec1.getTheta());
		var theta2 = Angle.createAbsAngle(vec2.getTheta());
		var dtheta = theta2.calcDiff(theta1);

		if(timeDiff == 0){
			return 0;	

		}




		var v = (dtheta.get())*1000 / timeDiff;


		//!!!!!!!!!!!sendForce(v);


		return v;
	};

	var rouletteStart = function(speed) {
		console.log("roulette start with speed: " + speed);
	};


	var touchStartX, touchStartY, touchStartTime, touchEndX, touchEndY, touchEndTime;

	var body = document.getElementById("body");

	var arrow = null;
	body.addEventListener("pointerdown", function(event){
		touchStartX = event.clientX;
		touchStartY = event.clientY;
		touchStartTime =  parseInt((new Date).getTime());
		// writeMessage('Mousedown or touchstart')	;
		event.stopPropagation();
		event.preventDefault();

		arrow =  snap.line(touchStartX,touchStartY,touchStartX,touchStartY)
			.attr({
				stroke:Snap.rgb(255,0,0),
				"stroke-opacity":0.5,
				strokeWidth:15
			});


	},false);

	body.addEventListener("pointermove", function(event){
		if(arrow)
			arrow.attr({
				x2:event.clientX,
				y2:event.clientY
			});
	});

	//画面外出た時の処理も書かなきゃ
	body.addEventListener("pointerup", function(event){
		touchEndX = event.clientX;
		touchEndY = event.clientY;
		touchEndTime =  parseInt((new Date).getTime());


		rouletteStart(
			calcSpeed(
				roulette.x, roulette.y, //しっかり中心を決める必要がある
				touchStartX, touchStartY,
				touchEndX, touchEndY,
				touchStartTime, touchEndTime
			)
		);


		//s. タッチ場所を描画
		console.log("pointer up position : " + touchEndX + " "+ touchEndY);

		arrow.attr({
			x2:touchEndX,
			y2:touchEndY
		});


		//function にarrowをわたしている クロージャ
		(function(larrow){
			arrow.animate({
				stroke:Snap.rgb(255,255,255), 
				"stroke-opacity":0
			},1000,null,function(){
				//arrowをはずす
				larrow.remove();
				//ガベージこれくしょｎ
				larrow = null;
			});
		})(arrow);

		//ガベージこれくしょｎ
		//moveしても動かないようにする	
		arrow = null;


		//アニメーションで消さなきゃ
		//arrow = null; //お前にもうようはねえ

		event.stopPropagation();
		event.preventDefault();

	},false);

	// layer.add(circle);
	// layer.add(text);
	// stage.add(layer);
});
