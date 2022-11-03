
// var size=[device.width,device.height];//设备宽高

function SetTask(task){//对FinishTask文件中的task的部分数据进行重写
    task.keyword_Search=['去浏览','去逛逛'];
    task.keyword_Estimate=null;//悬浮球提示“任务完成”的那个，没卵用，该控件没有相关的“任务完成”的文本
    task.keyword_TaskPage=['赚前进次数',[8]];
    task.keyword_PackageName=['Alipay'];
    task.flag_Swipe=12;
    task.GotoButton=function(wid){
        try{
            let t=wid.parent().child(wid.indexInParent()-1).text();
            if(t.search('可得1次前进次数')!=-1)
                return wid;
        }
        catch(err){
            print(err)
        }
        return null;
    }
    task.Finish=function(){
    }
}
module.exports=SetTask;

