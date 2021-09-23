import {
    isObject
} from '../utils';

export function observe(value) {
    if (!isObject(value)) {
        return;
    }

    // 观测value对象，实现数据响应式
    return new Observer(value);
}

// Observer 类：
// 遍历对象属性，使用 Object.defineProperty 重新定义 data 对象中的属性
class Observer {
    constructor(value) {
        // 如果value是对象，遍历对象中的属性，使用 Object.defineProperty 重新定义
        this.walk(value); //循环对象属性
    }

    // 循环 data 对象，使用 Object.keys 不循环原型方法
    walk(data) {
        Object.keys(data).forEach(key => {
            // 使用 Object.defineProperty 重新定义 data 对象中的属性
            defineReactive(data, key, data[key]);
        })
    }
}

/**
 * 给对象obj，定义属性key，值为value
 * 使用Object.defineProperty重新定义data中的属性
 * 由于Object.defineProperty性能低，所以vue2的性能瓶颈也在这里
 * @param {*} obj 需要定义属性的对象
 * @param {*} key 给对象定义的属性名
 * @param {*} value 给对象定义的属性值
 */
function defineReactive(obj, key, value) {
    Object.defineProperty(obj, key, {
        get() {
            return value;
        },
        set(newValue) {
            if (newValue === value) return;
            value = newValue;
        }
    })
}