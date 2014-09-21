(function(global){

	var milkcocoa = new MilkCocoa("https://io-fi0bzpl89.mlkcca.com/");

	var RANGE = 150;
	function Roulette(s) {
		var self = this;
		this.ds = milkcocoa.dataStore('roulette');
		this.id = "id" + String(Math.random()).substr(2);
		this.r = 0;
		this.v = 0;
    	self.group = s.group();
    	var lines = [];
    	var colors = ["#947fff", "#7fefff", "#7fff8a", "#f9ff7f", "#947fff", "#ff7f7f"];
    	[1, 61, 121, 181, 241, 301].map(function(e, index) {
    		return {
    			th : e,
    			next : e + 60
    		}
    	}).map(function(e, index) {
	    	return (s.path('M 0 0 L '+
	    		(RANGE * Math.sin(e.th / 180 * Math.PI))+' '
	    		+(RANGE * Math.cos(e.th / 180 * Math.PI))+
	    		' A 150 150 0 0 0 '+
	    		(RANGE * Math.sin(e.next / 180 * Math.PI))+' '+
	    	(RANGE * Math.cos(e.next / 180 * Math.PI))+
	    		' Z'));
    	}).map(function(l, index) {
    		return l.attr({
    			fill : colors[index],
    			stroke : "#333"
    		})
    	}).map(function(l) {
    		self.group.append(l);
    	});
    	this.ds.on("set", function(e) {
    		if(e.id == "force") {
    			addForceInternal(e.value.f);
			}
    	});
    }

	Roulette.prototype.addForce = function(f) {
		this.ds.set("force", {f : f});
	}

	Roulette.prototype.addForceInternal = function(f) {
		this.v += f;
	}

	Roulette.prototype.run = function(f) {
		this.rotate(this.v);
		this.v *= 0.9;
	}

	Roulette.prototype.rotate = function(r) {
		this.r += r;
	}

	Roulette.prototype.render = function() {
		this.group.transform("translate("+160+","+160+") rotate("+this.r+")");
	}


    global.Roulette = Roulette;
}(window))