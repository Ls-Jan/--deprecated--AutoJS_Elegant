# 此项目已废弃

#### 废弃原因：
- 薅不到羊毛，有这时间刷手机还不如干点别的有价值的事？
- 许多APP有反脚本策略，使用AutoJS容易不知不觉被拉黑
- 太久没维护，而且也没维护价值


<br>
<br>
<br>


# 脚本功能

主要用于各大电商平台(京东、美团、淘宝、饿了么等)的“果树种植”活动的任务浏览自动化/半自动化。

<br>
<br>
<br>
<br>











# 前置说明

1、使用的AutoJS版本为【Version4.1.1 Alpha2】，安装包我附在了Release那里：<a href='https://github.com/Ls-Jan/AutoJS_Elegant/releases/download/Release/AutoJS.apk'>点此下载AutoJS免费版</a>

2、脚本运行效果请移步到<a href='https://github.com/Ls-Jan/AutoJS_Elegant/tree/main/%E8%BF%90%E8%A1%8C%E6%BC%94%E7%A4%BA'> 运行演示 </a>查看

3、建议下载v1.1的脚本<a href='https://github.com/Ls-Jan/AutoJS_Elegant/releases/download/Release/Elegant.v1.1.zip'> Eleganev1.1 </a>，这份脚本用起来更加顺手。
<br>下载完的脚本压缩包要解压到AutoJS对应脚本路径中，怎么做就不用我多说了吧

<br>
<br>
<br>
<br>










# 运行说明

一般说明：

1. 在AutoJS应用里点击“【启动脚本】.js”运行脚本，如果弹出消息气泡提示没运行成功就再次点击运行，直到运行成功。不止是开始运行脚本时有概率失败，运行脚本的过程中也有概率出现闪退问题， 这是autojs自身不过硬造成的结果(说白了这问题我这里修不了)，雨我无瓜

2. “一键任务”能自动完成相对应的浏览任务，这取决于 `TaskPreset文件夹` 下的文件，目前能够完成的任务有 芭芭农场(淘宝/支付宝)、饿了么农场(饿了么/支付宝)、京东农场(京东)。脚本完成任务后先别急着退出，先看看有无漏网之鱼(没有完成的任务)。

3. “[循环点击]”就是重复点击同一处若干次的功能，用于果树的浇水施肥(循环点击按钮)。
<br>可以对点击次数和点击时间间隔进行修改。

4. “[机械点击]”则是以“→点击→返回→(再点击)→”这个循环对任务进行浏览，专门针对类似于美团果树的浏览任务(详见<a href='https://github.com/Ls-Jan/AutoJS_Elegant/tree/main/%E8%BF%90%E8%A1%8C%E6%BC%94%E7%A4%BA'> 运行演示 </a>)。
<br>和[循环点击]一样，其参数可以进行修改，其中“再点击时长”为0说明不需要二次点击(再点击主要是对付那些浏览完之后按钮变成“领取”的任务)

5. 如果要停下当前正在运行的任务，请双击黄色标题(运行任务时会出现在悬浮窗顶部位置)，双击无效的话请快速多次点击

6. 在浏览任务以及使用“[机械点击]”功能时有概率跑飞(也就是出现“不知道点到哪里”或者“怎么就跳到桌面了”的情况)，要稍微注意一下。

<br>
<br>

额外说明：

1. 如果想让[循环点击]和[机械点击]的参数修改在下一次脚本启动时仍然生效，请移步到 `Config.js` 下将25行处的“storages.remove(config.storageName)//...”注释掉

2. 嫌界面丑？嫌悬浮窗位置不好？嫌颜色不好看？可以到 `Config.js` 下对部分参数进行设置，并且记得先取消掉25行“storages.remove(config.storageName)//...”的注释让你在文件中的设置生效

3. 如果在完成某个平台的任务时总会出现一些问题(例如在饿了么会出现点击了类似于“淘特任务”的情况)那么就需要到对应的TaskPreset文件(也就是 `TaskPreset文件夹` 下的文件)中进行修改

4. 想要更多的一键自动化？例如“消费金(支付宝)”、“淘金币(淘宝)”之类的，只需要在 `TaskPreset文件夹` 下照猫画虎地添加js文件即可，只不过要先到 `ViewTask.js` 看下task的结构，并且看看另外几个TaskPreset文件然后再去添加新的TaskPreset文件。只不过如果某些平台不是控件型而是画布型的(例如美团果树，没法寻找控件按钮)就趁早打消脚本自动化的念头老老实实手动完成。

5. 如果手机很卡的话就需要在 `ViewTask.js` 里头大动刀子，把所有形如sleep(2000)的膜法数字都调大它(这些膜法数字我没怎么管，因为我脚本写好就刚好给自己用就行了)。调大了都没用的话这边建议换个手机呢:kissing_heart:


<br>
<br>
<br>
<br>












# 碎碎念

1. 自用勿宣传
2. 感觉有不少平台开始反脚本，例如淘宝的芭芭农场，我单次施肥被控制在0.01%，去年至今一直没恢复，然后就是支付宝里头的芭芭农场，脚本开循环点击时有极大可能性提示异常


