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
