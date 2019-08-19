import {Program} from "../program";

export class ComputeColor extends Program{
    constructor(gl,mvp_uniform="mvp",pointsize='1.0') {
        let programname= 'computecolor';
        // let v = fs.readFileSync(  programname+'.v.glsl', 'utf8');
        // let f= fs.readFileSync(  programname+'.f.glsl', 'utf8');

        super(gl, v, f,mvp_uniform);
        this.gl_Position="position";
        this.gl_FragColor="color";
        this.precision=" mediump float"
    }
}
