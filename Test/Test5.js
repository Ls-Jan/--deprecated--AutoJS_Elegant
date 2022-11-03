
console.show();

//0 0 0 1 18 1 1 0 5 0 2

let www=textContains('浏览').findOnce();
// print(www);
// for(let key in www){
//     print(key);
// }
print(www.indexInParent());
// let wid=textContains('浏览').findOnce();
// print(wid.text());
// print(textContains('¥').findOnce().parent().parent().child(4).click());
// print('累计浏览4个商品可得5000金币'.search('浏览.*?\\d+s'));

// print(textContains('¥').find().length)


// sleep(1000);
// textContains('做任务').findOnce().parent().parent().parent().child(0).click();//关掉任务列表
// sleep(2000);




exit();

let lst=[0, 0, 0, 1, 8, 3];//那个任务按钮所在位置
let wid=depth(0).findOnce();
for(let pst=0;pst<lst.length;++pst){
    print(pst,lst[pst]);
    wid=wid.child(lst[pst]);
}
wid.click();//点击以重新显示列表
sleep(2000);

exit();

textContains('做任务').find().forEach(wid=> {
    print(wid.text());
});
textContains('做任务').findOnce().parent().parent().parent().child(0).click();
// print(textContains('参与小程序').findOnce());

exit();


for(let pst=0;pst<4;++pst){
    let lst=textContains('¥').find();
    lst[pst].parent().parent().child(4).click();
    sleep(2000);
    back();
    sleep(2000);
}

