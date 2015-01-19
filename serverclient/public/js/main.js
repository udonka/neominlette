//main
//すべてをつなげる処理

if(typeof window === "undefined"){
  var Wheel = require("./common/wheel");
  var Wind = require("./common/wind").Wind;
  
}

$(function(){

  

  /* 通信系処理* */

	var roomname = window.location.host;

	var socket = {};
	var socket = io.connect(
		roomname,//これが部屋名
		{transports : ["websocket", "polling"]});

  var labels = [
      "後藤",
      "宮下",
      "石井",
      "tinko",
      /*
      */
  ];

  var wheel = new Wheel(0,0,labels);
  var wind = new Wind(wheel);
  var labelStoppers = wheel.getLabelStoppers();

  wheel.onloop(function(){
    roulette.setAngle(wheel.getAngle().get());
    roulette.setText(wind.getCurrentLabel());
    roulette.render();
  });


socket.on("move", function(data){
    wheel.setAngle(data.r);
    wheel.setVelocity(data.v);
    wheel.addForce(data.f);

    //Viewは角度だけ知ってればよし
    roulette.setAngle(data.r);
    roulette.setText(wind.getCurrentLabel());
    console.log("label" + wind.getCurrentLabel());
    roulette.render();
//    console.log("位置: " + data.r);
  //  console.log("力: " + data.f);
});


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


	var finger = new RouletteFinger(snap, snap.dom, roulette.x, roulette.y, socket);
});
