(function(global) {
	function LabelStopper(ang, str, text) {
		this.angle = ang;
		this.labelString = str;
		this.labelText = text || str;
	}

	LabelStopper.prototype.getAngle = function() {
		return this.angle;
	}

	LabelStopper.prototype.getLabel = function() {
		return this.labelString;
	}

	LabelStopper.prototype.getText = function() {
		return this.labelText;
	}
	global.LabelStopper = LabelStopper;

}(window));


