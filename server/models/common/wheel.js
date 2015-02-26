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
GLOBAL.m = 10;
GLOBAL.stop = Math.PI/50;

var Wheel = function(theta, v, labelStoppers){
  //theta : number ( 0 - 2PI)
  //v : number (tipically 0) 
  //labels: labelStoppersLing (array of linked labelStoppers)
  
  ///////////fundamental data///////////
  //位置（角度）
  this.ang = new Angle(theta);

  //速度(角速度)
  this.v = v;

  //質量
  this.m = GLOBAL.m;

  this.setLabelStoppers(labelStoppers);

  ///////////sub data///////////
  this.movable = true;

  this.frameNum = 0;//for debugging


  console.log("Wheelのインスタンスが作成されました");
}


////////////////loop controle/////////////////
//looper はmoveの後に実行される
Wheel.prototype.onloop = function (looper){
  //looper: function
  this.looper = looper;
}

Wheel.prototype.startLoop = function (){
  var self = this;

  if(!this.loopWorking())
  {
    this.timer = setInterval(function(){
      //ココが意外と中心部
      //毎フレームmove を実行する。
      //looperがあればそれも実行する

      self.move(0);
      if(self.looper) self.looper();

    },GLOBAL.frameRate);
  }
}


Wheel.prototype.loopWorking = function (){
  return !(typeof this.timer === 'undefined' || this.timer === null);
}


Wheel.prototype.stopLoop = function (){
  if(this.loopWorking()){
    clearInterval(this.timer);
    this.timer = null;//loopWorkingがfalseになるようにアピール
  }
}


////////////////Movable getter/setter /////////////////
Wheel.prototype.setMovable = function (flag){
  this.movable = flag;
}

Wheel.prototype.getMovable = function (flag){
  return this.movable;
}


////////////////////Lable Stopper////////////////////////

Wheel.prototype.setLabelStoppers = function (labelStoppers){
  this.labelStoppers = labelStoppers;
}

Wheel.prototype.getLabelStoppers = function (){
  return this.labelStoppers;
}


//void 
Wheel.prototype.addForce = function(force) {
  //動くの禁止のときは、なにもしません
  //クライアントに同期してあげないとな。。
  if(!this.getMovable()){
    console.log("cannot move!");
    return;
  }

  console.log("force " + force);

  //一フレーム増えてしまうが、いいのか。。
  this.move(force * 1000);//1000 適当な数字。理論的な裏付けがほしいところ


  this.startLoop();//動いてる時は何もしないよ
}

//void 
Wheel.prototype.move = function(force) {
  force = force || 0;
  //forceに加工したいときはここを使う
  this._internalMove(force);

  this.frameNum++;

  //console.log(this.frameNum);
}

//boolean 
Wheel.prototype.isMoving = function() {
  var res = Math.abs(this.v) > GLOBAL.stop;
  return res;
}



//void 
Wheel.prototype._internalMove = function(f) { //float


  //GLOBAL.dx = 1 / GLOBAL.frameRate;

  //if(Math.abs(this.v) > GLOBAL.vlimit){
  //
  //  this.v= (this.v > 0) ? GLOBAL.vlimit : -GLOBAL.vlimit;
  //}

  if(isNaN(f)) console.log("f is NaN");

  var a = f / this.m;

  if(isNaN(a)) console.log("a is NaN");

  this.v += a * GLOBAL.dx ;
  
  if (!this.isMoving()){
    this.v = 0;
    this.stopLoop();
  }

  this.v *= GLOBAL.gensui; //ホントは摩擦力で実現したいが、なんか振動する


  if(isNaN(this.v)) console.log("v is NaN");


  this.ang.add( this.v *GLOBAL.dx );

  var ang = this.getAngle();
  //console.log("r:%d v:%d f:%d", this.getAngle(), this.getVelocity(),f);
}

///////////////////// setter / getters /////////////////
//AbsAngle 
Wheel.prototype.getAngle = function() {
  return this.ang;
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

  
this['Wheel'] = Wheel;

