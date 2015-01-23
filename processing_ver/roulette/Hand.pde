class Hand{
  Wheel wheel;

  int i = 0;
  
  AbsAngle angles[] = new AbsAngle[2];
  int millises[] = new int[2];

  public Hand(Wheel w){
    wheel = w;
    
    for(int i = 0; i<angles.length; i++){
      angles[i] = new AbsAngle();
      millises[i] = millis();
    }
  }
  
  
  public void mousePressed(){
    //save current angle
    registerAngle( makeAngle() , millis());

    wheel.dragStart();
  }
  
  void mouseMoved(){
    
  }
  void mouseDragged(){
      fill(0,0,255);
      
      registerAngle(makeAngle(), millis());
      textStr = "current:" + currentAngle();
      textStr += "\nprev:" + prevAngle();
      
      wheel.drag(angleDifference(), timeDifference());
      
  }
  
  public void mouseReleased(){
    wheel.dragEnd(angleDifference(), timeDifference());
  }

  AbsAngle makeAngle(){
    Vec2 center2mouse = new Vec2(mouseX - width/2, mouseY - height/2);
    return new AbsAngle(center2mouse.getTheta());
  }
  
  void registerAngle(AbsAngle ang, int millis){
    ++i;
    angles[i % 2] = ang;
    millises[i % 2] = millis;
  }
  
  AbsAngle currentAngle(){
    return angles[i%2];
  }
  
  AbsAngle prevAngle(){
    return angles[(i+1)%2];
  }
  
  DiffAngle angleDifference(){
    return currentAngle().calcDiff(prevAngle());
//    return angles[i%2].calcDiff(angles[(i+1)%2]);
  }

  int timeDifference(){
    return millises[i%2] - millises[(i+1)%2];
  }
}
