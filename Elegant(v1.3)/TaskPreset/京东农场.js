


function SetTask(task){//对FinishTask文件中的task的部分数据进行重写
    task.keyword_Search=['去逛逛'];
    task.keyword_TaskPage=['东东农场',[1]];
    task.flag_Attempt=8000;//开启一下“尝试点击”功能，因为有不少任务仅需浏览6秒时间
    task.keyword_PackageName=['jingdong'];
    task.GotoButton=function(wid){
        if(wid.text() =='去逛逛')
            return wid;
        return null;
    }
}
module.exports=SetTask;


