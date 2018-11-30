const dns = require('dns');//域名解析
const zlib = require('zlib');//文件压缩
const gzip = zlib.createGzip();
const fs = require('fs');
const inp = fs.createReadStream('input.txt');
const out = fs.createWriteStream('input.txt.gz');


module.exports={
    dns(){
        dns.lookup('iana.org', (err, address, family) => {
            console.log(`IP 地址:${address} 地址族: IPv${family}`);
        });
        inp.pipe(gzip).pipe(out);
    }
}