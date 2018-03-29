import gApi from './core/gApi.js';
import gCache from './core/gCache.js';
import { fetch } from './core/gHttp.js';

import gExactCalc from './utils/gExactCalc.js';
import gValidate from './utils/gValidate.js';

export {
    gApi,
    gCache,
    fetch,
    gExactCalc,
    gValidate
};

const JsvanApi = {
    install: function(Vue) {
        window.gApi = gApi;
        window.gCache = gCache;
        window.fetch = fetch;
        window.gExactCalc = gExactCalc;
        window.gValidate = gValidate;
    }
};
export default JsvanApi;