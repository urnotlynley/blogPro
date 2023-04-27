# react学习

1. 使用create-react-app创建项目

2. render里的第一个数据是jsx, 相当于React.reacteElement
   组件首字母必须大写(小写无法识别成组件), 组件可以传递字符串/数组/对象/事件 (都是单向数据流,子组件不建议修改数据)

   **使用jsx语法需要引入React，不引无法使用**

3. 只能返回一个根节点, 可以使用React.Fragment占位符  或者 return一个数组

4. <u>使用registerServiceWorker可以在部署到线上以后让用户没网访问时展示上一次访问内容</u>

安装命令前端加sudo  是以管理员的身份安装插件

### class类语法:

1. 使用变量要是用  **{}**
   class testClass extends React.Component里面使用 **constructor(props)** 接受传进来的参数   使用**super(props)**是固定语法，**props**也是固定的

2. 不能直接修改state里的数据(就是vue中的data)  要使用 **setState** 修改数据

3. setState可能是异步的,  对于多个setState执⾏行行，会合并成一个调⽤用，因此对同一个状态执⾏多次只起一次作⽤(最后一次)
   this.setState((state, props) => ({ counter: state.counter + 1}))  传入函数可以拿到最新的值, setState官方建议**设置为函数形式而不用对象形式**

   setState中的键名使用[]中括号包起来表示一个变量, 否则表示一个字符串的key

4. class中的生命周期函数:  

   - componentDidMount组件挂载时    

   - componentWillUnmount组件卸载时

```javascript
dangerouslySetInnerHTML={{ __html:item}}
```
设置标签上的html可以被识别转义(类似于v-html)
label标签的for="其他的id"便签要改成htmlFor  (label标签点击后可以让指定输入框获取焦点)

### **prop类型**

```javascript
import PropTypes from "prop-types"
```

使用 **PropTypes** 限制组件传值的类型
子组件名称.propTypes = {变量名:PropTypes.string.[isRequired]}
子组件名称.deafultProps 设置默认值
PropTypes .arrayOf(PropTypes .string,PropTypes.number)  使用或语法

*** 建议不要使用index作为key值，这样diff算法会匹配不上，相当于全部都重新渲染了，影响性能**

*** 请求最好放在componentDidMount中**
*** 避免子组件频繁更新应该在shouldComponentUpdate中做判断返回false**

### css模块化

```javascript
import {createGlobalStyle} from 'styled-components'
```

需要引入，在render中插入

```javascript
<Fragment>
	<createGlobalStyle />
	<App />
</Fragment>
```

*** 可以使用reset.css重置所有浏览的基本样式，自行在官网搜索**

```javascript
import styled from "styled-components"
```

styled.a标签设置跳转地址可以 **设置attrs({href:'/'})**  或者 **在引用的地方直接写href**

render函数里面绑定的style要用双括号  **{{}}**  因为里面的括号代表一个对象   变量使用单括号 **{}**

### CSS动画

```javascript
import { CSSTransition } from "react-transition-group"
```

```javascript
<CSSTransition in={props.focused} timeout={200} classNames="slide">
    //包裹需要使用动画的组件
    <NavSearch
    className={props.focused ? "focused" : ""}
    onFocus={props.handleInputFocus}
    onBlur={props.handleInputBlur}></NavSearch>
</CSSTransition>
```

1. in设置动画开关  
2. timeout=设置动画时长 
3. classNames取动画名称  
4. 在css中使用.slide-enter和.slide-exit设置具体的动画形式

5. 设置unmountOnExit 意思是元素退场时，自动把DOM也删除

6. 设置appear=｛true｝意思是第一次展示就会有动画效果，第一帧的class叫 .slide-appear  .slide-appear-active

## redux:

1. 创建store需要使用createStore方法,并且传入reducer参数
2. store里面有一个reducer.js文件，负责管理整个应用的数据
3. store.dispatch调用方法

##### combineReducers 功能（是redux中/ redux-immutable中的功能）

combineReducers整合所有的reducer，避免一个reducer中有太多的数据引起混乱

```javascript
import { combineReducers } from "redux"
```

```javascript
export default combineReducers({
  header: headerReducer,
})
```

可以在每个组件中创建一个store和reducer做模块化，最好也使用 **actionCreator** 统一创建action

### redux-thunk中间件

```javascript
yarn add redux-thunk
```

redux-thunk中间件帮助在 Redux 应用中实现异步性。是对dispatch的升级

store中要使用middleware， 需要使用applyMiddleware(...middleware)

```javascript
const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose
const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)))
```

在actioncreators中  直接返回一个**方法(函数)**

**actioncreators中不需要暴露的方法最好放在顶部或者底部集中放置**

```javascript
export const getTodoList = ()=>{
   return (dispatch)=> axios.get(
       "https://www.easy-mock.com/mock/5f583bdbd5906660c22daac7/react/getList"
     )
     .then((res) => {
       console.log("获取axios的list", res)
       let action = initListAction(res.data.list)
       dispatch(action)
     })
 }
```

### react-redux

1. react-redux的核心组件**Provider**

   组件使用**Provider**包裹 ，可以绑定state={state}  

   这样包裹的组件都可以使用store里的数据了

2. **connect** 方法是连接方法，让组件和store做连接，前提是该组件被Provider包裹

```javascript
export default connect(mapStateToProps, mapDispatchToProps)(TodoList[自己的组件名])   
```

​		有两个：

​		**mapStateToProps**   把state映射到props

​		**mapDispatchToProps** 和dispatch做关联

### immutable对象

```javascript
yarn add immutable
```

immutable对象不可以被改变，用来固定一个变量，避免被改

```javascript
import { fromJS } from "immutable"
const defaultState = fromJS({
  focused: false,
})
```

获取值要使用 **get('变量名').get('变量名')**  或者使用使用 **getIn(['a','b','c'])**

改变值要使用 **state.set('focused',true)**

改变多个值可以使用 **state.merge({list:action.data,totalPage: action.totalPage})**

immutable对象的set方法，会结合之前的immutable对象的值和设置的值，返回一个全新的对象（并不是直接使用平常的state.set方法的意思 ）

fromJS是把数据改成immutable对象，toJS是把immutable对象转换成普通数据类型，也可以使用List()方法转化成immutable对象，需要注意的是List()方法只能把外层转化成immutable对象，层级深的不能转化

### redux-immutable插件

引入redux-immutable中的combineReducers，这样创建的对象就是一个immutable对象，获取里面的值需要使用get，set方法

### react-router-dom路由

```javascript
yarn add react-router-dom
```

```javascript
import { BrowserRouter, Route } from "react-router-dom"
```

BrowserRouter, Route(路由规则)都是只能在有一个外层盒子

HashRouter和BrowserRouter两个路由格式,  一个带#号一个不带

可以加上exact  路径全相等才显示，不加则是只要包含该字符串就显示

如果使用了嵌套路由, 使用exact的话容易出现子路由出不来的情况, 因为精准匹配在父路由就被拦截了

```javascript
import { Link } from "react-router-dom"
```

使用Link替代a标签，跳转使用to  可以写字符串或者对象 
```javascript
to={{pathname:'/home/7'}}
```

withRouter可以有能力获取router页面的内容

withRouter(组件名)

```
<Router path="/" component={Main}></Router>
```

component一定要是小写

<Router></Router>只写component不写path的话 可以放最后用于匹配其他路由显示404页面

使用 <Switch></Switch> 标签包裹,里面写每个Route, 项目会根据path路径匹配展示对应的路由



### PureComponent是另一种Component

PureComponent自带了shouldComponentUpdate浅比较功能，用来提升性能

使用PureComponent最好是结合immutable数据格式，不然会遇到坑



在render函数中可以使用 **this.props.match.params** 拿到路由携带过来的参数 / 后面的参数

在render函数中可以使用 **this.props.match.location** 拿到路由携带过来的参数 ？后面的参数（需要自己解析）

使用innerRef可以获取到真实的dom元素

在render里面写上{this.props.children} 表示自定义子页面



```javascript
import { Redirect } from 'react-router-dom'
```

Redirect用来重定向页面

```javascript
<Redirect to="/login" />
```

### react-loadable

```javascript
yarn add react-loadable
```

###### Example

```javascript
import Loadable from 'react-loadable';
import Loading from './my-loading-component';  //这个就是加载页面的组件，可删掉或自己写
 
const LoadableComponent = Loadable({
  loader: () => import('./'),
  loading: Loading, //loading是一个函数，返回一个对象或者组件
  loading: () => {  //下面的可以替代上面的内容
    return <div>正在加载...</div>
  },
});
 
export default class App extends React.Component {
  render() {
    return <LoadableComponent/>;
  }
}
```

### **使用Less**

```javascript
yarn add less less-loader
```

先使用yarn eject暴露项目

然后在文件webpack.config.js中大概在60多行增加代码

```javascript
const lessRegex = /\.less$/;    //新增
const lessModuleRegex = /\.module\.less$/;    //新增
```

在sass配置的后面增加:

```javascript
{
    test: lessRegex,
    exclude: lessModuleRegex,
    use: getStyleLoaders(
        {
            importLoaders: 3,
            sourceMap: isEnvProduction && shouldUseSourceMap,
        },
        "less-loader"
    ),
    sideEffects: true,
},
{
    test: lessModuleRegex,
    use: getStyleLoaders(
        {
            importLoaders: 3,
            sourceMap: isEnvProduction && shouldUseSourceMap,
            modules: {
            getLocalIdent: getCSSModuleLocalIdent,
        },
    },
    "less-loader"
    ),
},
```

### 跨域代理

安装 http-proxy-middleware (1.0+版本要使用createProxyMiddleware, 不使用proxy了)

```javascript
yarn add http-proxy-middleware
```

在src文件夹下新建 setupProxy.js文件

```javascript
const { createProxyMiddleware } = require("http-proxy-middleware")
module.exports = function (app) {
  // app.use(
  //   createProxyMiddleware("/weather", { target: "http://api.map.baidu.com/" })
  // )
  app.use(
    createProxyMiddleware("/weather", {
      target: "http://api.map.baidu.com/",
      changeOrigin: true,
      // pathRewrite: {
      //   "^/api": "/",
      // },
    })
  )
}
```

### **createRef()**

通过formRef = React.createRef()创建ref实例, 然后通过ref={this.formRef}绑定实例

在需要获取值的地方const form = this.formRef.current  获取到form实例

```javascript
getValues = () => {
    const form = this.formRef.current
    const values = form.getFieldsValue(true)
    console.log("values", values)
  }
```

获取this.formRef.current一定要写成箭头函数, 不然获取不到this

**这是class类组件的方法, 如果是用的函数方法好像是要用useImperativeHandle**

函数组件不像类组件有实例，所以不能通过 createRef 实现对子组件的引用，而是在子组件内通过 forwardRef + useImperativeHandle 的方式向父组件暴露数据

forwardRef和useImperativeHandle 都是react中的方法,需要先引用

```
const Child2 = forwardRef((props, ref) => {
  const [ msg, setMsg ] = useState('我是 child')
  useImperativeHandle(ref, () => ({
    // 向外暴露修改 msg 的方法
    fn: () => {
      setMsg(msg => msg + '!')
    }，
    msg
  }))
  return (
    <div>
      <p>{ msg }</p>
    </div>
  )
})
```





### 获取子组件的数据或方法

首先在父组件页面给子组件绑定onRef

```javascript
<Child onRef={（ref）=>this.child=ref} />   //child随便取名
```

然后在子组件的componentDidMount中写上 **this.props.onRef(this)**

然后在父组件里就可以使用了

```javascript
this.child.state.xxx //获取
this.child.dosomthing() // 调用
```





### react引用百度地图Map

先获取通过ID盒子获取一个地图实例, 然后设置中心点

**BMapGL如果报错的话 前面需要加上window实例**

```javascript
this.map = new window.BMapGL.Map("orderDetailMap")
this.map.centerAndZoom(new window.BMapGL.Point(116.404, 39.915), 14)
```

**每一个坐标点都需要转化成Point点才能使用**

```javascript
new window.BMapGL.Point(116.404, 39.915)
```



### 引入echarts

```javascript
npm install --save echarts-for-react
npm install --save echarts
```

设置主题 

先引入echartTheme然后

```javascript
componentWillMount() {
	echarts.registerTheme("Imooc", echartTheme)
}
```

获取数据以后然后渲染数据

```javascript
<ReactEchart option={this.getOption()}  theme="Imooc" />
```

页面可能会报错Attempted import error: ‘echarts‘ does not contain a default export (imported as ‘echarts‘)

方法一：很大可能是echarts-for-react不支持echarts最新版本，可以安装旧版本
指令：npm install echarts@4.9.0

方法二：把import方式 改成：var echarts = require(‘echarts’);
如果要用import，就这样：import * as echarts from ‘echarts’

如果需要按需加载的话:

```javascript
import "echarts/lib/chart/bar"
import "echarts/lib/component/tooltip"
import "echarts/lib/component/title"
import "echarts/lib/component/legend"
import "echarts/lib/component/markPoint"
```

### React Hooks

```javascript
const [ count , setCount ] = useState(0);
```

使用的es6的解构,  分别是声明、读取、使用（修改）

等同于下面的代码

```javascript
let _useState = userState(0)
let count = _useState[0]
let setCount = _useState[1]
```

**React Hooks不能出现在条件判断语句中，因为它必须有完全一样的渲染顺序**。

#### useEffect

**useEffect**的第二个参数, 它是一个数组，数组中可以写入很多状态对应的变量，意思是当状态值发生变化时，我们才进行解绑。但是当传空数组`[]`时，就是当组件将被销毁时才进行解绑，这也就实现了`componentWillUnmount`的生命周期函数。

#### useContext   父子组件的传值

```js
const CountContext = createContext()
<CountContext.Provider value={count}>
</CountContext.Provider>
```

里面包裹子组件, 子组件通过useContext 获取值

```js
const CountContext = createContext()
const count = useContext(CountContext)  //一句话就可以得到count
```

const CountContext = createContext()最好是写在公共部分, 不然两个组件都需要创建

### useReducer

```javascript
import React, { useReducer } from 'react';
function ReducerDemo(){
    const [ count , dispatch ] =useReducer((state,action)=>{
        switch(action){
            case 'add':
                return state+1
            case 'sub':
                return state-1
            default:
                return state
        }
    },0)
    return (
       <div>
           <h2>现在的分数是{count}</h2>
           <button onClick={()=>dispatch('add')}>Increment</button>
           <button onClick={()=>dispatch('sub')}>Decrement</button>
       </div>
    )
}
export default ReducerDemo
```

**useReducer所在的function需要大写开头**, 不然使用会报错

useReducer要传入两个参数,一个是Reducer一个是初始值

接受useReducer也有两个值, 一个是当前变量, 一个是dispatch方法

### useMemo

解决子组件重复渲染的问题, 用法和useEffect一样有两个参数