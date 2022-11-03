



let blackLst=['入会','下单','4个商品','加购','种草','品牌墙'];//凑JD整的活儿真多
function SetTask(task){//对FinishTask文件中的task的部分数据进行重写
    task.keyword_Search=['浏览','参与小程序'];
    task.keyword_Estimate=null;
    task.keyword_TaskPage=['赚金币',[11]];
    task.keyword_PackageName=['jingdong'];
    task.flag_Swipe=10;
    task.GotoButton=function(wid){
        try{
            if(wid.indexInParent()==1){
                let theText=wid.parent().child(0).text()+wid.text();//烦到起飞
                for(let pst=0;pst<blackLst.length;++pst){
                    if(theText.search(blackLst[pst])>=0)
                        return null;
                }
                // print(theText);
                // if(theText.search('浏览.*?\\d+s')==-1)//字串匹配
                    // return null;
                let targ=wid.parent();
                targ=targ.parent().child(GetIndexInParent(targ)[0]+1);
                if(targ.text()=='去完成')
                    return targ;
            }
        }
        catch(err){
            ;
        }
        return null;
    }
    task.ExtraClick=function(){//针对任务列表有时不刷新的问题，这里的解决方法是，把它关了再点开，没错，每次浏览完任务都要这么做
        textContains('做任务').findOnce().parent().parent().parent().child(0).click();//关掉任务列表
        sleep(1000);
        textContains('消耗').findOnce().parent().parent().parent().parent().child(3).click();//重新打开任务列表
        sleep(2000);
    }
    task.Finish=function(){//完成那个四点击、四加购任务，真是傻卵玩意儿
        try{
            while(true){
                let wid=textContains('4个商品').findOnce();
                let targ=wid.parent();
                targ=targ.parent().child(GetIndexInParent(targ)[0]+1);
                if(targ.text()=='去完成'){
                    targ.click();
                    let tryCount=10;
                    do{//睡到页面刷新为止
                        sleep(1000);
                    }
                    while(textContains('4个商品').findOnce()==null && tryCount-->0);
                    for(let num=0;num<4;++num){//四点击
                        let lst=textContains('¥').find();
                        lst[num].parent().parent().child(4).click();//点击那个红按钮
                        sleep(1000);
                        back();
                        sleep(1000);
                    }
                    back();
                    sleep(3000);
                }
                else
                    break
            }
        }
        catch(err){
            ;
        }
    }
}
module.exports=SetTask;




//************************************************************************************************
//下面俩函数是从ViewTask.js直接复制过来用的。

function GetIndexInParent(wid){//wid.indexInParent不能连续使用才出此下策。返回的是一个列表，正常情况下列表里应该只有一个元素(那就是目标indexInParent)，出现意外情况需要单独debug处理
    let theParent=wid.parent();
    let bounds_wid=wid.bounds();
    let standby=[];
    for(let c=theParent.childCount();c-->0;){
        let test=theParent.child(c);
        let bounds_test=test.bounds();
        if(//依据这个方法所寻得的控件，会出现以下糟糕情形：如果目标控件在屏幕之外，很可能会找到N多个完全符合条件的控件
            (bounds_wid.left==bounds_test.left)&&
            (bounds_wid.right==bounds_test.right)&&
            (bounds_wid.top==bounds_test.top)&&
            (bounds_wid.bottom==bounds_test.bottom)&&
            (wid.text()==test.text())&&
            (wid.desc()==test.desc())
        ){
            standby.push(c);
        }    
    }
    return standby;
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
