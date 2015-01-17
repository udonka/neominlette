//main
//すべてをつなげる処理

$(function(){

/* 通信系処理* */

	var roomname = window.location.host;
	var socket = io.connect(
		roomname,//これが部屋名
		{transports : ["websocket", "polling"]});



  var wheel = new Wheel(0,0);
  wheel.onloop(function(){
    roulette.setAngle(wheel.getAngle().get());
    roulette.render();
  });


  socket.on("move", function(data){
      wheel.setAngle(data.r);
      wheel.setVelocity(data.v);
      wheel.addForce(data.f);

      //Viewは角度だけ知ってればよし
      roulette.setAngle(data.r);
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

    var labels = [
        "うどんか",
        "うっきー",
        "石井",
        "後藤",
        "宮下",
    ];

	var roulette = new Roulette(snap,length,labels);
	//var rouletteView = new RouletteView(roulette, s, Math.min(width,height) / 2 * 0.8, width/2,height/2);

	var w = 5;
	var h = 50;

	snap.rect(length / 2 - w/2, 0, w, h);
	snap.attr({
		fill: "#700"
	})

	var angle = 0;


	var finger = new RouletteFinger(snap, snap.dom, roulette.x, roulette.y, socket);
	// layer.add(circle);
	// layer.add(text);
	// stage.add(layer);
});
