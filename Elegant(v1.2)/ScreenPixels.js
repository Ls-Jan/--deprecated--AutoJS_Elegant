


var screenPixels={
    //一般方法(需要看好说明文档/注释再调用，调用的次序将对结果造成影响)
    Opt_UpdateScreenshot:function(){return true;},//更新截屏内容，更新成功将返回true
    Get_Colors:function(x,y){},//获取像素颜色值，如果多采样为真将返回一个颜色值列表(列表长度由Set_SampleRadius决定)，为假将只返回一个颜色值
    Set_MultiplePixels:function(flag){},//设置多采样，默认为真。
    Set_PixelsInterval:function(dist){},//设置多采样的采样点间距，默认为10
    Set_SampleRadius:function(n){},//设置“样本半径”的采样点个数，默认值为1。这么说吧，采样点个数为(2n+1)²，采样点构成一个正方形

    //静态方法(即该方法与类对象数据无关，函数单独抽离出来也能正常使用)
    Opt_TranslateToRGB:function(color){},//像素值颜色转换，将整型数数值转换为一个RGB列表
    Opt_TranslateToColor:function(color){},//像素值颜色转换，将一个RGB列表转换为整型数数值
    Opt_CompareColors:function(pixels_A,pixels_B,threshold){},//比较两份颜色(一般由Get_Colors获取，也可以其中一个数值由Opt_TranslatorToColor获取)并返回同色个数，threshold为阈值(默认值为16)，颜色差值在threshold范围内则为同色。
    Opt_RestrictPos:function(pos,screenSize){},//制约pos的值在图片尺寸screenSize内。screenSize为二元列表，存放宽高；pos为列表存放x值和y值


    //私有数据
    __multiPixles:true,//多采样
    __screenshot:null,//截屏内容
    __interval:10,//采样点的间距(不宜过小或过大)
    __screenSize:[0,0],//屏幕宽高，截屏时自动赋值
    __radius:1,//“样本半径”的采样点个数
    __sampleMod:[],//采样模板，只是个一维列表

    //私有方法
    __UpdateSampleMod:function(){},//更新采样模板__sampleMod。当__interval或__radius发生变动时调用
}

// module.exports = screenPixels;









//**********************************************************************************************
//#region 【screenPixels】


screenPixels.Opt_CompareColors=function(pixels_A,pixels_B,threshold){
    if(threshold==null)
        threshold=16;
    let count=0;
    try {
        let num_A=typeof(pixels_A)=='number'?pixels_A:null;
        let num_B=typeof(pixels_B)=='number'?pixels_B:null;
        if(num_A&&num_B){//两者都是数值
            return colors.isSimilar(num_A, num_B,threshold,'diff')?1:0;
        }
        else{//至少有一方是数值
            function Make_9(num){//生成9元素列表，元素值均为num
                let lst=[];
                for(let pst=0;pst<9;++pst){
                    lst.push(num)
                }
                return lst;
            }
            if(num_A)
                pixels_A=Make_9(num_A);
            if(num_B)
                pixels_B=Make_9(num_B);
            
            for(let pst=0;pst<9;++pst){//两份数据依次进行比较
                count+=this.Opt_CompareColors(pixels_A[pst],pixels_B[pst]);
            }
        }
    } 
    catch (err) {
        
    }
    return count;
}

screenPixels.Opt_UpdateScreenshot=function(){
    let img=null;
    for(let tryCount=1;tryCount>=0;--tryCount){
        try{
            img=captureScreen();
            break;
        }
        catch(err){
            if(tryCount){
                requestScreenCapture();
                sleep(500);
            }
        }
    }
    this.__screenshot=img;
    if(img)
        this.__screenSize=[img.width,img.height];
    if(this.__sampleMod.length==0)//不知道放哪，就放在必先调用的这个函数里头，真省事
        this.__UpdateSampleMod();
    return img!=null;
}

screenPixels.Get_Colors=function(x,y){
    try{
        if(this.__multiPixles){
            let pixels=[];//采样结果
            for(let pst=0;pst<this.__sampleMod.length;++pst){
                let pos=this.__sampleMod[pst];
                pos[0]+=x;
                pos[1]+=y;
                this.Opt_RestrictPos(pos);
                pixels.push(this.__screenshot.pixel(pos[0],pos[1]));
            }
            // let mask=[-this.__interval,0,this.__interval];
            // for(let pstX=0;pstX<3;++pstX){//开始采样
            //     for(let pstY=0;pstY<3;++pstY){
            //         let pos=[x+mask[pstX],y+mask[pstY]];
            //         this.Opt_RestrictPos(pos);
            //         pixels.push(this.__screenshot.pixel(pos[0],pos[1]));
            //     }
            // }
            return pixels;
        }
        else
            return this.__screenshot.pixel(x,y);
    }
    catch(err){
        return null;
    }
}

screenPixels.Opt_RestrictPos=function(pos,screenSize){
    try{
        for(let pst=0;pst<2;++pst){
            let val=pos[pst];
            if(val<0)
                val=0;
            else if(val>=screenSize[pst])
                val=screenSize[pst]-1;
            pos[pst]=val;
        }
    }
    catch(err){
    }
}

screenPixels.Opt_TranslateToRGB=function(color){
    try{
        return [colors.red(color),colors.green(color),colors.blue(color)];
    }   
    catch(err){
        return null;
    }

    //发现有api可以调用，下面的白写了
    try{
        let lst=[0,0,0];
        for(let pst=lst.length-1;color!=0 && pst>0;--pst){
            for(let shift=0;shift<8;++shift){
                lst[pst]+=(color&1)<<shift;
                color>>=1;
            }
        }
        return lst;
    }
    catch(err){
        return null;
    }
}

screenPixels.Opt_TranslateToColor=function(color){
    try{
        return colors.rgb(color[0],color[1],color[2]);
    }
    catch(err){
        return null;
    }
}

screenPixels.Set_PixelsInterval=function(dist){
    this.__interval=dist;
    this.__UpdateSampleMod();
}

screenPixels.Set_MultiplePixels=function(flag){
    this.__multiPixles=flag;
}

screenPixels.Set_SampleRadius=function(n){
    this.__radius=n;
    this.__UpdateSampleMod();
}

screenPixels.__UpdateSampleMod=function(){
    let dim_1=[];//dimension-1的数据，处理完之后应该会获得形如[-2d,-d,0,d,2d]的列表
    let r=this.__radius
    let d=this.__interval;
    let val=-r*d;
    for(let n=-r;n<=r;++n){
        dim_1.push(val);
        val+=d;
    }
    if(dim_1.length==0)
        dim_1.push(0);

    let dim_2=[];//dimension-2的数据，处理完后将直接给__sampleMod赋值
    for(let x=0;x<dim_1.length;++x){
        for(let y=0;y<dim_1.length;++y){
            dim_2.push([dim_1[x],dim_1[y]]);
        }
    }

    this.__sampleMod=dim_2;
}




//#endregion




console.show();


// requestScreenCapture();
// var img = captureScreen();
// print(img.width,img.height);
// var color = img.pixel(450,1560);
// print(colors.toString(color));
// click(450,1560);
// sleep(10000);
// console.hide();


screenPixels.Set_PixelsInterval(50);//采样点间距
screenPixels.Set_SampleRadius(2);//样本半径的采样点个数
screenPixels.Set_MultiplePixels(false);//设置多点采样
screenPixels.Opt_UpdateScreenshot();//截取屏幕
let pixels=screenPixels.Get_Colors(450,1560);//对该坐标进行取点采样
// let pixels=screenPixels.Get_Colors(400,1280);//对该坐标进行取点采样
let count=screenPixels.Opt_CompareColors(screenPixels.Opt_TranslateToColor([248,0,0]),pixels,50);//判断这份颜色列表中与目标颜色相近的个数
print(count);
sleep(10000);
console.hide();





