/**
 * 判断是否是函数
 * @param {*} val 
 * @returns
 */
export function isFunction(val) {
    return typeof val === 'function';
}

/**
 * 判断是否是对象
 * @param {*} val
 * @returns
 */
export function isObject(val) {
    return typeof val === 'object' && val !== null;
}

/**
 * 判断是否是数组
 * @param {*} val 
 * @returns
 */
export function isArray(val) {
    return Array.isArray(val);
}

let callbacks = [];
let waiting = false;
function flushsCallbacks(){
    callbacks.forEach(fn => fn());
    callbacks = [];
    waiting = false;
}

/**
 * 将方法异步化
 * @param {*} fn 需要异步化的方法
 */
export function nextTick(fn){
    // return Promise.resolve().then(fn);
    callbacks.push(fn); //先缓存异步更新的nextTick,后续统一处理
    if(!waiting){
        Promise.resolve().then(flushsCallbacks);
        waiting = true; //首次进入被置为 true,控制逻辑只走一次
    }
}

/**
 * 对象合并:将childVal合并到parentVal中
 * @param {*} parentVal 父值-老值
 * @param {*} childVal 子值-新值
 */
export function mergeOptions(parentVal, childVal) {
    // console.log(parentVal, childVal);
    let options = {};
    for(let key in parentVal){
      mergeFiled(key);
    }
    for(let key in childVal){
      // 当新值存在，老值不存在时：添加到老值中
      if(!parentVal.hasOwnProperty(key)){
        mergeFiled(key);
      }
    }
    function mergeFiled(key) {
      // 默认合并方法：优先使用新值覆盖老值
      options[key] = childVal[key] || parentVal[key]
    }
    // console.log(options);
    return options;
}

/**
 * 执行生命周期钩子，从$options取对应的生命周期函数数组并执行
 * @param {*} vm vue实例
 * @param {*} hook 生命周期
 */
export function callHook(vm, hook){
    // 获取生命周期对应函数数组
    let handlers = vm.$options[hook];
    if(handlers){
        handlers.forEach(fn => {
            fn.call(vm);
        })
    }
}