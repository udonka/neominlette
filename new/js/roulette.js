(function(global){

    function SwipeInfo(sx,sy,st, ex,ey,et){
        if(sx && sy && ex && ey)
        {
            this.sx = sx;
            this.sy = sy;
            this.st = st;

            this.ex = ex;
            this.ey = ey;
            this.et = et;
        }
        else{
            this.sx = 0;
            this.sy = 0;
            this.st = 0;

            this.ex = 0;
            this.ey = 0;
            this.et = 0;
        }
    }

    SwipeInfo.prototype.isZero = function(){
        return this.sx*this.sx + this.sy*this.sy + this.st*this.st 
             + this.ex*this.ex + this.ey*this.ey + this.et*this.et  == 0;
    }


    if(MilkCocoa)
    	var milkcocoa = new MilkCocoa("https://io-fi0bzpl89.mlkcca.com/");

	var RANGE = 150;
	function Roulette(s, r, x, y ) {
		var self = this;
		this.range = r;
		this.x = x;
		this.y = y;

        if(MilkCocoa)
    		this.ds = milkcocoa.dataStore('roulette');

		this.id = "id" + String(Math.random()).substr(2);
		this.r = 0;
		this.v = 0;
		this.labels = [];
    	self.group = s.group();

    	var lines = [];
    	var angles = [];


    	var PI = Math.PI;


        /* *
        var day = [
            "地域で探す",
            "やりたいことで探す",
            "食べたいもので探す",
            "見たい景色で探す",
        ];
        //*/
        /* *
        var day = [

            "アメリカ",
            "アジア",
            "ヨーロッパ ", 
            "アフリカ", 
            "日本国内", 
            "その他",
        ];
        //*/

        /* *
        var day = [
            "東海岸",
            "西海岸",
            "内陸",
        ];
        //*/

        /* */
        var day = [
            "うどんか",
            "ごにょごにょ",
            "うっきー",
            "石井",
            "後藤",
            "宮下",
        ];

        //*/
        for (var i = 0; i < day.length; i++) {
            angles.push(i * 2*PI/day.length);
        };

    	angles.map(function(e, index) {
    		//LabelStopperオブジェクトを生成する
    		var label = new LabelStopper(new Angle(e), day[index], day[index]+"message");

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

    			fill : Snap.hsb(0, 0,1), 
    			"text-anchor": "middle",
                "font-size":40,

    			//fill : colors[index],
	    		//textpath: "M0,0L100,50"
	    	});
    		return label;
            
    	}).map(function(label) {
    		//グループに図形を追加
    		self.group.append(label.path);
    		self.group.append(label.strPath);

    	});

		var circle = self.group.append(s.circle(0,0,self.range/3 *2).attr({fill:Snap.rgb(255,255,255),stroke:Snap.rgb(0,0,0,0)}));

    	//受信したら力をかける
    	this.ds.on("set", function(e) {
    		if(self.id != e.id && (e.value.f)) {
    			self.addForceInternal(e.value.f);

                var swipe = e.value.swipe;
                if(swipe)
                {

                    console.log("hello swipe");

                    (function(){

                        self.range;
                        var otherline = s.line(
                            self.x + self.range * Math.cos(swipe.st), 
                            self.y + self.range * Math.sin(swipe.st), 
                            self.x + self.range * Math.cos(swipe.et), 
                            self.y + self.range * Math.sin(swipe.et)
                        )
                        .attr({
                            stroke:Snap.rgb(0,0,255),
                            "stroke-opacity":0.5,
                            strokeWidth:30
                        })
                        .animate({
                            "stroke-opacity":0,
                            strokeWidth:30
                        },1000,null,function(){
                            otherline.remove();
                            otherline = null;
                        });

                    })();
                }
			}
    	});

        //止まった時に同期
        this.ds.on("set", function(e) {
            console.log("receive");

            if(e.id == "currentstate"){
                var theta = e.value.theta
                console.log("receive"+theta);

                self.r = theta;
                self.v = 0;

                self.render();
            }

        });



        this.swipeInfo = new SwipeInfo();

    }


	Roulette.prototype.addForce = function(f) {
    	this.addForceInternal(f);
            if(MilkCocoa)

		this.ds.set(this.id, {
            f : f,
            swipe:
                ((!(this.swipeInfo) || this.swipeInfo.isZero())? 
                    null: this.swipeInfo)
        });
	}

    Roulette.prototype.swipe = function(sx,sy,st,ex,ey,et) {
        this.swipeInfo = new SwipeInfo(sx,sy,st,ex,ey,et);

    }

	Roulette.prototype.addForceInternal = function(f) {
		this.v += (f * 10);
	}

	Roulette.prototype.run = function(f) {
        //現在動いているか
        var th = 0.01;
        var was_running = false;
        if(Math.abs(this.v) < th)
            was_running = false;
        else
            was_running = true;

        //回す
		this.rotate(this.v);
		this.v *= 0.95;

        //回っていたのに止まった
        if(was_running && Math.abs(this.v) < th && MilkCocoa)
        {
            console.log("sent");
            this.ds.set("currentstate", {theta:this.r});
        }

	}

	Roulette.prototype.rotate = function(v) {
		this.r += v;
	}

	Roulette.prototype.render = function() {
		var self = this;
		this.group.transform("translate("+self.x+","+self.y+") rotate("+this.r+")");
	}

    global.Roulette = Roulette;

}(window))


