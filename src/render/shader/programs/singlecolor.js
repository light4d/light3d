import {Color} from "../../../math/color.js"
import {Program} from "../program";

export  class Singlecolor extends Program{

    constructor(gl,gl_FragColor,mvp_uniform="mvp",pointsize='1.0'){

        let v = `attribute vec3 position;`;
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
        v+=`}`;


        let f = `precision mediump float;
        void main(void) {
            gl_FragColor = {{color}};
            }`;
        let color=new Color(gl_FragColor);

        f=f.replace("{{color}}", color.getglsl());
        super(gl, v, f,mvp_uniform);

        this.gl_Position="position";
        this.precision=" mediump float"
    }
}
