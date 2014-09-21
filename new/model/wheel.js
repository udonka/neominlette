var Wheel = {
  forces : 0,
  v :0,
  Angle ang = Angle();
  stoppers: [],//配列のリテラル これでOK

  //view information

  /* いらないかもしれない
  r :0 ,
  
  pos: new Vec2(),

  im: 0, //image
  */
  
  init: function(theta, v, num) {//
    this.ang.set(theta);
    this.v = v;
    setStoppers(num);
  } ,


  setView :fucntion (pos, r){
    this.pos = pos;
    this.r = r;
  },

  setStoppers :function(num) {
    this.stoppers = [];//配列のコンストラクタ???
    var unit = 2 * PI / num;
    for (int i = 0; i < num; i++) {
      stoppers.push(
        new LabelStopper(
          new AbsAngle(unit * i /*i*0.13*/), 
          ""+(i+1),
          texts[i%texts.length]
        )
      );//the angle is from Wheel
    }
  } ,

  getStoppersNum:function() {
    return stoppers.length;//JSこれでいいのか??? -> OK
  },

//not yet

  //LabelStopper[] 
  getStoppers: function() {
    return stoppers;//better to copy
  },

  //AbsAngle[] 
  getStoppersAbs:function() {
    var res = [];
    for (int i = 0; i < getStoppersNum(); i++) {
      res.push(stoppers[i].getAngle().getAdd(ang));
    }
    return res;
  },
  
  //List<LabelStopper>
  getPrevStopper:function(ls){//ls : label stopper

    var stoppersList = wheel.getStoppers();

    var index = stoppersList.indexOf(ls);
    var prevIndex;

    if(index == 0){
      prevIndex = stoppersList.length -1;
    }
    else{
      prevIndex = index -1;
    }
    
    return stoppersList[prevIndex];
  },

  //AbsAngle 
  getAngle:function() {
    return this.ang;
  },

  // void 
  addForce:function(float f) {
    this.forces += f;
  },

  //void 
  move:function() {
    this.internalMove(this.calcForce());
  },

  //float 
  calcForce:function() {
    var a = 0;

    //registance force
    if (this.isMoving()) {
      // v is not 0
      this.forces += (v > 0 ? -1 : 1) * GLOBAL.masatu;
    }
    else { // if(this.isStopped()){
      if (Math.abs(this.forces) <= GLOBAL.maxMasatu) {
        this.forces = 0 ;
      }
    }

    a += this.forces; // mass is 1 F = 1a

    return a;
  },

  //boolean 
  isMoving:function() {
    var res = Math.abs(this.v) > GLOBAL.stop;
    return res;
  },

  //void 
  internalMove:function(a) { //float
    this.v=0;
    //??????s

    GLOBAL.dx = 1 / frameRate;

    if(Math.abs(v) > GLOBAL.vlimit){
      this.v= (this.v > 0) ? GLOBAL.vlimit : -GLOBAL.vlimit;
    }


    this.v += a *GLOBAL.dx;
    
    
    if (Math.abs(this.v) <= GLOBAL.stop){
      this.v = 0;
    }



    this.ang.add( this.v *GLOBAL.dx );
  } ,


  dragged : false,

  //void 
  dragStart:function() {
    this.dragged = true;
    this.v = 0;
  },

  //void 
  drag:function(diff,ms) {
    if (!this.dragged) {
      return ;
    }

    if (ms == 0) {
      return ;
    }
    
    float s = ms/1000.0;
    float v = diff.get() / s;
    
//    ang.add( v *dx );
//    v = diff.get();  
    console.log("drag" + this.v);
  },

  //void 

  dragEnd:function(diff, ms) {
    this.dragged = false;

    if (ms == 0) {
      return ;
    }
    
    float s = ms/1000.0;
    float v = diff.get() / s;

    
    float a = v / s;//mass is 1

   
    this.addForce(a);
  },
  
  
  //void 
  /*
  cacheImage:function(){
    this.drawWheel();
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
  */
  
  //void 

  draw:function() {
    //TODO

    /*
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
    */
  }

  
  //private void 
  /*
  drawWheelByCache:function(){
    image(im,-im.width/2,-im.height/2);
  },
  */
  
  //private void 
  /*
  drawWheel:function(){
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
  
  */
  

}
