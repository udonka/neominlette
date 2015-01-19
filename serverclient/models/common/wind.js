
if(typeof window === "undefined"){
  var Angle = require('./angle').Angle;
}



function Wind(wheel) {
  this.wheel = wheel;
  this.myAng = new Angle(-Math.PI/2);


  /*
  this.diff  =  Angle.createDiffAngle(0);
  this.bending = window.BendingState.NOBEND;
  */
}

Wind.prototype.move = function() {
  var stoppers = this.wheel.getStoppersAbs();

  this.diff = this.calcMinDiff(stoppers);
    
    //if stopped 0, positive 1, negative -1
    var direction = this.wheel.isMoving() ? 1:0;
    direction *= (this.wheel.v > 0 ? 1 : -1);
    
    //change state with diffirence angle and current direction.
    this.stateChange(this.diff, direction);
    
    //add force
    var k = Global.bane;
    if(this.bending == window.BendingState.RIGHTBEND && this.diff != null){
      this.wheel.addForce(- k * Math.abs(this.diff.get()));
/*      if(abs(wheel.v) < PI/6){
        wheel.addForce(-3*PI);
      }*/
    }
    
    if(this.bending == window.BendingState.LEFTBEND && this.diff != null){
      this.wheel.addForce( k * Math.abs(this.diff.get()));
      if(Math.abs(this.wheel.v) < Math.PI/6){
        this.wheel.addForce(3 * Math.PI);
      }
    }		
}

Wind.prototype.calcMinDiff = function(stoppers) {
    var minDiff = stoppers[0].calcDiff(this.myAng);
    var minIndex = 0;
    
    var diff = null;

    //find nearest stopper
    stoppers.forEach(function(stopper) {
      diff = stopper.calcDiff(this.myAng);
      if(Math.abs(diff.get()) < Math.abs(minDiff.get())){
        minDiff = diff;
      }
    });
    //difference between wind and stopper which can be collided
    diff = minDiff;
    return diff;
  }

Wind.prototype.calcArgMinDiff = function(stoppers) {
    var minDiff = abs(stoppers[0].getAngle().getAdd(this.wheel.getAngle()).calcDiff(this.myAng).get());
    var minStopper = stoppers[0];

    var diff = 0;
    //find nearest stopper
    stoppers.forEach(function(stopper) {
      diff = abs(stopper.getAngle().getAdd(this.wheel.getAngle()).calcDiff(this.myAng).get());

      if(diff < minDiff){
        minDiff = diff;
        minStopper = stopper;
      }
    });
    //difference between wind and stopper which can be collided

    return minStopper;
  }

Wind.prototype.stateChange = function(diff, direction) {
    if(this.bending == BendingState.NOBEND){
      if(0 < diff.get()){
        this.bending = BendingState.RIGHTEXIST;
      }
      //bending left
      else if(diff.get() < 0){
        this.bending = BendingState.LEFTEXIST;
      }
      return;
    }
    
    if(this.bending == BendingState.RIGHTEXIST){
      //bending left
      if(direction == -1 && (-this.bendingRange < diff.get()  && diff.get() < 0)){
        this.bending = BendingState.LEFTBEND;
      }
      else if(0 < diff.get()){
        this.bending = BendingState.RIGHTEXIST;
      }
      //bending left
      else if(diff.get() < 0){
        this.bending = BendingState.LEFTEXIST;
      }

      return;
    }
    
    // if stopper is left
    if(this.bending == BendingState.LEFTEXIST){

      //bending right
      if(direction == 1 && (0 < diff.get()  && diff.get() < this.bendingRange)){
        this.bending = BendingState.RIGHTBEND;
      }
      else if(0 < diff.get()){
        this.bending = BendingState.RIGHTEXIST;
      }
      //bending left
      else if(diff.get() < 0){
        this.bending = BendingState.LEFTEXIST;
      }
      
      return ;
    }
    
    //if bending right
    if(this.bending == BendingState.RIGHTBEND){
      if(diff.get() < 0){
        this.bending = BendingState.LEFTEXIST;
      }
      else if(this.bendingRange < diff.get()){
        this.bending = BendingState.RIGHTEXIST;
      }
      return ;
    }
    
    if(this.bending == BendingState.LEFTBEND){
      if(diff.get() < - this.bendingRange){
        this.bending = BendingState.LEFTEXIST;
      }
      if( 0 < diff.get() ){
        this.bending = BendingState.RIGHTEXIST;
      }
      return;
    }
    
    return;
  }

Wind.prototype.getCurrentLabel = function() {
    //nearest stopper
    var ls = this.calcArgMinDiff(this.wheel.getStoppers());
    var prevLs = this.wheel.getPrevStopper(ls);

    switch(this.bending){
      case LEFTBEND:
      case RIGHTEXIST:

        return prevLs;

      case RIGHTBEND:
      case LEFTEXIST:
      case NOBEND:
      default:
        return ls;
    }
}

Wind.prototype.draw = function() {
    switch(this.bending){
    case BendingState.RIGHTBEND:
      this.drawWind();
      break;
    case LEFTBEND:
      this.drawWind();
      break;
    case NOBEND:
    default:
      this.drawWind();
      break;
    }
}


function Wind(wheel){
  this.wheel = wheel;
  this.windAngle = new Angle(Math.PI /2);

}

Wind.prototype.currentLabel = function (){
  var labelStoppers = this.wind.getLabelStoppers();

  var wheelAngle = this.wheel.getAngle();
  //最も近いやつをみつける。
  var nearest = null;//{label, diffAngle} 

  _(labelStoppers).each(function(label, index){
    var labelAngle = label.getAngle().getAdd(wheelAngle);

    var diffAngle = windAngle.calcDiff(labelAngle);

    var diff = diffAngle.get();

    var abs = Math.Abs;
    nearest = (abs(diff)< abs(nearest.diff)) ? 
      {
        label : label,
        diff : diff
      }
      : nearestLabel;
  });

  //そいつの右だったらそいつ
  //そいつの左だったらそいつの前
  

}


function findNearestLabel(labelStoppers, wheelAngle, windAngle){

}


this['Wind'] = Wind2;

