export default {
    plus: function(arg1, arg2) {
        var r1, r2, m;
        try { r1 = (arg1 + "").split(".")[1].length; } catch (e) { r1 = 0; }
        try { r2 = (arg2 + "").split(".")[1].length; } catch (e) { r2 = 0; }
        m = Math.pow(10, Math.max(r1, r2));
        return (this.multiply(arg1, m) + this.multiply(arg2, m)) / m;
    },
    minus: function(arg1, arg2) {
        return this.plus(arg1, -arg2);
    },
    multiply: function(arg1, arg2) {
        var m = 0,
            s1 = arg1 + "",
            s2 = arg2 + "";
        try { m += s1.split(".")[1].length; } catch (e) {}
        try { m += s2.split(".")[1].length; } catch (e) {}
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    },
    divide: function(arg1, arg2) {
        var t1 = 0,
            t2 = 0,
            r1, r2;
        try { t1 = (arg1 + "").split(".")[1].length; } catch (e) {}
        try { t2 = (arg2 + "").split(".")[1].length; } catch (e) {}
        // with(Math) {
        r1 = Number((arg1 + "").replace(".", ""));
        r2 = Number((arg2 + "").replace(".", ""));
        return this.multiply((r1 / r2), Math.pow(10, t2 - t1));
        // }
    }
}