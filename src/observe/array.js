// 拿到数组的原型方法
let oldArrayPrototype = Array.prototype;
// 原型继承，将原型链向后移动 arrayMethods.__proto__ == oldArrayPrototype
export let arrayMethods = Object.create(oldArrayPrototype);

let methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];

methods.forEach(method => {
    arrayMethods[method] = function () {
        console.log('数组的方法进行重写操作 method = ' + method);
    }
})