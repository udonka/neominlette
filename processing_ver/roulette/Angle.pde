class Angle{
  private float max;
  private float min;
  
  private float theta;
  
  public Angle(float init, float _min, float _max){
    max = _max;
    min = _min;
    this.set(init);
  }
  

  public Angle(Angle other){
    this(other.theta, other.min, other.max);
  }
  
  public Angle(){
    max = 2*PI;
    min = 0;
    this.set(0);
  }

  public void add(float dang){ // min <= th < max
    set(this.get() + dang);
  }

  public void add(Angle ang){ // min <= th < max
    set(this.get() + ang.get());
  }
  
  public void set(Angle ang){ // min <= th < max
    set(ang.get());
  }
  
  public void set(float th){ // min <= th < max
    if(th >= max){
      set(min + (th-max));
      return ;
    }
    
    if(th < min){
      set(max + (th-min));
      return ;
    }

    theta = th;
  }
  
  public float get(){
    return theta;
  }
  
  String toString(){
    return "" + theta;
  }
  
}

class AbsAngle extends Angle{

  public AbsAngle(AbsAngle other){
    super(other);
  }
  
  public AbsAngle(float init){
    super(init, 0, 2*PI);
  }

  public AbsAngle(){
    super(0, 0, 2*PI);
  }
  
  public DiffAngle calcDiff(AbsAngle other){
    float diff = this.get() - other.get();
    if((-PI <= diff) && (diff <= PI)){
      return new DiffAngle(diff);
    }
    else if(diff < -PI){
      return new DiffAngle(diff + 2*PI);
    }
    else{
      return new DiffAngle(diff - 2*PI);
    }
  }
  
  public AbsAngle getAdd(Angle other){
    return new AbsAngle(this.get() + other.get());
  }
}

class DiffAngle extends Angle{
  
  public DiffAngle(float init){
    super(init, -PI, +PI);
  }

  public DiffAngle(){
    super(0, -PI, +PI);
  }
}

