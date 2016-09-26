/**
 * Created by dearsw on 16/9/24.
 */


// 闭包防止变量名污染
(function () {

    particle_no = 25;


    // 兼容行处理,获取特定浏览器支持的 requestAnimationFrame
    // IIEF
    // || 是短路值
    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function( callback ){
                window.setTimeout(callback, 1000 / 60);
            };
    })();


    // 获取页面中的 canvas 元素
    var canvas = document.getElementsByTagName("canvas")[0];

    // 获取 canvas 2D画布,后面的操作都在画布上面
    var ctx = canvas.getContext("2d");

    var counter = 0;
    var particles = [];

    // 设置 canvas 元素的 宽和高, 同时重置这个 canvas 元素
    var w = 400;
    var h = 200;
    canvas.width = w;
    canvas.height = h;


    // 初始化绘制背景、进度条
    function reset(){

        // 填充颜色到整个画布, 绘制背景
        ctx.fillStyle = "#0b0b16";
        ctx.fillRect(0,0,w,h);

        // (0, 0) 是 矩形背景的X、Y坐标, w h 是 宽和高

        // 填充颜色到 进度条 , 绘制进度条
        ctx.fillStyle = "#171814";
        ctx.fillRect(25,80,350,25);
        // 进度条的宽度是 350px,高度是 25px; 起始点是 (25, 80)
    }

    // 进度条构造函数
    function Progressbar(){

        this.widths = 0;
        this.hue = 0;

        this.draw = function(){
            ctx.fillStyle = 'hsla('+this.hue+', 100%, 40%, 1)';
            ctx.fillRect(25,80,this.widths,25);

            // 创建线性渐变
            var grad = ctx.createLinearGradient(0,0,0,130);
            // 指定色标 0--1
            grad.addColorStop(0,"transparent");
            grad.addColorStop(1,"rgba(0,0,0,0.5)");
            ctx.fillStyle = grad;
            ctx.fillRect(25,80,this.widths,25);
        }
    }

    //
    function Particle(){
        this.x = 23 + bar.widths;
        this.y = 82;

        this.vx = 0.8 + Math.random();
        this.v = Math.random()*5;
        this.g = 1 + Math.random()*3;
        this.down = false;

        this.draw = function(){
            ctx.fillStyle = 'hsla('+(bar.hue+0.3)+', 100%, 40%, 1)';
            var size = Math.random()*2;
            ctx.fillRect(this.x, this.y, size, size);
        }
    }

    // 全局对象 bar
    bar = new Progressbar();

    function draw(){
        reset();
        counter++;

        bar.hue += 0.8;

        bar.widths += 2;
        if(bar.widths > 350){
            if(counter > 215){
                reset();
                bar.hue = 0;
                bar.widths = 0;
                counter = 0;
                particles = [];
            }
            else{
                bar.hue = 126;
                bar.widths = 351;
                bar.draw();
            }
        }
        else{
            bar.draw();
            for(var i=0;i<particle_no;i+=10){
                particles.push(new Particle());
            }
        }
        update();
    }

    function update(){
        for(var i=0;i<particles.length;i++){
            var p = particles[i];
            p.x -= p.vx;
            if(p.down == true){
                p.g += 0.1;
                p.y += p.g;
            }
            else{
                if(p.g<0){
                    p.down = true;
                    p.g += 0.1;
                    p.y += p.g;
                }
                else{
                    p.y -= p.g;
                    p.g -= 0.1;
                }
            }
            p.draw();
        }
    }

    function animloop() {
        draw();
        requestAnimFrame(animloop);
    }

    animloop();
})(window);
