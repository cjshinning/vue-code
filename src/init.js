import {
    initState
} from './state';

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        const vm = this;
        vm.$options = options;

        // new Vue时，传入options选项，包含el和data
        initState(vm);

        if (vm.$options.el) {
            console.log('有el，需要挂载');
        }
    }
}