/**
 * Created by 95 on 2016/12/10.
 */
var socketIO=require('socket.io');
module.exports=function(httpServer){
    var arr=[];
    var socketserver=socketIO.listen(httpServer);
    socketserver.on("connect",function(socket){
        console.log("正在连接的用户ID"+socket.id);
        socket.on("message",function(data){
            var type=data.type;
            switch (type){
                case "101":
                    handleUserLogin(socket,data);
                    break;
                case "201":
                    handleChatMsg(socket,data);
                    break;
            }
        });
        socket.on("disconnect",function(){
            arr.pop([socket.nickname,socket.sex,socket.img]);
            var msg={
                type:"102",
                nickname:socket.nickname,
                arr:arr
            };
            socket.broadcast.send(msg);

        });
    });
    function handleUserLogin(socket,data){
        socket.sex=data.sex;
        socket.img=data.img;
        socket.nickname=data.nickname;
        arr.push([data.nickname,data.sex,data.img]);
        var connect={
            type:"101",
            nickname:socket.nickname,
            sex:socket.sex,
            img:socket.img,
            arr:arr
        };
        socket.broadcast.send(connect);
        connect.type="100";
        socket.send(connect);
    }
    function handleChatMsg(socket,data){
        var date=new Date();
        socket.chatmsg=data.chatmsg;
        socket.nickname=data.nickname;
        socket.img=data.img;
        var message={
            type:"201",
            chatmsg:socket.chatmsg,
            img:socket.img,
            nickname:socket.nickname,
            date:date.toLocaleString()
        };
        socket.broadcast.send(message);
        message.type="200";
        socket.send(message);
    }
};