(function(global){
	function Roulette(paper,length,labels) {
		var self = this;
		self.angle = 0;
		self.width = length;
        self.height = length;
        self.radius = length/2;
        self.x = self.radius;
        self.y = self.radius;
		self.labelStoppers = [];
    	self.group = paper.group();

    	var lines = [];
    	var angles = [];
    	var PI = Math.PI;



        for (var i = 0; i < labels.length; i++) {
            angles.push();
        };

        //モデルの処理じゃん！！!!!!!!!!!!!!!!!!!!!!!!!!!!

        //ラベルの文字列から、ストッパーの列に変換する
    	self.labelStoppers = labels.map(function(e, index){
    		//LabelStopperオブジェクトを生成する
    		var labelStopper = new LabelStopper(
                new Angle(index * 2*PI/labels.length), 
                labels[index], labels[index]+"message");

    		return labelStopper;
    	});

        //前後とのリンクを貼る
        self.labelStoppers.map(function(labelStopper,index){

    		labelStopper.next = self.labelStoppers[(index + 1) % self.labelStoppers.length];
    		labelStopper.prev = self.labelStoppers[(index - 1) < 0 ? self.labelStoppers.length-1 : (index -1)];
    	});

        //LabelStopperに対応する図形を描く.{pie,text}という形式で帰ってくる
        //とっておく必要あるかな・・・？
        var pathes = self.labelStoppers.map(function(labelStopper, index){
    		var ang = labelStopper.getAngle();
            var nextang = labelStopper.next.getAngle();

            var r = self.radius;

            var diffAng   = nextang.calcDiff(ang);
            var middleAng = ang.getAdded(diffAng.get()/2);

    		var pie = paper.pie(
    			0,
    			0,
                r,
    			ang.get() * 180 / Math.PI,
    			nextang.get() * 180 / Math.PI )

                //色を設定
                .attr({
                    fill : Snap.hsb(ang.get()/(2*Math.PI), 0.6,0.8), 
                    //fill : colors[index],
                    stroke : "#fff"
                });

    		var text = paper.text(0, 0, labelStopper.getLabel())
    			.transform(
                    "rotate("+ (-middleAng.get() * 180 / Math.PI) + ") "+
                    "translate("+(r*0.75)+",0) "+
                    "rotate(90) ")
                .attr({
                    fill : Snap.hsb(0, 0, 1), 
                    "text-anchor": "middle",
                    "font-size" : r*0.1, //サイズは半径に依存しなければならない
                });

            self.group.append(pie);
            self.group.append(text);

            var res ={pie: pie, text:text};

			return res;
    	})

        //真ん中の円
		var circle = self.group.append(paper.circle(0,0,self.radius/3 *2).attr({fill:Snap.rgb(255,255,255),stroke:Snap.rgb(0,0,0,0)}));

        //真ん中の文字列
        this.str = paper.text(0,0, "asdfasdfasdflakjsdaf");
        console.log(this.str);
        this.str.attr({
            fill : Snap.hsb(0, 1,1), 
            "text-anchor": "middle",
            "font-size":5,
        })

        this.render();
    }

    //requestAnimationFrameにより呼ばれる
    Roulette.prototype.render = function() {
        this.group.transform("translate("+this.x+","+this.y+") rotate("+this.angle/Math.PI*180+")");
        this.str.attr({"text": "hello" + this.angle});
    }

    //setIntervalとかに呼ばれる？
    Roulette.prototype.setAngle = function(angle_rad) {
        this.angle = angle_rad;
    };

    global.Roulette = Roulette;

}(window));



