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

### 第六篇 - 数据代理的实现

- 将 data 暴露在 vm.\_data 实例属性上
- 利用 Object.defineProperty 将 vm.xxx 操作代理到 vm.\_data 上

### 第七篇 - 阶段性梳理

### 第八篇 - 数组的深层劫持

- 最初仅对数组类型进行了原型方法重写，并未进行递归处理，所以，当时仅实现了数组的单层劫持；
- 通过对数组进行 observe 递归观测，实现了对数组嵌套结构的劫持（数组中嵌套数组、数组中嵌套对象）

### 第九篇 - 对象数据变化的观测情况

- 实现了对象老属性值变更为对象、数组时的深层观测处理；
- 结合实现原理，说明了对象新增属性不能被观测的原因，及如何实现数据观测；

### 第十篇 - 数组数据变化的观测情况

- 实现了数组数据变化被劫持后，已重写原型方法的具体逻辑；
- 数组各种数据变化时的观测情况分析；

### 第十一篇 - Vue 的数据渲染流程

- 初次渲染时

1. template 模板被编译为 ast 语法树；
2. 通过 ast 语法树生成 render 函数；
3. 通过 render 函数返回 vnode 虚拟节点；
4. 使用 vnode 虚拟节点生成真实 dom 并进行渲染；

- 视图更新时

1. 调用 render 函数生成新的 vnode 虚拟节点；
2. 通过 diff 算法对新老 vnode 虚拟节点进行对比；
3. 根据虚拟节点比对结果，更新真实 dom；

### 第十二篇 - 生成 ast 语法树-流程说明

- Vue 核心渲染流程回顾
- 三种模板写法及优先级
- Vue 的原型方法 \$mount
- compileToFunction -> parserHTM 流程说明

### 第十三篇 - 生成 ast 语法树 - 正则说明

- 简要说明了 HTML 模板的解析方式
- 对模板解析相关正则说明和测试

### 第十四篇 - 生成 ast 语法树 - 模板解析

- 介绍了生成 ast 语法树 - 模板解析部分

### 第十五篇 - 生成 ast 语法树 - 构造树形结构
- 基于 html 特点，使用栈型数据结构记录父子关系
- 开始标签，结束标签及文本的处理方式
- 代码重构及ast 语法树构建过程分析

### 第十六篇 - 生成 render 函数 - 代码拼接
- render 函数的代码拼接：generate(ast)
- 处理属性：genProps(ast.attrs)
- 处理属性中的样式
- 递归深层处理儿子：genChildren

### 第十七篇 - 生成 render 函数 - 函数生成
- 生成 render 函数的大致流程：
1. html模板编译称为 ast 语法树；
2. ast 语法树生成并拼接 code；
3. 使用 with 对生成的 code 进行一次包装；
4. 将包装后的完整 code 字符串，通过 new Function 输出为 render 函数

### 第十八篇 - 根据 render 函数，生成 vnode
- 封装 vm._render 返回虚拟节点
- _s，_v，_c的实现

### 第十九篇 - 根据 vnode 创建真实节点
- vnode 渲染真实节点的步骤
- Vue 原型方法 _update 的扩展
- patch 方法中的两个步骤：1，创建真实节点；2，替换掉老节点
- createElm 实现：根据虚拟节点创建真实节点

### 第二十篇 - 使用真实节点替换原始节点
- 新老节点的更新方案
- 虚拟节点与真实节点映射
- 实现新老节点的替换

### 第二十一篇 - 依赖收集的过程分析
- 前面已经完了Vue 的两大核心部分：响应式数据 和 数据渲染
- 截止至上篇，完成了整个 Vue 的初始化流程
- 从本篇开始，将进入 Vue 的更新流程

### 第二十二篇 - dep 和 watcher 关联
- 介绍了依赖收集的必要性；
- 介绍了 Watcher 和 Dep 的作用；
- 实现了 Watcher 类和 Dep 类；
- Watcher 和 Dep 如何产生关联；

### 第二十三篇 - 依赖收集 - 视图更新部分
- 视图初始化时：

1. render方法中会进行取值操作，进入 Object.defineProperty 的 get 方法
2. get 方法中为数据添加 dep，并记录当前的渲染 watcher
3. 记录方式：watcher查重并记住 dep，dep 再记住 watcher

- 数据更新时：

1. 当数据发生改,会进入 Object.defineProperty 的 set 方法
2. 在 set 方法中，使 dep 中收集的全部 watcher 执行视图渲染操作 watcher.get()
3. 在视图渲染前（this.getter方法执行前）,通过 dep.target 记录当前的渲染 watcher
4. 重复视图初始化流程

### 第二十四篇 - 异步更新流程
- 为什么要做异步更新
- 异步更新的实现思路
- 数据变更缓存的位置
- 缓存 watcher 更新逻辑
- vm.$nextTick 获取更新后的 dom
- 测试异步更新

### 第二十五篇 - 数组依赖收集的原理

### 第二十六篇 - 数组依赖收集的实现
- 未实现

### 第二十七篇 - Vue 生命周期的实现
- Vue.mixin 介绍
- Vue 的 Global API
- Vue.mixin 实现

### 【Vue2.x 源码学习】第二十八篇 - diff算法-问题分析与patch优化
- 初始化与更新流程分析；
- 问题分析与优化思路；
- 新老虚拟节点比对模拟；
- patch 方法改造；

### 第二十九篇 - diff算法-节点比对
- 介绍了 diff 算法、对比方式、节点复用
- 实现了外层节点的 diff 算法
- 不同节点如何做替换更新
- 相同节点如何做复用更新：文本、元素、样式处理

### 第三十篇 - diff算法-比对优化（上）
- 介绍了如何进行儿子节点比对；
- 新老儿子节点可能存在的3种情况及代码实现；
- 新老节点都有儿子时的 diff 方案介绍与处理逻辑分析；

### 第三十一篇 - diff算法-比对优化（下）
- 介绍了儿子节点比较的流程
- 介绍并实现了头头、尾尾、头尾、尾头4种特殊情况比对