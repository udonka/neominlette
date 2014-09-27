
(function(global){

	var milkcocoa = new MilkCocoa("https://io-fi0bzpl89.mlkcca.com/");

	var RANGE = 150;
	function Roulette(s, r, x) {
		var self = this;
		this.range = r - 20;
		this.x = x;
		this.ds = milkcocoa.dataStore('roulette');
		this.id = "id" + String(Math.random()).substr(2);
		this.r = 0;
		this.v = 0;
    	self.group = s.group();

    	var lines = [];

    	var angles = [];

    	var length = 8;
    	for (var i = 1; i <=length; i++) {
    		angles.push(i * 360/length);
    	};

    	angles.map(function(e, index) {
    		return {
    			th : e,
    			next : angles[(index + 1) % angles.length] 
    		}
    	}).map(function(e, index) {

    		e.path = s.pie(0,0,self.range,e.th,e.next);
    		/* *
	    	e.path =(s.path('M 0 0 L '+
		    		(self.range * Math.sin(e.th / 180 * Math.PI))+' '
		    		+(self.range * Math.cos(e.th / 180 * Math.PI))+
	    		' A '+self.range+' '+self.range+' 0 0 0 '+
		    		(self.range * Math.sin(e.next / 180 * Math.PI))+' '+
			    	(self.range * Math.cos(e.next / 180 * Math.PI))+
	    		' Z'));
//*/
			return e;
    	}).map(function(e, index) {
    		var l = e.path;
    		return l.attr({
    			fill : Snap.hsb(e.th/360, 0.7,0.8), 
    			//fill : colors[index],
    			stroke : "#fff"
    		})
    	}).map(function(l) {
    		self.group.append(l);
    		var circle = 
    		self.group.append(s.circle(0,0,300).attr({fill:Snap.rgb(255,255,255),stroke:Snap.rgb(0,0,0,0)}));

    	});

    	//受信したら力をかける
    	this.ds.on("set", function(e) {
    		if(self.id != e.id) {
    			self.addForceInternal(e.value.f);
			}
    	});
    }

	Roulette.prototype.addForce = function(f) {
    	this.addForceInternal(f);
		this.ds.set(this.id, {f : f});
	}

	Roulette.prototype.addForceInternal = function(f) {
		this.v += (f * 10);
	}

	Roulette.prototype.run = function(f) {
		this.rotate(this.v);
		this.v *= 0.95;
	}

	Roulette.prototype.rotate = function(r) {
		this.r += r;
	}

	Roulette.prototype.render = function() {
		var self = this;
		this.group.transform("translate("+self.x+","+self.x+") rotate("+this.r+")");
	}


    global.Roulette = Roulette;
}(window))