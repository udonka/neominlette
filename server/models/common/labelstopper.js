if(typeof window === "undefined"){

  var Angle = require("./angle").Angle;

}

function LabelStopper(ang, str, text) {
  if(! ang instanceof Angle){
    throw new Error("ang should be Angle");
  }

  this.angle = ang;
  this.labelString = str;
  this.labelText = text || str;
}

LabelStopper.prototype.getAngle = function() {
  return new Angle(this.angle.get());
}

LabelStopper.prototype.getLabel = function() {
  return this.labelString;
}

LabelStopper.prototype.getText = function() {
  return this.labelText;
}
LabelStopper = LabelStopper;

var generateLabelStoppersLing = function(labels){
  //ラベルの文字列から、ストッパーの列に変換する
  var labelStoppers = _(labels).map(function(labelStr, index,labels){
    //LabelStopperオブジェクトを生成する
    var labelStopper = new LabelStopper(
        new Angle(index * 2 * Math.PI/labels.length), 
        labelStr, labelStr + "message");

    return labelStopper;
  });

  console.log("label stoppers ");
  console.log(labelStoppers);

  //前後とのリンクを貼る
  _(labelStoppers).each(function(labelStopper,index, labelStoppers){
    labelStopper.next = labelStoppers[(index + 1) % labelStoppers.length];
    labelStopper.prev = labelStoppers[(index - 1) < 0 ? labelStoppers.length-1 : (index -1)];
  });

  return labelStoppers;
}

this['LabelStopper'] = LabelStopper;
this['generateLabelStoppersLing'] = generateLabelStoppersLing;

