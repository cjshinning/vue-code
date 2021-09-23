import {
    observe
} from './observe';
import {
    isFunction
} from './utils';

export function initState(vm) {
    const opts = vm.$options;

    if (opts.data) {
        initData(vm);
    }
}

function initData(vm) {
    console.log("进入 state.js - initData，数据初始化操作");
    let data = vm.$options.data;
    // data 可能是函数或对象
    data = isFunction(data) ? data.call(vm) : data;
    // data 数据的响应式：遍历对象拿到所有属性，再通过Object.defineProperty 重写 data 中的所有属性  
    observe(data);
    console.log(data);
}