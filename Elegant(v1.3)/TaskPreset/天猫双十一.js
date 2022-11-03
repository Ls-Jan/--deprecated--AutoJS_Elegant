
var size=[device.width,device.height];//设备宽高
var dragV=500;
var dragH=5000;

function SetTask(task){//对FinishTask文件中的task的部分数据进行重写
    task.keyword_Search=['浏览15秒'];
    task.keyword_Estimate='任务完成';
    task.keyword_TaskPage=['天猫双十一',[9]];
    task.keyword_PackageName=['taobao'];
    task.GotoButton=function(wid){
        try{
            let targ=wid.parent().parent().parent().child(1);
            if(targ.text()=='去完成')
                return targ;
        }
        catch(err){
            ;
        }
        return null;
    }
    task.Finish=function(){//完事，收草场
        let close=text("关闭").findOnce();
        if(close==null){
            let R=size[0]>>3;
            let T=size[1]>>3;
            let lst=[//拖拽方向，次序依次是左、上、右、上。第三参数为拖拽持续时长(ms)
                [-R,0,dragH],
                [0,-T,dragV],
                [R,0,dragH],
                [0,-T,dragV]
            ]
            let start=[size[0]>>1,size[1]>>1];//拖拽起点位置
            let ends=[];//拖拽终点位置+拖拽持续时长
            for(let pst=0;pst<lst.length;++pst)
                ends.push([start[0]+lst[pst][0],start[1]+lst[pst][1],lst[pst][2]]);
            while(true){
                for(let pst=0;pst<ends.length;++pst){
                    let end=ends[pst];
                    swipe(start[0],start[1],end[0],end[1],end[2]);
                    sleep(400);
                }
            }
        }
    }
}
module.exports=SetTask;

