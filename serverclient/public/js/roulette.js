(function(global){
	function Roulette(paper,length,labelStoppers) {
		var self = this;
		self.angle = 0;
		self.width = length;
        self.height = length;
        self.radius = length * (0.5 - 0.05);
        var sizes = {
            r : self.radius,
            r1_2 : self.radius/2,
            r1_3 : self.radius/3,
            r2_3 : self.radius*2/3,
            r1_4 : self.radius*1/4,
            r3_4 : self.radius*3/4,
            r1_5 : self.radius*1/5,
            r1_6 : self.radius*1/6,
            r1_10 : self.radius*1/10,
            r1_12 : self.radius*1/12,
            r1_24 : self.radius*1/24,
        };
            sizes.fontsize = sizes.r1_12;

        self.sizes = sizes;

        self.x = self.width/2;
        self.y = self.height/2;
        self.labelStoppers = labelStoppers;
        self.group = paper.group();

        var lines = [];
        var angles = [];
        var PI = Math.PI;


        //LabelStopperに対応する図形を描く.{pie,text}という形式で帰ってくる
        //とっておく必要あるかな・・・？
        var pathes = self.labelStoppers.map(function(labelStopper, index){
    		var ang = labelStopper.getAngle();
            var nextang = labelStopper.next.getAngle();


            var diffAng   = nextang.calcDiff(ang);
            
            var middleAng = ang.getAdd(diffAng.get()/2);

    		var pie = paper.pie(
    			0,
    			0,
                sizes.r,
    			ang.get() * 180 / Math.PI,
    			nextang.get() * 180 / Math.PI ).remove()

                //色を設定
                .attr({
                    fill : Snap.hsb(ang.get()/(2*Math.PI) + Math.PI/6, 0.5,0.9), 
                    //fill : colors[index],
                    stroke : "#000",
                    strokeWidth: sizes.r1_24

                });

    		var text = paper.text(0, 0, labelStopper.getLabel()).remove()
    			.transform(
                    "rotate("+ (-middleAng.get() * 180 / Math.PI) + ") "+
                    "translate("+ (sizes.r*0.75 - sizes.fontsize/2) +",0) "+ //;
                    "rotate(90) ")
                .attr({
                    fill : Snap.hsb(0, 0, 0), 
                    "text-anchor": "middle",
                    "font-size" : self.sizes.fontsize, //サイズは半径に依存しなければならない
                });

            self.group.append(pie);
            self.group.append(text);

            var res ={pie: pie, text:text};

			return res;
    	})


        //中央固定要素
        var centerObj = paper.group().remove()
            .transform("translate("+ self.x +","+self.y+")");


        var borderWidth = sizes.r1_24;

        //上の三角▲
        this.triAngle = PI/24;
        this.triangle = centerObj.path(
            "M"+ 0    +","+ -sizes.r1_10 +
            "L"+sizes.r1_10  +","+(sizes.r1_12)+
            "L"+(-sizes.r1_10)  +","+(sizes.r1_12)+"z")
            .attr({
                fill:Snap.rgb(255,255,255),
                stroke:Snap.rgb(0,0,0,1),
                strokeWidth:borderWidth 
            })
            .transform("translate("+ 0 +","+ -sizes.r1_2 +") "+
                "rotate("+ this.fure * 180/10 +")"
            );

        //真ん中の円
        var circle = centerObj.circle(0, 0, self.radius *(1/2))
            .attr({
                fill:Snap.rgb(255,255,255),
                stroke:Snap.rgb(0,0,0,1),
                strokeWidth:borderWidth 
            });


        //真ん中の文字列
        this.centerText = centerObj.text(0,0, "asdfasdfasdflakjsdaf")
            .attr({
                fill : Snap.hsb(0,0,0), 
                "text-anchor": "middle",
                "font-size":sizes.fontsize,
            });

		//self.group.append(circle);
        paper.append(centerObj);


        this.render();
    }

    //requestAnimationFrameにより呼ばれる
    Roulette.prototype.render = function() {
        this.group.transform("translate("+this.x+","+this.y+") rotate("+this.angle/Math.PI*180+")");

        var stateText = ("angle is " + this.angle.toFixed(2));

        this.centerText.attr({
            "text": this.text //|| stateText
        });

        this.triangle
            .transform("translate("+ 0 +","+ -this.sizes.r1_2 +") "+
                "rotate("+ this.fure * 180/10 +")"
            );

        //this.text = null; //1回表示したら消すようにしてみる
    }

    Roulette.prototype.setAngle = function(angle_rad) {
        this.angle = angle_rad;
    };

    Roulette.prototype.setFure= function(fure) {
        this.fure= fure;
    };

    Roulette.prototype.setText = function(text) {
        this.text = text;
    };

    global.Roulette = Roulette;

}(window));



