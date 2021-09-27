import {
    initMixin
} from './init';
import { renderMixin } from "./render";

/**
 * @param {*} options
 */
function Vue(options) {
    this._init(options);
}

initMixin(Vue);
renderMixin(Vue);

export default Vue;