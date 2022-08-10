

// var blacklist={//一些黑名单关键字，那些任务不能点击。使用“字典”是为了方便，因为js没有集合
//     //【这是支付宝-饿了么的黑名单】
//     '在页面内点击3个店铺':null,
//     '开启消息订阅':null,
//     '外卖实付7元以上可领阳光(0/3)次':null,
//     '邀请好友助力':null,
//     '从饿了么APP首页进果园':null,
//     '从支付宝口碑入口进果园':null,
//     '从支付宝饿了么入口进果园':null,
//     '去点淘App走路赚钱':null,

//     //【这是饿了么-饿了么的黑名单】
//     '下单品质外卖即可领大额水滴':null,
//     '逛夏日免单1分钟会场':null,
//     '外卖实付7元以上可领阳光(0/3)次':null,
//     '邀请好友助力':null,
//     '去闲鱼拿现金红包':null,
//     '来菜鸟抽手机':null,
//     '去微博任务中心领红包':null,
//     '去手淘App薅羊毛赚话费':null,
//     '去点淘App走路赚钱':null,
//     '去天猫领无门槛红包':null,
//     '去飞猪APP领能量兑红包':null,
//     '去UC极速版领红包':null,
//     '去手淘划算江湖练功1次':null,
// };

var blacklist=[//一些黑名单关键字，那些任务不能点击。不使用“字典”是因为不能点的任务太太太多了
    '点击3个',
    '消息订阅',
    '下单',
    '外卖实付',
    '邀请好友',
    '会场',
    '饿了么',
    '支付宝',
    '点淘',
    '闲鱼',
    '菜鸟',
    '微博',
    '手淘',
    '天猫',
    '淘特',
    '飞猪',
    '淘金币',
    'UC极速版',
];


var blacklistPlus={//额外的黑名单，因为最近总是发现饿了么会点到奇奇怪怪的地方，明明都已经加黑名单了。(利用字典来完成集合的功能

};

function SetTask(task){//对FinishTask文件中的task的部分数据进行重写
    task.keyword_Search=['去'];
    task.keyword_Estimate='完成';
    task.keyword_TaskPage='饿了么';
    task.keyword_PackageName=['Alipay','me.ele'];
    task.flag_Attempt=1;//开启一下“尝试点击”功能，因为饿了么有很多任务是点开就算完成的，根本不需要浏览
    task.GotoButton=function(wid){
        try{
            if(wid.text().length>3)//说明这不是按钮，散了吧
                return null;
            let targ=wid.parent().parent().child(1).child(0);
            targ=targ.text();
            if(targ in blacklistPlus)
                return null;
            for(let pst in blacklist){
                if(targ.includes(blacklist[pst]))
                    return null;
            }
            blacklistPlus[targ]=null;//加入黑名单，防止二次点击
            return wid;
        }
        catch(err){
            ;
        }
        return null;
    }
    task.Finish=function(){
        blacklistPlus={};//清空附加黑名单
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


