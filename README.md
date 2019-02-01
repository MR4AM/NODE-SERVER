# NODE-SERVER
node作为服务层创建服务、连接数据库、对数据库进行增删查改、使用fs文件模块、websocket通信长连接、cheerio及superagent解析基础网页结构进行基础网页清洗及craw操作。
> node层常用的进程管理器的有forever和pm2,远程部署项目的时候需要将项目变成远程服务主机的进程。
## pm2 模块
- pm2 的功能较forever更完善
### pm2 安装运行
- npm install pm2 -g 主机全局配置pm2
- pm2 start app.js 在项目入口文件根目录下运行app.js
- pm2 list 查看运用的进程数及cpu占比占用内存memory等常规参数
- pm2 monit 追踪资源运行情况
- pm2 describe 0 这里最后一个参数代表是pm2 list 进程对应的id，通过对应id找到查看应用详细部署状态
- pm2 log 查看服务日志输出
- pm2 stop app.js  在项目入口文件根目录下结束进程
> pm2 进行日志分割管理
- pm2 install pm2-logrotate 安装pm2日志分割模块
> 具体分割指令
- pm2 set pm2-logrotate:retain 7
- pm2 set pm2-logrotate:compress false 
- pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss 
- pm2 set pm2-logrotate:max_size 10M 
- pm2 set pm2-logrotate:retain 7 
- pm2 set pm2-logrotate:rotateInterval '0 0 * * * '
- pm2 set pm2-logrotate:rotateModule true 
- pm2 set pm2-logrotate:workerInterval 30  
> 详细配置参考至 https://www.jianshu.com/p/fdc12d82b661
## forever模块
- forever可以看做是一个nodejs的守护进程，能够启动，停止，重启我们的app应用。在forever进程之下，创建一个node app的子进程
### forever安装
- npm install -g forever//全局安装
- cd /path/to/your/project//进入对应的项目目录文件
- npm install forever-monitor//在项目中安装forever模块镜像
- forever start app.js//启动主服务文件，使其成为一项进程
- forever start -l forever.log app.js//指定forever信息输出文件
- forever start -o out.log -e err.log app.js//指定app.js中的日志信息和错误日志输出文件，-o 就是console.log输出的信息，-e 就是console.error输出的信息
- forever start -l forever.log -a app.js//追加日志，forever默认是不能覆盖上次的启动日志，所以如果第二次启动不加-a，则会不让运行
- forever start -w app.js//监听当前文件夹下的所有文件改动
- forever list//显示所有运行的服务进程
- forever stopall//暂停所有服务进程
- forever stop app.js 或 forever stop [id]//暂停某个服务进程
- forever restartall//重启所有服务
## socket.io模块
- node层利用socket.io模块为web端提供长连接通信。我们在node层创建定义一个socke连接，然后可以将这项服务进程添加到forever进程中，在web端建立连接。
SocketIO提供on和emit两种形式以事件的方式进行消息接收和推送，只要确定web端和node层触发的是同一个事件，并且这个事件在通信两端形成一个闭环，也就是on
和emit方式同时存在。
## superagent和cheeio模块实现基本的网页爬取和页面清洗
- 目标：nodejs实现基本的数据爬取并将数据进行存储，以爬取网页图片为例
- 思路：nodejs的语法结构类似js,对于前端还是非常有好的，提供了较多的模块可以连接服务层和解决js所无法实现的读写权限。该方法较简略，整合了网上nodejs初步爬虫的大体思路方法。
- 1.首先，确定爬取网站的的网页地址url http://www.ivsky.com/tupian/
- 2.利用http模块向该网站发起服务请求，获取响应信息。
- 3.利用cheerio选择器模块解析请求回来的页面DOM结构，并利用正则将所需的页面信息截取成对应的数据结构，将数据结构返回到数据库中进行存储。
- 4.利用fs模块解析数据结构并存储到本地。
## fs模块
- fs模块用于对系统文件及目录进行读写操作
### readFile读取文件
- fs.readFile(filename,[option],callback) 方法读取文件。
### WriteFile写入文件
- 使用fs.writeFile(filename,data,[options],callback)写入内容到文件。
### 使用fs.read和fs.write读写文件
- fs.read和fs.write功能类似fs.readFile和fs.writeFile()，但提供更底层的操作，实际应用中多用fs.readFile和fs.writeFile。
- 使用fs.read和fs.write读写文件需要使用fs.open打开文件和fs.close关闭文件。
