## V3使用心得

### vscode插件

vscode中使用插件Volar来验证变量是否被调用, 2.7以下版本继续使用vetur

Vetur插件对template使用eslint-plugin-vue进行了检测,没有支持vue3的新特性，所以需要把这个检测关闭。

**在vscode的设置-》扩展-》vetur-》Validtion：template取消选中即可。**

![img](https://img-blog.csdnimg.cn/20210326103643540.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQzMzk3Njk2,size_16,color_FFFFFF,t_70)

### 报错解决

在开发中引入vue文件, 但是项目 报错找不到模块“../views/Home.vue”或其相应的类型声明

在根目录新建env.d.ts文件

```typescript
// 在文件中加上
declare module '*.vue' {
   import type { DefineComponent } from 'vue'
   const component: DefineComponent<{}, {}, any>
   export default component
}
// 或者
declare module '*.vue' {
   import type { DefineComponent } from 'vue'
   const component: ComponentOptions | ComponentOptions['setup']
   export default component
}
```

### 快捷路径 (@)

首先在项目的 `vite.config.ts` 文件中，配置路径别名
```typescript
import { defineConfig } from 'vite'
import path form 'path'
export default defineConfig({
  resolve: {
    //配置文件扩展名
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'assets': path.resolve(__dirname, 'src/assets')
    },
  },
})
```

有时候在 `vite.config.ts` 中配置了以后编辑器还会有红线提示, 还需要做下面的配置

在 tsconfig.json 文件中同样需要添加路径配置

```typescript
{
  "compilerOptions": {
  	"baseUrl": "./",
  	"paths": {
  	  "@": ["src"],
  	  "@/*": ["src/*"],
  	  "assets/*": ["src/assets/*"]
  	}
  }

```

### 获取dome

vue内置了getCurrentInstance方法

```javascript
import { getCurrentInstance } from 'vue'
```

```javascript
// 获取页面的实例对象
const pageInstance = getCurrentInstance();
// 获取dom节点对象
const tagDomObj = pageInstance.refs.divDom;
```

或者直接声明一个同ref名称一样的变量

```typescript
const myParagraph = ref(null)  //(myParagraph跟ref绑定的同名)
```



## element plus

使用element plus的图标需要安装插件或者引入CDN

而且使用时由于部分标签可能被占用, 所以最好是使用别名的形式给icon注册时候就用别名注册

```javascript
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(`el-icon-${changeToLine(key)}`, component)
}
```

changeToLine在单独的ts文件中声明

```javascript
export const changeToLine = (value: string) => {
  return value.replace(/(A-Z)g/, '-$1').toLocaleLowerCase()
}
```

## Props传值

使用defineProps类型

```typescript
let props = defineProps<{
	collapse: boolean
}>()
//或者
let props = defineProps({
	collapse: {
        type:boolean,
        default:false
    }
}
```

子组件传值

```typescript
let emits = defineEmits(['update:collapse'])
然后在事件中调用
emits('update:collapse', true)
```

父组件传值的部分就要写成

```javascript
v-model:collapse="collapse"
```

## 判断是否使用了slot

可以使用useSlots来判断是否使用了slots

```javascript
import { useSlots } from "vue"
let slots = useSlots()
```

如果有使用, 可以通过slots.default来判断是否有值



自定义组件里面使用$slots.xxx(对应插槽的名称)来判断是否用户是自定义插槽, 否则显示默认插槽

```typescript
<slot name="editCell" v-if="$slots.editCell"></slot>
<template v-else>
	<el-icon-check class="check" @click="clickCheck(scope)" />
	<el-icon-close class="close" @click="clickClose(scope)" />
</template>
```

## 插件unplugin-auto-import

自动引入插件, 可以省去引入ref, watch等代码

```
import AutoImport from 'unplugin-auto-import/vite'
//在vite.config.js的plugins中
AutoImport({
      imports: ['vue', 'vue-router'], // 自动导入vue和vue-router相关函数
      dts: 'src/auto-import.d.ts', // 生成 `auto-import.d.ts` 全局声明
    }),
```

## object.freeze(arr)  冻结数据

若想让定义的对象或数组的数据也不能改变，可以使用object.freeze(arr)进行冻结。冻结指的是不能向这个对象或数组添加新的属性，不能修改已有属性的值，不能删除已有属性。

```javascript
const arr = [];
Object.freeze(arr);
// 不报错，但数据改变无效
arr[0] = 1;
arr[1] = 2;
arr[2] = 3;
console.log(arr.length); // 输出：0
```

## [jt]sx中插槽的调用

```tsx
{/* jsx的写法 核心调用代码块*/}
const slots = {
      {/* 默认插槽 */}
      default: () => {
        return (
          <>
            <span>{'默认区域'}</span>
          </>
        );
      },
      {/* 自定义插槽 */}
      'top-section': () => {
        return (
          <>
            <span>{'头部导航栏'}</span>
          </>
        );
      },
      'aside-section': () => {
        return (
          <>
            <span>{'侧边导航栏'}</span>
          </>
        );
      },
      'main-section': () => {
        return (
          <>
            <span>{'主体内容区'}</span>
          </>
        );
      },
      'head-section': () => {
        return (
          <>
            <span>{'头部内容区'}</span>
          </>
        );
      },
      'opts-section': () => {
        return (
          <>
            <span>{'中间内容区'}</span>
          </>
        );
      },
      'data-section': () => {
        return (
          <>
            <span>{'数据展示区'}</span>
          </>
        );
      },
      'paging-section': () => {
        return (
          <>
            <span>{'底部区'}</span>
          </>
        );
      },
    };
return () => (
    {/* 插槽布局组件调用 */}
    <content-layout v-slots={slots} />
)
```

插槽都用<></>包裹一层

## useAttrs  获取props中未获取的数据

vue中提供了useAttrs方法

```
let attrs = useAttrs()
// 在想要绑定的地方展开就可以了
{...attrs}就可以了
```

Css类型,在Vue中自带了, 可以自己引入

```typescript
import { CSSProperties } from 'vue'
```



## 作用域插槽

在子组件声明好作用域插槽

```javascript
<slot name="action" :form="form" :model="model"></slot>
```

在父组件中使用

```javascript
<template #action="scope">
    <el-button type="primary" @click="submitForm(scope)">确认</el-button>
	<el-button @click="resetForm(scope)">重置</el-button>
</template>
```

```javascript
interface Scope {
  form: any
  model: any
}
let submitForm = (scope: Scope) => {
  console.log('submitForm',scope)
  scope.form.validate()
}
let resetForm = (scope: Scope) => {
  console.log('resetForm')
  scope.form.resetFields()
}
```

声明好Scope的类型, 然后在自定时事件上可以调用

## v3基础数据交互方式

### watch事件

watch事件中有两个参数, 第一个参数是监听的值, 第二个是监听的回调

```typescript
watch(() => props.visible, (val) => {})
```

### props接收

```javascript
let props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
```

### emits

```javascript
let emits = defineEmits(['update:visible', 'changeItem'])
//在需要调用的地方调用就行了
emits('update:visible', val)
emits('changeItem', item)
```

## 手动分发defineExpose

子组件是`<script setup>`时，父组件直接调用就会提示clear方法未定义。[官网](https://v3.cn.vuejs.org/api/sfc-script-setup.html#defineexpose)有这么一句话：`使用 <script setup> 的组件是默认关闭的，也即通过模板 ref 或者 $parent 链获取到的组件的公开实例，不会暴露任何在 <script setup> 中声明的绑定。`因此，父组件是不能直接访问子组件的方法。需要子组件手动的抛出才行。

子组件中需要如此修改：

```javascript
<script setup>
    import { defineExpose, ref } from 'vue';
    const data = ref('');
    function clear(){
        data.value = ''
    }
    defineExpose({ clear })
</script>
```

## 开发插件部分使用

### 1、vite-plugin-vue-setup-extend

解决vue3下 script setup语法糖 下 ，手动设置组件name不方便的问题

```undefined
npm i vite-plugin-vue-setup-extend -D
```

*在文件vite.config.ts中*

```typescript
import setupExtend from 'vite-plugin-vue-setup-extend';
export default defineConfig({
  plugins: [
    ...
    setupExtend()
  ],
});
```

使用:  使用name以后可以给组件自定义名称

```typescript
<script lang="ts" setup name="demo">

</script>
```



### 2、unplugin-auto-import

实现vue函数的自动导入,这样如ref, computed，watch等就不用手动导入了

```cpp
 npm i unplugin-auto-import -D
```

*在文件vite.config.ts中*

```jsx
import AutoImport from 'unplugin-auto-import/vite';
export default defineConfig({
  plugins: [
    ...
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        {
          vuex: ['useStore']
        }
      ],
      resolvers: [],
      dts: false
    }),
  ],
});
```

**当前无效与eslint冲突，如果直接使用依然会报错**
 这里采用了全局eslint还需安装*npm i eslint-plugin-auto-import  -D*
 顾最终配置如下
 *在vite.config.ts文件中*

```tsx
export default ({ mode }) => {
  return defineConfig({
    plugins: [
      AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/ // .md
        ],
        imports: [
          'vue',
          'vue-router',
          {
            vuex: ['useStore']
          }
        ],
        resolvers: [ElementPlusResolver()],
        dts: './auto-imports.d.ts',
        // eslint报错解决
        eslintrc: {
          // 此处为true运行后会生成.eslintrc-auto-import.json  auto-imports.d.ts文件
          enabled: true, // 此处第一次运行使用true,之后改为false
          filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
          globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        }
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      }),
    ],
  });
};
```

*在.eslintrc.js文件中*

```dart
  extends: [
    ...
    './.eslintrc-auto-import.json'
  ],
```

*在tsconfig.json文件中*

```bash
  compilerOptions: [
    ...
    "types": ["element-plus/global"]
  ],
"include": [..., "auto-imports.d.ts"],
```

### 3、unplugin-vue-components

实现vue组件库的自动按需导入,这样就不用手动导入了

```undefined
npm i unplugin-vue-components -D
```

*在文件vite.config.ts中*

```jsx
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        {
          vuex: ['useStore']
        }
      ],
      resolvers: [ElementPlusResolver()],
      dts: false
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
  ]
});
```

### 4、vite-plugin-compression

静态资源压缩

```undefined
npm i vite-plugin-compression -D
```

*在文件vite.config.ts中*

```jsx
// 静态资源压缩
import viteCompression from 'vite-plugin-compression';
export default defineConfig({
  plugins: [
    ...
    viteCompression({
      verbose: true,
      disable: false, // 不禁用压缩
      deleteOriginFile: false, // 压缩后是否删除原文件
      threshold: 10240, // 压缩前最小文件大小
      algorithm: 'gzip', // 压缩算法
      ext: '.gz' // 文件类型
    })
  ],
});
```

### 5、rollup-plugin-visualizer

打包分析,可视化并分析构建包，查看哪些模块占用空间大小，以及模块的依赖关系

```undefined
npm i rollup-plugin-visualizer -D
```

*在文件vite.config.ts中*

```jsx
import visualizer from 'rollup-plugin-visualizer';
export default defineConfig({
  plugins: [
    ...
    visualizer({
        // 打包后自动打开分析报告
        open: true
      })
  ],
});
```

## axios

v1.x.x 之后是没有 `common` 字段了，注意去 [package.json](https://gitee.com/lyt-top/vue-next-admin/blob/master/package.json) 中查看 `axios` 版本

## Pinia

```javascript
import { defineStore } from 'pinia'

// 你可以对 `defineStore()` 的返回值进行任意命名，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。(比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useAlertsStore = defineStore('alerts', {
  // 其他配置...
})
```

将返回的函数命名为 *use...* 是一个符合组合式函数风格的约定。

`defineStore()` 的第二个参数可接受两类值：Setup 函数或 Option 对象。

### Option Store

与 Vue 的选项式 API 类似，我们也可以传入一个带有 `state`、`actions` 与 `getters` 属性的 Option 对象

js

```javascript
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: {
    double: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})
```

你可以认为 `state` 是 store 的数据 (`data`)，`getters` 是 store 的计算属性 (`computed`)，而 `actions` 则是方法 (`methods`)。

### Setup Store

也存在另一种定义 store 的可用语法。与 Vue 组合式 API 的 [setup 函数](https://cn.vuejs.org/api/composition-api-setup.html) 相似，我们可以传入一个函数，该函数定义了一些响应式属性和方法，并且返回一个带有我们想暴露出去的属性和方法的对象。

js

```javascript
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  function increment() {
    count.value++
  }

  return { count, increment }
})
```

在 *Setup Store* 中：

- `ref()` 就是 `state` 属性
- `computed()` 就是 `getters`
- `function()` 就是 `actions`

Setup store 比 [Option Store](https://pinia.vuejs.org/zh/core-concepts/#option-stores) 带来了更多的灵活性，因为你可以在一个 store 内创建侦听器，并自由地使用任何[组合式函数](https://cn.vuejs.org/guide/reusability/composables.html#composables)。**不过，请记住，使用组合式函数会让 [SSR](https://pinia.vuejs.org/zh/cookbook/composables.html) 变得更加复杂。**
