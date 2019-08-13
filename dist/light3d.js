var light3d = (function (exports) {
    'use strict';

    class domutil {
        static isHTMLElement (obj) {
            return (
                typeof obj.nodeName === 'string' &&
                typeof obj.appendChild === 'function' &&
                typeof obj.getBoundingClientRect === 'function'
            )
        }

        static isCanvas (obj) {
            return (
                typeof obj.getContext   === 'function'
            )
        }

        static isWebGLContext (obj) {
            return (
                typeof obj.drawArrays === 'function' ||
                typeof obj.drawElements === 'function'
            )
        }

        static getElement (desc) {
            if (typeof desc === 'string') {
                check(typeof document !== 'undefined', 'not supported outside of DOM');
                return document.querySelector(desc)
            }
            return desc
        }
    }

    function extend (base, opts) {
        var keys = Object.keys(opts);
        for (var i = 0; i < keys.length; ++i) {
            base[keys[i]] = opts[keys[i]];
        }
        return base
    }

    function strMap2obj(strMap) {
        let obj = Object.create(null);
        for (let [k,v] of strMap) {
            obj[k] = v;
        }
        return obj;
    }

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
                this.canvas =canvas;
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
            this.gl.flush();
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

    /**
     * Common utilities
     * @module glMatrix
     */
    // Configuration Constants
    var EPSILON = 0.000001;
    var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
    var degree = Math.PI / 180;

    /**
     * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
     * @module mat4
     */

    /**
     * Creates a new identity mat4
     *
     * @returns {mat4} a new 4x4 matrix
     */

    function create() {
      var out = new ARRAY_TYPE(16);

      if (ARRAY_TYPE != Float32Array) {
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
      }

      out[0] = 1;
      out[5] = 1;
      out[10] = 1;
      out[15] = 1;
      return out;
    }
    /**
     * Set a mat4 to the identity matrix
     *
     * @param {mat4} out the receiving matrix
     * @returns {mat4} out
     */

    function identity(out) {
      out[0] = 1;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[5] = 1;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[10] = 1;
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
      out[15] = 1;
      return out;
    }
    /**
     * Multiplies two mat4s
     *
     * @param {mat4} out the receiving matrix
     * @param {mat4} a the first operand
     * @param {mat4} b the second operand
     * @returns {mat4} out
     */

    function multiply(out, a, b) {
      var a00 = a[0],
          a01 = a[1],
          a02 = a[2],
          a03 = a[3];
      var a10 = a[4],
          a11 = a[5],
          a12 = a[6],
          a13 = a[7];
      var a20 = a[8],
          a21 = a[9],
          a22 = a[10],
          a23 = a[11];
      var a30 = a[12],
          a31 = a[13],
          a32 = a[14],
          a33 = a[15]; // Cache only the current line of the second matrix

      var b0 = b[0],
          b1 = b[1],
          b2 = b[2],
          b3 = b[3];
      out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
      b0 = b[4];
      b1 = b[5];
      b2 = b[6];
      b3 = b[7];
      out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
      b0 = b[8];
      b1 = b[9];
      b2 = b[10];
      b3 = b[11];
      out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
      b0 = b[12];
      b1 = b[13];
      b2 = b[14];
      b3 = b[15];
      out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
      return out;
    }
    /**
     * Translate a mat4 by the given vector
     *
     * @param {mat4} out the receiving matrix
     * @param {mat4} a the matrix to translate
     * @param {vec3} v vector to translate by
     * @returns {mat4} out
     */

    function translate(out, a, v) {
      var x = v[0],
          y = v[1],
          z = v[2];
      var a00, a01, a02, a03;
      var a10, a11, a12, a13;
      var a20, a21, a22, a23;

      if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
      } else {
        a00 = a[0];
        a01 = a[1];
        a02 = a[2];
        a03 = a[3];
        a10 = a[4];
        a11 = a[5];
        a12 = a[6];
        a13 = a[7];
        a20 = a[8];
        a21 = a[9];
        a22 = a[10];
        a23 = a[11];
        out[0] = a00;
        out[1] = a01;
        out[2] = a02;
        out[3] = a03;
        out[4] = a10;
        out[5] = a11;
        out[6] = a12;
        out[7] = a13;
        out[8] = a20;
        out[9] = a21;
        out[10] = a22;
        out[11] = a23;
        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
      }

      return out;
    }
    /**
     * Scales the mat4 by the dimensions in the given vec3 not using vectorization
     *
     * @param {mat4} out the receiving matrix
     * @param {mat4} a the matrix to scale
     * @param {vec3} v the vec3 to scale the matrix by
     * @returns {mat4} out
     **/

    function scale(out, a, v) {
      var x = v[0],
          y = v[1],
          z = v[2];
      out[0] = a[0] * x;
      out[1] = a[1] * x;
      out[2] = a[2] * x;
      out[3] = a[3] * x;
      out[4] = a[4] * y;
      out[5] = a[5] * y;
      out[6] = a[6] * y;
      out[7] = a[7] * y;
      out[8] = a[8] * z;
      out[9] = a[9] * z;
      out[10] = a[10] * z;
      out[11] = a[11] * z;
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
      return out;
    }
    /**
     * Rotates a mat4 by the given angle around the given axis
     *
     * @param {mat4} out the receiving matrix
     * @param {mat4} a the matrix to rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @param {vec3} axis the axis to rotate around
     * @returns {mat4} out
     */

    function rotate(out, a, rad, axis) {
      var x = axis[0],
          y = axis[1],
          z = axis[2];
      var len = Math.sqrt(x * x + y * y + z * z);
      var s, c, t;
      var a00, a01, a02, a03;
      var a10, a11, a12, a13;
      var a20, a21, a22, a23;
      var b00, b01, b02;
      var b10, b11, b12;
      var b20, b21, b22;

      if (len < EPSILON) {
        return null;
      }

      len = 1 / len;
      x *= len;
      y *= len;
      z *= len;
      s = Math.sin(rad);
      c = Math.cos(rad);
      t = 1 - c;
      a00 = a[0];
      a01 = a[1];
      a02 = a[2];
      a03 = a[3];
      a10 = a[4];
      a11 = a[5];
      a12 = a[6];
      a13 = a[7];
      a20 = a[8];
      a21 = a[9];
      a22 = a[10];
      a23 = a[11]; // Construct the elements of the rotation matrix

      b00 = x * x * t + c;
      b01 = y * x * t + z * s;
      b02 = z * x * t - y * s;
      b10 = x * y * t - z * s;
      b11 = y * y * t + c;
      b12 = z * y * t + x * s;
      b20 = x * z * t + y * s;
      b21 = y * z * t - x * s;
      b22 = z * z * t + c; // Perform rotation-specific matrix multiplication

      out[0] = a00 * b00 + a10 * b01 + a20 * b02;
      out[1] = a01 * b00 + a11 * b01 + a21 * b02;
      out[2] = a02 * b00 + a12 * b01 + a22 * b02;
      out[3] = a03 * b00 + a13 * b01 + a23 * b02;
      out[4] = a00 * b10 + a10 * b11 + a20 * b12;
      out[5] = a01 * b10 + a11 * b11 + a21 * b12;
      out[6] = a02 * b10 + a12 * b11 + a22 * b12;
      out[7] = a03 * b10 + a13 * b11 + a23 * b12;
      out[8] = a00 * b20 + a10 * b21 + a20 * b22;
      out[9] = a01 * b20 + a11 * b21 + a21 * b22;
      out[10] = a02 * b20 + a12 * b21 + a22 * b22;
      out[11] = a03 * b20 + a13 * b21 + a23 * b22;

      if (a !== out) {
        // If the source and destination differ, copy the unchanged last row
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
      }

      return out;
    }
    /**
     * Generates a perspective projection matrix with the given bounds.
     * Passing null/undefined/no value for far will generate infinite projection matrix.
     *
     * @param {mat4} out mat4 frustum matrix will be written into
     * @param {number} fovy Vertical field of view in radians
     * @param {number} aspect Aspect ratio. typically viewport width/height
     * @param {number} near Near bound of the frustum
     * @param {number} far Far bound of the frustum, can be null or Infinity
     * @returns {mat4} out
     */

    function perspective(out, fovy, aspect, near, far) {
      var f = 1.0 / Math.tan(fovy / 2),
          nf;
      out[0] = f / aspect;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[5] = f;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[11] = -1;
      out[12] = 0;
      out[13] = 0;
      out[15] = 0;

      if (far != null && far !== Infinity) {
        nf = 1 / (near - far);
        out[10] = (far + near) * nf;
        out[14] = 2 * far * near * nf;
      } else {
        out[10] = -1;
        out[14] = -2 * near;
      }

      return out;
    }
    /**
     * Generates a look-at matrix with the given eye position, focal point, and up axis.
     * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
     *
     * @param {mat4} out mat4 frustum matrix will be written into
     * @param {vec3} eye Position of the viewer
     * @param {vec3} center Point the viewer is looking at
     * @param {vec3} up vec3 pointing up
     * @returns {mat4} out
     */

    function lookAt(out, eye, center, up) {
      var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
      var eyex = eye[0];
      var eyey = eye[1];
      var eyez = eye[2];
      var upx = up[0];
      var upy = up[1];
      var upz = up[2];
      var centerx = center[0];
      var centery = center[1];
      var centerz = center[2];

      if (Math.abs(eyex - centerx) < EPSILON && Math.abs(eyey - centery) < EPSILON && Math.abs(eyez - centerz) < EPSILON) {
        return identity(out);
      }

      z0 = eyex - centerx;
      z1 = eyey - centery;
      z2 = eyez - centerz;
      len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
      z0 *= len;
      z1 *= len;
      z2 *= len;
      x0 = upy * z2 - upz * z1;
      x1 = upz * z0 - upx * z2;
      x2 = upx * z1 - upy * z0;
      len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);

      if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
      } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
      }

      y0 = z1 * x2 - z2 * x1;
      y1 = z2 * x0 - z0 * x2;
      y2 = z0 * x1 - z1 * x0;
      len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);

      if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
      } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
      }

      out[0] = x0;
      out[1] = y0;
      out[2] = z0;
      out[3] = 0;
      out[4] = x1;
      out[5] = y1;
      out[6] = z1;
      out[7] = 0;
      out[8] = x2;
      out[9] = y2;
      out[10] = z2;
      out[11] = 0;
      out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
      out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
      out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
      out[15] = 1;
      return out;
    }

    /**
     * 3 Dimensional Vector
     * @module vec3
     */

    /**
     * Creates a new, empty vec3
     *
     * @returns {vec3} a new 3D vector
     */

    function create$1() {
      var out = new ARRAY_TYPE(3);

      if (ARRAY_TYPE != Float32Array) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
      }

      return out;
    }
    /**
     * Scales a vec3 by a scalar number
     *
     * @param {vec3} out the receiving vector
     * @param {vec3} a the vector to scale
     * @param {Number} b amount to scale the vector by
     * @returns {vec3} out
     */

    function scale$1(out, a, b) {
      out[0] = a[0] * b;
      out[1] = a[1] * b;
      out[2] = a[2] * b;
      return out;
    }
    /**
     * Perform some operation over an array of vec3s.
     *
     * @param {Array} a the array of vectors to iterate over
     * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
     * @param {Number} offset Number of elements to skip at the beginning of the array
     * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
     * @param {Function} fn Function to call for each vector in the array
     * @param {Object} [arg] additional argument to pass to fn
     * @returns {Array} a
     * @function
     */

    var forEach = function () {
      var vec = create$1();
      return function (a, stride, offset, count, fn, arg) {
        var i, l;

        if (!stride) {
          stride = 3;
        }

        if (!offset) {
          offset = 0;
        }

        if (count) {
          l = Math.min(count * stride + offset, a.length);
        } else {
          l = a.length;
        }

        for (i = offset; i < l; i += stride) {
          vec[0] = a[i];
          vec[1] = a[i + 1];
          vec[2] = a[i + 2];
          fn(vec, vec, arg);
          a[i] = vec[0];
          a[i + 1] = vec[1];
          a[i + 2] = vec[2];
        }

        return a;
      };
    }();

    class Render extends  Webgl{

        constructor( canvas,container = document.body){
            super( canvas,container);
            this.programs=new Map();
            this.initcamera();
        }

        initcamera(){
            this.vMatrix =  create();
            this.pMatrix =  create();
            return this
        }

        setprogram(name,program){
            this.programs.set(name,program);
            return this
        }
        /*
        v
         */
        lookAt(eye=[0.0, 0.0, 1.0],target=[0, 0, 0],up=[0, 1, 0]){
            lookAt(this.vMatrix,eye, target, up);
            return this
        }

        /*
        p
        第一个参数flvy,定义可视角的大小，flvy值小，表示从相机（人眼）出发的光线的角度小，此时同等距离下，可观察到的视野范围较小，反之则大。从物体显示在画板的大小来反映，如果flvy值较大，则物体在画板中所占比例就较少，看起来比较小，反之则显示比较大。
    第二个参数aspect，定义物体显示在画板上的x和y方向上的比例。aspect小于1，则物体显示出来比实际更高，大于1，显示出来比实际看起来更宽，设为1，会按实际反应长宽比。
    第三个参数zNear,定义距离相机（人眼）最近处物体截面相距的距离。这个值越大，表示观测点距离物体距离越远，看起来物体就比较小，反之则比较大。如果物体运动到距离观测点的距离小于了设定的zNear,则物体不会被绘制在画板上。
    第四个参数zFar,定义可观测到的物体的最远处截面相距相机的距离。如果物体运动到距离观测点的距离大于了设定的zFar,则物体不会被绘制的画板上。
         */
        perspective(flvy=90,aspect=this.canvas.width/this.canvas.height,zNear=1,zfar=100){
            perspective(this.pMatrix,flvy,aspect,zNear, zfar);
            return this

        }

        translate(t=[0,0,0]){
            for (let [name, program] of this.programs.entries()) {
                program.translate(t,this.pMatrix,this.vMatrix);
            }
            return this
        }

        rotate(rad,rotationAxis) {
            for (let [name, program] of this.programs.entries()) {
                program.rotate(rad,rotationAxis,this.pMatrix,this.vMatrix);
            }
            return this
        }
        scale(t=[1,1,1]) {
            for (let [name, program] of this.programs.entries()) {
                program.scale(t,this.pMatrix,this.vMatrix);
            }
            return this
        }
        toworld(){
            for (let [name, program] of this.programs.entries()) {
                program.toworld();
            }
            return this
        }
        /*
       usage
           gl.STATIC_DRAW: 缓冲区的内容可能经常使用，而不会经常更改。内容被写入缓冲区，但不被读取。
           gl.DYNAMIC_DRAW: 缓冲区的内容可能经常被使用，并且经常更改。内容被写入缓冲区，但不被读取。
           gl.STREAM_DRAW: 缓冲区的内容可能不会经常使用。内容被写入缓冲区，但不被读取。
        */
        data(data2d,target=this.gl.ARRAY_BUFFER,usage= this.gl.STATIC_DRAW){
            let data1d=[].concat.apply([],data2d);
            let buffer = this.gl.createBuffer();
            /*
            target=
            ARRAY_BUFFER  表示顶点的数据。
    		ELEMENT_ARRAY_BUFFER 表示索引数据
             */
            //绑定缓冲
            this.gl.bindBuffer(target,buffer);
            //数据传递到缓冲区
            if(target==this.gl.ARRAY_BUFFER){
                this.gl.bufferData(target, new Float32Array(data1d), usage);
            } if (target==this.gl.ELEMENT_ARRAY_BUFFER) {
                this.gl.bufferData(target, new Int16Array(data1d), usage);
            }

            //取消绑定缓冲区
            this.gl.bindBuffer(target, null);
            return buffer;
        }


        drawArrays(drawtype=this.gl.LINE_LOOP,count,first=0){
            //void gl.drawArrays(mode, first, count);
            this.gl.drawArrays(drawtype, first, count);
            return this
        }
        drawElements(drawtype=this.gl.LINE_LOOP,count,type,offset){
            // void gl.drawElements(mode, count, type, offset);
            this.gl.drawArrays(drawtype, count, type, offset);
            return this
        }
    }

    class glstatus {
        constructor(gl){
            this.gl=gl;
            this.status=new Map();
        }
        checkgl() {
            let capsmap=new Map();
            let caps = new Map([
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

    function Shader(gl,type,glsl ){
            if(!domutil.isWebGLContext(gl)){
                throw new Error("need webgl context");
            }

            var SHADERTYPE=[gl.VERTEX_SHADER,gl.FRAGMENT_SHADER];
            if(!SHADERTYPE.includes(type)){
                throw new Error("SHADER TYPE no such type"+type+" only "+SHADERTYPE);
            }

            let shader = gl.createShader(type);
            gl.shaderSource(shader,glsl);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                throw new Error(gl.getShaderInfoLog(shader));
            }
            return shader
        }

    class Program {

        constructor(gl,v,f,mvp_uniform){
            this.gl=gl;
            this.v=v;
            this.f=f;
            // mvp_uniform，这个变量是全局的变量。
            this.mvp_uniform=mvp_uniform;
            // 模型矩阵，实现平移，缩放
            this.mMatrix=create();
            this.mvp=create();
        }
        linkProgram() {
            this.program= this.gl.createProgram();
            this.s_v = Shader(this.gl, this.gl.VERTEX_SHADER, this.v);
            this.s_f = Shader(this.gl, this.gl.FRAGMENT_SHADER,this.f);

            this.gl.attachShader( this.program, this.s_v);
            this.gl.attachShader( this.program, this.s_f);
            this.gl.linkProgram( this.program);
            if (!this.gl.getProgramParameter( this.program, this.gl.LINK_STATUS)) {
                throw new Error("Could not initialise shaders");
            }
            return this;
        }
        useProgram(){
            this.gl.useProgram(this.program);
           return this;
       }
        getAttribLocation(attribnname){
            return this.gl.getAttribLocation(this.program,attribnname)
        }
        getUniformLocation(uniformname=this.mvp_uniform){
            return this.gl.getUniformLocation(this.program,uniformname)
        }

        // 实现对单个program对平移，mvp=p*v*m;所以p*v=mvp*m^(-1)
        translate(t=[0,0,0],p,v){
            this.pv=multiply(create(),p,v);
            translate(this.mMatrix,this.mMatrix,t);
            this.toworld();
        }
        initmMatrix(){
            this.mMatrix=create();
        }
        // 实现对单个program对平移，mvp=p*v*m;所以p*v=mvp*m^(-1)
        scale(t=[1,1,1],p, v){
            this.pv=multiply(create(),p,v);
            scale(this.mMatrix,this.mMatrix,t);
            this.toworld();
        }
        // 实现对单个program对平移，mvp=p*v*m;所以p*v=mvp*m^(-1)
        rotate(rad, rotationAxis,p,v) {
            this.pv=multiply(create(),p,v);
            rotate(this.mMatrix,this.mMatrix, rad, rotationAxis);
            this.toworld();
        }

        toworld(){
            multiply(this.mvp,this.pv, this.mMatrix);
            let uniLocation=this.gl.getUniformLocation(this.program,this.mvp_uniform);
            //将坐标变换矩阵传入uniformLocation，并绘图(第一个模型)
            if(uniLocation==null){
                throw new Error("uniform location not found"+this.mvp_uniform);
            }
            this.gl.uniformMatrix4fv(uniLocation, false, this.mvp);
        }
        setattr(target=this.gl.ARRAY_BUFFER,buffer,attribname,vertexAttribPointer_size,type=this.gl.FLOAT,stride=0,offset=0){

            this.gl.bindBuffer(target, buffer);
            let attribLocation=this.gl.getAttribLocation(this.program , attribname);
            // 将attributeLocation设置为有效
            this.gl.enableVertexAttribArray(attribLocation);

            /*
            void gl.vertexAttribPointer(index, size, type, normalized, stride, offset);

            index=attributeLocation
            size=count
            stride=offset beginning
            offset=offset length
            */

            this.gl.vertexAttribPointer(attribLocation,vertexAttribPointer_size,type, false,stride,offset);
        }
    }

    class Color {

        static hsva2rgba(h, s, v, a){
            if(s > 1 || v > 1 || a > 1){return;}
            var th = h % 360;
            var i = Math.floor(th / 60);
            var f = th / 60 - i;
            var m = v * (1 - s);
            var n = v * (1 - s * f);
            var k = v * (1 - s * (1 - f));
            var color = new Array();
            if(!s > 0 && !s < 0){
                color.push(v, v, v, a);
            } else {
                var r = new Array(v, n, m, m, k, v);
                var g = new Array(k, v, v, n, m, m);
                var b = new Array(m, m, k, v, v, n);
                color.push(r[i], g[i], b[i], a);
            }
            return color;
        }
        constructor(r, g, b,a=1) {
            this.a=a;
            if (g === undefined && b === undefined ) {
                // r is THREE.Color, hex or string
                return this.set(r);
            }
            return this.setRGB(r, g, b );
        }

        isColor() {
            return true;
        }

        fromArray (array, offset) {

            if (offset === undefined) offset = 0;

            this.r = array[offset];
            this.g = array[offset + 1];
            this.b = array[offset + 2];

            return this;

        }
        setHex(hex) {
            hex = Math.floor(hex);
            this.r = (hex >> 16 & 255) / 255;
            this.g = (hex >> 8 & 255) / 255;
            this.b = (hex & 255) / 255;
        }

        set(value) {
            if (value && typeof value.isColor==="function") {
                this.r = value.r;
                this.g = value.g;
                this.b = value.b;
            }else if (typeof value.length === "number"){
                this.fromArray(value);
            } else if (typeof value === 'number') {
                this.setHex(value);

            }
            return this;

        }
        getglsl(){
            return "vec4("+this.r+","+this.g+","+this.b+","+this.a+")"
        }
    }

    class Singlecolor extends Program{

        constructor(gl,gl_FragColor,mvp_uniform="mvp") {

            let v = `attribute vec3 position;`;
            if(mvp_uniform!=null) {
                v += ` uniform mat4  ` + mvp_uniform + `;`;
            }
            v+= `void main(void) {`;

            if(mvp_uniform!=null){
                v+=` gl_Position = ` +mvp_uniform+`* vec4(position, 1.0);`;
            }else {
                v+=` gl_Position = vec4(position, 1.0);`;
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
            this.precision=" mediump float";
        }
    }

    class Colors extends Program{

        constructor(gl,mvp_uniform="mvp") {

            let v = `attribute vec3 position;
        attribute vec4 color;
          varying vec4 vColor;`;
            if(mvp_uniform!=null) {
                v += ` uniform mat4  ` + mvp_uniform + `;`;
            }
            v+= `void main(void) {`;

            if(mvp_uniform!=null){
                v+=` gl_Position = ` +mvp_uniform+`* vec4(position, 1.0);`;
            }else {
                v+=` gl_Position = vec4(position, 1.0);`;
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
            this.precision=" mediump float";
        }
    }

    /*
    绘制一个线圈。即，绘制一系列线段，上一点连接下一点，并且最后一点与第一个点相连。
     */

    class Lineloop {


    }

    class Square {
        /*
         */
        constructor(a){
            this.position=[];
            this.position.push(scale$1([],[1.0,1,0],a));
            this.position.push(scale$1([],[1.0,-1,0],a));
            this.position.push(scale$1([],[-1.0,-1,0],a));
            this.position.push(scale$1([],[-1.0,1,0],a));

            this.color=[];
            this.color.push( [0,1,0,1]);
            this.color.push([0,1,0,1]);
            this.color.push([0,1,0,1]);
            this.color.push([0,1,0,1]);

            this.index=[[3,2,1],[3,1,0]];
        }
    }

    /*
    torus 立体的圆环
     */

    class Torus {
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

    exports.Color = Color;
    exports.Colors = Colors;
    exports.Lineloop = Lineloop;
    exports.Program = Program;
    exports.Render = Render;
    exports.Shader = Shader;
    exports.Singlecolor = Singlecolor;
    exports.Square = Square;
    exports.Torus = Torus;
    exports.Webgl = Webgl;
    exports.domutil = domutil;
    exports.extend = extend;
    exports.glstatus = glstatus;
    exports.strMap2obj = strMap2obj;

    return exports;

}({}));
