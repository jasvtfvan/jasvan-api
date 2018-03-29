import axios from 'axios';
import gApi from './gApi.js';
import gCache from './gCache.js';
//import { Toast } from 'mint-ui';
//import 'mint-ui/lib/toast/style.css';

// unauthorized is a window function, aimming at bussiness code would overwrite it for response status of 401
if (!gApi.isFunction(window.unauthorized)) {
    window.unauthorized = function() {
        Toast({ message: '未授权!' });
    };
}
axios.defaults.timeout = 1000 * 30;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
// axios.defaults.baseURL = 'http://127.0.0.1:8080/test/';
var safeLock = {};
var errorConfig = {};

axios.interceptors.request.use(config => {
    // if config.data is not a json data, program will jump into error
    JSON.stringify(config.data);
    // token is needed normally, except for the illegal paramter
    config['isToken'] = gApi.isEmpty(config["isToken"]) ? true : !!config["isToken"];
    if (config.isToken) {
        if (uris.com_flag) {
            config.headers['Authorization'] = window.localStorage.getItem('token');
        } else {
            config.headers['Authorization'] = uris.token_temp;
        }
    }
    config.openLoading();
    return config;
}, error => {
    errorConfig.closeLoading();
    if (!errorConfig.isToast) {
        Toast({ message: '请求参数错误：' + error });
    }
    return Promise.reject(error);
});

axios.interceptors.response.use(response => {
    response.config.closeLoading();
    let status = response.status;
    if (status == '200') {
        let code = response.data.code;
        if (code == '10000') {
            return response.data;
        }
        if (code == '10005') {
            if (!errorConfig.isToast) {
                Toast({ message: response.data.message });
            } else {
                return response.data;
            }
        } else {
            return response.data;
        }
    } else if (status == '401') {
        unauthorized();
    } else {
        if (!errorConfig.isToast) {
            Toast({ message: '网络异常!' });
        }
    }
    return Promise.reject(response);
}, error => {
    console.log(error.response.status)
    let status = error.response.status;
    if (status == '401') {
        unauthorized();
        return;
    }
    errorConfig.closeLoading();
    if (!errorConfig.isToast) {
        Toast({ message: '网络异常!' });
    }
    return Promise.reject(error);
});

export function fetch(config) {

    // safe lock is needed to prevent duplicate request normally, except for the illegal paramter
    config["isSafe"] = gApi.isEmpty(config["isSafe"]) ? true : !!config["isSafe"];

    if (!config.data) {
        config['data'] = {};
    }

    let lockKey = config.url + gApi.jsonToString(config.data, true);
    if (config["isSafe"] == true) {
        if (!gApi.isEmpty(safeLock[lockKey])) {
            return new Promise((resolve, reject) => {});
        } else {
            safeLock[lockKey] = "1";
        }
    }

    if (!config.headers) {
        config['headers'] = {};
    }
    if (config.ContentType) {
        config.headers['Content-Type'] = config.ContentType;
    }

    let version = "1.0";
    let sign = "123456"
    config['method'] = config.method ? config.method : 'post';
    if (config.method == "get") {
        config.url += gApi.jsonToUrl(config.data) + `&version=${version}&sign=${sign}`;
        // console.log(config.url);
    } else {
        config.data.version = version;
        config.data.sign = sign;
    }
    config['isCatch'] = !!config['isCatch']; // need promise catch?
    config['isToast'] = !!config['isToast']; // need bussiness toast?
    errorConfig['isToast'] = config.isToast;

    if (!config['openLoading'] || !gApi.isFunction(config['openLoading'])) {
        config['openLoading'] = function() {};
    }
    if (!config['closeLoading'] || !gApi.isFunction(config['closeLoading'])) {
        config['closeLoading'] = function() {};
    }
    errorConfig['closeLoading'] = config.closeLoading;

    /*
     * prevent server cache
     */
    if (config.url.indexOf('?') === -1) {
        config.url += ('?timeStamp=' + new Date().getTime());
    } else if (config.url.indexOf('?') === (config.url.length - 1)) {
        config.url += ('timeStamp=' + new Date().getTime());
    } else {
        config.url += ('&timeStamp=' + new Date().getTime());
    }
    // var qs = require('qs');
    // config.data = qs.stringify(config.data);
    return new Promise((resolve, reject) => {
        // console.log(config)
        axios(config)
            .then(response => {
                try {
                    resolve(response);
                } catch (e) {
                    Toast({ message: '请求成功, 回调函数错误：' + e });
                }
                if (config["isSafe"] == true) {
                    delete safeLock[lockKey];
                }
            })
            .catch(error => {
                if (config["isSafe"] == true) {
                    delete safeLock[lockKey];
                }
                if (config['isCatch']) {
                    reject(error);
                }
            })
    })
};