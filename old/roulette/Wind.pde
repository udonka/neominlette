
class Wind implements Drawable{
  Wheel wheel; //the objective 
  AbsAngle myAng; //where it is?
  DiffAngle diff = new DiffAngle(0);
  int length;
  

  float bendingRange = windRange;//width which bends

  BendingState bending = BendingState.NOBEND; 
  // 0: no bend, 
  // 1: bending right, 
  //-1: bending left;
  // 2: exists in right. going to enter left
  //-2: exists in left . going to enter right

  public Wind(Wheel w){
    wheel = w;
    bending = BendingState.NOBEND;
    myAng = new AbsAngle(-PI/2);
    
    length = (int)(wheel.r * 0.4);
  }

  void move(){
    //get stoppers
    AbsAngle[] stoppers = wheel.getStoppersAbs();
    
    //difference bitween nearest stopper
    diff = calcMinDiff(stoppers);
    
    //if stopped 0, positive 1, negative -1
    int direction = wheel.isMoving() ? 1:0;
    direction *= (wheel.v > 0 ? 1 : -1);
    
    //change state with diffirence angle and current direction.
    stateChange(diff, direction);
    
    //add force
    float k = bane;
    if(bending == BendingState.RIGHTBEND && diff != null){
      wheel.addForce(- k * abs(diff.get()));
/*      if(abs(wheel.v) < PI/6){
        wheel.addForce(-3*PI);
      }*/
    }
    
    if(bending == BendingState.LEFTBEND && diff != null){
      wheel.addForce( k * abs(diff.get()));
      if(abs(wheel.v) < PI/6){
        wheel.addForce(3*PI);
      }
    }
          
  }
  
  DiffAngle calcMinDiff(AbsAngle[] stoppers){
    DiffAngle minDiff = stoppers[0].calcDiff(myAng);
    int minIndex = 0;
    
    DiffAngle diff = null;

    //find nearest stopper
    for(AbsAngle stopper : stoppers){
      diff = stopper.calcDiff(myAng);
      if(abs(diff.get()) < abs(minDiff.get())){
        minDiff = diff;
      }
    }
    //difference between wind and stopper which can be collided
    diff = minDiff;
    return diff;
  }
  
  LabelStopper calcArgMinDiff(LabelStopper[] stoppers){
    
    float minDiff = abs(stoppers[0].getAngle().getAdd(wheel.getAngle()).calcDiff(this.myAng).get());
    LabelStopper minStopper = stoppers[0];

    float diff = 0;
    //find nearest stopper
    for(LabelStopper stopper : stoppers){
      diff = abs(stopper.getAngle().getAdd(wheel.getAngle()).calcDiff(myAng).get());

      if(diff < minDiff){
        minDiff = diff;
        minStopper = stopper;
      }
    }
    //difference between wind and stopper which can be collided

    return minStopper;
  }
  
  
  void stateChange(DiffAngle diff, int direction){
    if(bending == BendingState.NOBEND){
      if(0 < diff.get()){
        bending = BendingState.RIGHTEXIST;
      }
      //bending left
      else if(diff.get() < 0){
        bending = BendingState.LEFTEXIST;
      }
      return;
    }
    
    if(bending == BendingState.RIGHTEXIST){
      //bending left
      if(direction == -1 && (-bendingRange < diff.get()  && diff.get() < 0)){
        bending = BendingState.LEFTBEND;
      }
      else if(0 < diff.get()){
        bending = BendingState.RIGHTEXIST;
      }
      //bending left
      else if(diff.get() < 0){
        bending = BendingState.LEFTEXIST;
      }

      return;
    }
    
    // if stopper is left
    if(bending == BendingState.LEFTEXIST){

      //bending right
      if(direction == 1 && (0 < diff.get()  && diff.get() < bendingRange)){
        bending = BendingState.RIGHTBEND;
      }
      else if(0 < diff.get()){
        bending = BendingState.RIGHTEXIST;
      }
      //bending left
      else if(diff.get() < 0){
        bending = BendingState.LEFTEXIST;
      }
      
      return ;
    }
    
    //if bending right
    if(bending == BendingState.RIGHTBEND){
      if(diff.get() < 0){
        bending = BendingState.LEFTEXIST;
      }
      else if(bendingRange < diff.get()){
        bending = BendingState.RIGHTEXIST;
      }
      return ;
    }
    
    if(bending == BendingState.LEFTBEND){
      if(diff.get() < - bendingRange){
        bending = BendingState.LEFTEXIST;
      }
      if( 0 < diff.get() ){
        bending = BendingState.RIGHTEXIST;
      }
      return;
    }
    
    return;
  }
  
  LabelStopper getCurrentLabel(){
    //nearest stopper
    LabelStopper ls = this.calcArgMinDiff(wheel.getStoppers());
    LabelStopper prevLs = wheel.getPrevStopper(ls);

    switch(this.bending ){
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
  
  
  
  
  void draw(){
    pushMatrix();
      translate(width/2, height/2);
      rotate(myAng.get());
      translate(wheel.r,0);
      rotate(PI);

      stroke(0,0,250);
      strokeWeight(5);
        
      switch(bending){
      case RIGHTBEND:
      stroke(0,200,0);
        rotate(-3*diff.get());
        drawWind();
        break;
      case LEFTBEND:
        rotate(-3*diff.get());
        drawWind();
        break;
      case NOBEND:
      default:
        drawWind();
        break;
      }
    popMatrix();
  }

  void drawWind(){
    noStroke();

/*    
    fill(0,0,0);
    beginShape();
    vertex(0,length/8);
    vertex(-length/8,0);    
    vertex(0,-length/8);
    vertex(length*1.1,0);
    endShape();
    */
    fill(0,0,255);
    beginShape();
    vertex(0,length/12);
    vertex(-length/12,0);    
    vertex(0,-length/12);
    vertex(length,0);
    endShape();
  }
  

}
