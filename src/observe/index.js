import {
    isObject,
    isArray
} from '../utils';
import {
    arrayMethods
} from './array';
import Dep from './dep';

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
        Object.defineProperty(value, '__ob__', {
            value: this,
            enumerable: false //不可被枚举
        })

        if (isArray(value)) {
            // 对数组类型进行单独处理：重写 7 个变异方法
            value.__proto__ = arrayMethods;
            this.observeArray(value);
        } else {
            // 如果value是对象，遍历对象中的属性，使用 Object.defineProperty 重新定义
            this.walk(value); //循环对象属性
        }
    }

    // 循环 data 对象，使用 Object.keys 不循环原型方法
    walk(data) {
        Object.keys(data).forEach(key => {
            // 使用 Object.defineProperty 重新定义 data 对象中的属性
            defineReactive(data, key, data[key]);
        })
    }

    /**
     * 遍历数组，对数组中的对象进行递归观测
     * 1）[[]] 数组套数组
     * 2）[{}] 数组套对象
     * @param {*} data 
     */
    observeArray(data) {
        data.forEach(item => observe(item))
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
    observe(value); //递归实现深层观测
    let dep = new Dep();    //为每个属性添加一个 dep
    Object.defineProperty(obj, key, {
        get() {
            if(Dep.target) {
                dep.depend();
            }
            return value;
        },
        set(newValue) {
            // console.log("修改了被观测属性 key = " + key + ", newValue = " + JSON.stringify(newValue));
            if (newValue === value) return;
            // 当值被修改时，通过 observe 实现对新值的深层观测，此时，新增对象将被观测
            // vm._update(vm._render());
            observe(newValue);
            value = newValue;
        }
    })
}