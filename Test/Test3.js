console.show();


//print(eval('4').toString(16));

function Dim(col,rate){
    let rst=col.substring(0,col.length-6);//取非rgb部分
    col=col.substring(col.length-6);//取rgb部分

    for(let pst=0;pst<col.length;){
        let temp='0x';//取数
        temp+=col[pst++];
        temp+=col[pst++];

        print(pst,temp);
        temp=eval(temp).toString(10);//转十进制
        temp=parseInt(temp*rate);//乘以比率rate并保留整数
        temp=temp.toString(16);//回16进制

        rst+=temp;
    }

    return rst;
}

print(Dim('#FF4080',0.5))
//print('#3388FF44'.substring('#33333333'.length-6))

