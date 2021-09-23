# vue-code

## 【vue2.x 源码学习】核心功能点

### 第二篇-vue 初始化流程

- initMixin 方法：原型方法 Vue.prototype.\_init
- vm.\$options：使用 options 选项在 vm 实例上被共享
- initState 方法：Vue 初始化时，对多种数据源做集中处理
- initData 方法：data 数据的初始化

### 第三篇 对象的单向劫持

- data 为函数和对象的处理，及当 data 为函数时的 this 指向问题
- Observer 类，对数据进行观测
- walk 方法：遍历 data 属性（对象属性遍历）
- defineReactive 方法：利用 Object.defineProperty 实现数据劫持

### 第四篇 对象的深度劫持

- 通过 data = isFunction(data) ? data.call(vm) : data;处理后的 data 一定是对象类型
- 通过 data = observe(data)处理后的 data 就实现了数据的响应式（目前只有劫持）
- observe 方法最终返回一个 Observer 类
- Observer 类初始化时，通过 walk 遍历属性
- 对每一个属性进行 defineReactive（Object.defineProperty）就实现对象属性的单层数据劫持
- 在 defineReactive 中，如果属性值为对象类型就继续调用 observe 对当前的对象属性进行观测（即递归步骤 3~5），这样就实现了对象属性的深层数据劫持

### 第五篇 - 数组的劫持

- 出于对性能的考虑，Vue 没有对数组采用 Object.defineProperty 进行递归劫持，而是对能够导致原数组变化的 7 个方法进行了拦截和重写，实现了对数组的数据劫持
