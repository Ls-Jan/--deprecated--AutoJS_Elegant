

var suite={//悬浮窗的配置以及函数调用(感觉用“suite”比用“preset”要更贴切..
    config:{
        alpha:0.8,//窗体透明度
        txSize:20,//选项字体大小
        sep_col:'#FF00FF',//选项之间的分隔符的颜色
        sep_dist:1,//选项之间的分隔符的距离
    },
    title:{//另设，不扔进上面的config主要是因为变量名不好起
        msg:'',//标题内容
        fg:'#FF0000',//标题前景色
        bg:'#00FF00',//标题背景色
        size:20,//标题字体大小
    },

    DoubleClick_Title:function(){},//双击标题时调用的函数(0.5秒内的两次点击视为双击)
    GetFloaty:function(){},//根据配置suite.config和suite.title生成一个悬浮窗，悬浮窗生成后上面的两个配置将不再生效
    GetWinTitle:function(){},//获取标题内容
    SetWinTitle:function(title){},//对窗体的标题内容进行设置
    SetWinList:function(list){},//对窗体中的列表进行设置
    //列表格式为：[{...},{...},...]
    //其中的字典格式为：{'tx':...,'fg':...,'bg':...,'func':...}
    //tx为字符串，为显示的文本内容
    //fg为字符串，为显示的字体颜色(例如'#FFFFFF')
    //bg为字符串，为显示的背景颜色(例如'#000000')
    //func为点击回调函数，是个无参函数(例如function(){})
};
module.exports = suite;

















//**********************************************************************************************
var win=null;
var flag_click=false;//判断标题是否被点击
var flat_fold=true;//判断菜单是否被折叠

suite.GetFloaty=function(){//根据配置suite.config和suite.title生成一个悬浮窗，悬浮窗生成后上面的两个配置将不再生效
    if(win==null){
        win=floaty.rawWindow(
            <vertical alpha={suite.config.alpha}>
                <text id='folder' gravity="center" color={suite.title.fg} bg={suite.title.bg} textSize='15' text=' ∧ ∧ ∧ '></text>
                <text id='title' gravity="center" color={suite.title.fg} bg={suite.title.bg} textSize={suite.title.size}></text>
                <list id='list' padding='0 0' bg={suite.config.sep_col}>
                    <card  w='*' marginTop={suite.config.sep_dist} marginBottom={suite.config.sep_dist}>
                        <vertical>
                            <text gravity="center" bg='{{this.bg}}' color='{{this.fg}}' text='{{this.tx}}' textSize='{{this.txSize}}'/>
                        </vertical>
                    </card>
                </list>
            </vertical>
        );

        win.list.on('item_click',function(item,i,itemView,listView){
            if(item.func){
                item.func();
            }
        });
        
        win.title.click(function(){//以sleep+控制信号量的方式实现“双击”
            if(flag_click){
                flag_click=false;
                suite.DoubleClick_Title();
            }
            else{
                threads.start(function(){
                    flag_click=true;
                    sleep(500);
                    flag_click=false;
                });
            }
        });

        win.folder.click(function(){//点击以折叠(实际上是将list隐藏)
            //属性visibility，对其赋值0、4、8分别获得控件的“显示”、“隐藏但占空间”、“隐藏并且不占空间”的效果
            let args=(flat_fold=!flat_fold)?[0,' ∧ ∧ ∧ ']:[8,' ∨ ∨ ∨ '];
            win.list.visibility=args[0];
            win.folder.setText(args[1]);
            win.setSize(win.getWidth(),-2);
        });

        suite.SetWinTitle('');
    }
    return win;
}

suite.GetWinTitle=function(){
    if(win)
        return win.title.text();
}

suite.SetWinList=function(list){//对窗体中的列表进行设置
    if(win){
        win.list.setDataSource(list);
    }
}

suite.SetWinTitle=function(title){//对窗体的标题内容进行设置
    let t=win.title;
    t.setText(title);
    //经过爷的不断努力+不断尝试，最终找到属性visibility，对其赋值0、4、8分别获得控件的“显示”、“隐藏但占空间”、“隐藏并且不占空间”的效果
    t.visibility=title.length>0?0:8;
}






