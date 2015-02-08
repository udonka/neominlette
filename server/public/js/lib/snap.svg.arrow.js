Snap.plugin(function (Snap, Element, Paper, global, Fragment) {
	
	// 制御点の配列を受け取りcatmull-romスプライン曲線を描画する関数
	Paper.prototype.drawMyArrow = function(snap,arrowPoints,color) {
		var pathStr = array2path(arrowPoints);
		var arrow = snap.path({path:pathStr})
	    .attr({
	      stroke:color,
				"fill-opacity":0,
	      "stroke-opacity":0.5,
	      strokeWidth:16
	    });
		
		return arrow;
	}

	Paper.prototype.redrawMyArrow = function(snap,arrow,arrowPoints,color){
		var marker = arrowMarker(48,48,0,24,color,0.5,snap);
		var pathStr = array2path(arrowPoints);
		if(arrowPoints.length>2){
			arrow.attr({
				path:pathStr,
				markerEnd:marker
			});
		}else{
			arrow.attr({
				path:pathStr
			});
		}
		
		return arrow;
	}

	// 制御点の配列を受け取りcatmull-romスプライン曲線を描画する関数
	Paper.prototype.drawGlobalArrow = function(snap,arrowPoints,color) {
		var marker = arrowMarker(48,48,0,24,color,0.5,snap);
		var pathStr = array2path(arrowPoints);
		var arrow = snap.path({path:pathStr})
	    .attr({
	      stroke:color,
				"fill-opacity":0,
	      "stroke-opacity":0.5,
	      strokeWidth:16,
				markerEnd:marker
	    });
		
		return arrow;
	}

	// Markerを返す関数
	// refX,refYは描画の基準位置
	var arrowMarker = function (width,height,refX,refY,color,opacity,snap) {
		var pathStr = "M0,0L"+width+","+height/2+"L0,"+height+"z";
		var markerShape = snap.path(pathStr).attr({
			fill:color,
			"fill-opacity":opacity
		});
		var marker = markerShape.marker(0,0,width,height,refX,refY).attr({
			markerUnits:"userSpaceOnUse",
			markerWidth:width,
			markerHeight:height
		});
		return marker; 
	};

	var array2path = function (arrowPoints){
		var pathStr = "M"+arrowPoints[0][0]+","+arrowPoints[0][1]+"R";
		for(var i=0;i<arrowPoints.length-1;i++ ){ // 最後の点は使わないようにする(矢じりの方向が直感と異なる)
			if(arrowPoints.length>3){ // 一定の長さ以上になったら
				if(i%3!=0 && i!=arrowPoints.length-2) continue; // 点を減らし滑らかにする
			}
			// arrowPoints[0]が2回path文字列に含まれるのはタッチ開始直後でも描画できるようにするため
			if(i!=0) pathStr += " ";
			pathStr += (arrowPoints[i][0]+","+arrowPoints[i][1]);
		}
		console.log("path:"+pathStr);	
		return pathStr;
	}



});
