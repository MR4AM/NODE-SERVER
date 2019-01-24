//node层利用socket.io模块为web端提供长连接通信。我们在node层创建定义一个socke连接，然后可以将这项服务进程添加到forever进程中，在web端建立连接
//SocketIO提供on和emit两种形式以事件的方式进行消息接收和推送，只要确定web端和node层触发的是同一个事件，并且这个事件在通信两端形成一个闭环，也就是on
//和emit方式同时存在。
const jstools=require('../utils/jstool');
module.exports={
    startio(io){
        io.on('connection',(client)=>{
            console.log(`id为${client.id}的用户连接服务端成功`);
            // console.log(`连接服务端成功${jstools.formatTime(new Date())}`);
            
            // 接收来自客户端的信息
            client.on('onmessage',(_mess)=>{
                console.log(`id为${client.id}的用户向客户端发送了消息${_mess}`,)
                // console.log(`id为${client.id}的用户于${jstools.formatTime(new Date())}向客户端发送了消息${_mess}`,)
                 // 将信息推送到各客户端
                 io.emit('onsend',_mess,client.id);
            })
        })
    }
}