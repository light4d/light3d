import {vec3} from "gl-matrix";
import {SplitLINES,SplitTRIANGLES} from "../math/split"
import {MakeIndexArray} from "../math/rander"
import {MakePolygonLINE_STRIPIndexArray,MakePolygonLINE_LOOPIndexArray,MakePolygonTRIANGLESIndexArray} from "../math/drawelementindex"
export class Polygon {
    /*
     */

    static regular_polygon_points(sides=3,radius=1){
        const pos=[]
        let radalpha=Math.PI*2/sides
        for (let i=0;i<sides;i++){
            let x=radius*Math.cos(i*radalpha)
            let y=radius*Math.sin(i*radalpha)
            pos.push( [x,y,0]);
        }
        return pos;
    }
    static newpoints(sides=3,radius=1){
        return new Polygon(sides,radius,draw="Arrays",type=WebGLRenderingContext.POINTS)
    }
    static newlines(sides=3,radius=1){
        return new Polygon(sides,radius,draw="Arrays",type=WebGLRenderingContext.LINES)
    }
    
    static newlinestrip(sides=3,radius=1){
        return new Polygon(sides,radius,draw="Elements",type=WebGLRenderingContext.LINE_STRIP)
    }
    static newlineloop(sides=3,radius=1){
        return new Polygon(sides,radius,draw="Elements",type=WebGLRenderingContext.LINE_LOOP)
    }
    constructor(sides=3,radius=1,draw="Elements",type=WebGLRenderingContext.LINES){
        this.position=[];this.color=[];
        if(draw=="Arrays"){
            switch (type) {
                case WebGLRenderingContext.POINTS://绘制一系列点。
                case WebGLRenderingContext.LINE_STRIP://绘制一个线条。即，绘制一系列线段，上一点连接下一点。
                case WebGLRenderingContext.LINE_LOOP: //绘制一个线圈。即，绘制一系列线段，上一点连接下一点，并且最后一点与第一个点相连。
                    this.position=Polygon.regular_polygon_points(sides,radius)
                    break;
                case WebGLRenderingContext.LINES://绘制一系列单独线段。每两个点作为端点，线段之间不连接。
                    this.position=SplitLINES(Polygon.regular_polygon_points(sides,radius))
                    break;
                case WebGLRenderingContext.TRIANGLES://绘制一系列三角形。每三个点作为顶点。
                    this.position=SplitTRIANGLES(Polygon.regular_polygon_points(sides,radius))
                    break;
            }

        }else if (draw=="Elements"){
            this.position=Polygon.regular_polygon_points(sides,radius)
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

    //判断点在多边形内
    static  IsPointInPoly( point, pts){  
	    let N = pts.length;  
	    let boundOrVertex = true; //如果点位于多边形的顶点或边上，也算做点在多边形内，直接返回true  
	    let intersectCount = 0;//cross points count of x   
	    let precision = 2e-10; //浮点类型计算时候与0比较时候的容差  
	    let p1, p2;//neighbour bound vertices  
	    let p = point; //当前点  
	      
	    p1 = pts[0];//left vertex          
	    for(let i = 1; i <= N; ++i){//check all rays              
	        if(p===p1){  
	            return boundOrVertex;//p is an vertex  
	        }  
	          
	        p2 = pts[i % N];//right vertex              
	        if(p.x < Math.min(p1.x, p2.x) || p.x > Math.max(p1.x, p2.x)){//ray is outside of our interests                  
	            p1 = p2;   
	            continue;//next ray left point  
	        }  
	          
	        if(p.x > Math.min(p1.x, p2.x) && p.x < Math.max(p1.x, p2.x)){//横坐标 内  ray is crossing over by the algorithm (common part of)  
	            if(p.y <= Math.max(p1.y, p2.y)){//y下  x is before of ray                      
	                if(p1.x == p2.x && p.y >= Math.min(p1.y, p2.y)){//overlies on a horizontal ray  垂线
	                    return boundOrVertex;  
	                }  
	                  
	                if(p1.y == p2.y){//水平线 ray is vertical                          
	                    if(p1.y == p.y){//水平线内 overlies on a vertical ray  
	                        return boundOrVertex;  
	                    }else{//before ray  
	                        ++intersectCount;  //交点在上方
	                    }   
	                }else{//cross point on the left side                          
	                    let xinters = (p.x - p1.x) * (p2.y - p1.y) / (p2.x - p1.x) + p1.y;//两点式化简，交点y坐标 cross point of y                          
	                    if(Math.abs(p.y - xinters) < precision){//== 0  在线上  overlies on a ray  
	                        return boundOrVertex;  
	                    }  
	                      
	                    if(p.y < xinters){//before ray  
	                        ++intersectCount;  //交点在上方
	                    }   
	                }  
	            }  
	        }else{//special case when ray is crossing through the vertex                  
	            if(p.x == p2.x && p.y <= p2.y){//p crossing over p2                      
	                let p3 = pts[(i+1) % N]; //next vertex                      
	                if(p.x >= Math.min(p1.x, p3.x) && p.x <= Math.max(p1.x, p3.x)){//p.x lies between p1.x & p3.x  
	                    ++intersectCount;  
	                }else{  
	                    intersectCount += 2;  
	                }  
	            }  
	        }              
	        p1 = p2;//next ray left point  
	    }  
	      
	    if(intersectCount % 2 == 0){//偶数在多边形外  
	        return false;  
	    } else { //奇数在多边形内  
	        return true;  
	    }  
	      
	}  
}
 
