import {Shader} from "./shader";
import {mat4} from "gl-matrix";

class Program {

    constructor(gl,v,f,mvp_uniform){
        this.gl=gl;
        this.v=v;
        this.f=f;
        // mvp_uniform，这个变量是全局的变量。
        this.mvp_uniform=mvp_uniform;
        // 模型矩阵，实现平移，缩放
        this.mMatrix=mat4.create();
        this.mvp=mat4.create();
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
        this.pv=mat4.multiply(mat4.create(),p,v)
        mat4.translate(this.mMatrix,this.mMatrix,t);
        this.toworld()
    }
    initmMatrix(){
        this.mMatrix=mat4.create();
    }
    // 实现对单个program对平移，mvp=p*v*m;所以p*v=mvp*m^(-1)
    scale(t=[1,1,1],p, v){
        this.pv=mat4.multiply(mat4.create(),p,v)
        mat4.scale(this.mMatrix,this.mMatrix,t);
        this.toworld()
    }
    // 实现对单个program对平移，mvp=p*v*m;所以p*v=mvp*m^(-1)
    rotate(rad, rotationAxis,p,v) {
        this.pv=mat4.multiply(mat4.create(),p,v)
        mat4.rotate(this.mMatrix,this.mMatrix, rad, rotationAxis);
        this.toworld()
    }

    /*
    变换，并应用到世界坐标系mvp
     */
    toworld(p,v){
        if(this.pv==null){
            this.pv=mat4.multiply(mat4.create(),p,v)
        }
        mat4.multiply(this.mvp,this.pv, this.mMatrix);
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

export {Program}
