
import {vec3} from "gl-matrix";

export class Square {
    /*
     */
    constructor(a,type=WebGLRenderingContext.LINES){
        this.position=[];
        this.position.push(vec3.scale([],[1.0,1,0],a));
        this.position.push(vec3.scale([],[1.0,-1,0],a));
        this.position.push(vec3.scale([],[-1.0,-1,0],a));
        this.position.push(vec3.scale([],[-1.0,1,0],a));

        this.color=[];
        this.color.push( [0,1,0,1]);
        this.color.push([0,1,0,1]);
        this.color.push([0,1,0,1]);
        this.color.push([0,1,0,1]);

        switch (type) {
            case WebGLRenderingContext.POINTS:
                this.index=[0,1,2,3];
            case WebGLRenderingContext.LINES://绘制一系列单独线段。每两个点作为端点，线段之间不连接。
                this.index=[[0,1],[2,3]];
        }

    }

}
