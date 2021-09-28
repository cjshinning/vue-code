import Dep from "./dep";

class Watcher {
    constructor(vm, fn, cb, options){
        this.vm = vm;
        this.fn = fn;
        this.cb = cb;
        this.options = options;

        this.getter = fn;
        this.get();
    }

    get(){
        Dep.target = this;  //在触发视图渲染前，将 watcher 记录到 Dep.target 上
        this.getter();  //调用页面渲染逻辑
        Dep.target = null;  //渲染完成后，清除 Watcher 记录
    }
}

export default Watcher;