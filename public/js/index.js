
 $(function(){
            var images=$('#box').find('img');
            var clientsocket=io();
            var date=new Date()
            $('#box').hide();
            $('#chat').hide();
            $('#icon_btn').on("click",function(){
                $('#box').slideDown();
                images.on("click",function(){
                    $('#box').fadeOut();
                    ($('#icon')).html("");
                    var iconImg=$(this).clone();
                    iconImg.appendTo($('#icon'));
                });
            });
            $('#icon').on("click",function(){
                $('#icon_btn').click();
            });
            $('#btn').on("click",function(){
                var nickname=$('#nickname').val();
                var sex=$('input[name="sex"]:checked').val();
                var img=$('#icon').find('img').attr("src");
                var msg={
                    type:"101",
                    nickname:nickname,
                    sex:sex,
                    img:img
                };
                if(nickname==""||nickname=="请输入合法用户名"){
                    $('#nickname').val("请输入合法用户名");
                    return false;
                }else if(img==undefined){
                    alert("请选择头像@_@");
                    return false;
                }else {
                    clientsocket.send(msg);
                }
                $('#enter_btn').on('click',function(){
                    var chatmsg=$('#enter').val();
                    if(chatmsg==""){
                        $('#enter').attr("placeholder","请发送正确的内容");
                        return;
                    }
                    var message={
                        type:"201",
                        chatmsg:chatmsg,
                        nickname:nickname,
                        img:img
                    };
                    clientsocket.send(message);
                    $('#enter').attr("placeholder","");
                    $('#enter').val("");
                });
                $("#enter").on("keyup",function(e){
                    if(e.keyCode == 13){
                        $("#enter_btn").click();
                    }
                });
                clientsocket.on("message",function(data){
                    var type=data.type;
                    switch (type){
                        case "100":
                            handelselfLogin(data);
                            break;
                        case "101":
                            handelUserLogin(data);
                            break;
                        case "200":
                            handelselfChat(data);
                            break;
                        case "201":
                            handelUserchat(data);
                            break;
                        case "102":
                            handelleavechat(data);
                            break;
                    }
                });
                function handelselfLogin(data){
                    $('#loginbox').hide();
                    $('#chat').fadeIn(800);
                    var status="";
                    for(var i=0;i<data.arr.length;i++){
                  status+='<div class="status"><img class="small" src="'+data.arr[i][2]+'">　ID:'+data.arr[i][0]+'<span class="'+data.arr[i][1]+'"></span><a href="javascript:;" class="more" name="'+data.arr[i][0]+'">[　详情　]</a></div>';
                    }
                    $('#status_connet').html(status);
                    $('#title').html('<div>当前在线人数　'+data.arr.length+'　人</div>');
                    var content="<div class='system'>登录成功,请文明聊天</div>";
                    $('#chat_content').append(content);
                    $('.more').on("click",function(){
                        var private=$(this).attr("name");
                        $('#chat_content').append('<div class="system">你正在与'+private+'聊天</div>');
                    });
                    scroll();
                }
                function handelUserLogin(data){
                    var status="";
                    for(var i=0;i<data.arr.length;i++){
                        status+='<div class="status"><img class="small" src="'+data.arr[i][2]+'">　ID:'+data.arr[i][0]+'<span class="'+data.arr[i][1]+'"></span><a href="javascript:;" class="more" name="'+data.arr[i][0]+'">[　详情　]</a></div>';
                    }
                    $('#status_connet').html(status);
                    $('#title').html('<div>当前在线人数　'+data.arr.length+'　人</div>');
                    var content="'<div class='system'>欢迎"+data.nickname+"加入聊天室</div>";
                    $('#chat_content').append(content);
                    $('.more').on("click",function(){
                        var private=$(this).attr("name");
                        alert(private);
                        return false;
                    });
                    scroll();
                }
                function handelselfChat(data){
                    var msg='<div class="clearfix chatmsg"><div class="right"><div class="my"><img src="'+data.img+'"><span>'+data.nickname+'</span></div>';
                    msg+='<div class="text2 clearfix"><p><i>'+data.date+'</i>'+data.chatmsg+'</p></div></div></div>';
                    $('#chat_content').append(msg);
                    scroll();
                }
                function handelUserchat(data){
                   var msg='<div class="clearfix chatmsg"><div class="left"><div class="yours"><img src="'+data.img+'"><span>'+data.nickname+'</span></div>';
                   msg+='<div class="text1 clearfix"><p><i>'+data.date+'</i>'+data.chatmsg+'</p></div></div></div>';
                    $('#chat_content').append(msg);
                    scroll();
                }
                function handelleavechat(data){
                    var status="";
                    for(var i=0;i<data.arr.length;i++){
                        status+='<div class="status"><img class="small" src="'+data.arr[i][2]+'">　ID:'+data.arr[i][0]+'<span class="'+data.arr[i][1]+'"></span></div>';
                    };
                    $('#status_connet').html(status);
                    var content="'<div class='system'>"+data.nickname+"离开聊天室</div>";
                    $('#chat_content').append(content);
                    scroll();
                }
                function scroll(){
                    $("#chat_content").scrollTop($("#chat_content").prop("scrollHeight"));
                }
            });
        });