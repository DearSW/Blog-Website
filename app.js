



var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('blog');

// 生成一个express实例 app, app是一个对象, app.use(),就是使用中间件; app.set(),就是设置参数;
var app = express();

// 路由总接口,路由处理逻辑都在里面
var routes = require('./routes/index');

// var users = require('./routes/users');

// 数据库设置参数,包括了数据库名(blog),主机名(localhost),端口(27017)
// settings 就是一个对象来使用里面的数据
var settings = require("./settings");

// falsh接口
var flash = require("connect-flash");
app.use(flash());

// view engine setup
// 设置 views 文件夹为存放视图文件的目录, 存放ejs模板文件的地方,__dirname 为全局变量,存储当前正在执行的脚本所在的目录,
// 也就是 / 根目录, 也就是 views 目录的父目录
// path.join([path[, ...]]),<String> A sequence of path segments;
app.set('views', path.join(__dirname, 'views')); //  返回 __dirname/views, 相当于设置了 views 的具体路径
app.set('view engine', 'ejs'); // 设置 视图模版引擎 ejs


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); // icon图片的位置

// HTTP请求日志中间件的Node.js
// dev 参数 通过开发使用响应状态着色的简洁输出。：红色的服务器错误代码，黄色为客户端错误代码，重定向代码青色，和无色的所有其他代码。
app.use(logger('dev')); // 加载日志中间件。

// 在您的处理程序之前解析中间件中的传入请求体
app.use(bodyParser.json()); // 加载解析json的中间件。

//
app.use(bodyParser.urlencoded({ extended: false })); // 加载解析urlencoded请求体的中间件。

//
app.use(cookieParser()); // 加载解析cookie的中间件。

// 静态资源处理,此处改变了静态资源的处理路径,提升到了根目录;也就是说在EJS模版上引入外部文件时
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname)));


// session接口,Create a session middleware with the given options.
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);
// session持久化配置
app.use(session({
	secret: settings.cookieSecret,
	key: settings.db,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 30
		// cookie 的有效时间，计算的259,200,000
	},
    // 强制将会话保存回会话存储区，即使在请求中没有修改会话，也可以将其保存到会话存储区中。
    // The default value is true,Typically, you'll want false.
	resave: false,
	saveUninitialized: true,
	store: new MongoStore({
		url: "mongodb://localhost/blog"
	})
}));



// 路由处理；routers是路由处理文件,处理 app 实例
routes(app);


// catch 404 and forward to error handler
// 捕获404错误，并转发到错误处理器。
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
// 开发环境下的错误处理器，将错误信息渲染error模版并显示到浏览器中。
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
// 生产环境下的错误处理器，不会将错误信息泄露给用户。
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


// 导出app实例供其他模块调用。
module.exports = app;

// 变回express3的启动形式
// 设置端口号 3000
app.set('port', process.env.PORT || '3000');
// 监听端口 app.get() 获取设置值
app.listen(app.get('port'), function() {
  console.log('HaHa.......DearSW.Website Start at the port: ' + app.get('port'));
});