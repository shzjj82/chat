/**
 * Created by 95 on 2016/12/10.
 */
var http=require('http');
var path=require('path');
var express=require('express');
var app=express();
app.use(express.static(path.resolve(__dirname,"public")));
var httpServer=http.createServer(app);
require("./socketserver")(httpServer);
httpServer.listen(3000,function(){
    console.log("服务器正在3000端口上运行....")
});