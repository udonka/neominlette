//あんまり独立性高くない良くないクラス
(function(global){

	var Finger = function(snap, snapdom, centerx, centery, sio){
		var self = this;

		self.socket = sio;

		self.snap = snap;
		self.snapdom = snapdom;

		self.centerX=centerx;
		self.centerY=centery;
		self.touchStartX=0;
		self.touchStartY=0;
		self.touchStartTime=0;
		self.touchEndX=0; 
		self.touchEndY=0; 
		self.touchEndTime=0;
		self.arrow=null;

		snapdom.addEventListener("pointerdown", function(event){
			self.pointerdown();
		},false);

		snapdom.addEventListener("pointermove", function(event){
			self.pointermove();
		},false);

		//画面外出た時の処理も書かなきゃ
		snapdom.addEventListener("pointerup", function(event){
			self.pointerup();
		},false);

		snapdom.addEventListener("pointerout", function(event){
			//self.pointerup();
		},false);

		snapdom.addEventListener("pointerleave", function(event){
			//self.pointerup();
		},false);
	}

	Finger.prototype.pointerdown = function(){
		this.touchStartX = event.offsetX;
		this.touchStartY = event.offsetY;
		this.touchStartTime =  parseInt((new Date).getTime());
		// writeMessage('Mousedown or touchstart')	;
		event.stopPropagation();
		event.preventDefault();

		this.arrow =  this.snap.line(this.touchStartX,this.touchStartY,this.touchStartX,this.touchStartY)
			.attr({
				stroke:Snap.rgb(255,0,0),
				"stroke-opacity":0.5,
				strokeWidth:15
			});
	}

	Finger.prototype.pointermove = function(){
		if(this.arrow)
			this.arrow.attr({
				x2:event.offsetX,
				y2:event.offsetY
			});

	}

	Finger.prototype.pointerup = function(){

		this.touchEndX = event.offsetX;
		this.touchEndY = event.offsetY;
		this.touchEndTime = parseInt((new Date).getTime());


    //力を送信
		var f = this.calcSpeed(
				this.centerX, this.centerY, //しっかり中心を決める必要がある
				this.touchStartX, this.touchStartY,
				this.touchEndX, this.touchEndY,
				this.touchStartTime, this.touchEndTime
			)

    var swipeData = {
      "f": f,
      //スタート角度とストップ角度、かかった時間を送ればよかろう

    }

    this.sendForce(swipeData);


		//s. タッチ場所を描画
		console.log("pointer up position : " + this.touchEndX + " "+ this.touchEndY);

		this.arrow.attr({
			x2:this.touchEndX,
			y2:this.touchEndY
		});


		//function にarrowをわたしている クロージャ
		(function(larrow){
			larrow.animate({
				stroke:Snap.rgb(255,255,255), 
				"stroke-opacity":0
			},1000,null,function(){
				//arrowをはずす
				larrow.remove();
				//ガベージこれくしょｎ
				larrow = null;
			});
		})(this.arrow);

		//ガベージこれくしょｎ
		//moveしても動かないようにする	
		this.arrow = null;


		//アニメーションで消さなきゃ
		//arrow = null; //お前にもうようはねえ

		event.stopPropagation();
		event.preventDefault();
	}

	Finger.prototype.sendForce = function(swipeData){
		this.socket.emit('swipe',{swipeData:swipeData, who:0},function(data){
			//who:自分が誰なのか

		});
	}
	//最終的に速度を計算する
	Finger.prototype.calcSpeed = function(centerX, centerY, startX, startY, endX, endY, timeStampX, timeStampY) {
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

		var v = dtheta.get();
		var f = v ;

		console.log("vel = " + v) ;

		return f;
	};

	global.RouletteFinger = Finger;

}(window));
