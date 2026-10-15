export type LabelAnchor={id:string;x:number;y:number;w:number;h:number};
export type LabelBox=LabelAnchor & {anchorX:number;anchorY:number};
export type LabelBounds={left:number;top:number;right:number;bottom:number};
export const overlaps=(a:LabelAnchor,b:LabelAnchor,gap=4)=>Math.abs(a.x-b.x)<(a.w+b.w)/2+gap&&Math.abs(a.y-b.y)<(a.h+b.h)/2+gap;
const clamp=(value:number,min:number,max:number)=>Math.max(min,Math.min(max,value));

/** Place every label, using the shortest available offset rather than dropping collisions. */
export function layoutAllLabels(anchors:LabelAnchor[],bounds:LabelBounds):LabelBox[]{
 const place=(order:LabelAnchor[])=>{
  const placed:LabelBox[]=[];
  for(const anchor of order){
   const left=bounds.left+anchor.w/2,right=bounds.right-anchor.w/2;
   const top=bounds.top+anchor.h/2,bottom=bounds.bottom-anchor.h/2;
   const preferred={...anchor,x:clamp(anchor.x,left,right),y:clamp(anchor.y,top,bottom)};
   let best=preferred,bestCost=Infinity;
   const candidates=[preferred];
   // Neighbour edges offer a snug packing; a regular grid also reaches spare corners.
   for(const other of placed){
    for(const x of [other.x-(other.w+anchor.w)/2-5,other.x+(other.w+anchor.w)/2+5])candidates.push({...anchor,x:clamp(x,left,right),y:clamp(anchor.y,top,bottom)});
    for(const y of [other.y-(other.h+anchor.h)/2-5,other.y+(other.h+anchor.h)/2+5])candidates.push({...anchor,x:clamp(anchor.x,left,right),y:clamp(y,top,bottom)});
   }
   for(let y=top;y<=bottom;y+=8)for(let x=left;x<=right;x+=10)candidates.push({...anchor,x,y});
   for(const candidate of candidates){
    const distance=(candidate.x-anchor.x)**2+(candidate.y-anchor.y)**2;
    if(distance>=bestCost)continue;
    if(placed.some(other=>overlaps(candidate,other)))continue;
    best=candidate;bestCost=distance;
    if(distance<1)break;
   }
   placed.push({...best,anchorX:anchor.x,anchorY:anchor.y});
  }
  return placed;
 };
 // Try complementary sweeps so dense dormitory rows don't push one unlucky label far away.
 const orders=[anchors,[...anchors].sort((a,b)=>a.y-b.y||a.x-b.x),[...anchors].sort((a,b)=>b.y-a.y||b.x-a.x),[...anchors].sort((a,b)=>b.w-a.w)];
 const cost=(boxes:LabelBox[])=>boxes.reduce((sum,b,i)=>sum+(b.x-b.anchorX)**2+(b.y-b.anchorY)**2+boxes.slice(i+1).filter(other=>overlaps(b,other)).length*1e8,0);
 return orders.map(place).reduce((best,candidate)=>cost(candidate)<cost(best)?candidate:best);
}
