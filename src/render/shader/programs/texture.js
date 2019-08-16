import {Color} from "../../../math/color.js"
import {Program} from "../program";

export class Texture extends Program{
    constructor(gl,mvp_uniform="mvp",pointsize='1.0'){

        let v = `attribute vec3 position;
                attribute vec4 color;
                attribute vec2 textureCoord;
                varying   vec2 vTextureCoord;`;
        if(mvp_uniform!=null) {
            v += ` uniform mat4  ` + mvp_uniform + `;`
        }
        v+= `void main(void) {
             vColor = color;
             vTextureCoord = textureCoord;
        `;

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
        uniform sampler2D texture;
        varying vec2      vTextureCoord;
        
        void main(void) {
            vec4 smpColor = texture2D(texture, vTextureCoord);
            gl_FragColor  = vColor * smpColor;
        }`;
        let color=new Color(gl_FragColor);

        f=f.replace("{{color}}", color.getglsl());
        super(gl, v, f,mvp_uniform);

        this.position="position";
        this.textureCoord="textureCoord";
        this.precision=" mediump float"
    }
}
