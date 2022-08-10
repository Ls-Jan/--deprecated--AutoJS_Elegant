
var blacklist={//淘宝用的黑名单
    '搜一搜你心仪的宝贝(0/1)':null,
    '逛逛支付宝芭芭农场(0/1)':null,
    '去淘宝人生扔骰子(0/1)':null,
};



function SetTask(task){//对FinishTask文件中的task的部分数据进行重写
    task.keyword_Search=['浏览','逛逛'];
    task.keyword_Judge='完成';
    task.keyword_TaskPage='做任务';
    task.GotoButton=function(wid){
        let packageName=depth(0).findOnce().packageName();
        if(packageName.includes('Alipay')){//支付宝内的
            try{
                targ=wid.parent().child(wid.indexInParent()+1).child(0);
                if(targ.text().includes('去'))
                    return targ;
            }
            catch(err){
                ;
            }
            return null;
        }
        else if (packageName.includes('taobao')){//淘宝内的
            try{
                if(wid.text().includes('去')==false)
                    return null;
                let targ=wid.parent().child(0).child(0);
                if(targ.text() in blacklist)
                    return null;
                return wid;
            }
            catch(err){
                ;
            }
            return null;
        }
    }
}
module.exports=SetTask;

