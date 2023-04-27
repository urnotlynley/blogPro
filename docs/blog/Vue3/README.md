# vue3基础
## ref

用于声明单个变量

如果要想拿到循环出来的子组件的 dom,需要

```javascript
<PendingTable :ref="setRef"/>   //子组件
const myRef = ref([])
const setRef = (el) => {
	myRef.value.push(el)
}
```

获取数据的时候需要在 nextTick 中获取才能拿到值

**而且 myRef 在每次更新的时候需要置空**

```javascript
onBeforeUpdate(() => {
  myRef.value = []
})
```

## reactive

多用于声明对象,具有多个属性,但是单个拿出来某个属性时该属性不是响应式的

## toRefs

通过 reactive 创建的数据, 获取里面单个属性时不时响应式的, 如果想拿到的是响应式的, 要通过 toRefs 包裹

**使用 ref, reactive, toRefs, watch, computed 等功能都需要从 vue 引入**

**watch 可以监听多个数据, 第一个参数传数组**

## setup 的两个参数

```typescript
setup(props,context){}
```

props 为当前的 props 的值

context 可以调用三个方法: attrs, slots, emit, 这三个方法都是同步到最新的值

## teleport

使用<teleport></teleport>标签包裹, to 属性表示移动到什么节点上去 例如 #modal

emits 组件自定义事件 类似于 V2 的$emit

## Suspense 用于处理异步请求

要返回一个 promise

## 使用`$attrs`

- 项目中有多层组件传参可以使用`$attrs`
- 如果给组件传递的数据，**组件不使用 props 接收，那么这些数据将作为组件的 HTML 元素的特性，这些特性绑定在组件的 HTML 根元素上**
- inheritAttrs: false 的含义是不希望本组件的根元素继承父组件的 attribute，同时父组件传过来的属性（没有被子组件的 props 接收的属性），也不会显示在子组件的 dom 元素上，但是在组件里可以通过其$attrs可以获取到没有使用的注册属性, ``inheritAttrs: false`是不会影响 style 和 class 的绑定, **设置为true会把没有在props接收的属性直接绑定在html根元素上 **(最外层的div盒子上,而不是div里面的某一个盒子),里面的盒子需要使用v-bind="$attrs"绑定)

userRoute 获取路由的信息

userRouter 用来做路由操作，例如跳转

### watch 事件

```typescript
watch(
  () => province.value,
  val => {
    if (val) {
      cityList.value = provinceList.value.find(x => x.code === val)?.children
    }
    city.value = ''
    area.value = ''
  }
)
```

有两个参数, 都是 function, 第一个参数返回需要监听的参数, 第二个 func 是监听的回调函数

### computed 计算属性

```typescript
let textFinally = computed(() => {
  return props.type === 'up' ? props.upTextColor : props.downTextColor
})
```
