const dns = require('dns');//域名解析
const zlib = require('zlib');//文件压缩
const gzip = zlib.createGzip();
const fs = require('fs');
// const inp = fs.createReadStream('input.txt');
// const out = fs.createWriteStream('input.txt.gz');


module.exports={
    dns(){
        dns.lookup('iana.org', (err, address, family) => {
            console.log(`IP 地址:${address} 地址族: IPv${family}`);
        });
        // inp.pipe(gzip).pipe(out);
    },
    dns2(){
        dns.resolve4('archive.org', (err, addresses) => {
            if (err) throw err;
          
            console.log(`IP 地址: ${JSON.stringify(addresses)}`);
          
            addresses.forEach((a) => {
              dns.reverse(a, (err, hostnames) => {
                if (err) {
                  throw err;
                }
                console.log(`IP 地址 ${a} 逆向解析到域名: ${JSON.stringify(hostnames)}`);
              });
            });
          });
    }
}