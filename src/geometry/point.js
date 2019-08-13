class Point {

    constructor(x, y) {
        if (!isNil(x) && !isNil(y)) {
            /**
             * @property x {Number} - x value
             */
            this.x = +(x);
            /**
             * @property y {Number} - y value
             */
            this.y = +(y);
        } else if (!isNil(x.x) && !isNil(x.y)) {
            this.x = +(x.x);
            this.y = +(x.y);
        } else if (Array.isArray(x)) {
            this.x = +(x[0]);
            this.y = +(x[1]);
        }
        if (this._isNaN()) {
            throw new Error('Position is NaN');
        }
    }

    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
}

export default { Point };