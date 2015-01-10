(function(global){
	function Roulette(s,labels) {
		var self = this;
		this.range = 50;

		this.angle = 0;
		this.v = 0;
		this.labels = [];
    	self.group = s.group();

    	var lines = [];
    	var angles = [];

    	var PI = Math.PI;

        /* */

        //*/


        for (var i = 0; i < labels.length; i++) {
            angles.push(i * 2*PI/labels.length);
        };

    	angles.map(function(e, index){
    		//LabelStopperオブジェクトを生成する
    		var label = new LabelStopper(new Angle(e), labels[index], labels[index]+"message");

    		self.labels.push(label);

    		return label;

    	}).map(function(label,index){
    		//前後とのリンクを貼る

    		label.next = angles[(index + 1) % angles.length];
    		label.prev = angles[(index - 1) < 0 ? angles.length-1 : (index -1)];

    		return label;

    	}).map(function(label, index) {
    		//対応する図形を描く
    		var ang = label.getAngle().get();
    		label.path = s.pie(
    			0,
    			0,
    			self.range,
    			ang * 180 / Math.PI,
    			label.next * 180 / Math.PI );

    		var r = self.range ;

    		var diffAng = new Angle(label.next).calcDiff(label.getAngle());

    		var middleAng = new Angle(label.getAngle()).add(diffAng.get()/2);


    		label.strPath = s.text(0,0, label.getLabel())
    			.transform("rotate("+ (-middleAng.get() * 180 / Math.PI) + ") translate("+(r*0.75)+",0) rotate(90)");

			return label;
    	}).map(function(label, index) {
    		//図形の色をぬる
    		label.path.attr({
    			fill : Snap.hsb(label.getAngle().get()/(2*Math.PI), 0.6,0.8), 
    			//fill : colors[index],
    			stroke : "#fff"
    		});

    		//文字を追加
    		label.strPath.attr({
    			fill : Snap.hsb(0, 0, 1), 
    			"text-anchor": "middle",
                "font-size":10,
	    	});

    		return label;
            
    	}).map(function(label) {
    		//グループに図形を追加
    		self.group.append(label.path);
    		self.group.append(label.strPath);
    	});

		var circle = self.group.append(s.circle(0,0,self.range/3 *2).attr({fill:Snap.rgb(255,255,255),stroke:Snap.rgb(0,0,0,0)}));

        this.str = s.text(0,0, "asdfasdfasdflakjsdaf");
        console.log(this.str);
        this.str.attr({
            fill : Snap.hsb(0, 1,1), 
            "text-anchor": "middle",
            "font-size":5,
        })

        s.append(this.str);

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



