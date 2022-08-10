


function SetTask(task){//对FinishTask文件中的task的部分数据进行重写
    task.keyword_Search=['去逛逛'];
    task.keyword_TaskPage='东东农场';
    task.flag_Attempt=8000;//开启一下“尝试点击”功能，因为有不少任务仅需浏览6秒时间
    task.keyword_PackageName=['jingdong'];
    task.GotoButton=function(wid){
        return wid;
    }
    task.Finish=function(){
        toast('点击[领取]按钮');
        sleep(2000);
        while(true){
            let btn=text('去领取').findOnce();
            if(btn){
                btn.click();
                sleep(2000);
            }
            else{
                break;
            }
        }
    }
}
module.exports=SetTask;


