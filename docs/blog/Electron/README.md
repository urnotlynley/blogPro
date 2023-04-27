

#### 介绍

main.js一般是主进程, 有且只有一个

renderer.js是多个渲染进程

运行命令是 

```javascript
electron .
```

#### 快速搭建工具

[electron-quick-start](https://www.npmjs.com/package/electron-quick-start)

#### 创建第一个hello world

```javascript
const { app, BrowerWindow } = require('electron)
var mainWindow = null ;  //声明要打开的主窗口
app.on('ready',()=>{
    mainWindow = new BrowserWindow(
     	{
            width: 800,
            height: 600,
            webPreferences:{
                nodeIntegration: true 
            }
        }
    )   //设置打开的窗口大小
    mainWindow.loadFile('index.html')  //加载那个页面
    //监听关闭事件，把主窗口设置为null
    mainWindow.on('closed',()=>{
        mainWindow = null
    })
})
```

**nodeIntegration ** 是否集成node

**可选项:**

![img](https://upload-images.jianshu.io/upload_images/3399573-a58e91e9d077057c.png?imageMogr2/auto-orient/strip|imageView2/2/format/webp)



#### 开发插件

##### nodemon

在开发阶段可以安装nodemon, 监听改变main.js后自动更新

```javascript
"scripts": {
    "dev": "electron .",
    "start": "nodemon --watch main.js --exec \"npm run dev\""
},
```

#### 组件间的数据通讯

renderer.js

```javascript
const { ipcRenderer } = require('electron')
window.addEventListener('DOMContentLoaded',()=>{
    ipcRenderer.send('message', 'hello form renderer')
    ipcRenderer.on('reply', (event, arg) => {
        
    })
})
```

在renderer发送事件, 在main.js中监听对应事件

使用ipcRenderer发送事件, 使用ipcMain监听

```javascript
const { app, BrowerWindow, ipcMain } = require('electron')
app.on('ready',()=>{
    mainWindow = new BrowserWindow({width:400,height:400})   //设置打开的窗口大小
    mainWindow.loadFile('index.html')  //加载那个页面
    //监听关闭事件，把主窗口设置为null
    mainWindow.on('closed',() => {
        mainWindow = null
    })
    ipcMain.on('message',(event, arg) => {
        console.log(arg)
        event.sender.send('reply' , 'hello from main.js')
    })
})
```

event.sender可以找到发送事件的发送者

#### 打开新窗口

打开新窗口的话需要使用 **Electron Remote** 

```javascript
 const BrowserWindow = require('electron').remote.BrowserWindow
```
然后其他的操作或者配置跟BrowserWindow一样

##### 在electron14以后系统移除了remote, 要使用的话需要自己安装

1、首先在自己项目中npm安装 @electron/remote模块

```javascript
npm install --save @electron/remote
```

2、在主进程初始化@electron/remote模块，然后在渲染中使用

```javascript
require('@electron/remote/main').initialize()
```

**在主进程中这样引入**

```javascript
const remote = require('@electron/remote/main')
```

 **在渲染程序中这样引入**

```javascript
const remote = require("@electron/remote")
```

<u>*渲染程序中使用menu   是const Menu = remote.Menu*</u>  

3、在主进程main.js中，设置remote模块，在webPreferences中添加enableRemoteModule:true 和 contextIsolation为false。

```javascript
webPreferences:{ 
    nodeIntegration:true,
    enableRemoteModule: true,
    contextIsolation: false
}
```

4、渲染进程中，require('electron').remote替换为require('@electron/remote')

```javascript
const BrowserWindow = require('@electron/remote').BrowserWindow
```

要使用remote的话

#### 编写菜单模版
新建一个menu.js
```javascript
const { Menu } = require('electron')
var template = [
    {
        label:'凤来怡洗浴会所',
        submenu:[
            {label:'精品SPA'},
            {label:'泰式按摩'}
        ]
    },
    {
        label:'大浪淘沙洗浴中心',
        submenu:[
            {label:'牛奶玫瑰浴'},
            {label:'爱情拍拍手'}
        ]
    }
]
var m = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(m)
```
然后在主进程中引用

```javascript
require('./main/menu.js')
```

**`Menu`  属于是主线程下的模块，所以只能在主线程中使用**

可以在菜单模版中增加 `click` 事件, 例如上面写的打开新窗口

#### 绑定菜单快捷键

绑定快捷键的属性是 `accelerator` 属性，比如我们新打开一个窗口

```javascript
accelerator:`ctrl+n`
```

在lebel的同级, 写上accelerator表示绑定快捷键

#### 创建右键菜单

在渲染程序中

```javascript
var rigthTemplate = [{ label: '粘贴' }, { label: '复制' }]
var m = Menu.buildFromTemplate(rigthTemplate)
window.addEventListener('contextmenu', function (e) {
  //阻止当前窗口默认事件
  e.preventDefault()
  //把菜单模板添加到右键菜单
  m.popup({ window: remote.getCurrentWindow() })
})
```

#### 开启调试模式

在主进程main.js中

```javascript
mainWindow.webContents.openDevTools()
```

#### 在浏览器中打开网页

通过shell在浏览器中打开网页  shell.openExternal

```javascript
const { shell } = require('electron')
var aHref = document.querySelector('#aHref')
```

在onlad中绑定点击事件,  通过getAttribute获取dom绑定的属性值

```javascript
aHref.onclick = e => {
    e.preventDefault()
    var href = aHref.getAttribute('href')
    shell.openExternal(href)
}
```

#### 在主进程中使用BrowserView嵌入网页

```javascript
const view = new BrowserView()
mainWindow.setBrowserView(view)
view.setBounds({ x: 100, y: 150, width: 200, height: 400 })
view.webContents.loadURL('https://electronjs.org/')
```

(使用baidu网址或者其他网址可能无法显示, 是链接的问题)

#### 打开子窗口

```javascript
window.open('https://jspang.com')
```

#### 窗口组件通信

子窗口发送信息

```javascript
window.opener.postMessage(message,targetOrigin)
```

- message : 传递的消息，是`String`类型的值
- targetOrigin : 指定发送的窗口, 如果未指定来源则发送给`*`，即所有窗口。

父窗口接受信息

```javascript
window.addEventListener('message',(msg)=>{
    let mytext = document.querySelector('#mytext')
    mytext.innerHTML = JSON.stringify(msg)
})
```

#### 选择文件对话框

```javascript
const { dialog } = require('electron')   //main主进程引入
const { dialog } = require('@electron/remote')  //渲染进程引入
```

对话框API  dialog.showOpenDialog() 打开对话框

- title ： String (可选)，对话框的标题
- defaultPath ： String (可选),默认打开的路径
- buttonLabel ： String (可选), 确认按钮的自定义标签，当为空时，将使用默认标签
- filters ： 文件选择过滤器，定义后可以对文件扩展名进行筛选
- properties：打开文件的属性，比如打开文件还是打开文件夹，甚至是隐藏文件。

的风格

#### 保存文件

```javascript
dialog.showSaveDialog({
	title:'保存文件',
}).then(result=>{
	console.log(result)
}).catch(err=>{
	console.log(err)
})
```

可以配合fs 保存一个文件到指定位置

```javascript
fs.writeFileSync(result.filePath,'技术胖一个前端爱好者')
```

#### 消息对话框

showMessageBox, 属性很多

- type ：String类型，可以选，图标样式，有`none`、`info`、`error`、`question`和`warning`
- title: String类型，弹出框的标题
- messsage : String 类型，必选 message box 的内容，这个是必须要写的
- buttons: 数组类型，返回的是一个索引数值（下标）

```javascript
dialog.showMessageBox({
    type: 'question',
    title: '去不去由你',
    message: '是不是要跟胖哥去大保健?',
    buttons: ['我要去', '不去了']
}).then(result => {
	console.log(result)
})
```

#### 断网提醒功能

其实这个是JavaScript的一种方式进行监听网络状态,监听的事件分别是`online`和`offline`。

```
window.addEventListener('online',function(){
	alert('来网了哦！')
})

window.addEventListener('offline',function(){
	alert('断网了哦，请稍等！')
})
```

#### 桌面通知 Notification 

Notification.permission 该属性用于表明当前通知显示的授权状态，可能的值包括：

- default ：不知道用户的选择，默认。
-  granted ：用户允许。
-  denied ：用户拒绝。

```javascript
new Notification(title, options)  //或者
new window.Notification(option.title, option)
```

option参数:

- title：通知的标题
- options：通知的设置选项（可选）。
- body：通知的内容。
- tag：代表通知的一个识别标签，相同tag时只会打开同一个通知窗口。
- icon：要在通知中显示的图标的URL。
- image：要在通知中显示的图像的URL。
- data：想要和通知关联的任务类型的数据。
- requireInteraction：通知保持有效不自动关闭，默认为false。

#### 注册快捷键

`globalShortcut` 是主进程中的模块，而且注册的都是全局的快捷键，所以尽量写在`main.js`中。

```javascript
var  globalShortcut = electron.globalShortcut
```

```javascript
globalShortcut.register('ctrl+e',()=>{
    mainWindow.loadURL('https://jspang.com')  
})
```

**注册全局的快捷键必须在`ready`事件之后，才能注册成功。**

##### 检测快捷键

是否注册成功可以使用`globalShortcut.isRegistered()`方法，来检测快捷键是否注册成功.

```javascript
 let isRegister= globalShortcut.isRegistered('ctrl+e')?'Register Success':'Register fail'
 console.log('------->'+isRegister)
```

##### 注销快捷键

因为我们注册的是全局的快捷键，所以当我们关闭软件或者窗口时，记得一定要注销快捷键。防止关闭后打开其他软件和快捷键冲突。

```javascript
app.on('will-quit',function(){
    //注销全局快捷键的监听
    globalShortcut.unregister('ctrl+e')
    globalShortcut.unregisterAll()
})
```

#### 复制功能

```javascript
 const { clipboard } = require('electron')
 const code = document.getElementById('code')
 const btn = document.getElementById('btn')
 btn.onclick = function(){
 	clipboard.writeText(code.innerHTML)
 	alert('复制成功')
 }
```

#### 本地存储使用electron-store

```javascript
const Store = require('electron-store')
const { v4: uuidv4 } = require('uuid')
const path = require('path')

class DataStore extends Store {
  constructor(settings) {
    super(settings)
    this.tracks = this.get('tracks') || []
  }
  saveTracks() {
    this.set('tracks', this.tracks)
    return this
  }
  getTracks() {
    return this.get('tracks') || []
  }
  addTracks(tracks) {
    const tracksProps = tracks
      .map(x => {
        return {
          id: uuidv4(),
          path: x,
          fileName: path.basename(x),
        }
      })
      .filter(x => {
        const currentTracks = this.getTracks().map(i => i.path)
        return currentTracks.indexOf(x.path) < 0
      })
    this.tracks = [...this.tracks, ...tracksProps]
    return this.saveTracks()
  }
}
module.exports = DataStore
```

#### webContents中有一个 did-finish-load 事件, 导航完成时触发

```javascript
mainWindow.webContents.on('did-finish-load', () => {})
```

原生使用js时候

```javascript
let { dataset, classList } = event.target
```

使用dataset获取自定义在dom上的数据, 绑定自定义的数据是data-xx='' (**xx**是自定义的参数名)

#### **Audio**标签

**Loadedmetadata** 事件是媒体加载完毕以后的事件

**Timeupdate** 是播放时间更新会触发的事件 

#### **Electron**打包

- Electron packager
- Electron builder
