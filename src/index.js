import { initGlobalAPI } from './global-api';
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
initGlobalAPI(Vue);

export default Vue;