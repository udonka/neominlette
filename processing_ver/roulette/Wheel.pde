class Wheel implements Drawable {
  float forces = 0;
  float v;

  AbsAngle ang = new AbsAngle();
  LabelStopper[] stoppers;
  
  

  //view information
  int r;
  
  Vec2 pos;
  
  PImage im = null;


  Wheel() {
    this(0, PI/6, 3);
  }


  Wheel(float theta, float v, int num) {//
    this.ang.set(theta);
    this.v = v;
    setStoppers(num);
  }
  
  void setView(Vec2 p, int r){
    pos = p;
    this.r = r;
  }

  void setStoppers(int num) {
    stoppers = new LabelStopper[num];
    float unit = 2 * PI / num;
    for (int i = 0; i < num; i++) {
      stoppers[i] = new LabelStopper(new AbsAngle(unit * i /*i*0.13*/), ""+(i+1),texts[i%texts.length]);//the angle is from Wheel
    }
  }

  int getStoppersNum() {
    return stoppers.length;
  }

  LabelStopper[] getStoppers() {
    return stoppers;//better to copy
  }

  AbsAngle[] getStoppersAbs() {
    AbsAngle[] res = new AbsAngle[getStoppersNum()];
    for (int i = 0; i < getStoppersNum(); i++) {
      res[i] = stoppers[i].getAngle().getAdd(ang);
    }
    return res;
  }
  
  LabelStopper getPrevStopper(LabelStopper ls){
    List<LabelStopper> stoppersList = Arrays.asList(wheel.getStoppers());

    int index = stoppersList.indexOf(ls);
    int prevIndex;
    if(index == 0){
      prevIndex = stoppersList.size() -1;
    }
    else{
      prevIndex = index -1;
    }
    
    return stoppersList.get(prevIndex);
  }

  AbsAngle getAngle() {
    return ang;
  }

  void addForce(float f) {
    forces += f;
  }

  void move() {
    internalMove(calcForce());
  }

  float calcForce() {
    float a = 0;

    //registance force
    if (this.isMoving()) {
      // v is not 0
      forces += (v > 0 ? -1 : 1) * masatu;
    }
    else { // if(this.isStopped()){
      if (abs(forces) <= maxMasatu) {
        forces = 0 ;
      }
    }

    a += forces; // mass is 1 F = 1a

    return a;
  }

  boolean isMoving() {
    boolean res = abs(v) > stop;
    return res;
  }

  void internalMove(float a) {
    v=0;
    //??????s

    dx = 1 / frameRate;

    if(abs(v) > vlimit){
      v= (v > 0) ? vlimit : -vlimit;
    }


    v += a *dx;
    
    
    if (abs(v) <= stop){
      v = 0;
    }



    ang.add( v *dx );
  }



  boolean dragged = false;
  void dragStart() {
    dragged = true;
    v = 0;
  }

  void drag(DiffAngle diff,float ms) {
    if (!dragged) {
      return ;
    }

    if (ms == 0) {
      return ;
    }
    
    float s = ms/1000.0;
    float v = diff.get() / s;
    
//    ang.add( v *dx );
//    v = diff.get();  
    println("drag" + v);
  }

  void dragEnd(DiffAngle diff, int ms) {
    dragged = false;

    if (ms == 0) {
      return ;
    }
    
    float s = ms/1000.0;
    float v = diff.get() / s;

    
    float a = v / s;//mass is 1

   
    addForce(a);
  }
  
  
  void cacheImage(){
    drawWheel();
    im = createImage(r*2,r*2,RGB);
    im.loadPixels();
    loadPixels();
    
    int xbase = + width/2 - r;
    int ybase = + height/2 - r;
    for(int i = 0; i < im.height; i++){
      for(int j = 0; j < im.width; j++){
        im.pixels[i * im.width + j] = pixels[(i+ybase) * width + (j+xbase) ];
      }
    }
      
    im.updatePixels();
    
    background(bgColor);

  }
  
  void draw() {
    println("X= " + ang.get() + ",\tV= "+v);
    
    pushMatrix();
      translate(width /2, height /2 + height /12);
      rotate(ang.get());
  
      if(im != null){
        
        drawWheelByCache();
      }
      else{
        drawWheel();
      }
    popMatrix();
  }

  
  private void drawWheelByCache(){
    image(im,-im.width/2,-im.height/2);
  }
  
  private void drawWheel(){
    pushMatrix();
    translate(width/2, height/2);
//    rotate(ang.get());

    noStroke();
    fill(wheelColor);

    ellipse(0, 0, r, r);
    

    //settings of texts
    textAlign(CENTER);
    textSize(40);
    
    //draw pie and text
    for (int i = 0; i < stoppers.length; i++) {
      AbsAngle current = stoppers[i].getAngle();
      AbsAngle next = stoppers[i+1 < stoppers.length ? i+1 : 0].getAngle();
      DiffAngle diff = next.calcDiff(current);
      
      pushMatrix();
        rotate(current.get());
        fill((int)(255.0/stoppers.length * i), 200, 200);
  
        arc(0, 0, r*0.9, r*0.9, 0, next.calcDiff(current).get());
  
        rotate(diff.get()/2);


        translate(150,0);
 
        rotate(PI/2);
   
        fill(0,0,255);
        text("" + stoppers[i].getLabel(), 0,0);
      popMatrix();
      
    }

    //draw line between label
    for (LabelStopper stopper : stoppers) {
      pushMatrix();
      rotate(stopper.getAngle().get());
      stroke(0, 0, 255);
      strokeWeight(4);
      line(0, 0, r*0.9, 0);
      popMatrix();
    }
    ellipse(0, 0, r/10, r/10);


    popMatrix();
  }
  
  

}

