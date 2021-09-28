import { patch } from './vdom/patch';
import Watcher from './observe/watcher';

export function mountComponent(vm){
    // 抽取成为一个可被调用的函数
    let updateComponent = () => {
        vm._update(vm._render());
    }
    updateComponent();

    // 渲染 watcher ：每个组件都有一个 watcher
    new Watcher(vm, updateComponent, () => {
        console.log('Watcher-update');
    }, true);
}

export function lifeCycleMixin(Vue){
    Vue.prototype._update = function (vnode) {
        // console.log("_update-vnode", vnode);
        const vm = this;
        vm.$el = patch(vm.$el, vnode);
    }
}