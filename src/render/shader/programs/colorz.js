import {Color} from "../../../math/color.js"
import {Program} from "../program";

export  class Colorz extends Program{

    constructor(gl,mvp_uniform="mvp",pointsize='1.0'){

        let v = `
        attribute vec3 position;
        varying vec4 vColor;
        `;
        if(mvp_uniform!=null) {
            v += ` uniform mat4  ` + mvp_uniform + `;`
        }
        v+= `void main(void) {`;

        if(mvp_uniform!=null){
            v+=` gl_Position = ` +mvp_uniform+`* vec4(position, 1.0);`
        }else {
            v+=` gl_Position = vec4(position, 1.0);`
        }
        if(pointsize){
            v += `gl_PointSize = `+pointsize+`;`
        }
        v+=`
        vColor= vec4(abs(position[0]),abs(position[1]),abs(position[2]),1.0);
        }`;


        let f = `precision mediump float;
         varying vec4 vColor;
        void main(void) {
            gl_FragColor = vColor;
            }`;
        super(gl, v, f,mvp_uniform);

        this.gl_Position="position";
        this.precision=" mediump float"
    }
}
