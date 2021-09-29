import { initState } from './state';
import { compileToFunction } from './compiler';
import { mountComponent } from "./lifecycle";
import { nextTick } from "./utils";

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        const vm = this;
        vm.$options = options;

        // new Vue时，传入options选项，包含el和data
        initState(vm);

        if (vm.$options.el) {
            // console.log('有el，需要挂载');
            vm.$mount(vm.$options.el);
        }
    }

    Vue.prototype.$mount = function (el) {
        const vm = this;
        const opts = vm.$options;
        el = document.querySelector(el);
        vm.$el = el;

        if (!opts.render) {
            let template = opts.template;
            // console.log('template = ', template);
            if (!template) {
                // console.log("没有template, el.outerHTML = " + el.outerHTML)
                // 将模板编译为 render 函数
                template = el.outerHTML;
            }

            let render = compileToFunction(template);
            opts.render = render;
            // console.log("打印 compileToFunction 返回的 render = " + JSON.stringify(render));
        }

        // 为 Vue 扩展原型方法 $nextTick
        Vue.prototype.$nextTick = nextTick;
        // debugger;
        // 将当前 render 渲染到 el 元素上
        mountComponent(vm);
    }
}