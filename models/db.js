
// mongodb 数据库的连接封装

var settings = require("../settings");
var Db = require("mongodb").Db,
	Connection = require("mongodb").Connection,
	Server = require("mongodb").Server;

// 暴露出 数据库实例, 赋值给一个对象
module.exports = new Db(settings.db,new Server(settings.host,settings.port),{ safe: true });
// 其中通过 new Db(settings.db, 
// new Server(settings.host, settings.port), {safe: true}); 
// 设置数据库名、数据库地址和数据库端口创建了一个数据库连接实例，
// 并通过 module.exports 导出该实例。
// 
// server 是创建MongoDB服务器，Db是数据库操作对象；