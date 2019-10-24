import {vec3} from "gl-matrix";
import {SplitLINES,SplitTRIANGLES} from "../math/split"
import {MakeIndexArray} from "../math/rander"
import {MakePolygonLINE_STRIPIndexArray,MakePolygonLINE_LOOPIndexArray,MakePolygonTRIANGLESIndexArray} from "../math/drawelementindex"
export class Polygon {
    /*
     */
    static points(sides=3,radius=1){
        const pos=[]
        let radalpha=Math.PI*2/sides
        for (let i=0;i<sides;i++){
            let x=radius*Math.cos(i*radalpha)
            let y=radius*Math.sin(i*radalpha)
            pos.push( [x,y,0]);
        }
        return pos;
    }
    constructor(sides=3,radius=1,draw="Arrays",type=WebGLRenderingContext.LINES){
        this.position=[];this.color=[];
        if(draw=="Arrays"){
            switch (type) {
                case WebGLRenderingContext.POINTS://绘制一系列点。
                case WebGLRenderingContext.LINE_STRIP://绘制一个线条。即，绘制一系列线段，上一点连接下一点。
                case WebGLRenderingContext.LINE_LOOP: //绘制一个线圈。即，绘制一系列线段，上一点连接下一点，并且最后一点与第一个点相连。
                    this.position=Polygon.points(sides,radius)
                    break;
                case WebGLRenderingContext.LINES://绘制一系列单独线段。每两个点作为端点，线段之间不连接。
                    this.position=SplitLINES(Polygon.points(sides,radius))
                    break;
                case WebGLRenderingContext.TRIANGLES://绘制一系列三角形。每三个点作为顶点。
                    this.position=SplitTRIANGLES(Polygon.points(sides,radius))
                    break;
            }

        }else if (draw=="Elements"){
            this.position=Polygon.points(sides,radius)
            this.index=[];
            switch (type) {
                case WebGLRenderingContext.POINTS://绘制一系列点。
                    this.index=MakeIndexArray(this.position.length-1,0)
                    break;
                case WebGLRenderingContext.LINE_STRIP://绘制一个线条。即，绘制一系列线段，上一点连接下一点。
                    this.index=MakePolygonLINE_STRIPIndexArray(this.position.length)
                    break;
                case WebGLRenderingContext.LINE_LOOP: //绘制一个线圈。即，绘制一系列线段，上一点连接下一点，并且最后一点与第一个点相连。
                    this.index=MakePolygonLINE_LOOPIndexArray(this.position.length)
                    break;
                case WebGLRenderingContext.LINES://绘制一系列单独线段。每两个点作为端点，线段之间不连接。
                    this.index=MakeIndexArray(this.position.length-1,0)
                    break;
                case WebGLRenderingContext.TRIANGLES://绘制一系列三角形。每三个点作为顶点。
                    this.index=MakePolygonTRIANGLESIndexArray(this.position.length)
                    break;
            }
        }
    }

}
