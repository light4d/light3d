import {Webgl} from "./webgl";
import {mat4} from "gl-matrix";

class Render extends  Webgl{

    constructor( canvas,container = document.body){
        super( canvas,container);
        this.programs=new Map();
        this.initcamera()
    }

    initcamera(){
        this.vMatrix =  mat4.create();
        this.pMatrix =  mat4.create();
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
        mat4.lookAt(this.vMatrix,eye, target, up);
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
        mat4.perspective(this.pMatrix,flvy,aspect,zNear, zfar);
        return this

    }

    translate(t=[0,0,0]){
        for (let [name, program] of this.programs.entries()) {
            program.translate(t,this.pMatrix,this.vMatrix)
        }
        return this
    }

    rotate(rad,rotationAxis) {
        for (let [name, program] of this.programs.entries()) {
            program.rotate(rad,rotationAxis,this.pMatrix,this.vMatrix)
        }
        return this
    }
    scale(t=[1,1,1]) {
        for (let [name, program] of this.programs.entries()) {
            program.scale(t,this.pMatrix,this.vMatrix)
        }
        return this
    }
    toworld(p=this.pMatrix,v=this.vMatrix){
        for (let [name, program] of this.programs.entries()) {
            program.toworld(p,v)
        }
        return this
    }
    /*
   usage
       gl.STATIC_DRAW: 缓冲区的内容可能经常使用，而不会经常更改。内容被写入缓冲区，但不被读取。
       gl.DYNAMIC_DRAW: 缓冲区的内容可能经常被使用，并且经常更改。内容被写入缓冲区，但不被读取。
       gl.STREAM_DRAW: 缓冲区的内容可能不会经常使用。内容被写入缓冲区，但不被读取。
    */
    data(data,target=this.gl.ARRAY_BUFFER,usage= this.gl.STATIC_DRAW){
        let data1d=[]
        if(typeof data[0].length === "undefined"){
            data1d=data
        }else {
            data1d=[].concat.apply([],data);
        }

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
        // count 顶点的数量。
        this.gl.drawArrays(drawtype, first, count);
        return this
    }
    drawElements(drawtype=this.gl.LINE_LOOP,count,type=this.gl.UNSIGNED_SHORT,offset){
        // void gl.drawElements(mode, count, type, offset);
        this.gl.drawElements(drawtype, count, type, offset);
        return this
    }
}

export {Render};
