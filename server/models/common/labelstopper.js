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



this['LabelStopper'] = LabelStopper;

