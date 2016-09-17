// var express = require('express');
// var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;
var crypto = require("crypto");
var User = require("../models/user.js");
var Post = require("../models/post.js");
var path = require("path");
var multer = require('multer');
/**
 * 取出一个object的所有属性值
 * @param  {object} obj 可以是一个object
 * @return {string}     包含结果的字符串
 */
function writeObj(obj) { 
	var description = ""; 
	for(var i in obj) { 
		var property = obj[i]; 
		description += i + " = " + property + "--"; 
	 }
 	return description;
} 
/**
 * 路由中间件
 * 检测登录状态
 */
function checkLogin(req, res, next) {
	if(!req.session.user) {
		req.flash("error", "未登录");
		res.redirect("/login");
	}
	next();
}

function checkNotLogin(req, res, next) {
	if(req.session.user) {
		req.flash("error", "已登录");
		res.redirect("back");
	}
	next();
}

module.exports = function(app) {

	//-----------------------------------------------------
	// 首页,动态的页面
	app.get("/", function(req, res, next) {
		var page = parseInt(req.query.p) || 1;
		Post.prototype.getTen(null, page, function (err, posts, total) {
		    if (err) {
		      	posts = [];
		    } 
		    res.render('index2', {
			    title: '主页',
			    posts: posts,
			    page: page,
			    isFirstPage: (page - 1) == 0,
			    isLastPage: ((page - 1) * 3 + posts.length) == total,
			    user: req.session.user,
			    success: req.flash('success').toString(),
			    error: req.flash('error').toString()
		    });
	  	});
	});


	//---------------------------------------------------
	//关于about
	app.get("/about", function(req, res, next) {
		res.render("about2", {
			user: req.session.user,
			success: req.flash("success").toString(),
			error: req.flash("error").toString()
		});
	});



	//--------------------------------------------------
	//文章 article

		//读取所有文章
        app.get("/articles", function(req, res, next) {
            Post.prototype.get(null, function(err, posts) {
                if(err) {
                    console.log("查看1：" + err);
                    posts = [];
                    req.flash("error", "没有找到");
                    //查询失败任然展示页面
                    res.render("article2", {
                        title: "主页",
                        posts: posts,
                        user: req.session.user,
                        success: req.flash("success").toString(),
                        error: req.flash("error").toString()
                    });
                }

                console.log("查看6：" + writeObj(posts));
                res.render("article2", {
                    title: "主页",
                    posts: posts,
                    user: req.session.user,
                    success: req.flash("success").toString(),
                    error: req.flash("error").toString()
                });

            });
        });
		//读取一篇文章
        app.get("/articleSearch/:title", function(req, res, next) {
            Post.prototype.getOne(req.params.title, function(err, post) {
                if(err) {
                    req.flash('error', err);
                    return res.redirect('/');
                }
                res.render('article', {
                    title: req.params.title,
                    post: post,
                    user: req.session.user,
                    success: req.flash('success').toString(),
                    error: req.flash('error').toString()
                });
            });
        });
		//编辑
        app.get('/edit/:title', checkLogin);
        app.get('/edit/:title', function(req, res, next) {
            var currentUser = req.session.user;
            Post.prototype.edit(req.params.title, function(err, post) {
                if(err) {
                    req.flash('error', err);
                    return res.redirect('back');
                }
                res.render('edit', {
                    title: '编辑',
                    post: post,
                    user: req.session.user,
                    success: req.flash('success').toString(),
                    error: req.flash('error').toString()
                });
            });
        });
        app.post('/edit/:title', checkLogin);
        app.post('/edit/:title', function (req, res) {
            var currentUser = req.session.user;
            Post.prototype.update(req.params.title, req.body.post, function (err) {
                var url = encodeURI('/articleSearch/' + req.params.title);
                if (err) {
                    req.flash('error', "修改失败！");
                    return res.redirect(url);//出错！返回文章页
                }
                req.flash('success', '修改成功!');
                res.redirect(url);//成功！返回文章页
            });
        });

	//-------------------------------------------------------
	//测试
	app.get("/test", function(req, res, next) {
		res.sendFile("login-1.html", { root: path.join(__dirname, "../html")});
	});
	//------------------------------------------------
	// 登录
	app.get("/login", checkNotLogin);
	app.get("/login", function(req, res, next) {
		res.render("login", {
			title: "登录",
			user: req.session.user,
			success: req.flash("success").toString(),
			error: req.flash("error").toString()
		});
	});

	app.post("/login", checkNotLogin);
	app.post("/login", function(req, res, next) {
		// createHash创建hash加密对象，update是加密字符串，digest是返回hex类型的加密字符串
		var md5 = crypto.createHash("md5"),
			password = md5.update(req.body.password).digest("hex");

		//检测用户是否存在
		User.prototype.get(req.body.name, function(err, user) {
			console.log("登录时，get获得的user：" + user);
			console.log(writeObj(user));
			if(!user) {
				req.flash("error", "用户不存在！");
				return res.redirect("/login");
			}
			//检查密码是否一致
			if(user.password != password) {
				req.flash("error","密码错误！");
				console.log(user.password + "||" + password);
				return res.redirect("/login");
			}
			//都匹配时，将用户信息存入session
			req.session.user = user;
			req.flash("success", "登录成功！");
			res.redirect("/");

		});

	});
	//---------------------------------------------------
	// 注销
	app.get("/logout", checkLogin);
	app.get("/logout", function(req, res) {
		req.session.user = null;
		req.flash("success","注销成功！");
		res.redirect("/");
	})
	//-------------------------------------------------
	//上传
	var storage = multer.diskStorage({
	    destination: function (req, file, cb){
	        cb(null, '../public/imgs')
	    },
	    filename: function (req, file, cb){
	        cb(null, file.originalname)
	    }
	});
	var upload = multer({
	    storage: storage
	});
	app.get('/upload', checkLogin);
	app.get('/upload', function(req, res, next) {
		res.render('upload', {
			title: '文件上传',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
	app.post('/upload', checkLogin);
	app.post('/upload', upload.array('field1', 5), function (req, res) {
  		req.flash('success', '文件上传成功!');
  		res.redirect('/upload');
	});
	//--------------------------------------------------------
	// 注册
	app.get("/reg", checkNotLogin);
	app.get("/reg", function(req, res, next) {
		res.render("reg",{
			title: "注册",
			user: req.session.user,
		    success: req.flash('success').toString(),
		    error: req.flash('error').toString()
		});
	});
	// 注册页面提交数据时会触发下面这个路由规则
	app.post("/reg", checkNotLogin);
	app.post("/reg", function(req, res, next) {
		var name = req.body.name,
			password = req.body.password,
			password_re = req.body["password-repeat"];
		if (password_re != password) {
			req.flash("error", "两次输入的密码不一致！");
			return res.redirect("/reg");
		}

		// 生成MD5值
		var md5 = crypto.createHash("md5"),
			password = md5.update(req.body.password).digest("hex");
		//传入数据并调用构造函数User方法
		var newUser = new User({
			name: name,
			password: password,
			email: req.body.email
		});
		//检测用户名
		newUser.get(newUser.name, function(err, user) {
			console.log("注册时，get获得的user：" + user);
			console.log(writeObj(user));
			if (err) {
				req.flash("error",err);
				return res.redirect("/");
			}
			if(user) {
				req.flash("error","用户已存在！");
				return res.redirect("/reg");
			}
			// 如果不存在则新增用户
			newUser.save(function (err, user) {
				console.log("注册时，save获得的user：" + user);
				console.log(writeObj(user));
				if(err) {
					req.flash("error", user);
					return res.redirect("/reg");
				}
				req.session.user = newUser;
				console.log(user + "||" + req.session.user);
				//用户信息存入session
				req.flash("success","注册成功！");
				res.redirect("/");
			});
		});
	});

	//--------------------------------------------------
	// 发表文章
	app.get("/post", checkLogin);
	app.get("/post", function(req, res, next) {
		res.render("post", {
			title: "发表文章",
			user: req.session.user,
			success: req.flash("success").toString(),
			error: req.flash("error").toString()
		});
	});
	
	app.post("/post", checkLogin);
	app.post("/post", function(req, res) {
		var currentUser = req.session.user;
		var post = new Post(currentUser.name, req.body.title, req.body.post);
		post.save(function(err) {
			if(err) {
				req.flash("error", err);
				return res.redirect("/"); 
			}
			req.flash("success", "发布成功！");
			res.redirect("/");

		});
	});
};	//----------------------------------------------------


















