export function MakePolygonLINE_STRIPIndexArray(polygonpointlen) {
    const indexs=[]
    for(let i=0;i<polygonpointlen-1;i++){
        indexs.push(i);
        indexs.push(i+1);
    }
    return indexs;
}

export function MakePolygonLINE_LOOPIndexArray(polygonpointlen) {
    const indexs=[]
    for(let i=0;i<polygonpointlen-1;i++){
        indexs.push(i);
        indexs.push(i+1);
    }
    indexs.push(polygonpointlen-1);
    indexs.push(0);
    return indexs;
}
/*
正多边形的三角形生成算法
*/
export function MakePolygonTRIANGLESIndexArray(polygonpointlen) {
    const indexs=[]
    if(polygonpointlen<3){
        throw "polygonpointlen must >=3"
        return
    }
    for(let i=1;i<polygonpointlen-1;i++){
        indexs.push(0);
        indexs.push(i);
        indexs.push(i+1);
    }    
    return indexs;
}
