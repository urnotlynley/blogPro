## 安装

3.0需要node版本在14.16以上

2.0

```javascript
npx create-nuxt-app <项目名>
或者 yarn create nuxt-app <项目名>
```

3.0

```javascript
npx nuxi init nuxt3-app
```



## 目录结构

默认的项目里就如下几个文件和目录，我已经用备注的形式写清楚每个文件的作用了。

```JSON
- .nuxt               // 自动生成的目录，用于展示结果
- node_modules        // 项目依赖包存放目录
- .gitignore          // Git的配置目录，比如一些文件不用Git管理就可以在这个文件中配置
- app.vue             // 项目入口文件，你可以在这里配置路由的出口
- nuxt.config.ts      // nuxt项目的配置文件 ，这个里边可以配置Nuxt项目的方法面面
- package-lock.json   // 锁定安装时包的版本，以保证其他人在 npm install时和你保持一致
- package.json        // 包的配置文件和项目的启动调式命令配置
- README.md           // 项目的说明文件
- tsconfig.json       // TypeScript的配置文件
 
```

随着我们的开发目录也会越来越多，比如常用的还有下面三个目录。

```JSON
- pages               // 开发的页面目录
- components          // 组件目录
- assets              // 静态资源目录
- layouts             // 项目布局目录
```

**访问pages/index.vue**

根目录app.vue，<NuxtWelcome />替换为：<NuxtPage/>

一般vue文件页面顶层的 div 包裹是必需的，不然跳转会丢失状态

## 个性meta标签

### 2.0

在想要设置个性标签的vue文件中,写一个head方法(类似data)

```javascript
//独立设置head信息
  head() {
    return {
      title: this.title,
      meta: [{ hid: "description", name: "news", content: "this is news" }],
    };
  },
```

### 3.0

```vue
<template>
    <Head>  //不确定需不需要head标签
      <Title>{{ title }}</Title>
      <Meta name="description" :content="title" />
    </Head>
</template>
<script>
    // 或者使用useHead
	useHead({
        title: 'snow-title-2',
        meta: [
            { name: 'description', content: 'snow-desc'},
            { name: 'keywords', content: 'snow-kw'}
        ]
    })    
</script>
```

Title不会在页面中显示, 只会在浏览器的标题上显示   **useHead优先级小于Title标签。**



## 引入全局样式

在nuxt.config.js文件中  引入全局css   (Global CSS: https://go.nuxtjs.dev/config-css)

**css是一个数组** 写入你要引入的文件

```
css:['~static/css/index.css']
```

## 自定义启动端口

在package.json中写

```javascript
"config":{
	"nuxt":{
		"host":"ip",
		"post":"1818"
	}
}
```

## 使用loader

在nuxt.config.js添加  (实例)

```javascript
loaders: [
	{
		test: /\.(png|jpe?g|gif|svg)$/,
		loader: "url-loader",
		query: {
			limit:10000,
			name:'img/[name].[hash].[ext]'  // img文件夹下的原来的文件名+hash值.文件扩展名
		}
	}
]
```

## 路由

使用nuxt-link代替a标签    绑定to对象, 使用name跳转, params传参

```javascript
<nuxt-link :to="{ name: 'index', params:{ newsId:3} }">HOME</nuxt-link>
```

获取参数跟vue一样   {{ $route.params.newsId }}

### 动态路由

在对应文件夹下建立 _[参数名].vue的文件   获取数据同样是{{ $route.params.newsId }}  

**注意**:

从其他页面跳转到动态路由页面使用nuxt-link中的name要使用  [文件名]-[参数名]  跳转

#### 在script里获取参数

```typescript
const route = useRoute();
const id = ref(route.params.id)
```

#### 多参数的获取  

目录结果如下:

```typescript
-|  pages/
---| index.vue
---| goods-[name]/
-----| demo2-[id].vue
```

```typescript
<NuxtLink to="/goods-jspang/demo2-38">Demo2.vue</NuxtLink>
```

### 嵌套路由

**目录和文件名同名**  

目录结构如下

```typescript
|--pages
|----parent/
|------child.vue
|----parent.vue
```

在父组件中使用`NuxtChild`

### 参数校验

在js中写

```javascript
validate({params}){
	return /^\d+$/.test(params.id)
}
```

## 动画

自己新建一个css, 最好是在静态文件css中

### 全局动画

```javascript
.page-enter-active, .page-leave-active {
    transition: opacity 2s;
}
.page-enter, .page-leave-active {
    opacity: 0;
}
```

### 单页面动画

同样在css文件重修改page

```javascript
.test-enter-active, .test-leave-active {
    transition: all 2s;
    font-size:12px;
}
.test-enter, .test-leave-active {
    opacity: 0;
    font-size:40px;
}
```

然后在需要使用对应动画的vue中调用

```javascript
export default {
  transition:'test'
}
```

## 布局模板(3.0)

在`layouts` 中新建defaul.vue文件

```vue
<template>
  <div>
    我是布局模板，default.vue
    <slot />
  </div>
</template>
```

有了这个模板后，可以在任何你想要使用的页面中用`<NuxtLayout>`标签为页面赋予模板中的内容。

某页面不想使用layout: 

```typescript
definePageMeta({
    layout: false,
    layout: 'layout-snow' //某页面使用特定的layout
})
```

动态设置layout

```typescript
const router = useRoute()
function enableLayout () {
    router.meta.layout = "layout-snow"
}
```

全局设置，指定layout

```vue
<template>
  <NuxtLayout :name="layoutSnow">
    <NuxtPage/>
  </NuxtLayout>
</template>
<script setup lang="ts">
const layoutSnow = ref("layout-snow")
</script>
```



## 默认模板(2.0)

新建一个app.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
   {{ HEAD }}
</head>
<body>
    <p>这里是所有页面都会加上的内容</p>
    {{ APP }}
</body>
</html>
```

这里的{{ HEAD }}读取的是nuxt.config.js里的信息，{{APP}} 就是我们写的pages文件夹下的主体页面了。需要注意的是HEAD和APP都需要 **大写** ，如果小写会报错的

## 默认布局(2.0)

默认布局主要针对于页面的统一布局使用。它在位置根目录下的layouts/default.vue。需要注意的是在默认布局里不要加入头部信息，只是关于 `<template>` 标签下的内容统一订制。

```vue
<template>
  <div>
    <p>这里是所有页面都会加上的内容</p>
    <nuxt/> 
  </div>
</template>
```

这里的 `<nuxt/>` 就相当于我们每个页面的内容，你也可以把一些通用样式放入这个默认布局里，但是个人不建议这样写，会增加页面的复杂程度。

总结：要区分默认模版和默认布局的区别，模版可以订制很多头部信息，包括IE版本的判断；默认布局只能定制 `<template> `里的内容，跟布局有关系。在工作中修改时要看情况来编写代码。



## 错误页面

在`layouts`文件夹下新建一个error.vue  (**默认**)

在script中接受error参数

```javascript
props:['error']
```

然后在逻辑判断中判断error的状态码statusCode 

例如等于404就显示对应的文字提示

## 多层级组件

在`components`中建文件夹, 然后文件夹中再建.vue文件

使用的时候就用外层文件夹的名称+里面组件的名字

## 组件的懒加载

如果在组件名前面加上`Lazy`前缀，则可以按需懒加载该组件。

## 模块化代码 Composable文件夹的试用

这个是业务逻辑代码的复用   **只有顶层文件会被引入或者下面的test文件夹下面的ts叫`index.ts`**

新建一个文件夹`composables` 然后在文件夹里边，新建一个文件`time.ts`

```typescript
export  const getTime=()=>{
  const timezone = 8;
  const offset_GMT = new Date().getTimezoneOffset();
  const nowDate = new Date().getTime();
  const today = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
  const date = today.getFullYear() + "-" + twoDigits(today.getMonth() + 1) + "-" + twoDigits(today.getDate());
  const time = twoDigits(today.getHours()) + ":" + twoDigits(today.getMinutes()) + ":" + twoDigits(today.getSeconds());
  const timeString ='当前时间：' + date + '  ' + time;
  return timeString;
}

function twoDigits(val) {
  if (val < 10) return "0" + val;
  return val;
}
```

在页面中直接调用就可以了

## 数据请求

### asyncData  (2.0版本)

是在组件创建之前执行的, 所以赋值不能使用this  跟data同级

```javascript
async asyncData() {
    let { data } = await axios.get("https://www.fastmock.site/mock/5d0a1d606c32319ff252ec5e325699e5/buttontest/getJson");
    return { info: data };
  },
```

使用async和await写法优雅一些

### useAsyncData (3.0版本)

Nuxt3中提供了四种方法：`useAsyncData` 、`useFetch` 、`useLazyFetch` 、`useLazyAsyncData` 。

可以查看官网说明:  [在服务端获取数据](https://www.nuxtjs.org.cn/usage/data-fetching.html#%E5%9C%A8%E6%9C%8D%E5%8A%A1%E7%AB%AF%E8%8E%B7%E5%8F%96%E6%95%B0%E6%8D%AE)

```typescript
const res = await useAsyncData("getList", () =>
  $fetch("http://121.36.81.61:8000/getTenArticleList")
);
```

**$fetch( )方法是nuxt3提供的内置方法，我们直接可以使用。**

返回值是一个对象，对象里有四个属性。

- data: 返回的数据，我们需要的服务器数据就在这个属性里。

- error：是否存在错误，如果存在错误，可以在这个属性中获得，返回的是一个对象。

- pending：这次请求的状态，返回的是布尔值。

- refresh：这个返回的是一个函数，可以用来刷新 handler函数返回的数据。

  

```typescript
const res = await useFetch("http://121.36.81.61:8000/getTenArticleList", {  method: "get",  id: 1, });
```

`useFetch` 可以理解为所有的都选择默认配置的`useAsyncData` 方法

## middleware路由中间件

在项目根目录，新建一个`middleware`的文件夹，然后在文件下边新建一个文件`default.global.ts` 的文件。其中的`.global`代表这个中间件是全局的，也就是在每次跳转都会执行下面的代码。

```typescript
export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path === '/demo1') {
     console.log('禁止访问这个页面')
     abortNavigation()  //停止当前导航，可以使用error进行报错
     return  navigateTo('/')
  }
  //通过useNuxtApp可以获取当前页的参数
  const { $config } = useNuxtApp()
  //使用vue-router做路由守卫也行，很灵活
  const { beforeEach, } = useRouter();
 
  if (to.path === '/product') {
    return navigateTo('/product/1',{ replace: true })
  }
  if (to.path === '/index') {
    return navigateTo('/',{ replace: true })
  }
})
```

```typescript
//auth.js内容
export default defineNuxtPlugin(() => {
 //  可以使用addRouteMiddleware()辅助函数手动添加全局或命名路由中间件，例如在插件中。
  addRouteMiddleware('global-test', () => {
    console.log('这个全局中间件被添加到一个插件中，将在每次路由更改时运行')
  }, { global: true })

  addRouteMiddleware('named-test', () => {
    console.log('这个命名的中间件被添加到一个插件中，将覆盖任何同名的现有中间件')
  })
})
```



**如果不写global的话代表是只对注册页面起作用 ,  然后在需要使用的页面注册**

```typescript
<script setup>
definePageMeta({
  middleware: ["default"],
  // or middleware: 'auth'
});
</script>
```

## 静态资源文件

可以使用系统自带的 ~ 来找文件路径  这个表示从根目录开始查找

css中同样适用

## Cookie设置

```typescript
const cookie = useCookie(name, options)
```

options配置参数

1. maxAge/expires

这两个参数都是设置Cookie的有效时长的，如果两个参数你都不设置，那Cookie的值在关闭浏览器的时候将会被清空。两个参数的不同是，maxAge的值是一个数字`Number`,而expires的值是一个日期对象`Date object`.
比如我们希望设置Cookie的过气时间是一个小时，也就是3600秒，那我们的配置就需要这样写

```typescript
const counter = useCookie("counter",{
  maxAge:3600,
});
```

2. httpOnly

这算是一个安全设置，如果把httpOnly设置为true，可以对最常见的XSS攻击起到防范作用。

> 什么是HttpOnly？ HttpOnly是包含在http返回头Set-Cookiew里面的一个附件的flag，所以它是后端服务器对cookie设置的一个附件属性，在生成cookie时使用HttpOnly标志有助于减轻客户端脚本访问收保护cookie的风险。

```javascript
const counter = useCookie("counter",{
  htttpOnly:true,
});
```

3. secure

这也是一个安全设置，如果你的网址不是`HTTPS`的，并且把`secure`的值设置为true，那Cookie的值就不会传递给服务端。总的来说还是一个为了服务器安全的设置。

```javascript
const counter = useCookie("counter",{
  secure:true,
});
```

其余的还有`domain` ,`path` ,`sameSite` ,`encode`,`decode` 这些属性设置，其实都跟安全有关，因为Cookie的设置确实需要考虑安全性，所以根据服务端和app的需求，尽量设置多的安全性参数。

详细的见官网  [配置项](https://www.nuxtjs.org.cn/usage/cookies.html#%E9%85%8D%E7%BD%AE%E9%A1%B9)

## 状态共享

使用`useState`可以定义简单的共享状态

例如在 `composables` 中定义 `useCounter`

```ts
// composables/useCounter.ts
// composables 下模块的同名导出将被自动按需引入
export const useCounter = () => useState('counter', () => 100)
```

`useState` 的第一参数为 `key`，第二参数为初始化的工厂函数

**`useState` 只允许在生命周期中使用。**
