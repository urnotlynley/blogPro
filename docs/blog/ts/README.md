### : number   : string   是类型注解

最后一个number是返回类型注解
function getTotal(one: number, two: number): number {
  return one + two;
}
如果没有返回值可以写 :void
永远无法执行完毕写 : never



### interface

```typescript
interface Person{
    readonly id:number;
	name:string;
	age?:number;
}
```

interface类型不能少属性也不能多属性,属性加了问号表示可选可不选

如果想多传数据可以写成:

```javascript
[propName: string]: any
```

readonly表示只读不能改变

```
interface ISun{
	(x:number,y:number,z?:number):number
}
```

最后一个冒号表示返回值类型, 直接写的话要写成=>

```
let add2= (x:number, y: number, z?: number) => number = add
等于
let add2:Isum = add
```



### function

```typescript
function add(a: number, b: number, c?: number): number {
  if (typeof c === 'number') {
    return a + b + c
  } else {
    return a + b
  }
}
```

**必选参数不能位于可选参数后**



函数解构设置类型
function add({ one, two }: { one: number, two: number }): number {
  return one + two;
}

多种数据类型
const arr: (number | string)[] = [1, "string", 2]



### class类 

访问修饰符:

**public**  共有属性

**private**  私有属性

**protected**  受保护了, 子类可以使用

**readonly** 只读属性



extends用来继承类，implements用来实现一个接口

可以使用 **implements** 来实现接口



### **enum**枚举

```typescript
enum list {
	Up= 'UP',
	Down = 'DOWN',
	Left = 'LFET',
	Right = 'RIGHT'
}
```

在枚举前面加const  表示常量枚举

### type类型别名

type关键字  

```typescript
type PlusType = (x:number,y:number)=>number
```

##### 也可以使用固定字符串自变量

```typescript
type Directions = 'Up' | 'Down' | 'Left' | 'Right'
```

这样可以固定变量只能是这四个当中的一个,不能是其他值

##### 交叉类型

```typescript
interface IName {
	name:string
}
type IPerson = Iname & {age:number}
let person:Iperson = {name:'132',age:123}
```

声明文件:       .d.ts



