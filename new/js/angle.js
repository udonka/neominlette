function isNumber(x){ 
    if( typeof(x) != 'number' && typeof(x) != 'string' )
        return false;
    else 
        return (x == parseFloat(x) && isFinite(x));
}

function Angle(init, min, max){
	//numeric construction

	if(isNumber(init) && isNumber(min) && isNumber(max)){
		this.theta = 0;

		this.max = max;
		this.min = min;

		this.set(init)
	}
	else if(min == undefined && max == undefined && init instanceof Angle){
		Angle.call(this, init.theta, init.min, init.max);
	}
	//これが一番使いそう
	else if(min == undefined && max == undefined && isNumber(init)){
		Angle.call(this, init,0,2*Math.PI);
	}
	else if(min == undefined && max == undefined && init == undefined){
		this.max = 2*Math.PI;
		this.min = 0;
		this.set(0);
	}
}


//static method

Angle.createAbsAngle = function(theta){
	return new Angle(theta, 0, 2* Math.PI);
}

//これのfloat版もほしい
Angle.prototype.add = function(ang) {
	if(ang instanceof Angle)
	{
		this.set(
			this.get() 
			+ ang.get());
	}
	else if(isNumber(ang)){
		this.set(this.get() + ang);
	}
	return this;
};

//オーバーロードできた
Angle.prototype.set = function(th){ // min <= th < max
	if(th instanceof Angle){
		this.set(ang.get());
	}
	else if(isNumber(th)){
		if(th >= this.max){
			this.set(this.min + (th-this.max));
			return ;
		}

		if(th < this.min){
			this.set(this.max + (th-this.min));
			return ;
		}

		this.theta = th;
	}
	else
	{
		console.log("数値か角度以外だめです")
	}
}	

Angle.prototype.get = function(){ // min <= th < max
	return this.theta;
}


Angle.prototype.toString = function(){ // min <= th < max
	return "(" + this.theta +  ", " + this.min +", " + this.max + ")";
}


Angle.prototype.calcDiff = function(other){
	if(!other instanceof Angle){
		return 0;
	}

	var diff = this.get() - other.get();

    if((-Math.PI <= diff) && (diff <= Math.PI))
    {
    	return new Angle(diff, -Math.PI, Math.PI);
    }
    else if(diff < -Math.PI)
    {
    	return new Angle(diff + 2*Math.PI, -Math.PI, Math.PI);
    }
    else
    {
    	return new Angle(diff - 2*Math.PI, -Math.PI, Math.PI);
    }
}