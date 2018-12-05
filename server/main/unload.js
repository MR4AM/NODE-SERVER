//引入express模块  
var express = require('express');  
//引入multer模块  
var multer = require ('multer');
var path = require('path')  ;
var fs = require('fs');
//设置上传的目录，  

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var _path = path.join(__dirname, "../uploadFile");
        if(!fs.existsSync(_path)){
            fs.mkdirSync(_path);
        }
        cb(null, _path);    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        cb(null, file.originalname);  
    }
});

// // 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({ storage: storage })

var app = express(); 
//跨域处理
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    if(req.method == 'OPTIONS') {
        //让options预请求快速返回
        res.sendStatus(200); 
    } else { 
        next(); 
    }
});
app.use(express.static(path.join(__dirname, '/')));

app.post('/singleUpload', upload.single('photos'), function (req, res, next) {  
    console.log(req.file);  
    console.log(req.body);  
    res.end("上传成功");  
});  

app.post('/mulUpload', upload.array('photos', 12), function (req, res, next) {  
    console.log(req.files);  
    console.log(req.body);  
    res.end("上传成功");  
})

app.listen(88);