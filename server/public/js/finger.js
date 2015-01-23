//あんまり独立性高くない良くないクラス
(function(global){

	var Finger = function(snap, snapdom, centerx, centery, radius, sio, room){
		var self = this;

		self.socket = sio;
		self.room = room;

		self.snap = snap;
		self.snapdom = snapdom;

		self.centerX=centerx;
		self.centerY=centery;
		self.radius=radius;
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

    if(this.arrow ){
      this.arrow.remove();

    }
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


    //力を計算
    var swipeData = this.calcSwipe(
        this.centerX, this.centerY, //しっかり中心を決める必要がある
        this.touchStartX, this.touchStartY,
        this.touchEndX, this.touchEndY,
        this.touchStartTime, this.touchEndTime,
        this.radius
    );

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
		this.socket.emit('swipe',
        {swipeData:swipeData,
         who:0, //いるのか
         room: this.room},
         function(data){});
	}

  //
	//最終的に速度を計算する
	Finger.prototype.calcSwipe = function(centerX, centerY, startX, startY, endX, endY, timeStampX, timeStampY, radius) {
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

    var dx = 30 / 1000;
    var v = dtheta.get() / (timeDiff || 1);
    var f = v / dx;

    console.log("vel = " + v) ;

    var swipeData = {
      f: f,
      timeDiff: timeDiff,

      startVec:vec1,
      startAngle: vec1.getTheta(),
      startR: vec2.getLength()/radius,

      endVec:vec2,
      endAngle: vec2.getTheta(),
      endR: vec2.getLength()/radius,
    }
    return swipeData;
	};

	global.RouletteFinger = Finger;

}(window));
