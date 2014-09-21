ang = new Angle(0,0,2.5); // theta, min, max


for (var i = 0; i < 100; i++) {
	ang.add(1);
	console.log(ang.get());
}


ang.set(15);
console.log(ang.get());
