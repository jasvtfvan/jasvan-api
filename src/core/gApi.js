export default {
    clone(obj) {
        var buf;
        if (obj instanceof Array) {
            buf = [];
            for (var i = 0; i < obj.length; i++) {
                buf.push(this.clone(obj[i]));
            }
        } else if (obj instanceof Object) {
            buf = {};
            for (var j in obj) {
                buf[j] = this.clone(obj[j]);
            }
        } else {
            buf = obj;
        }
        return buf;
    },
    dateFormat(date, format) {
        if (!date instanceof Date) {
            return '';
        }
        if (!format || !this.isString(format)) {
            format = 'yyyy-MM-dd';
        }
        var layout = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12,
            'H+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
            'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
            'S': date.getMilliseconds() // 毫秒
        };
        var week = {
            '0': '\u65e5',
            '1': '\u4e00',
            '2': '\u4e8c',
            '3': '\u4e09',
            '4': '\u56db',
            '5': '\u4e94',
            '6': '\u516d'
        };
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(format)) {
            format = format.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[date.getDay() + '']);
        }
        for (var i in layout) {
            if (new RegExp('(' + i + ')').test(format)) {
                format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (layout[i]) : (('00' + layout[i]).substr(('' + layout[i]).length)));
            }
        }
        return format;
    },
    formatCash(num, digit) {
        if (this.isEmpty(num)) {
            return null;
        }

        var num = num.toString(),
            minus = num.substring(0, 1) == '-' ? '-' : '';
        num = minus == '-' ? num.substring(1) : num;
        num = num.replace(/\.$/, '');

        var integral = num,
            decimal = '';
        if (num.indexOf('.') != -1) {
            integral = num.substring(0, num.indexOf('.'));
            decimal = num.substring(num.indexOf('.'));

            if (/^[1-9]\d*|0$/.test(digit)) {
                if (decimal.length - 1 > digit) {
                    decimal = decimal.substring(0, (1 + digit));
                } else {
                    var cover = digit - (decimal.length - 1);
                    decimal += Array(cover).fill(0).join('');
                }
            }

            decimal = decimal.replace(/\.$/, '');
        }

        var result = '';
        while (integral.length > 3) {
            result = ',' + integral.slice(-3) + result;
            integral = integral.slice(0, integral.length - 3);
        }

        if (integral) {
            result = integral + result;
        }

        return minus + result + decimal;
    },
    getUrlParam(key) {
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURI(r[2]);
        }
        return null;
    },
    isArray(obj) {
        return (obj && obj instanceof Array) || Array.isArray(obj);
    },
    isBoolean(obj) {
        return obj === true || obj === false;
    },
    isDOM(obj) {
        return !!(obj && typeof window !== 'undefined' && (obj === window || obj.nodeType));
    },
    isEmpty(str) {
        return (typeof str === 'undefined') || (str == null) || (str === '') || (str === 'null') || (str === 'NULL');
    },
    isFunction(obj) {
        return typeof obj === 'function';
    },
    isMobilePhone(tel) {
        var pattern = /^1(3|4|5|7|8)\d{9}$/;
        return pattern.test(tel);
    },
    isNumeric(obj) {
        return /^-?\d+(\.\d+)?$/.test(obj);
    },
    isString(obj) {
        return !!arguments.length && obj != null && (typeof obj === 'string' || obj instanceof String);
    },
    jsonToString(json, force) {
        if (this.isString(json)) {
            return json;
        }
        force = !!force;
        var result = '';
        try {
            result = JSON.stringify(json);
        } catch (error) {
            if (force) {
                result = '';
            } else {
                result = json;
            }
        }
        return result;
    },
    numberFormat(numStr, decimal) {
        if (numStr.length <= 0) {
            return '';
        }

        numStr = numStr + "";
        var minus = '';
        if (numStr.substring(0, 1) == '-') {
            minus = '-';
        }

        var result = '';
        if (decimal == 1) {
            result = (numStr.replace(/[^0-9.]/g, '')).replace(/[.][0-9]*[.]/, '.').replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3');
        } else if (decimal == 2) {
            result = (numStr.replace(/[^0-9.]/g, '')).replace(/[.][0-9]*[.]/, '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
        } else {
            result = (numStr.replace(/[^0-9.]/g, '')).replace(/[.][0-9]*[.]/, '.');
        }

        if (result.substring(0, 1) == '.') {
            result = '0' + result;
        }

        return minus + result;
    },
    stringToJson(str, force) {
        if (typeof str === 'object') {
            return str;
        }
        force = !!force;
        var result = {};
        try {
            result = JSON.parse(str);
        } catch (error) {
            if (force) {
                result = {};
            } else {
                result = str;
            }
        }
        return result;
    },
    trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, '');
    },

    // json格式的参数转成url格式
    jsonToUrl(param, ) {  
        var s = "";
        for (var i in param) {
            s += "&" + i + "=" + param[i]
        }
        return "?" + s.slice(1);
    },
}