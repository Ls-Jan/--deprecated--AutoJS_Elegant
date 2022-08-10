

var task={//类对象(没必要对其拷贝)，主要有以下函数(首字母大写)和变量(首字母小写)
    //【【【需重写】】】
    keyword_Search:[],//所需的关键词，用于搜索文本组件
    keyword_Judge:null,//所需的关键词，用于判断是否浏览完毕。为空则浏览一定时间就返回
    keyword_TaskPage:'',//任务页面的关键词，用于返回任务页面
    GotoButton:function(widget){return null},//根据文本组件返还对应按钮。如果按钮不存在则返回null

    //【【【选择性重写】】】
    flag_Attempt:0,//当该值大于0时开启“Attempt”功能，会点击任务停留一段时间(ms)后返回。【该功能效果奇差，翻车的时候建议把它关了】
    flag_Swipe:15,//点进页面后拖拽屏幕的次数(每次拖拽间隔1500ms)，拖拽结束后会返回页面
    Search:function(keyword){return [];},//根据关键词搜索文本组件
    Judge:function(keyword){return true;},//根据关键字判断是否完成浏览，完成浏览则返回true
    GoBack:function(keyword){back();},//根据关键词返回到任务所在页面。返回失败将抛出异常
    Finish:function(){},//供脚本结束前调用

    //【【【不需要重写】】】
    Attempt:function(widget){},//先尝试一次点击然后立马返回，并判断点击后这按钮是否发生变化(发生变化会返回true)。因为支付宝-饿了么经常有这种“只需点击但不需要浏览”的任务
    Swipe:function(duration,dragUp,needRandom){},//滑动屏幕。duration为拖拽用时(毫秒)，dragUp为拖拽方向(为真时向下拖拽)，needRandom为随机距离拖拽
    Run:function(){},//运行脚本。如果需要使用locator则需要将其重写，其余情况不建议对其进行修改
};
module.exports = task;









//**********************************************************************************************
//#region 【task】

var size=[device.width,device.height]//设备宽高

function Widget_FindIndexes(wid){//获取控件的路径。【供task.Attempt使用】
    let indexes=[]
    for(let d=wid.depth();d-->0;){
        let bounds_child=wid.bounds();
        let text_child=wid.text();
        let desc_child=wid.desc();
        let standby=[];
        wid=wid.parent();
        for(let c=wid.childCount();c-->0;){//indexInParent不能连续使用，麻了，想砍人
            let test=wid.child(c);
            let bounds_test=test.bounds();
            if(//依据这个方法所寻得的控件，会出现以下糟糕情形：如果目标控件在屏幕之外，很可能会找到N多个完全符合条件的控件
                (bounds_child.left==bounds_test.left)&&
                (bounds_child.right==bounds_test.right)&&
                (bounds_child.top==bounds_test.top)&&
                (bounds_child.bottom==bounds_test.bottom)&&
                (text_child==test.text())&&
                (desc_child==test.desc())
            ){
                standby.push(c);
            }    
        }
        indexes.push(standby);
    }
    indexes.reverse();
    return indexes;
}

function Widget_LoadIndexes(indexes){//读取路径返回控件。【供task.Attempt使用】
    let wids=[depth(0).findOnce()];
    for(let pst in indexes){
        let index=indexes[pst];
        let group=[];
        for(let pst in wids){
            let wid=wids[pst];
            for(let pst in index){
                try{
                    group.push(wid.child(index[pst]));
                }
                catch(err){
                }
            }
        }
        wids=group;
    }
    if(wids.length>1){
        let err='该任务的task.Attempt功能不理想，建议到对应的文件中(./TaskPreset/***.js)中将task.flag_Attempt置为0';
        toast(err);
        throw err;    
    }
    return wids.length?wids[0]:null;
}


task.Attempt=function(widget){
    //记录一下这个控件的路径
    let path=Widget_FindIndexes(widget);

    //点击控件并立马返回
    widget.click();
    sleep(1000);//等待一会儿
    if(this.flag_Attempt>100){
        this.Swipe(100,true,true);
        sleep(this.flag_Attempt-100);
    }
    this.GoBack(this.keyword_TaskPage);//立刻返回不犹豫
    sleep(3000);//等待“一会儿”防止按钮突变

    //根据路径找回控件，并对比判断text和desc是否一致(一致说明控件并未发生变化)
    let targ=Widget_LoadIndexes(path);
    if((targ!=null)&&(targ.desc()==widget.desc())&&(targ.text()==widget.text()))
        return false;
    return true;

    //【根据bounds找控件的方式十分不稳定】
    // let b=widget.bounds();
    // let d=widget.desc();
    // let t=widget.text();
    // let selector=bounds(b.left,b.top,b.right,b.bottom).depth(widget.depth());
    // if(d)
    //     selector.desc(d);
    // if(t)
    //     selector.text(t);
    // sleep(3000);//等待“一会儿”防止按钮突变
    // if(selector.findOnce())//说明未发生变化
    //     return false;
    // return true;
}

task.Search=function(keyword){
    let obj=[];
    for(let pst in keyword){
        obj.push.apply(obj,textContains(keyword[pst]).find());
        obj.push.apply(obj,descContains(keyword[pst]).find());
    }
    return obj;
};

task.Judge=function(keyword){
    return textContains(keyword).find().length>0 || descContains(keyword).find().length>0 ;
}

task.GoBack=function(keyword){
    for(let tryCount=5;tryCount-->0;){
        toast('返回上一页');
        back();
        sleep(2000);
        this.Swipe(250,true,false);//简单拖拽一下
        this.Swipe(250,false,false);    
        if(textContains(keyword).find().length>0)
            return;
    }
    throw '任务界面返回失败';
};

task.Swipe=function(duration,dragUp,needRandom){
    if(('cache' in Swipe)==false){
        Swipe.cache={
            'cRangeW':[0.7*size[0],0.8*size[0]],//点击范围(宽)
            'cRangeH':[0.8*size[1],0.9*size[1]],//点击范围(高)
            'dRangeW':[-0.1*size[0],0.1*size[0]],//拖拽幅度(宽)
            'dRangeH':[0.05*size[1],0.1*size[1]]//拖拽幅度(高)
        };
    }
    let cW=Swipe.cache.cRangeW;
    let cH=Swipe.cache.cRangeH;
    let dW=Swipe.cache.dRangeW;
    let dH=Swipe.cache.dRangeH;
    let pStart=[0,0];
    let pDelta=[0,0];
    if(dragUp){
//        cH=[size[1]-cH[0],size[1]-cH[1]];
        dH=[-dH[0],-dH[1]];
    };
    if(needRandom){
        pStart=[random(cW[0],cW[1]),random(cH[0],cH[1])];
        pDelta=[random(dW[0],dW[1]),random(dH[0],dH[1])];    
    }
    else{
        pStart=[cW[1],cH[1]];
        pDelta=[0,dH[1]];
    }
    swipe(pStart[0],pStart[1],pStart[0]+pDelta[0],pStart[1]+pDelta[1],duration);

};

task.Run=function(){
    for(let flag=true;flag;){
        flag=false;
        let obj=this.Search(this.keyword_Search);//寻找组件
        if(obj.length==0){
            toast('【控件不存在】');
            sleep(1000);
            break;
        }
        for(let pst in obj){
            try{
                let targ=this.GotoButton(obj[pst]);//查找对应按钮
                if(targ){
                    flag=true;
                    toast("点击按钮","【",targ.text(),"】");
                    if((this.flag_Attempt<=0) || (sleep(1000),this.Attempt(targ)==false)){//对按钮尝试点击并立马返回。如果点击后按钮未发生变化说明是浏览型任务
                        targ.click();
                        sleep(2000);
                        for(let tryCount=this.flag_Swipe;((this.keyword_Judge==null) || (this.Judge(this.keyword_Judge)==false)) && tryCount>0;--tryCount){//当没完成浏览时
                            this.Swipe(500,true,true);
                            sleep(1000);
                        }
                        this.GoBack(this.keyword_TaskPage);
                    }
                    break;
                }
            }
            catch(err){
                toast('【任务中断】');
                print(err);
                return false;
            }
        }
    }
    this.Finish();
    toast('【任务结束】');
    return true;
};


//#endregion

