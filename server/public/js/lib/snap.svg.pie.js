Snap.plugin(function(Snap, Element, Paper, glob){
	//新たにPaper.pieメソッドを追加している．
	Paper.prototype.pie = function(x,y,r,start,end){
		//pieオブジェクトはpathオブジェクトで実現する．
		var pie = this.path();
		//pieオブジェクトであることを記憶させる．
		pie.attr("shapeType", "pie");
		//パラメータをElementオブジェクトに設定する．
		if(typeof x == "object"){
			pie.attr(x);
		}else{
			pie.attr({x:x,y:y,r:r,start:start,end:end});
		}
		return pie;
	}
	//実際のパス文字列のテンプレート
	var piePath = "M{x},{y}U{r},{start},{end}L{x},{y}z";
	//パス文字列に対するパラメータオブジェクト
	var param = {x:0, y:0, r:0, start:0, end:0};
	//elemの内容を変数paramに書き込むメソッド
	function push(elem){
		for(var i in param){
			var val = elem.attr(i);
			val = val || 0;
			param[i] = val;
		}
	}
	//扇型を描画するメソッド
	function drawPie(){
		if(this.type != "path" || this.attr("shapeType") != "pie"){return;}
		push(this);
		//arcの始点と終点が重なると消えてしまう
		if(param.start - param.end % 360 == 0){param.end -= 0.01;}
		this.attr("path", Snap.format(piePath, param));
	}
	//attrメソッドからdrawPieメソッドを呼び出す．
	//domに値が描きこまれたあとで動作するように，優先度を1としている．
	eve.on("snap.util.attr.x", drawPie)(1);
	eve.on("snap.util.attr.y", drawPie)(1);
	eve.on("snap.util.attr.r", drawPie)(1);
	eve.on("snap.util.attr.start", drawPie)(1);
	eve.on("snap.util.attr.end", drawPie)(1);
});