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
        this.getindex(type);
    }
    getindex(type){
        switch (type) {
            case WebGLRenderingContext.POINTS:
                this.index=[0,1,2,3];
                break;
            case WebGLRenderingContext.LINES://绘制一系列单独线段。每两个点作为端点，线段之间不连接。
                this.index=[[0,1],[2,3]];
                break;
            case WebGLRenderingContext.LINE_LOOP://绘制一个线圈。即，绘制一系列线段，上一点连接下一点，并且最后一点与第一个点相连。
                this.index=[0,1,2,3];
                break;
            case WebGLRenderingContext.LINE_STRIP://绘制一个线条。即，绘制一系列线段，上一点连接下一点。
                this.index=[[0,1],[1,2],[2,3]];
                break;
            case WebGLRenderingContext.TRIANGLES://绘制一系列三角形。每三个点作为顶点。
                this.index=[[0,1,2],[2,3,0]];
                break;
        }

    }
}
