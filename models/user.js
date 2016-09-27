

// 数据库 对象
var mongodb = require("./db");

function User(user) {
	this.name = user.name;
	this.password = user.password;
	this.email = user.email;
}

// 关键语句
module.exports = User;

//存储用户信息
User.prototype.save = function(callback) {
	 //要存入数据库的用户文档,取的调用这个save函数这个对象的值
	 var user = {
	 	name: this.name,
	 	password: this.password,
	 	email: this.email
	 };
	 //打开数据库
	 mongodb.open(function(err, client) {
	 	if(err) {
	 		return callback(err);
	 	}
	 	//连接集合，即读取user集合表
	 	client.collection("user", function(err, collection) {
	 		if(err) {
	 			mongodb.close();
	 			return callback(err);
	 		}
	 		//将用户数据插入users组合
	 		collection.insert(user, {safe: true}, function(err, user) {
	 			if(err) {
	 				return callback(err);
	 			}
	 			// user返回的是插入后的ObjectId？
	 			callback(null, user);
	 		});

	 	});
	 });
};

//读取用户信息
User.prototype.get = function(name, callback) {
	//打开数据库
	mongodb.open(function(err, client) {
		if(err) {
			return callback(err);
		}
		//读取users集合
		client.collection("user", function(err, collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}
			collection.findOne({name: name}, function(err, user) {
				mongodb.close();
				if(err) {
					return callback(err);
				}
				// user返回的是
				callback(null, user);
				// 出去其他所有判断，这句回调很美妙！
				// 将匿名回调函数的err设为null，同时
				// 传入user，
				// 所有回调函数是为了处理错误之后怎么办；
			});
		});
	});
};