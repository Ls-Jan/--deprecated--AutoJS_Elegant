

var tool=require('Tools.js');

if(engines.all().length==1){//当前脚本运行数为1，即仅该脚本正在运行
    while(true){
        var exectuion=engines.execScriptFile("./【启动脚本】.js");//运行启动脚本
        sleep(100);//小睡一会儿
        var engine=exectuion.getEngine();//获取该脚本的运行实例
        while(engine.isDestroyed()==false)//持续运行直到脚本结束
            sleep(500);
        if(tool.Storage.Get("operation")==false)//如果是主动结束
            break;
    }
    engines.stopAll();//强制结束所有运行中的脚本
}
