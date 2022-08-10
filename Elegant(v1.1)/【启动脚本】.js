

var config=require('Config.js');
var tool=require('Tools.js');

var main={//核心部分
    __suite:require('FloatyPreset.js'),
    __task:require('ViewTask.js'),

    menu:{//菜单
        __content:{},//菜单内容(逻辑)
        __cache:{},//缓存(如果菜单内容__content发生变化则需清空__cache
        __current:['',true],//当前菜单名+选项是否可点击

        opt_ChangeMenu:function(name){},//切换菜单
        opt_DoTask:function(name){},//执行任务【保留不使用(主要是不想删但在这里真的没啥用)】
        opt_DoOther:function(func){},//执行其他函数(为了格式统一才“脱裤子放屁”
    },
    SwitchMenu:function(name){},//切换菜单。仅在窗口显示(即调用过Run函数)时调用
    AlterMenu:function(name,index,text){},//将菜单名为name的第index个选项的文本内容修改为text
    SetTitle:function(name){},//设置窗口标题

    Run:function(name){},//主函数(运行脚本)
    Stop:function(){},//结束正在运行的任务
    Exit:function(){},//结束脚本
};

var loopClick={//控制循环点击
    __locator:tool.copy.Shallow(require('PosLocator.js')),//拿一个“定位器”出来

    Alter_Count:function(){},//弹出对话框对点击次数count进行修改
    Alter_Interval:function(){},//弹出对话框对点击时间间隔interval进行修改
    Run:function(){},//开始运行
};

var rigidClick={//控制机械(死板)点击
    __locator:tool.copy.Shallow(require('PosLocator.js')),//拿一个“定位器”来用

    Alter_ViewTime:function(){},//弹出对话框对任务浏览时间viewTime进行修改
    Alter_Interval:function(){},//弹出对话框对返回时长interval进行修改
    Alter_ReClick:function(){},//弹出对话框对再点击reClick进行修改
    Run:function(){},//开始运行
}

var oneKeyTask={//一键任务(超级懒人)
    __tasks:{},//任务列表。{'任务名'：ViewTask对象}

    Init:function(){},//初始化
    Run:function(){},//开始运行
}






//VSCode的自定义代码折叠区是真的香的不行：https://blog.csdn.net/ycx60rzvvbj/article/details/106447130
//******************************************************************************************
//#region 【loopClick】

loopClick.Run=function(){
    ui.run(()=>{main.SetTitle('[请点击屏幕]')});
    loopClick.__locator.Run()
}

loopClick.__locator.Callback=function(x,y){
    toast('【开始点击】')
    ui.run(()=>{main.SetTitle('剩余次数：'+config.loopClick.count)});
    for(let c=config.loopClick.count;c-->0;){
        sleep(config.loopClick.interval*100);
        click(x,y);
        ui.run(()=>{main.SetTitle('剩余次数：'+c)});
    }
    ui.run(()=>{main.SetTitle('')});
    toast('【循环点击结束】');
}

loopClick.Alter_Count=function(){
    tool.input.Integer_Positive(config.loopClick.count,false,(val)=>{
        if(val>0){
            config.loopClick.count=val;
            main.AlterMenu('[循环点击]',0,'点击次数：'+val);
            toast('修改成功');
        }
        tool.storage.Put(config.storageName,'loopClick',config.loopClick);
    },'修改“点击次数”');
}

loopClick.Alter_Interval=function(){
    tool.input.Float(config.loopClick.interval,1,(val)=>{
        if(val>=0.1){
            config.loopClick.interval=val;
            main.AlterMenu('[循环点击]',1,'时间间隔(s)：'+val);
            toast('修改成功');
        }
        else{
            toast('时间间隔过短(<100ms)，修改失败')
        }
        tool.storage.Put(config.storageName,'loopClick',config.loopClick);
    },'修改“点击时间间隔”\n(保留一位小数)');
}


//#endregion
//******************************************************************************************
//#region 【rigidClick】

rigidClick.Run=function(){
    ui.run(()=>{main.SetTitle('[机械点击]')});
    rigidClick.__locator.Run();
}

rigidClick.__locator.Callback=function(x,y){
    sleep(1000);
    while(true){
        click(x,y),sleep(100);
        toast('【浏览任务】')
        sleep(config.rigidClick.viewTime*1000);

        back();
        toast('【返回上一页】')
        sleep(config.rigidClick.interval*1000);

        if(config.rigidClick.reClick>0){
            toast('【再点击】')
            click(x,y);
            sleep(config.rigidClick.reClick*1000);
        }
    }
}



rigidClick.Alter_ViewTime=function(){
    tool.input.Integer_Positive(config.rigidClick.viewTime,false,(val)=>{
        if(val>0){
            if(val>=1){
                config.rigidClick.viewTime=val;
                main.AlterMenu('[机械点击]',0,'浏览时长(s)：'+val);
                toast('修改成功');
            }
            else{
                toast('时间间隔过短(<1s)，修改失败');
            }
        }    
        tool.storage.Put(config.storageName,'rigidClick',config.rigidClick);
    },'修改“浏览时长”');
}

rigidClick.Alter_Interval=function(){
    tool.input.Integer_Positive(config.rigidClick.interval,false,(val)=>{
        if(val>0){
            if(val>=1){
                config.rigidClick.interval=val;
                main.AlterMenu('[机械点击]',1,'返回时长(s)：'+val);
                toast('修改成功');
                }
            else{
                toast('时间间隔过短(<1s)，修改失败');
            }
        }    
        tool.storage.Put(config.storageName,'rigidClick',config.rigidClick);
    },'修改“返回时长”');
}


rigidClick.Alter_ReClick=function(){
    toast('“再点击”功能仅输入时长大于1s时启用');
    tool.input.Integer_Positive(config.rigidClick.reClick,true,(val)=>{
        if(val>=1){
            config.rigidClick.reClick=val;
            main.AlterMenu('[机械点击]',2,'再点击时长(s)：'+val);    
            toast('设置成功');    
        }
        else{
            config.rigidClick.reClick=0;
            main.AlterMenu('[机械点击]',2,'再点击时长(s)：'+0);    
            toast('时间间隔过短(<1s)，默认设置为0');
        }
        tool.storage.Put(config.storageName,'rigidClick',config.rigidClick);
    },'修改“再点击时长”');
    tool.storage.Put();
}


//#endregion
//******************************************************************************************
//#region 【oneKeyTask】

oneKeyTask.Init=function(){
    var tasks={};
    let list=files.listDir('./TaskPreset/',function(name){return name.endsWith(".js");});
    for(let key in list){
        let name=list[key].replace('.js','');
        let task=tool.copy.Shallow(main.__task);//对其浅拷贝

        require('TaskPreset/'+name+'.js')(task);//对task进行修改
        tasks[name]=task;//加入任务列表中
    }
    oneKeyTask.__tasks=tasks;
}

oneKeyTask.Run=function(){
    let tasks=oneKeyTask.__tasks;
    for(let name in tasks){
        let task=tasks[name];
        if(task.IsTargetPackage()){
            threads.start(function(){
                toast('执行任务【'+name+'】');
                ui.run(()=>{main.SetTitle(name);});
                sleep(1000);
                print();
                print(task);
                print();
                task.Run();
                ui.run(()=>{main.SetTitle('');});
            });
            return;
        }
    }
    toast('无对应任务可执行');
}

//#endregion
//******************************************************************************************
//#region 【main】
main.menu.opt_DoTask=function(name){
    let SetTask=require('TaskPreset/'+name+'.js');//还好，它有着类似于py的import机制(自带缓存)，即同个文件多次import时并不会多次执行文件内容
    let task=tool.copy.Shallow(main.__task);//对其浅拷贝
    SetTask(task);//对task进行修改
    return ()=>{
        threads.start(function(){
            toast('执行任务【'+name+'】');
            ui.run(()=>{main.SetTitle(name);});
            sleep(1000);
            task.Run();
            ui.run(()=>{main.SetTitle('');});
        });
    };
}

main.menu.opt_ChangeMenu=function(name){//切换菜单
    return ()=>{
        main.SwitchMenu(name);
    }
}

main.menu.opt_DoOther=function(func){
    return func;
}

main.SwitchMenu=function(name){
    let menu=this.menu;
    let suite=this.__suite;
    let cache=menu.__cache;
    let enable=suite.GetWinTitle()==''?true:false;//根据标题是否可见来决定选项是否可点击
    
    if((name in cache)==false)
        cache[name]={};
    else if((name==menu.__current[0])&&(enable==menu.__current[1]))//防止多次调用suite.SetWinList。【频繁调用极易翻车于是在此打补丁】
        return;
    if((enable in cache[name])==false){
        let origList=menu.__content[name];
        let targLst=[];
        for(let pst in origList){
            let item=origList[pst];
            let name=item[0];
            let func=item[1];

            let style=config.ui.optColor[item[2]];//选项样式
            let fg=style[0];
            let bg=style[1];
            let txSize=style[2];

            let unable=item[3] && !enable;//判断选项当前是否被禁用
            if(unable){//如果选项被禁用，则对其前景色进行修改，并且清除回调函数
                fg=tool.color.Dim(fg,config.ui.optDimRate);
                func=null;
            }

            targLst.push({
                tx:name,
                fg:fg,
                bg:bg,
                txSize:txSize,
                func:func,
            });
        }
        cache[name][enable]=targLst;
    }
    suite.SetWinList(cache[name][enable]);
    menu.__current=[name,enable];
}

main.AlterMenu=function(name,index,text){
    let menu=this.menu;
    menu.__content[name][index][0]=text;
    delete menu.__cache[name];
    if(menu.__current[0]==name){
        this.SwitchMenu(name);
    }
}

main.SetTitle=function(name){
    this.__suite.SetWinTitle(name);
    this.SwitchMenu(this.menu.__current[0]);
}

main.Stop=function(){//结束正在运行的任务
    toast('结束正在运行的任务');
    threads.shutDownAll();
    main.SetTitle('');
}

main.Exit=function(){//结束脚本
    toast('退出脚本');
    threads.shutDownAll();
    // for(let key in config)
    //     tool.storage.Put(config.storageName,key,config[key]);
    exit();
}


//#endregion
//******************************************************************************************

main.Run=function(){
    //【设置菜单】
    // let list=files.listDir('./TaskPreset/',function(name){return name.endsWith(".js");});
    // list.sort((A,B)=>A.length-B.length);//根据字串长简单排序一下
    // for(let key in list){
    //     let name=list[key].replace('.js','');
    //     taskList.push([name,main.menu.opt_DoTask(name),'exec',true]);//布尔变量true/false用于决定该选项能否被禁用(被禁用时点击无响应)，true为禁用
    // }

    //【初始化任务列表】
    oneKeyTask.Init();
    //【设置菜单】
    let taskList=[];
    taskList.push(['一键任务',main.menu.opt_DoOther(oneKeyTask.Run),'exec',true]);
    taskList.push(['[循环点击]',main.menu.opt_ChangeMenu('[循环点击]'),'menu',false]);
    taskList.push(['[机械点击]',main.menu.opt_ChangeMenu('[机械点击]'),'menu',false]);
    taskList.push(['>>退出<<',main.menu.opt_DoOther(main.Exit),'exit',false]);
    main.menu.__content={//菜单，设置好点击函数
        '':
            taskList
        ,
        '[循环点击]':[
            ['点击次数：'+config.loopClick.count,main.menu.opt_DoOther(loopClick.Alter_Count),'config',true],
            ['时间间隔(s)：'+config.loopClick.interval,main.menu.opt_DoOther(loopClick.Alter_Interval),'config',true],
            ['[开始点击]',main.menu.opt_DoOther(()=>{loopClick.Run();}),'exec',true],
            ['>>返回<<',main.menu.opt_ChangeMenu(''),'exit',false],
        ],
        '[机械点击]':[
            ['浏览时长(s)：'+config.rigidClick.viewTime,main.menu.opt_DoOther(rigidClick.Alter_ViewTime),'config',true],
            ['返回时长(s)：'+config.rigidClick.interval,main.menu.opt_DoOther(rigidClick.Alter_Interval),'config',true],
            ['再点击时长(s)：'+config.rigidClick.reClick,main.menu.opt_DoOther(rigidClick.Alter_ReClick),'config',true],
            ['[开始点击]',main.menu.opt_DoOther(()=>{rigidClick.Run();}),'exec',true],
            ['>>返回<<',main.menu.opt_ChangeMenu(''),'exit',false],
        ],
    };

    let suite=main.__suite;
    //长按标题结束在运行的线程
    suite.DoubleClick_Title=main.Stop;
    //配置参数赋值(窗口界面)
    suite.config.alpha=config.ui.alpha;
    suite.config.sep_col=config.ui.sep_col;
    suite.config.txSize=config.ui.txSize;
    suite.title.fg=config.ui.titleStyle[0];
    suite.title.bg=config.ui.titleStyle[1];
    suite.title.size=config.ui.titleStyle[2];
    //配置参数赋值(窗口位置+大小)
    let pos=config.ui.pos;
    let size=[config.ui.winWidth,-2];

    var win=suite.GetFloaty();
    win.setPosition(pos[0],pos[1]);
    win.setSize(size[0],size[1]);
    main.SwitchMenu('[循环点击]');//设置菜单
    main.SwitchMenu('');//设置菜单
    setInterval(()=>{},60000);//让窗口持续运行
}

main.Run();


