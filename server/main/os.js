//os 模块提供了一些操作系统相关的实用方法
const os=require('os');
console.log(os.arch(),'检测服务器主机的操作系统CPU架构');
console.log(os.cpus(),'检测cpu内核信息');
console.log(os.homedir(),os.hostname(),'检测当前用户的home目录');
console.log(os.networkInterfaces(),'检测网络地址的网络接口')