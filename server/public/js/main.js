//main
//すべてをつなげる処理

if(typeof window === "undefined"){
  var Wheel = require("./common/wheel");
  var Wind = require("./common/wind").Wind;
}

var labels = labels ||  [
  "ごにょ",
  "うっきー",
  "うどんか",
];


(function(global){

  
  /* 通信系処理* */
  var serverurl = window.location.host;
  var room = roulette_id;

  //io: socket.jsで定義される
  var socket = io(serverurl);
  //????????????できなかったらどーすんの!!!!!!!!!

  //hello メッセージを送る。roomに配属してもらう
  socket.emit('hello', {room: room});

  socket.emitForce = function(swipeData){
    this.emit('swipe', {
        swipeData:swipeData,
        room: room
    });
  }


  var wheel = new Wheel(0,0,labels);
  var wind = new Wind(wheel);
  var labelStoppers = wheel.getLabelStoppers();

  wheel.onloop(function(){
    roulette.setAngle(wheel.getAngle().get());
    roulette.setText(wind.getCurrentLabel());
    roulette.render();
  });

  var drawTrace = function(data){
    var swipe = data.swipeData;

    console.log(swipe);

    var cx = roulette.x;
    var cy = roulette.y;
    var x1 = cx+ swipe.startR * Math.cos(swipe.startAngle) * roulette.radius;
    var y1 = cy+ swipe.startR * Math.sin(swipe.startAngle) * roulette.radius;
    var x2 = cx+ swipe.endR   * Math.cos(swipe.endAngle)   * roulette.radius;
    var y2 = cy+ swipe.endR   * Math.sin(swipe.endAngle)   * roulette.radius;

    console.log("line ("+x1+" , "+y1+") -> ( "+x2+", "+ y2 +") ");

    //スワイプあとを描画
    var arrow =  snap.line(x1,y1,x2,y2)
      .attr({
        stroke:Snap.rgb(0,0,255),
        "stroke-opacity":0.5,
        strokeWidth:15
      });

    arrow.animate({
      stroke:Snap.rgb(255,255,255), 
      "stroke-opacity":0
    },1000,null,function(){
      //arrowをはずす
      arrow.remove();
    });

  }




  var moveRoulette  = function(data){

      wheel.setAngle(data.r);
      wheel.setVelocity(data.v);
      wheel.addForce(data.f);

      //Viewは角度だけ知ってればよし
      roulette.setAngle(data.r);
      roulette.setText(wind.getCurrentLabel());

      roulette.render();
  }

  socket.on("globalmove", function(data){
    moveRoulette(data);
    drawTrace(data);
  })
  //自分のぐらい自分で回せばいいかも？
  socket.on("mymove", function(data){
    moveRoulette(data);
  });

  socket.on("members", function(data){
    //!!!!!!!!!!!!!!!!!

    var $logging_users_div = $("#logging-users");


    $logging_users_div.empty();


    for(id in data.members){

      if(socket.io.engine.id === id){
        console .log("yes");

        console.log(socket.io.engine.id);
        console.log(id);
      }
      else{
        console.log("no");
        console.log(socket.io.engine.id);
        console.log(id);
      }

      var listr = 
        "<div id='"+ id + "' " +
        "class='logging-user " + (socket.io.engine.id === id ? "me" : "") + "' "+
        "style='background:hsl("+
        data.members[id].hue +
        ",50%,50%)'>"+data.members[id].mp +"</div>";
      $logging_users_div.append(listr);

    }

    console .log(socket);

    var str = " I'm " + socket.io.engine.id + "<br>";

    str += "members: <br>" ;
    for( id in data.members)
    {
      str += id + "<br>";
    }


    $('#memo').html(str);

  });

  socket.on("timer", function(data){
    $("#timer").text(data.count);

    if(data.count == 0){
      wheel.movable = false;
    }
    else{
      wheel.movable = true;
    }

  });

  global.addmp = function(){
    socket.emit('addmp',{count:5, room:room});
  }


	var container = $("#rouletteContainer");
	var width = container.width();
	var height = $("html").height() - 200;
	var length = Math.min(width,height);
	var snap = Snap("#rouletteArea");
	snap.dom = document.getElementById("rouletteArea");
	snap.attr({"style": "width:"+length+"px; height:"+length+"px;"});


	var roulette = new Roulette(snap,length,labelStoppers);
	//var rouletteView = new RouletteView(roulette, s, Math.min(width,height) / 2 * 0.8, width/2,height/2);




	var w = 5;
	var h = 50;

	var angle = 0;


	var finger = new RouletteFinger(snap, snap.dom, roulette.x, roulette.y, roulette.radius, socket, room);

})(window);
