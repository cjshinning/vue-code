import { patch } from './vdom/patch';

export function mountComponent(vm){
    vm._update(vm._render());
}

export function lifeCycleMixin(Vue){
    Vue.prototype._update = function (vnode) {
        // console.log("_update-vnode", vnode);
        const vm = this;
        vm.$el = patch(vm.$el, vnode);
    }
}