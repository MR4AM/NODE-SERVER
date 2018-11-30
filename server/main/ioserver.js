
module.exports={
     //时间格式化
     formatTime(time, cFormat) {
        if (arguments.length === 0) return null
        if ((time + '').length === 10) {
            time = +time * 1000
        }

        var format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}', date
        if (typeof time === 'object') {
            date = time
        } else {
            date = new Date(time)
        }

        var formatObj = {
            y: date.getFullYear(),
            m: date.getMonth() + 1,
            d: date.getDate(),
            h: date.getHours(),
            i: date.getMinutes(),
            s: date.getSeconds(),
            a: date.getDay()
        }
        var time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
            var value = formatObj[key]
            if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
            if (result.length > 0 && value < 10) {
                value = '0' + value
            }
            return value || 0
        })
        return time_str
    },

    startio(io){
        io.on('connection',(client)=>{
            console.log(`连接服务端成功${this.formatTime(new Date())}`);
            // 接收来自客户端的信息
            client.on('onmessage',(_mess)=>{
                console.log(`id为${client.id}的用户于${this.formatTime(new Date())}向客户端发送了消息${_mess}`,)
                 // 将信息推送到各客户端
                 io.emit('onsend',_mess);
            })
        })
    }
}