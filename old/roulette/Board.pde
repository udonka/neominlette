
class Board implements Drawable {
  Wind wind;

  int myWidth;
  int myHeight;


  Board(Wind w) {
    wind = w;
    myWidth = 300;
    myHeight =70;
  }


  void draw() {
    pushMatrix();
      translate(width/2,0);

      fill(250, 0, 255);
      rect(-myWidth/2, 0, myWidth,myHeight);
      LabelStopper current = wind.getCurrentLabel();
      fill(0, 100, 0);
      textAlign(CENTER);
      text("" + current.getText(), 0, 50);
      textAlign(LEFT);
      text("" + current.getLabel(), -140, 50);
    popMatrix();
  }

  int i = 0;
  
  void move() {
    
  }
}

