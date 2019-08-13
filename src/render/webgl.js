import {domutil} from "../util/dom";
import {extend} from "../util/util";

class Webgl{
    /*
     * @param {canvas} canvas the canvas
     * @param {HTMLElement} container the HTMLElement
     * @returns {Webgl} out
     */
    constructor( canvas,container = document.body) {

        if( canvas === undefined  ){

            if (!domutil.isHTMLElement(container)) {
                throw new Error("need isHTMLElement container");
            }

            this.canvas =   this.createcanvas();

        }else {
            if (!domutil.isCanvas(canvas)) {
                throw new Error("need isHTMLElement container");
            }
            this.canvas =canvas
        }
        this.container = container;
        this.container.appendChild(this.canvas);

        this.initGL(this.canvas);
        this.resize(this.container.clientWidth, this.container.clientHeight);
    }

    createcanvas() {
        let canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
        extend(canvas.style, {
            border: 0,
            margin: 0,
            padding: 0,
            top: 0,
            left: 0
        });
        return canvas;
    }
    initGL(c) {
        try {
            this.gl = c.getContext("webgl");
            if (!this.gl)
                this.gl = c.getContext("experimental-webgl");

        } catch (e) {
            throw new Error(e)
        }
        if (!this.gl) {
            throw new Error("Could not initialise WebGL, sorry :-(");
        }
    }

    config(){

        // Enable the depth test
        this.gl.enable( this.gl.DEPTH_TEST);
        this.gl.depthFunc( this.gl.LEQUAL);
        this.gl.enable( this.gl.CULL_FACE);
    }
    /*
    如果你重新改变了canvas的大小，你需要告诉WebGL上下文设定新的视口。在这里，你可以使用gl.viewport。
     */
    resize(w=this.canvas.width, h=this.canvas.height) {
        this.canvas.width = w;
        this.canvas.height = h;
        this.gl.viewport(0, 0, w, h);
    }
    /*
    如果你重新改变了canvas的大小，你需要告诉WebGL上下文设定新的视口。在这里，你可以使用gl.viewport。
     */
    viewport(x, y, width=this.canvas.width, height=this.canvas.height){
        this.gl.viewport(x, y, width, height);
    }
    /*
    / Int32Array[0, 0, 640, 480]
     */
    getvieport(gl = this.gl){
        gl.getParameter(gl.VIEWPORT);
    }
    /*
    clearDepth
    https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/clearDepth
     */
    clearDepth(depth=1.0){
        if (typeof depth === 'number'){
            if(depth<=1 &&depth>0){
                this.gl.clearDepth(depth);
                return
            }
        }
        throw new Error("need number from 0 to 1");
    }
    getclearDepth(){
        return this.gl.getParameter(gl.DEPTH_CLEAR_VALUE);
    }

    clearColor(red =0.0, green=0.0, blue=0.0 , alpha=1.0){
        this.gl.clearColor(red , green , blue , alpha);
    }
    getclearColor(){
        return this.gl.getParameter(this.gl.COLOR_CLEAR_VALUE);
    }
    getclearStencil(){
        return this.gl.getParameter(this.gl.STENCIL_CLEAR_VALUE);
    }
    clearStencil(s){
        this.gl.clearStencil(s);
    }
    /*
        gl.COLOR_BUFFER_BIT   //颜色缓冲区
    gl.DEPTH_BUFFER_BIT   //深度缓冲区
    gl.STENCIL_BUFFER_BIT  //模板缓冲区
     */

    clear(mask=this.gl.COLOR_BUFFER_BIT){
        this.clearColor();
        this.clearDepth();
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    flush(){
        this.gl.flush()
    }




    getbindBuffer(){
        this.gl.getParameter(gl.ARRAY_BUFFER_BINDING);
    }
    getBuffersize(){
        this.gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE);
    }
    getBufferusage(){
        this.gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_USAGE);
    }
    getbindElementBuffer(){
        this.gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING);
    }
}

export { Webgl };
