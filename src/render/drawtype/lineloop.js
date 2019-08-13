/*
绘制一个线圈。即，绘制一系列线段，上一点连接下一点，并且最后一点与第一个点相连。
 */
import {vec3} from "gl-matrix"

export class Lineloop {

    constructor(data){
        this.vertex=data
    }
    square(a){
        this.vertex=[];
        this.vertex.push(vec3.scale([],[1,1,0],a));
        this.vertex.push(vec3.scale([],[1,-1,0],a));
        this.vertex.push(vec3.scale([],[-1,-1,0],a));
        this.vertex.push(vec3.scale([],[-1,1,0],a));

        return  this.vertex
    }
}
