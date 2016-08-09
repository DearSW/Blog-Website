var mongodb = require("./db");
var markdown = require('markdown').markdown;
function Post(name, title, post) {
	this.name = name;
	this.title = title;
	this.post = post;
}

module.exports = Post;

// 存储一篇文章及其相关信息
Post.prototype.save = function(callback) {
	var date = new Date();
	//存储各种时间格式
	var time = {
		date: date,
		year: date.getFullYear(),
		month: date.getFullYear() + "-" + (date.getMonth() + 1),
		day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
		minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
	};
	// 要存入数据库的文档
	var post = {
		name: this.name,
		time: time,
		title: this.title,
		post: this.post
	};

	// 打开数据库
	mongodb.open(function(err, client) {
		if(err) {
			return callback(err);
		}
		client.collection("post", function(err, collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}
			// 将文档插入post集合
			collection.insert(post, {safe: true}, function(err) {
				mongodb.close();
				if(err) {
					return callback(err);
				}
				callback(null);
			});
		});
	});
};

//读取所有文章信息
Post.prototype.get = function(name, callback) {
	mongodb.open(function(err, client) {
		if(err) {
			return callback(err);
		}
		client.collection("post", function(err, collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}
			var query = {};
			if(name) {
				query.name = name;
			}
			console.log("查看2：" + query.name);
			console.log("查看2.2：" + query);
			collection.find(query).sort({time: -1}).toArray(function(err, docs) {
				mongodb.close();
				if(err) {
					return callback(err);
					console.log("查看4：" + err);
				}
				console.log("查看3：" + docs);
				docs.forEach(function(doc) {
					doc.post = markdown.toHTML(doc.post);
				})
				callback(null, docs);
			
			});
		});
	});
};

// 读取单篇文章
Post.prototype.getOne = function(title, callback) {
	mongodb.open(function(err, client) {
		if(err) {
			return callback(err);
		}
		client.collection("post", function(err, collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}
			collection.findOne({
				"title": title
			}, function(err, doc) {
				mongodb.close();
				if(err) {
					return callback(err);
				}
				doc.post = markdown.toHTML(doc.post);
				callback(null, doc);
			});

		});
	});
};

Post.prototype.edit = function(title, callback) {
	mongodb.open(function(err, client) {
		if(err) {
			return callback(err);
		}

		client.collection('post', function(err, collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}
			collection.findOne({
				"title": title
			}, function(err, doc) {
				mongodb.close();
				if(err) {
					return callback(err);
				}
				callback(null, doc);

			});
		});
	});
};

Post.prototype.update = function(title, post, callback) {
	mongodb.open(function(err, client) {
		if(err) {
			return callback(err);
		}
		client.collection('post', function(err, collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}
			collection.update({
				"title": title
			}, {
				$set: {post: post}
			}, function(err) {
				mongodb.close();
				if(err) {
					return callback(err);
				}
				callback(null);
			});
		});
	});
};

//一次获取十篇文章
Post.prototype.getTen = function(name, page, callback) {
  //打开数据库
  mongodb.open(function (err, client) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    client.collection('post', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      var query = {};
      if (name) {
        query.name = name;
      }
      //使用 count 返回特定查询的文档数 total
      collection.count(query, function (err, total) {
        //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的 10 个结果
        collection.find(query, {
          skip: (page - 1)*3,
          limit: 3
        }).sort({
          time: -1
        }).toArray(function (err, docs) {
          mongodb.close();
          if (err) {
            return callback(err);
          }
          //解析 markdown 为 html
          docs.forEach(function (doc) {
            doc.post = markdown.toHTML(doc.post);
          });  
          callback(null, docs, total);
        });
      });
    });
  });
};