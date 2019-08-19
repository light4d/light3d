import {strMap2obj} from "../util/util.js";

class glstatus {
    constructor(gl){
        this.gl=gl;
        this.status=new Map()
    }
    checkgl() {
        const capsmap=new Map();
        const caps = new Map([
            [ this.gl.BLEND,'BLEND'],
            [ this.gl.CULL_FACE,'CULL_FACE'],
            [  this.gl.DEPTH_TEST,'DEPTH_TEST'],
            [  this.gl.DITHER ,'DITHER'],
            [  this.gl.POLYGON_OFFSET_FILL ,'POLYGON_OFFSET_FILL'],
            [  this.gl.SAMPLE_ALPHA_TO_COVERAGE,' SAMPLE_ALPHA_TO_COVERAGE'],
            [ this.gl.SAMPLE_COVERAGE,'SAMPLE_COVERAG'],
            [ this.gl.SCISSOR_TEST,'SCISSOR_TEST'],
            [ this.gl.STENCIL_TEST,'STENCIL_TEST' ]]);
        for (let item of caps.keys()) {
            capsmap.set(caps.get(item), this.gl.isEnabled(item));
        }

         this.status.set("cap",capsmap);
         this.status.set("vieport",   this.gl.getParameter( this.gl.VIEWPORT) );
         this.status.set("clearDepth",  this.gl.getParameter( this.gl.DEPTH_CLEAR_VALUE)  );
         this.status.set("clearColor",  this.gl.getParameter( this.gl.COLOR_CLEAR_VALUE) );
         this.status.set("clearStencil",   this.gl.getParameter( this.gl.STENCIL_CLEAR_VALUE));

         this.status.set("buffersize", this.gl.getBufferParameter( this.gl.ARRAY_BUFFER,  this.gl.BUFFER_SIZE));
         this.status.set("bufferusage",   this.gl.getBufferParameter( this.gl.ARRAY_BUFFER,  this.gl.BUFFER_USAGE));

        return strMap2obj( this.status);
    }
}

export {glstatus}
