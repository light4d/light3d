import {Program} from "../program";

export class Colors extends Program{

    constructor(gl,mvp_uniform="mvp") {

        let v = `attribute vec3 position;
        attribute vec4 color;
          varying vec4 vColor;`;
        if(mvp_uniform!=null) {
            v += ` uniform mat4  ` + mvp_uniform + `;`
        }
        v+= `void main(void) {`;

        if(mvp_uniform!=null){
            v+=` gl_Position = ` +mvp_uniform+`* vec4(position, 1.0);`
        }else {
            v+=` gl_Position = vec4(position, 1.0);`
        }
        v+=`vColor = color;
        }`;


        let f = `precision mediump float;
        varying vec4 vColor;
        void main(void) {
            gl_FragColor = vColor;
        }`;


        super(gl, v, f,mvp_uniform);
        this.gl_Position="position";
        this.gl_FragColor="color";
        this.precision=" mediump float"
    }
}
