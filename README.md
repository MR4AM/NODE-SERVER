# NODE-SERVER
node作为服务层创建服务、连接数据库、对数据库进行增删查改、使用fs文件模块、websocket通信长连接、cheerio及superagent解析基础网页结构进行基础网页清洗及craw操作。
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
