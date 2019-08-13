export  class domutil {
    static isHTMLElement (obj) {
        return (
            typeof obj.nodeName === 'string' &&
            typeof obj.appendChild === 'function' &&
            typeof obj.getBoundingClientRect === 'function'
        )
    }

    static isCanvas (obj) {
        return (
            typeof obj.getContext   === 'function'
        )
    }

    static isWebGLContext (obj) {
        return (
            typeof obj.drawArrays === 'function' ||
            typeof obj.drawElements === 'function'
        )
    }

    static getElement (desc) {
        if (typeof desc === 'string') {
            check(typeof document !== 'undefined', 'not supported outside of DOM');
            return document.querySelector(desc)
        }
        return desc
    }
}

