//import {Toast} from 'mint-ui';
// import 'mint-ui/lib/toast/style.css';
export default {
    isNotEmpty: function(value, msg) {
        value = value || '';
        msg = msg || '不能为空!';
        if ((typeof value === 'undefined') || (value == null) || (value === '') || (value === 'null') || (value === 'NULL')) {
            Toast({message: msg});
            return false;
        }
        return true;
    },
    isUnderMaxLen: function(value, max, msg) {
        value = value || '';
        max = max || 0;
        msg = msg || '超出最大长度限制!';
        if (value.length > max) {
            Toast({message: msg});
            return false;
        }
        return true;
    },
    isOverMinLen: function(value, min, msg) {
        value = value || '';
        min = min || 0;
        msg = msg || '低于最小长度限制!';
        if (value.length < min) {
            Toast({message: msg});
            return false;
        }
        return true;
    }
}
