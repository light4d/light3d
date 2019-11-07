export class LinklistNode {
    constructor(value){
        this.value=value;
        this.front=null;
        this.next=null;
    }
    static fromarray(dataarray){
        let first=new LinklistNode(dataarray[0]);
        let p=first;
        for (let i=1;i< dataarray.length;i++) {
            let n=new LinklistNode(dataarray[i]);
            p.next=n;
            n.front=p;
            p=n;
        }
        return first;
    }
}