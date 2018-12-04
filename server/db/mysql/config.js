//created by limenghui 2018/12/04
const mysql =require('mysql');
//nodejs连接mysql包括直连和连接池连接两种，其中直连是创建一个connection数据库连接对象。而连接池的原理：初始化的时候创建多个连接，放到数组中存起来；当有访问数据的时候，不用再创建连接，直接从连接池取出连接使用进行各种数据库操作，操作关闭后再放回连接池中；连接池会自动管理池中的连接（当访问量少的时候，会自动减少一些连接，当访问量大的时候会自动增加一些连接)
//配置连接参数，包括服务器域名或者ip、数据库帐号密码、数据库端口、数据库名称
const db_config={
    host:"localhost",
    user:"root",
    password:"root",
    port:"3306",
    database:"testdb" 
}
module.exports={
    //直连
    directConnect:()=>{
        return mysql.createConnection(db_config);
    },
    //连接连接池
    poolConnect:()=>{
        return mysql.createPool(db_config);
    }
}

