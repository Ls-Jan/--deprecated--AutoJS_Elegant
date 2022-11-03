
var tool={//用来装一堆垃圾函数(为了降耦+代码复用而疯狂创建结构体的屑XJ
    Input:{//输入特定数值
        Integer_Positive:function(defaultNum,includeZero,func,hint){},//弹出对话框，用于输入正整数。输入无效数字不调用func。func形如(num)=>{}
        Float:function(defaultNum,digits,func,hint){},//弹出对话框，用于输入浮点数，digits为浮点数的小数位数。输入无效数字不调用func。func形如(num)=>{}
        Bool:function(func,hint){},//弹出对话框，用于选择布尔变量。如果做出选择则将调用func。func形如(bool)=>{}
    },
    Copy:{//拷贝数据(只拷贝数组+字典)
        Shallow:function(data){},//浅拷贝
    },
    Color:{
        Dim:function(col,rate){},//返回暗淡的颜色。传入和返回的均是形如'#FF0000'的颜色字串(可包括透明度)；rate为暗淡比率(小数，取值0~1)
    },
    Storage:{
        Save:function(fileName,obj){},//保存json数据。文件在默认路径，文件名自带后缀json
        Load:function(fileName){},//返回json数据。文件在默认路径，文件名自带后缀json
        Put:function(key,obj){},//保存临时数据。使用Storages，存储名在Config.json中设置
        Get:function(key){},//读取临时数据。使用Storages，存储名在Config.json中设置
    }
};
module.exports = tool;









//******************************************************************************************

tool.Input.Bool=function(func,hint){
    dialogs.select(hint,['是','否']).then(val=>{
        if(val==-1)
            toast('取消输入');
        else
            func(val==0);
    });
}

tool.Input.Integer_Positive=function(defaultNum,includeZero,func,hint){
    let numType=includeZero?'非负整数':'正整数';
    dialogs.rawInput(hint?hint:('请输入'+numType),defaultNum).then(num=>{
        try{
            if(num==null){
                toast('取消输入');
            }
            else{
                num=eval(num);
                if(num==parseInt(num)){//如果输入的是整数
                    if(num>0 ||(includeZero && num==0)){
                        func(num);
                    }
                    else{
                        includeZero?toast(num+"不是"+numType):toast(num+"不是"+numType);
                    }
                }
                else{
                    toast("输入数值无效");
                }        
            }
        }
        catch(err){
            toast("输入数值无效");
        }
    });
}



tool.Input.Float=function(defaultNum,digits,func,hint){
    dialogs.rawInput(hint?hint:'请输入浮点数',defaultNum).then(num=>{
        try{
            num=parseFloat(eval(num).toFixed(digits));//保留digits位小数并且抹除小数末尾的0
            if(num==null){
                toast('取消输入');
            }
            else{
                func(num);
            }
        }
        catch(err){
            toast("输入数值无效");
        }
    });
}




tool.Copy.Shallow=function(data){
    let Copy=(data instanceof Array)?[]:{};
    for(key in data)
        Copy[key]=data[key];
    return Copy;
}


tool.Color.Dim=function(col,rate){
    let rst=col.substring(0,col.length-6);//取非rgb部分
    col=col.substring(col.length-6);//取rgb部分

    for(let pst=0;pst<col.length;){
        let temp='0x';//取数
        temp+=col[pst++];
        temp+=col[pst++];

        temp=eval(temp).toString(10);//转十进制
        temp=parseInt(temp*rate);//乘以比率rate并保留整数
        temp=temp.toString(16);//回16进制
        temp=(temp.length==1?'0':'')+temp;//避坑。当temp是一位数时要补多一个0

        rst+=temp;
    }

    return rst;
}



tool.Storage.Save=function(fileName,obj){
    //json对象转字符串(带缩进)：https://blog.csdn.net/renfufei/article/details/44156509
    fileName='./'+fileName+'.json';
    let str=JSON.stringify(obj,null,4);
    files.write(fileName,str);
}

tool.Storage.Load=function(fileName){
    //字符串转json对象：https://www.w3cschool.cn/json/nopz1pp7.html
    fileName='./'+fileName+'.json';
    let str=files.read(fileName);
    let json = (new Function("return " + str+";"))();
    return json;
}



tool.Storage.Put=function(key,obj){
    let config=tool.Storage.Load("Config");
    storages.create(config.storageName).put(key,obj);
}



tool.Storage.Get=function(key){
    let config=tool.Storage.Load("Config");
    return storages.create(config.storageName).get(key);
}





