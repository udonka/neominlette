(function(global){
	function Vec2(x, y) {
		this.set(x, y);
	}

	Vec2.prototype.set = function(x, y) {
		if(typeof v == "object") {
			this.x = x.x;
			this.y = x.y;
		}else{
			this.x = x || 0;
			this.y = y || 0;			
		}
	}

	Vec2.prototype.setX = function(x) {
			this.x = x || 0;
	}

	Vec2.prototype.setY = function(y) {
			this.y = y || 0;
	}

	Vec2.prototype.getX = function() {
		return this.x;
	}

	Vec2.prototype.getY = function() {
		return this.y;
	}

	Vec2.prototype.setR = function(r) {
	    this.normalize();
	    this.mul(r);
	}

	Vec2.prototype.getR = function(r) {
	    this.getLength();
	}

	Vec2.prototype.setTheta = function(theta) {
	    var r = this.getLength();
	    this.x = r * Math.cos(theta);
	    this.y = r * Math.sin(theta);
	}

	Vec2.prototype.getTheta = function() {
		Math.atan2(this.y, this.x);
	}

	Vec2.prototype.zero = function() {
		this.set();
	}

	/**
		@param v Vec2
	*/
	Vec2.prototype.zero = function(v) {
	    if(Math.abs(v.x) > 1000 || Math.abs(v.y) > 10000){//vが大きすぎたら足しません
	      this.set(x, y);
	      return this;
	    }
	    this.x += v.x;
	    this.y += v.y;
	    return this;
	}

	Vec2.prototype.add = function(v) {
	    if(Math.abs(v.x) > 1000 || Math.abs(v.y) > 10000){//vが大きすぎたら足しません
	      this.set(this.x, this.y);
	    
	      return this;
	    }

	    this.x += v.x;
	    this.y += v.y;
	    return this;
	}

	Vec2.prototype.sub = function(v) {
	    this.x -= v.x;
	    this.y -= v.y;
	    return this;
	}

	Vec2.prototype.mul = function(v) {
	    this.x *= v.x;
	    this.y *= v.y;
	    return this;
	}

	Vec2.prototype.div = function(v) {
		if(f == 0) return this;
	    this.x /= v.x;
	    this.y /= v.y;
	    return this;
	}

	Vec2.prototype.getAdd = function(v) {
	    return new Vec2(this.x + v.x, this.y + v.y);
	}

	Vec2.prototype.getSub = function(v) {
	    return new Vec2(this.x - v.x, this.y - v.y);
	}

	Vec2.prototype.getMul = function(v) {
	    return new Vec2(this.x * v.x, this.y * v.y);
	}

	Vec2.prototype.getDiv = function(v) {
	    if (f == 0) return this;
	    return new Vec2(this.x / v.x, this.y / v.y);
	}

	Vec2.prototype.getLength = function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	Vec2.prototype.normalize = function() {
	    var len = getLength();
	    if (len < 0.0001f)
	    len = 1.0f;
	    this.x /= len;
	    this.y /= len;
	    return this;
	}
	Vec2.prototype.getNormalize = function() {
	    var len = getLength();
	    if (len < 0.0001f)
	    len = 1.0f;
	    return new Vec2(this.x / len, this.y / len);
	}
	Vec2.prototype.reverse = function() {
		this.x *= -1;
		this.y *= -1;
	}
	Vec2.prototype.getReverse = function() {
	    return new Vec2(-this.x, -this.y);
	}
	Vec2.prototype.rotate = function(radian) {
	    var x2 = (-Math.sin(radian) * this.y + Math.cos(radian) * this.x);
	    var y2 = (Math.cos(radian) * this.y + Math.sin(radian) * this.x);
	    this.x = x2;
	    this.y = y2;
	}
	Vec2.prototype.getRotate = function(radian) {
	    return new Vec2((-Math.sin(radian) * this.y + Math.cos(radian) * this.x),
	    	(Math.cos(radian) * this.y + Math.sin(radian) * this.x));
	}
	Vec2.prototype.clone = function() {
		return new Vec(this.x, this.y);
	}


	Vec2.prototype.dot = function(v) {
	    return this.x * v.x + this.y * v.y;
	}
	Vec2.prototype.getLengthSquare = function() {
		return this.x * this.x + this.y * this.y;
	}
	Vec2.prototype.distance = function(v) {
		return this.getSub(v).getLength();
	}
	Vec2.prototype.toString = function(v) {
		return "X=" + this.x + ", Y=" + this.y;
	}
	global.Vec2 = Vec2;
}(window))
  
