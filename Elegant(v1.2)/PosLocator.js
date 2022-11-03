

var locator={//定位器，因为各种原因我将其耦合进task里头
    //【【【需重写】】】
    Callback:function(x,y){},//手指抬起时的回调函数

    //【【【选择性重写】】】
    color:'#2200FFFF',//颜色

    //【【【不需要重写】】】
    Run:function(){},//启动定位器

    //【【【状态量】】】
    thread:false,//该值有三种可取情况：false、true、线程对象。(需注意的是，意外中断线程的话该信号量无法恢复为false
    //false说明定位器未运行；
    //true说明定位器正等候点击；
    //线程对象说明定位器正在执行Callback函数，可以对这线程对象调用.join()函数来阻塞同步线程
};
module.exports = locator;





//**********************************************************************************************
//#region 【locator】

var posX=0;
var posY=0;

locator.Run=function(){
    threads.start(((obj)=>function(){//mlgbd，逼我整闭包
        toast('【请点击屏幕】');
        obj.thread=true;
        var w=floaty.rawWindow(
            <frame id='canvas' bg={obj.color}/>
        );
        w.setSize(-1,-1);
    
        w.canvas.on('touch',function(point){
            posX=point.rawX;
            posY=point.rawY;
        });    
        w.canvas.on('click',function(point){
            obj.thread=threads.start(function(){obj.Callback(posX,posY);obj.thread=false;});
            w.close();
        });
    })(this));
}

//#endregion

