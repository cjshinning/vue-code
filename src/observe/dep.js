let id = 0;

class Dep{
    constructor(){
        this.id = id++;
        this.subs = [];
    }
    // 保存数据的渲染 watcher
    depend(){
        this.subs.push(Dep.target);
    }
}

Dep.target = null;  //静态属性

export default Dep;