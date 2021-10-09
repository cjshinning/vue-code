import { initGlobalAPI } from './global-api';
import { initMixin } from './init';
import { renderMixin } from "./render";
import { lifeCycleMixin } from "./lifecycle";
import { compileToFunction } from './compiler/index';
import { createElm, patch } from './vdom/patch';

/**
 * @param {*} options
 */
function Vue(options) {
    this._init(options);
}

initMixin(Vue);
renderMixin(Vue);
lifeCycleMixin(Vue);
initGlobalAPI(Vue);

export default Vue;

let vm1 = new Vue({
    data() {
        return { name: 'Jenny' }
    }
})
let render1 = compileToFunction('<div style="color:blue"></div>');
let oldVnode = render1.call(vm1)
let el1 = createElm(oldVnode);
document.body.appendChild(el1);

let vm2 = new Vue({
    data() {
        return { name: 'JennyChan' }
    }
})
let render2 = compileToFunction('<div style="color:red">{{name}}</div>');
let newVnode = render2.call(vm2);

setTimeout(() => {
    patch(el1, oldVnode, newVnode); 
}, 1000);