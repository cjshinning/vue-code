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
    let data = vm.$options.data;
    data = vm._data = isFunction(data) ? data.call(vm) : data;
    observe(data);

    // 当 vm.message 在 vm 实例上取值时，将它代理到vm._data上去取
    for (let key in data) {
        Proxy(vm, key, '_data');
    }
}

/**
 * 代理方法
 * @param {*} vm vm 实例
 * @param {*} key 属性名
 * @param {*} source 代理目标，这里是vm._data
 */
function Proxy(vm, key, source) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[source][key];
        },
        set(newValue) {
            vm[source][key] = newValue;
        }
    })
}