
function SetTask(task){//对FinishTask文件中的task的部分数据进行重写
    task.keyword_Search=['去逛逛'];
    task.keyword_TaskPage=['消费金',[1]];
    task.keyword_PackageName=['Alipay'];
    task.flag_Swipe=5;
    task.ExtraClick=function(){//对付恶党的函数
        try{
            sleep(2000);
            wid=textContains('消费金+').findOnce();
            wid=wid.parent().child(wid.indexInParent()+1);
            this.ClickWidget(wid);
            sleep(2000);
        }
        catch(err){
            throw '关闭弹窗失败';
        }
    }
    task.ClickWidget=function(widget){//恶心的老六
        click(widget.bounds().centerX(), widget.bounds().centerY());
    }
}
module.exports=SetTask;

