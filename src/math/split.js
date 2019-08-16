export function SplitLINES(points) {
    let lines=[]
    for(let i=0;i<points.length-1;i++){
        lines.push(points[i]);
        lines.push(points[i+1]);
    }
    return lines;
}
/*

 */
export function SplitTRIANGLES(points) {
    let lines=[]
    for(let i=0;i<points.length-1;i++){
        lines.push(points[0]);
        lines.push(points[i]);
        lines.push(points[i+1]);
    }
    return lines;
}
