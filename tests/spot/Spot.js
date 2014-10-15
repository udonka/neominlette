//ルーレットのラベルの手書き対応用クラス

//canvasのidを引数で受け取ってそのcanvasを手書きエリアにする
//getImageData()で描画内容をImageDataオブジェクトとして出力
//putImageData(imageData)でImageDataオブジェクトを外部から受け取り自身のcanvasに描画

function Spot(canvasId){
	this.canvasId = canvasId;
	this.canvas = document.getElementById(canvasId);
	this.ctx = this.canvas.getContext('2d');

	var x1,
		y1,
		x2,
		y2,
		borderWidth = ($("#"+canvasId).outerWidth()-$("#"+canvasId).innerWidth()) / 2;
		//もしborderの太さが縦と横で違う場合はそれぞれ取得する必要あり
		isDrawing = false;

	var self = this;

	$("#"+canvasId).mousedown(function(e){
		isDrawing = true;
		x1 = e.pageX - $(this).offset().left - borderWidth;
		y1 = e.pageY - $(this).offset().top - borderWidth;
		console.log("mousedown");
	})
	.mousemove(function(e){
		if(!isDrawing) return;
		x2 = e.pageX - $(this).offset().left - borderWidth;
		y2 = e.pageY - $(this).offset().top - borderWidth;

		self.ctx.beginPath();
 		self.ctx.moveTo(x1,y1);
 		self.ctx.lineTo(x2,y2);
 		self.ctx.stroke();

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

Spot.prototype.penColor = function(color){
	this.ctx.strokeStyle = color;
}

Spot.prototype.penWidth = function(width){
	this.ctx.lineWidth = width;
}

Spot.prototype.clear = function(){
	this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
}

Spot.prototype.getImageData = function(){
	return this.ctx.getImageData(0,0,$("#"+this.canvasId).width(),$("#"+this.canvasId).height());
}

Spot.prototype.putImageData = function(imageData){
	this.ctx.putImageData(imageData,0,0,0,0,imageData.width,imageData.height);
}
