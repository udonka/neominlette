var Wheel = require('./common/wheel').Wheel;
var CountDownTimer = require('./common/countdowntimer').CountDownTimer;

if(typeof window == "undefined"){
  //require
}


var Room = function(roomid, sio){
  var this_room = this;
  this_room.id = roomid;

  this_room.sio = sio;
  this_room.wheel = new Wheel(0,0,["", "", ""]);
  this_room.countDownTimer = new CountDownTimer();
  this_room.stopTime = 0;

  this_room.countDownTimer = new CountDownTimer(
    0,//0まだはじめないのでcountは0にしとく
    function(count){ //tick
      if(count <= this_room.stopTime){
        console.log("STOP TIME!!!!");
        this_room.wheel.setMovable(false);
        this_room.sio.in(this_room.id).emit('timer', {count: count , stop:true});

        return ;
      }
      this_room.sio.in(this_room.id).emit('timer', {count: count ,stop:false});
    },
    function(){ //finished
      this_room.wheel.setMovable(false);
    }
  );
}

Room.prototype.startCountDown = function(count){
  var this_room = this;  

  //if started, doesn't restart
  if(this_room.countDownTimer.working()){
    console.log("timer is already working");
    return ;
  }

  this_room.stopTime = Math.floor(Math.random() * 10);
  console.log("stopTime " +  this_room.stopTime );

  this_room.countDownTimer.start(count);
}


Room.prototype.getMembers = function(){
  
  var room_members = this.sio.sockets.adapter.rooms[this.id];

  var member_sockets = [];
  //部屋が存在しなければundefined
  if(room_members){
    for(socketid in room_members){
      member_sockets.push(this.sio.sockets.connected[socketid])
    }
  }

  return member_sockets;
}

//部屋のメンバーを見せる
Room.prototype.showMembers = function(){

  console.log("your room mates [" + this.id + "] are");
  var members = this.getMembers();

  if(members){
    for(i in members){
      console.log("\t" + i + ": <" + 
          members[i].id.slice(0,4)+">");
    }
  }
  else{
    console.log("no members in room [" +this.id+ "]");
  }
}

Room.prototype.emitMembers = function(){

  var member_sockets = this.getMembers();
  var members_array = {};

  for(i in member_sockets){
    var member_socket = member_sockets[i];
    members_array[member_socket.client.id] = {
      hue : id2hue(member_socket.client.id),
      mp : member_socket.mp
    }
  }

  this.sio.in(this.id).emit('members',
      {members: members_array});

}

Room.prototype.addMp= function(mp){
      //share mp to room members
      //
      //mp should be number;
      
      var members_socket = this.getMembers();
      for(i in members_socket){
        members_socket[i].mp += mp;
      }
};


function id2hue(idstr){

  var sum = 0;
  for(i = 0; i < idstr.length; i++){

    sum += idstr.charCodeAt(i);
  }

  var hue = sum % 24;

  return hue /24  * 360;
}

this['Room'] = Room;
this['id2hue'] = id2hue;

