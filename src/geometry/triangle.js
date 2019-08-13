import {vec3} from "gl-matrix"
export class Triangle {
    constructor(a){
                this.position=[];
                this.position.push(vec3.scale([],[1 ,1,0],a));
                this.position.push(vec3.scale([],[1 ,-1,0],a));
                this.position.push(vec3.scale([],[-1 ,-1,0],a));

                this.color=[];
                this.color.push( [0,1,0,1]);
                this.color.push([0,1,0,1]);
                this.color.push([0,1,0,1]);

                this.index=[0,1,2];
    }
}
