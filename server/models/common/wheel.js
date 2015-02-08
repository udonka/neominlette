var isServer = function(){
  console.log("This is server");
  return (typeof window == "undefined")
}

if(isServer()){
  var _ = require('underscore'); //node_moduleから探してくれる
  var Angle = require('./angle').Angle; //同じディレクトリ
  var LabelStopper = require('./labelstopper').LabelStopper;//同じディレクトリ
}


GLOBAL = {};
GLOBAL.frameRate = 1000/30;
GLOBAL.dx = 1/GLOBAL.frameRate;
GLOBAL.gensui = 0.98;
GLOBAL.stop = Math.PI/50;

//function Wheel(theta, v, num){
var Wheel = function(theta, v, labels){

  this.forces = 0;
  this.ang = new Angle(theta);
  this.v = v;
  this.movable = true;

  this.frameNum = 0;//for debugging

  this.setLabelStoppers(labels);

  console.log("Wheelのインスタンスが作成");
}

//looper はmoveの後に実行される
Wheel.prototype.onloop = function (looper){
  this.looper = looper;
}


Wheel.prototype.startLoop = function (){
  var self = this;

  if(!this.timerWorking())
  {
    this.timer = setInterval(function(){
      self.move();
      if(self.looper) self.looper();

    },GLOBAL.frameRate);
  }
}

Wheel.prototype.setMovable = function (flag){
  this.movable = flag;
}

Wheel.prototype.getMovable = function (flag){
  return this.movable;
}

Wheel.prototype.timerWorking = function (){
  return !(typeof this.timer === 'undefined' || this.timer === null);
}


Wheel.prototype.stopLoop = function (){
  if(this.timerWorking()){
    clearInterval(this.timer);
    this.timer = null;
  }
}


Wheel.prototype.setView = function (pos, r){
  this.pos = pos;
  this.r = r;
}


Wheel.prototype.setLabelStoppers = function (labels ){
 
  var self = this;

  //ラベルの文字列から、ストッパーの列に変換する
  self.labelStoppers = _(labels).map(function(labelStr, index,labels){
    //LabelStopperオブジェクトを生成する
    var labelStopper = new LabelStopper(
            new Angle(index * 2*Math.PI/labels.length), 
            labelStr, labelStr + "message");

    return labelStopper;
  });

  console.log(self.labelStoppers);

  //前後とのリンクを貼る
  self.labelStoppers.map(function(labelStopper,index){

    labelStopper.next = self.labelStoppers[(index + 1) % self.labelStoppers.length];
    labelStopper.prev = self.labelStoppers[(index - 1) < 0 ? self.labelStoppers.length-1 : (index -1)];
  });
}

Wheel.prototype.getLabelStoppers = function (){
  return this.labelStoppers;
}

//Wheel.prototype.setStoppers = function(num) {
//  this.stoppers = [];//配列のコンストラクタ???
//  var unit = 2 * PI / num;
//  for (var i = 0; i < num; i++) {
//    stoppers.push(
//      new LabelStopper(
//        new AbsAngle(unit * i /*i*0.13*/), 
//        ""+(i+1),
//        texts[i%texts.length]
//      )
//    );//the angle is from Wheel
//  }
//}

//Wheel.prototype.getStoppersNum = function() {
//  return stoppers.length;//JSこれでいいのか??? -> OK
//}

  //not yet

//LabelStopper[] 
//Wheel.prototype.getStoppers = function() {
//  return stoppers;//better to copy
//}

//AbsAngle[] 
//Wheel.prototype.getStoppersAbs = function() {
//  var res = [];
//  for (var i = 0; i < getStoppersNum(); i++) {
//    res.push(stoppers[i].getAngle().getAdd(ang));
//  }
//  return res;
//}

//List<LabelStopper>
//Wheel.prototype.getPrevStopper = function(ls){//ls : label stopper
//
//  var stoppersList = wheel.getStoppers();
//
//  var index = stoppersList.indexOf(ls);
//  var prevIndex;
//
//  if(index == 0){
//    prevIndex = stoppersList.length -1;
//  }
//  else{
//    prevIndex = index -1;
//  }
//  
//  return stoppersList[prevIndex];
//}

//AbsAngle 
Wheel.prototype.getAngle = function() {
  return this.ang;
}

//AbsAngle 
Wheel.prototype.getVel = function() {
  return this.v;
}

//void 
Wheel.prototype.addForce = function(force) {
  if(!this.getMovable()){
    return;
  }
  this.forces += force * 1000;
  this.startLoop();//動いてる時は何もしないよ
}

//void 
Wheel.prototype.move = function() {
  this._internalMove(this.calcForce());
  this.frameNum++;
  //console.log(this.frameNum);
}

//float 
Wheel.prototype.calcForce = function() {
  var a = 0;


  a += this.forces; // mass is 1 F = 1a
  this.forces = 0;
  return a;
}

//boolean 
Wheel.prototype.isMoving = function() {
  var res = Math.abs(this.v) > GLOBAL.stop;
  return res;
}

//void 
Wheel.prototype._internalMove = function(f) { //float
  //??????s


  //GLOBAL.dx = 1 / GLOBAL.frameRate;

  //if(Math.abs(this.v) > GLOBAL.vlimit){
  //  this.v= (this.v > 0) ? GLOBAL.vlimit : -GLOBAL.vlimit;
  //}
  var m = 10;

  var a = f / m;

  this.v += a * GLOBAL.dx ;
  
  
  if (Math.abs(this.v) <= GLOBAL.stop){
    this.v = 0;
    this.stopLoop();
  }

  this.v *= GLOBAL.gensui;


  this.ang.add( this.v *GLOBAL.dx );
  //console.log("速度: " + this.v);
  //console.log("角度: "+this.ang.get());
}

Wheel.prototype.getForces = function(){
  return this.forces;
}

Wheel.prototype.setAngle = function(theta){
  this.ang.set(theta);
}

Wheel.prototype.setVelocity = function(v){
  this.v = v;
}

Wheel.prototype.getVelocity = function(){
  return this.v;
}

  //void 
//Wheel.prototype.dragStart = function() {
//  this.dragged = true;
//  this.v = 0;
//}

//void 
//Wheel.prototype.drag = function(diff,ms) {
//  if (!this.dragged) {
//    return ;
//  }
//
//  if (ms == 0) {
//    return ;
//  }
//  
//  var s = ms/1000.0;
//  var v = diff.get() / s;
//    
////    ang.add( v *dx );
////    v = diff.get();  
//  console.log("drag" + this.v);
//}

  //void 

//Wheel.prototype.dragEnd = function(diff, ms) {
//  this.dragged = false;
//
//  if (ms == 0) {
//    return ;
//  }
//  
//  var s = ms/1000.0;
//  var v = diff.get() / s;
//
//  
//  var a = v / s;//mass is 1
//
// 
//  this.addForce(a);
//}
//


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

  //draw:function() {
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
  //}

  
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
  
this['Wheel'] = Wheel;

