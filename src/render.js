import { isObject } from './utils';
import { createElement, createText} from './vdom';

export function renderMixin(Vue){
    // createElement 创建元素型的节点
    Vue.prototype._c = function(tag, data={}, ...children){
        const vm = this;
        return createElement(vm, tag, data, ...children);
    }
    // 创建文本的虚拟节点
    Vue.prototype._v = function(text){
        const vm = this;
        return createText(vm, text);
    }
    // JSON.stringify
    Vue.prototype._s = function(val){
        if(isObject(val)){
            return JSON.stringify(val);
        }else{
            return val;
        }
    }
    Vue.prototype._render = function(){
        const vm = this;
        let { render } = vm.$options;
        // console.log(render.toString());
        let vnode = render.call(vm);
        // console.log(vnode);
        return vnode;
    }
}