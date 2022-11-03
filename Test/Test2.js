


console.show();

let wid=text('去收集').findOnce();
print(wid.bounds() == text('去收集').findOnce().bounds());


print(wid.childCount());

function FindWidgeIndexes(wid){//获取控件的路径
    let indexes=[]
    for(let d=wid.depth();d-->0;){
        let bounds_child=wid.bounds();
        wid=wid.parent();
        for(let c=wid.childCount();c-->0;){//indexInParent不靠谱，麻了，只能通过这种方式寻找控件
            let test=wid.child(c);
            let bounds_test=test.bounds();
            if(
                (bounds_child.left==bounds_test.left)&&
                (bounds_child.right==bounds_test.right)&&
                (bounds_child.top==bounds_test.top)&&
                (bounds_child.bottom==bounds_test.bottom)
            ){
                indexes.push(c);
                break;
            }
        }
    }
    indexes.reverse();
    return indexes;
}

function LoadWidgetIndexes(indexes){//读取路径返回控件
    try{
        let wid=depth(0).findOnce();
        for(let pst in indexes){
            wid=wid.child(indexes[pst]);
        }
        return wid;
    }
    catch(err){
        print(err);
    }
    return null;
}

let path=FindWidgeIndexes(wid);
let www=LoadWidgetIndexes(path);
print(path);
print(www);

sleep(10000);
console.hide();

