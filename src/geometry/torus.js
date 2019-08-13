/*
torus 立体的圆环
 */
import {Color} from "../math";

export class Torus {
    /*
     */
    constructor(row, column, iradius, oradius){
        let pos = [], col = [], idx = [];
        for(var i = 0; i <= row; i++){
            var r = Math.PI * 2 / row * i;
            var rr = Math.cos(r);
            var ry = Math.sin(r);
            for(var ii = 0; ii <= column; ii++){
                var tr = Math.PI * 2 / column * ii;
                var tx = (rr * iradius + oradius) * Math.cos(tr);
                var ty = ry * iradius;
                var tz = (rr * iradius + oradius) * Math.sin(tr);
                pos.push([tx, ty, tz]);
                var tc = Color.hsva2rgba(360 / column * ii, 1, 1, 1);
                col.push([tc[0], tc[1], tc[2], tc[3]]);
            }
        }
        for(i = 0; i < row; i++){
            for(ii = 0; ii < column; ii++){
                r = (column + 1) * i + ii;
                idx.push([r, r + column + 1, r + 1]);
                idx.push([r + column + 1, r + column + 2, r + 1]);
            }
        }
        this.position=pos;
        this.color=col;
        this.index=idx;
    }
}
