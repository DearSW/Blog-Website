


// 获取 mongodb 数据库实例, mongodb 为一个对象;
var mongodb = require("./db");

// 获取 markdown 模块,使用它来处理文档;
var markdown = require('markdown').markdown;

// 定义 Post 构造函数,
/***
 *
 * @param name 作者姓名
 * @param title 文章标题
 * @param post 文章内容
 * @constructor 构造函数
 */
function Post(name, title, post) {

    // this 指向对象实例
	this.name = name;
	this.title = title;
	this.post = post;
}

// 暴露 Post 构造函数给其他模块使用, 比如 路由控制模块 index.js
module.exports = Post;


// 存储一篇文章及其相关信息
// 在原型链上定义一个函数 save, 保存一篇文章
// callback 是回调函数, 在 路由控制模块中有定义;
Post.prototype.save = function(callback) {

    // 获取当前时间,一起存入数据库
	var date = new Date();
	// 需要存储的各种时间格式,方便拓展,分好几类
	var time = {
		date: date,
		year: date.getFullYear(),
		month: date.getFullYear() + "-" + (date.getMonth() + 1),
		day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
		minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
	};

	// 要存入数据库的文档
	var post = {
		name: this.name, // 实例中的作者姓名
		time: time, // 时间
		title: this.title, // 实例中的文章标题
		post: this.post // 实例中的文章内容
	};

	// mongodb 是数据库实例对象, 使用 open 方法打开数据库;
    // err 是错误, client 是客户端
	mongodb.open(function(err, client) {

        // 如果发现错误,就返回一个 回调函数 ,并结束;
		if(err) {
			return callback(err);
		}

        // 客户端进行连接 , 使用 collection()方法, 集合方法; 第一个参数是 集合 , 第二个是函数
		client.collection("post", function(err, collection) {
            // err 是错误, collection 是集合句柄,其中包含了许多操作在其中的文档的方法;
            // 发生错误,就关闭数据库,返回回调函数
			if(err) {
				mongodb.close();
				return callback(err);
			}

			// 将文档插入post集合,集合句柄的insert()方法, collection.insert(document,options[,callback]) 插入一篇文档,
            // 如果需要执行 回调函数,则必须要设置 options 为
            // { safe: true }
			collection.insert(post, {safe: true}, function(err) {
                // 此时插入已完毕,可以结束数据库的连接了;
				mongodb.close();
				if(err) {
					return callback(err);
				}

                // 执行回调函数
				callback(null);
			});
		});
	});
};

// 读取所有文章信息
// name是作者信息,读取作者相关的所有信息
Post.prototype.get = function(name, callback) {
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
			var query = {};
			if(name) {
				query.name = name;
			}
			console.log("查看2：" + query.name);
			console.log("查看2.2：" + query);

            // 集合句柄 find() 方法, find(query,[fields],options), 返回一个Cursor对象,该对象可以附加查询条件,就是链式调用
            // 例如 sort、limit、each、toArray等等
            // 排序、将结果转换成数组
			collection.find(query).sort({time: -1}).toArray(function(err, docs) {
                // 回调函数的第二个参数 docs 是返回的结果
				mongodb.close();
				if(err) {
					return callback(err);
				}
				//console.log("查看3：" + docs);

                // 由于结果被转换了数组,所以使用 数组的forEach()方法,循环处理每个文档
				docs.forEach(function(doc) {
                    // doc 为单个文档, 将文档内容使用 markdown 来处理
					doc.post = markdown.toHTML(doc.post);
				});
                // 执行回调函数,并将 文档集合传入其中,方便外面使用;
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

// 编辑文章 先读取出来
// title 文章标题
Post.prototype.edit = function(title, callback) {

    // 直接打开数据库
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


// 更新文章 编辑好之后,再存进去
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
            // 更新句柄
			collection.update({
				"title": title
			}, {
                // 这个是需要更新的数据
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