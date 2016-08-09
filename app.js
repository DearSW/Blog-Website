var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('blog');

// 生成实例
var app = express();

// 路由总接口
var routes = require('./routes/index');
// var users = require('./routes/users');

// 数据库接口
var settings = require("./settings");

// falsh接口
var flash = require("connect-flash");
app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// 静态资源处理
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname)));


//session接口
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);
app.use(session({//session持久化配置
	secret: settings.cookieSecret,
	key: settings.db,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 30
		//超时时间，计算的259,200,000
	},
	resave: false,
	saveUninitialized: true,
	store: new MongoStore({
		url: "mongodb://localhost/blog"
	})
}));



//路由处理；
routes(app);

// app.use('/', routes);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
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
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


// module.exports = app;

//变回express3的启动形式
app.set('port', process.env.PORT || '3000');
app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});