var config={//各种设置
    storageName:'autoConfig',//存储名，不建议对其修改
    ui:{//窗口ui的设置
        alpha:0.7,//窗体透明度
        pos:[200,200],//窗口位置
        winWidth:500,//窗口宽度

        sep_col:'#8000FFFF',//选项之间的分隔符的颜色
        titleStyle:['#FFFF00','#60000000',20],//标题颜色(前景+背景+字号)

        optColor:{exec:['#00EEEE','#000000',18],menu:['#FFFFFF','#000000',18],config:['#00AACC','#000000',16],exit:['#EE0000','#000000',19]},//选项颜色(前景+背景+字号)
        optDimRate:0.5,//选项禁用时黯淡的程度
    },
    loopClick:{//循环点击的设置
        count:1000,//点击次数
        interval:0.1,//点击的时间间隔    
    },
    rigidClick:{//机械点击的设置
        viewTime:20,//点进任务后停留的时长
        interval:7,//浏览完任务后返回到任务界面时等待的时长
        reClick:7,//部分任务完成后还很恶心地出现“领取”按钮，于是很贴心地设置该变量来完成点击“领取”操作。如果该值大于说明需要“领取”，并且点击完领取后会等待一段时间
    }
};

//storages.remove(config.storageName);//如果想让上面的config不生效的话请注释掉该语句

let s=storages.create(config.storageName);
for(let key in config)
    config[key]=s.get(key,config[key]);

module.exports = config;
