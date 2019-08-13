/*
torus 立体的圆环
 */
import {Color} from "../math";

export class Torus {
    /*
     */
    constructor(row, column, iradius, oradius){
        let pos = [], col = [], idx = [];
        for(let i = 0; i <= row; i++){
            let r = Math.PI * 2 / row * i;
            let rr = Math.cos(r);
            let ry = Math.sin(r);
            for(let ii = 0; ii <= column; ii++){
                let tr = Math.PI * 2 / column * ii;
                let tx = (rr * iradius + oradius) * Math.cos(tr);
                let ty = ry * iradius;
                let tz = (rr * iradius + oradius) * Math.sin(tr);
                pos.push([tx, ty, tz]);
                let tc = Color.hsva2rgba(360 / column * ii, 1, 1, 1);
                col.push([tc[0], tc[1], tc[2], tc[3]]);
            }
        }
        for(let i = 0; i < row; i++){
            for(let ii = 0; ii < column; ii++){
                let r = (column + 1) * i + ii;
                idx.push([r, r + column + 1, r + 1]);
                idx.push([r + column + 1, r + column + 2, r + 1]);
            }
        }
        this.position=pos;
        this.color=col;
        this.index=idx;
    }
}
