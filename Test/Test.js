

console.show();


let keyWord='赚金币';
// let keyWord=".*?浏览.*?\\d+s.+?";
// let keyWord=".+?\\d+s.+?";
let wid=textContains(keyWord).findOnce();
print(wid.depth());
// print(wid.text().search('浏览.*?\\d+s'));
// let wid=textMatches(keyWord).findOnce();
exit();


function GetIndexInParent(wid){//wid.indexInParent不能连续使用才出此下策。返回的是一个列表，正常情况下列表里应该只有一个元素(那就是目标indexInParent)，出现意外情况需要单独debug处理
    let theParent=wid.parent();
    let bounds_wid=wid.bounds();
    let standby=[];
    for(let c=theParent.childCount();c-->0;){
        let test=theParent.child(c);
        let bounds_test=test.bounds();
        if(//依据这个方法所寻得的控件，会出现以下糟糕情形：如果目标控件在屏幕之外，很可能会找到N多个完全符合条件的控件
            (bounds_wid.left==bounds_test.left)&&
            (bounds_wid.right==bounds_test.right)&&
            (bounds_wid.top==bounds_test.top)&&
            (bounds_wid.bottom==bounds_test.bottom)&&
            (wid.text()==test.text())&&
            (wid.desc()==test.desc())
        ){
            standby.push(c);
        }    
    }
    return standby;
}

wid=wid.parent();
wid=wid.parent().child(GetIndexInParent(wid)[0]+1);
print(wid.text());
