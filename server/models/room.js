if(typeof window == "undefined"){
  //require
}


var CountDownTimer = function(count, count_func, finish_func){

  //count:number
  //count_func: function
  //finish_func: function
  
  this.timer = 0;
  this.count = count;
  this.count_func = count_func;
  this.finish_func = finish_func;
}

CountDownTimer.prototype.start = function(count){
  //count:number
  
  var this_cdt = this;

  this_cdt.count = count || this_cdt.count;

  if(this_cdt.timer)
  {
    console.log("[timer "+this_cdt.timer+"] already running");
    return;
  }

  this_cdt.timer = setInterval(function(){
    console.log("[timer "+this_cdt.timer+"] count :" + count);

    if(count <= 0){
      this_cdt.finish_func();
      clearInterval(this_cdt.timer);
      this_cdt.timer = 0;
    }

    this_cdt.count_func(count);

    count--;

  }, 1000);
}


CountDownTimer.prototype.stop = function(){ }

var Room = function(){
}

this['Room'] = Room;
this['CountDownTimer'] = CountDownTimer;
