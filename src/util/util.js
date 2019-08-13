function extend (base, opts) {
    var keys = Object.keys(opts);
    for (var i = 0; i < keys.length; ++i) {
        base[keys[i]] = opts[keys[i]]
    }
    return base
}

function strMap2obj(strMap) {
    let obj = Object.create(null);
    for (let [k,v] of strMap) {
        obj[k] = v;
    }
    return obj;
}

export { extend,strMap2obj };
