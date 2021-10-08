import { patch } from './vdom/patch';
import Watcher from './observe/watcher';
import {callHook} from './utils';


let strats = {};  // 存放所有策略
let lifeCycle = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted'
];
lifeCycle.forEach(hook => {
    // 创建生命周期的合并策略
    strats[hook] = function (parentVal, childVal) {
        if(childVal){ // 儿子有值，需要进行合并
        if(parentVal){
            // 父亲儿子都有值：父亲一定是数组，将儿子合入父亲
            return parentVal.concat(childVal);  
        }else{
            // 儿子有值，父亲没有值：儿子放入新数组中
            // 注意：如果传入的生命周期函数是数组，已经是数组无需再包成数组
            if(Array.isArray(childVal)){
                return childVal;
            }else{
                return [childVal];
            }
        }
        }else{  // 儿子没有值，无需合并，直接返回父亲即可
            return parentVal;
        }
    }
})

export function mountComponent(vm){
    // 抽取成为一个可被调用的函数
    let updateComponent = () => {
        vm._update(vm._render());
    }
    
    callHook(vm, 'beforeCreate');

    // 渲染 watcher ：每个组件都有一个 watcher
    new Watcher(vm, updateComponent, () => {
        // console.log('Watcher-update');
        callHook(vm, 'created');
    }, true);

    // 当视图挂载完成，调用钩子: mounted
    callHook(vm, 'mounted');
}

export function lifeCycleMixin(Vue){
    Vue.prototype._update = function (vnode) {
        // console.log("_update-vnode", vnode);
        const vm = this;
        vm.$el = patch(vm.$el, vnode);
    }
}
