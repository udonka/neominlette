/**
* 2Dベクトルを扱うクラスです。

* 内積や外積、ベクトルの加算乗除などほぼ全ての演算ができます。
* 
* @author saharan
* 
*/

public class Vec2 implements Cloneable{
  
  /** ベクトルの値です。 */
  public float x, y;
  
  /**
  * それぞれの初期の値を指定して作成します。
  * 
  * @param x
  * 初期x値
  * @param y
  * 初期y値
  */
  public Vec2(float x, float y) {
    this.x = x;
    this.y = y;
  }
  
  /**
  * それぞれの初期の値を0に指定して作成します。
  */
  public Vec2() {
    this(0, 0);
  }
  
  /**
  * 既存ベクトルをコピーして作成します。
  */
  public Vec2(Vec2 v) {
    this(v.x, v.y);
  }

  
  /**
  * 値をセットします。
  * 
  * @param x
  * x値
  * @param y
  * y値
  */
  public void set(float x, float y) {
    this.x = x;
    this.y = y;
  }
  
  public void setX(float x) {
    this.x = x;
  }
  public void setY(float y) {
    this.y = y;
  }
  
  public float getX(){
    return x;
  }
  public float getY(){
    return y;
  }
  
  public void set(Vec2 v) {
    this.x = v.x;
    this.y = v.y;
  }
  
  /**
  * 角座標Rの値をセットします。
  * 
  * @param r
  * 長さ
  */
  public void setR(float r) {
    this.normalize();
    this.mul(r);
  }

  /**
  * 角座標Rの値をゲットします。
  */
  public float getR() {
    return getLength();
  }
  
  /**
  * 角座標θの値をセットします。
  * 
  * @param theta
  * 角度
  */
  public void setTheta(float theta){
    float r = this.getLength();
    x = r * cos(theta);
    y = r * sin(theta);
  }
  
  /**
  * 角座標θの値をゲットします。
  */
  public float getTheta() {
    return atan2(y,x);
  }
  
  /**
  * 値を0にリセットします。
  */
  public void zero() {
    set(0, 0);
  }
  
  /**
  * ベクトルを加算します。
  * 
  * @param v
  * 加算するベクトル
  * @return 加算されたベクトル
  */
  public Vec2 add(Vec2 v) {
    if(abs(v.x) > 1000 || abs(v.y) > 10000){//vが大きすぎたら足しません
      set(x, y);
    
      return this;
    }

    x += v.x;
    y += v.y;
    return this;
  }
  
  /**
  * ベクトルを減算します。
  * 
  * @param v
  * 減算するベクトル
  * @return 減算されたベクトル
  */
  public Vec2 sub(Vec2 v) {
    x -= v.x;
    y -= v.y;
    return this;
  }
  
  /**
  * ベクトルを乗算します。
  * 
  * @param v
  * 乗算するベクトル
  * @return 乗算されたベクトル
  */
  public Vec2 mul(float f) {
    x *= f;
    y *= f;
    return this;
  }
  
  /**
  * ベクトルを除算します。
  * 
  * @param v
  * 除算するベクトル
  * @return 除算されたベクトル
  */
  public Vec2 div(float f) {
    if (f == 0)
    return this;
    x /= f;
    y /= f;
    return this;
  }
  
  /**
  * ベクトルを加算した結果を返します。
  * 
  * @param v
  * 加算するベクトル
  * @return 加算されたベクトル
  */
  public Vec2 getAdd(Vec2 v) {
    return new Vec2(x + v.x, y + v.y);
  }
  
  /**
  * ベクトルを減算した結果を返します。
  * 
  * @param v
  * 減算するベクトル
  * @return 減算されたベクトル
  */
  public Vec2 getSub(Vec2 v) {
    return new Vec2(x - v.x, y - v.y);
  }
  
  /**
  * ベクトルを乗算した結果を返します。
  * 
  * @param v
  * 乗算するベクトル
  * @return 乗算されたベクトル
  */
  public Vec2 getMul(float f) {
    return new Vec2(x * f, y * f);
  }
  
  /**
  * ベクトルを除算した結果を返します。
  * 
  * @param v
  * 除算するベクトル
  * @return 除算されたベクトル
  */
  public Vec2 getDiv(float f) {
    if (f == 0)
    return this;
    return new Vec2(x / f, y / f);
  }
  
  /**
  * ベクトルの長さを返します。
  * 
  * @return このベクトルの長さ
  */
  public float getLength() {
    return (float) Math.sqrt(x * x + y * y);
  }
  
  /**
  * ベクトルを正規化します。 
  
  * 正規化されたベクトルは getLength() == 1 という条件を見たします。
  
  * ただし非常に長さが短いときや、長さが0のときは正しく正規化されません。
  */
  public Vec2 normalize() {
    float length = getLength();
    if (length < 0.0001f)
    length = 1.0f;
    x /= length;
    y /= length;
    return this;
  }
  
  /**
  * 正規化されたベクトルを返します。
  * 
  * @return 正規化されたベクトル
  * @see #normalize()
  */
  public Vec2 getNormalize() {
    float length = getLength();
    if (length < 0.0001f)
    length = 1.0f;
    return new Vec2(x / length, y / length);
  }
  
  /**
  * ベクトルを反転させます。
  */
  public void reverse() {
    x *= -1;
    y *= -1;
  }
  
  /**
  * 反転したベクトルが返されます。
  * 
  * @return 反転されたベクトル
  */
  public Vec2 getReverse() {
    return new Vec2(-x, -y);
  }
  
  /**
  * ベクトルをラジアン角で回転させます。
  
  * 度数からラジアンへの変更は Mathf.toRadians が使えます。
  * 
  * @param radian
  * ラジアン単位の角度
  * @see Mathf#toRadians(float degree)
  */
  public void rotate(float radian) {
    float x2 = (float) (-Math.sin(radian) * y + Math.cos(radian) * x);
    float y2 = (float) (Math.cos(radian) * y + Math.sin(radian) * x);
    x = x2;
    y = y2;
  }
  
  /**
  * ベクトルをラジアン角で回転させた結果を返します。
  
  * 度数からラジアンへの変更は Mathf.toRadians が使えます。
  * 
  * @param radian
  * ラジアン単位の角度
  * @return 回転後のベクトル
  * @see Mathf#toRadians(float degree)
  */
  public Vec2 getRotate(float radian) {
    return new Vec2((float) (-Math.sin(radian) * y + Math.cos(radian) * x),
  (float) (Math.cos(radian) * y + Math.sin(radian) * x));
  }
  
  /**
  * @see Object#clone()
  */
  public Vec2 clone() {
    Vec2 v;
    try {
      v = (Vec2)super.clone();
    } catch (CloneNotSupportedException ce)
    { throw new RuntimeException();}
    
    v.set(x, y);
    
    return v;
  }
  

 
  
  /**
  * 二つのベクトルの内積を返します。
  * 
  * @param v
  * 一つ目のベクトル
  * @param v2
  * 二つ目のベクトル
  * @return 内積
  */
  public float dot(Vec2 v) {
    return x * v.x + y * v.y;
  }
  
  /**
  * 長さの二乗を返します。
  * 
  * @return 長さの二乗
  */
  public float getLengthSquare() {
    return x * x + y * y;
  }
  
  /**
  * 2つの点の距離を返します
  * @param v
  * 相手のベクトル
  * @return 点間の距離
  */  public float distance(Vec2 v){
    return this.getSub(v).getLength();
  }
  /**
  * @see Object#toString()
  */
  public String toString() {
    return "X=" + x + ", Y=" + y;
  }
}
