ang = new Angle(0); // theta, min, max

for (var i = 0; i < 30; i++) {
	ang.add(1);
	console.log(ang.get());
}


ang.set(3.25);
console.log("ang theta " + ang.toString() + " max " + ang.max + " min " + ang.min);


var ang2 = new Angle(ang);


console.log("ang2 theta " + ang2.toString() + " max " + ang2.max + " min " + ang2.min);

for (var i = 0; i < 30; i++) {
	ang2.add(1);
	console.log(ang2.get());
}



ang2.set(15);

console.log("ang1 " + ang.toString() );
console.log("ang2 " + ang2.toString() );

var diff = ang2.calcDiff(ang);


console.log("ang3 " + diff.toString() );


//////////////////wheel test//////////////////

GLOBAL = {
	frameRate: 1000/60,
	dx : 60/1000,//いらないかな？
	masatu : Math.PI/8,
	maxMasatu : Math.PI/5,
	stop : Math.PI/50,
	bane : Math.PI*30,
	windRange : Math.PI/24,
	vlimit : 5 * Math.PI,
	texts : ["shota", "masafumi", "sumie", "miyoko", "satomi", "shun"]
}


var hoi = 0;
function draw(){

	hoi ++;

	if(hoi % 3== 0){

		Wheel.addForce(10);
	}

	Wheel.move();
	console.log(Wheel.getAngle().toString())

}
setInterval(draw , 1000/60);



