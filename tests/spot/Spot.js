//canvasのidを引数で受け取ってそのcanvasを手書きエリアにする
//getImageData()で描画内容をImageDataオブジェクトとして出力
//putImageData(imageData)でImageDataオブジェクトを受け取り自身のcanvasに描画

function Spot(canvasId){
	this.canvas = document.getElementById(canvasId);
	this.ctx = this.canvas.getContext('2d');
	console.log(this.ctx);

	var x1,
		y1,
		x2,
		y2,
		borderWidth = ($("#"+canvasId).outerWidth()-$("#"+canvasId).innerWidth()) / 2;
		isDrawing = false;

	console.log(borderWidth);

	var self = this;

	$("#"+canvasId).mousedown(function(e){
		isDrawing = true;
		console.log(self.ctx);
		x1 = e.pageX - $(this).offset().left - borderWidth;
		y1 = e.pageY - $(this).offset().top - borderWidth;
		console.log("mousedown: "+x1+","+y1);
	})
	.mousemove(function(e){
		if(!isDrawing) return;
		x2 = e.pageX - $(this).offset().left - borderWidth;
		y2 = e.pageY - $(this).offset().top - borderWidth;

		//-----------------------------------------
		//この部分，本当はSpotのthis.ctxを使いたいのに
		//thisが $("#"+canvasId) になってしまっている
		//Spotのthis.ctxを使うにはどうしたら良い？
		self.ctx.beginPath();
 		self.ctx.moveTo(x1,y1);
 		self.ctx.lineTo(x2,y2);
 		self.ctx.stroke();
 		//-----------------------------------------

 		x1 = x2;
 		y1 = y2;
 		console.log("mousemove");
	})
	.mouseup(function(){
		isDrawing = false;
		console.log("mouseup");
	})
	.mouseleave(function(){
		isDrawing = false;
		console.log("mouseleave");
	});
}

Spot.prototype = {
	//canvasの描画内容を返す
	getImageData : function(){
		return this.ctx.getImageData(0,0,$("#"+canvasId).width(),$("#"+canvasId).height());
	},
	//引数で受け取ったcanvasの描画内容を描画する
	putImageData : function(imageData){ 
		this.ctx.putImageData(imageData,0,0,0,0,imageData.width,imagedata.height);
	}
}