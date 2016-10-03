

var crypto = require("crypto");
var User = require("../models/user.js");

// 获取文章对象
var Post = require("../models/post.js");

var path = require("path");

var multer = require('multer');



// 将路由控制模块暴露出去
module.exports = function(app) {

    // 首页
    app.get("/", function (req, res, next) {

        // 如果 请求信息 req 携带有查询参数,则使用,否则就默认为 1;
        var page = parseInt(req.query.p) || 1;
        // 调用 Post 实例的原型方法, 获取十篇文章
        // Post.prototype.getTen = function(name, page, callback) {};
        // callback(null, docs, total);
        Post.prototype.getTen(null, page, function (err, posts, total) {

            // function 为回调函数, posts 是数据库返回的文档, total 是总数量;
            if (err) {
                posts = [];
            }

            // 响应信息的渲染,第一个参数为ejs页面模版,第二个为传入这个模版的参数,一段json数据;
            res.render('index', {
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
    app.get("/about", function (req, res, next) {
        res.render("about", {
            user: req.session.user,
            success: req.flash("success").toString(),
            error: req.flash("error").toString()
        });
    });


    // -------------------------------------------------
    app.get('/resume', function (req, res, next) {
        res.render('resume');
    });

    //--------------------------------------------------
    // 文章 article

    // 读取所有文章, req 是请求信息, res 是响应信息, next 是回调函数, 位置是固定的;
    // get() 有两个参数, 第一个为路由,第二个为 回调函数;
    app.get("/articles", function (req, res, next) {
        Post.prototype.get(null, function (err, posts) {
            if (err) {
                posts = [];
                req.flash("error", "没有找到");
                //查询失败任然展示页面
                res.render("article", {
                    title: "主页",
                    posts: posts,
                    user: req.session.user,
                    success: req.flash("success").toString(),
                    error: req.flash("error").toString()
                });
            }
            res.render("article", {
                title: "主页",
                posts: posts,
                user: req.session.user,
                success: req.flash("success").toString(),
                error: req.flash("error").toString()
            });

        });
    });


    // --------------------------------------------------------
    // --------------------------------------------------------
    // --------------------------------------------------------
    // --------------------------------------------------------
    // --------------------------------------------------------
    // --------------------------------------------------------
    // --------------------------------------------------------
    // --------------------------------------------------------
    // --------------------------------------------------------
    // 后台页面-------------------------------------------------


    // 后台主页,主要是进入后台管理界面
    app.get('/backend', function (req, res) {
        /*res.render('backend_index', {
            title: '主页',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        })*/
        // 如果 请求信息 req 携带有查询参数,则使用,否则就默认为 1;
        var page = parseInt(req.query.p) || 1;
        // 调用 Post 实例的原型方法, 获取十篇文章
        // Post.prototype.getTen = function(name, page, callback) {};
        // callback(null, docs, total);
        Post.prototype.getTen(null, page, function (err, posts, total) {

            // function 为回调函数, posts 是数据库返回的文档, total 是总数量;
            if (err) {
                posts = [];
            }

            // 响应信息的渲染,第一个参数为ejs页面模版,第二个为传入这个模版的参数,一段json数据;
            res.render('backend_index', {
                title: '概览',
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

    // 后台 注册
    app.get('/reg', checkNotLogin);
    app.get('/reg', function (req, res) {
        res.render('backend_reg', {
            title: '注册',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.post('/reg', checkNotLogin);
    app.post('/reg', function (req, res) {
        var name = req.body.name,
            password = req.body.password,
            password_re = req.body['password-repeat'];
        //检验用户两次输入的密码是否一致
        if (password_re != password) {
            req.flash('error', '两次输入的密码不一致!');
            return res.redirect('/reg');//返回主册页
        }
        //生成密码的 md5 值
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        var newUser = new User({
            name: req.body.name,
            password: password,
            email: req.body.email
        });
        //检查用户名是否已经存在
        User.prototype.get(newUser.name, function (err, user) {
            if (user) {
                req.flash('error', '用户已存在!');
                return res.redirect('/reg');//返回注册页
            }
            //如果不存在则新增用户
            newUser.save(function (err, user) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/reg');//注册失败返回注册页
                }
                req.session.user = user;//用户信息存入 session
                req.flash('success', '注册成功!');
                res.redirect('/backend');//注册成功后返回后台主页
            });
        });
    });


    // 后台 登录
    app.get('/login', checkNotLogin);
    app.get('/login', function (req, res) {
        res.render('backend_login', {
            title: '登录',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.post('/login', checkNotLogin);
    app.post('/login', function (req, res) {
        //生成密码的 md5 值
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        //检查用户是否存在
        User.prototype.get(req.body.name, function (err, user) {
            if (!user) {
                req.flash('error', '用户不存在!');
                return res.redirect('/login');//用户不存在则跳转到登录页
            }
            //检查密码是否一致
            if (user.password != password) {
                req.flash('error', '密码错误!');
                return res.redirect('/login');//密码错误则跳转到登录页
            }
            //用户名密码都匹配后，将用户信息存入 session
            req.session.user = user;
            req.flash('success', '登陆成功!');
            res.redirect('/backend');//登陆成功后跳转到主页
        });
    });

    // 后台 文章发表
    app.get('/post', checkLogin);
    app.get('/post', function (req, res) {
        res.render('backend_post', {
            title: '发表',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.post("/post", checkLogin);
    app.post("/post", function (req, res) {
        var currentUser = req.session.user;
        var post = new Post(currentUser.name, req.body.title, req.body.post);
        post.save(function (err) {
            if (err) {
                req.flash("error", err);
                return res.redirect("/backend");
            }
            req.flash("success", "发布成功！");
            res.redirect("/backend");

        });
    });


    // 后台 注销
    app.get('/logout', checkLogin);
    app.get('/logout', function (req, res) {
        req.session.user = null;
        req.flash('success', '登出成功!');
        res.redirect('/backend');//登出成功后跳转到主页
    });


    // 编辑
    app.get('/edit/:title', checkLogin);
    app.get('/edit/:title', function(req, res, next) {
        var currentUser = req.session.user;
        Post.prototype.edit(req.params.title, function(err, post) {
            if(err) {
                req.flash('error', err);
                return res.redirect('back');
            }
            res.render('backend_edit', {
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
            //var url = encodeURI('/articleSearch/' + req.params.title);
            var url = '/backend';
            if (err) {
                req.flash('error', "修改失败！");
                return res.redirect(url);//出错！返回文章页
            }
            req.flash('success', '修改成功!');
            res.redirect(url);//成功！返回文章页
        });
    });



    // 简单的中间件函数
    function checkLogin(req, res, next) {
        if (!req.session.user) {
            req.flash('error', '未登录!');
            return res.redirect('/login');
        }
        next();
    }

    function checkNotLogin(req, res, next) {
        if (req.session.user) {
            req.flash('error', '已登录!');
            return res.redirect('back'); //返回之前的页面
        }
        next();
    }
};



