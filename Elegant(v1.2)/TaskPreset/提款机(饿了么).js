



var blacklist=[//黑名单，部分任务需要人为点击完成，这部分任务不予处理
    '逛外卖好店领奖励',
    '进入现金提款机'
];

function SetTask(task){//对FinishTask文件中的task的部分数据进行重写
    task.keyword_Search=['去逛逛','去完成','去看看'];
    task.keyword_TaskPage=['现金提款机',[-1]];
    task.keyword_PackageName=['Alipay','me.ele'];
    task.flag_Attempt=3000;//开启“尝试点击”功能
    task.flag_Swipe=10;
    task.GotoButton=function(wid){
        try{
            tx=wid.parent().child(wid.indexInParent()-1).child(0).text();
            for(let pst in blacklist){
                if(tx.includes(blacklist[pst]))
                    return null;
            }
            blacklist.push(tx);
            return wid;
        }
        catch(err){
            return null;
        }
    }
    task.Finish=function(){
        toast('点击[领取]按钮');
        sleep(2000);
        while(true){
            let btn=text('领取').findOnce();
            if(btn){
                btn.click();
                sleep(1500);
            }
            else{
                break;
            }
        }
    }
}
module.exports=SetTask;

