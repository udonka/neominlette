//main
//すべてをつなげる処理

$(function(){
	var width  = $(window).width();
	var height = $(window).height();

	var minlength = Math.min(width,height);
	$("svg").attr("width" , minlength);
	$("svg").attr("height", minlength);
	$("#container").attr("style", "width:" + width + "px; width:" + height + "px");

	var s = Snap("#viewarea");

	var roulette = new Roulette(s, minlength / 2 * 0.8, minlength/2,minlength/2);
	//var rouletteView = new RouletteView(roulette, s, Math.min(width,height) / 2 * 0.8, width/2,height/2);

	var w = 5;
	var h = 50;

	s.rect(minlength / 2 - w/2, 0, w, h);
	s.attr({
		fill: "#700"
	})

	function render() {
		roulette.render();
	}

	setInterval(function() {
		roulette.run()
	}, 1000 / 30);


	function animationLoop(){
		render();
		requestAnimationFrame(animationLoop);
	}

	animationLoop();

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

		roulette.swipe(startX, startY, theta1.get(), endX, endY, theta2.get());

		return v;
	};

	var rouletteStart = function(speed) {
		console.log("roulette start with speed: " + speed);
		roulette.addForce(speed);

		// TODO
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

		arrow =  s.line(touchStartX,touchStartY,touchStartX,touchStartY)
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
})
