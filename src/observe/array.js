// 拿到数组的原型方法
let oldArrayPrototype = Array.prototype;
// 原型继承，将原型链向后移动 arrayMethods.__proto__ == oldArrayPrototype
export let arrayMethods = Object.create(oldArrayPrototype);

let methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];

methods.forEach(method => {
    arrayMethods[method] = function (...args) {
        console.log('数组的方法进行重写操作 method = ' + method);
        // 调用数组原生方法逻辑（绑定到当前调用上下文）
        oldArrayPrototype[method].call(this, ...args);

        // 数组新增的属性如果是属性，要继续观测
        // 哪些方法有增加数组的功能: splice push unshift
        let inserted = null;
        let ob = this.__ob__;
        switch (method) {
            case 'splice':
                inserted = args.slice(2);
            case 'push':
            case 'unshift':
                inserted = args;
                break;
        }

        if (inserted) ob.observeArray(inserted);
    }
})