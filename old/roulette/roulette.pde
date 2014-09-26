import java.util.*;

float dx;
Wheel wheel;
Hand hand;
Wind wind;
Board board;

/////////////////settings about phisics//////////////////
/**/
float masatu = PI/2;
float maxMasatu = PI/5;
float stop = PI/50;
float bane = PI*10;
float windRange = PI/24;
float vlimit = 5 * PI;
String[] texts = {"shota", "masafumi", "sumie", "miyoko", "satomi", "shun"};
//*/

/**
float masatu = PI/2;
float maxMasatu = PI/5;
float stop = PI/50;
float bane = PI*60;
float windRange = PI/24;
float vlimit = 7 * PI;
String[] texts = {"shota", "masafumi", "sumie", "miyoko", "satomi", "shun"};

//*/

/////////////////setting about view//////////////////
Vec2 position = new Vec2(width/2, height/2);
int wheelRadius = (int) (width/2 * 0.8);

/////////////////setting about view//////////////////


ArrayList<Drawable> drawables = new ArrayList<Drawable>();

color bgColor;
color wheelColor;
color[] colors;

String textStr = "";

void setup(){
  size(600,600);
  ellipseMode(RADIUS);
  colorMode(HSB);
  background(0,50,50);


  wheelColor = color(0,0,255);
  bgColor = color(0,50,50);
  
  wheel = new Wheel( -PI, PI/6, 6);
  wheel.setView(new Vec2(width/2, height/2), (int)(width/2 * 0.8));
  
  wind = new Wind(wheel);
  hand = new Hand(wheel);
  board = new Board(wind);
  
  drawables.add(wheel);
  drawables.add(wind);
  drawables.add(board);

  wheel.cacheImage();

}

PImage im = null;
void draw(){
    
  
  
  background(bgColor);
  
  for(Drawable d : drawables){
    d.move();
  }
  for(Drawable d : drawables){
    d.draw();
  }

  if(im != null){
    image(im,0,0);
  }
  
  switch(keyCode){
  case LEFT:
    wheel.addForce(-10*PI);
    keyCode = 0;
    break;
    
  case RIGHT:
    wheel.addForce(10*PI);
    keyCode = 0;
    break;
  }

}


void mousePressed(){
  hand.mousePressed();
}
void mouseMoved(){
  hand.mouseMoved();
}
void mouseDragged(){
  hand.mouseDragged();
}
void mouseReleased(){
  hand.mouseReleased();
}


