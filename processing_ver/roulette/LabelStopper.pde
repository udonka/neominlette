class LabelStopper{
  AbsAngle angle;
  String labelString = "";
  String labelText = "";

// LabelStopper nextStopper; //don't exceed me! or diff will be negative

  LabelStopper(AbsAngle ang,String str, String text){
    angle = ang;
    labelString = str;
    labelText = text;
  }
  
  LabelStopper(AbsAngle ang,String str){
    angle = ang;
    labelString = str;
    labelText = str;
  }
  
  AbsAngle getAngle(){
    return angle;
  }

  
/*  caution:: don't exceed next angle.
  void setAngle(AbsAngle ang){
    angle = ang;
  }
  */

  String getLabel(){
    return labelString;
  }
  
  String getText(){
    return labelText;
  }
  
}


