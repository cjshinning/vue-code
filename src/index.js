import { initMixin } from './init';
import { renderMixin } from "./render";
import { lifeCycleMixin } from "./lifecycle";

/**
 * @param {*} options
 */
function Vue(options) {
    this._init(options);
}

initMixin(Vue);
renderMixin(Vue);
lifeCycleMixin(Vue);

export default Vue;