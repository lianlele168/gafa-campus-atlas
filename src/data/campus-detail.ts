import * as THREE from 'three';
import {places} from './campus';
// Shared geometry for both renderers. Coordinates follow the north-up supplied plan.
export type XYZ=[number,number,number];
export type DetailBox={x:number;z:number;w:number;d:number;h:number;y:number;color:number;id?:string};
export type DetailSurface={points:[number,number][];y:number;color:number;id?:string;h?:number};
export type DetailLine={points:XYZ[];color:number;id?:string;width?:number};
export type DetailTree={x:number;z:number;r:number};
export const TEACHING_IDS=['a','b','library','d','e','j','admin'];
export function academicLevels(id:string,_height:number){return id==='admin'?[14.8,18.6,22.4,26.2]:[0,3.4,7.2,11,14.8,18.6,22.4,26.2];}
// Gallery crossings are open only at their walking level; A's front facade stays intact.
export function galleryWallSpans(p:{id:string;x:number;w:number},y:number):[number,number][]{
 const left=p.x-p.w/2,right=p.x+p.w/2;
 if(y<7.1||y>=11||!['b','library','d','e'].includes(p.id))return [[left,right]];
 const cuts=(p.id==='e'?[]:[-2,20]).filter(x=>x-2>left&&x+2<right);const spans:[number,number][]=[];let start=left;
 for(const x of cuts){const half=p.id==='e'&&x===20?3.2:2;spans.push([start,x-half]);start=x+half;}spans.push([start,right]);return spans;
}
export function createLakeShape(){const points=[[71,-1],[75,0],[77,7],[76,23],[75,36],[77,49],[76,66],[77,85],[76,104],[76,121],[72,131],[69,128],[70,119],[70,109],[68,100],[62,95],[53,95],[46,91],[43,84],[41,77],[43,70],[48,67],[46,61],[50,56],[59,55],[65,49],[66,41],[65,33],[68,22],[68,10],[68,3]].map(([x,z])=>new THREE.Vector3(x,0,z));const curve=new THREE.CatmullRomCurve3(points,true,'centripetal');const shape=new THREE.Shape();curve.getPoints(180).forEach((p,i)=>i?shape.lineTo(p.x,-p.z):shape.moveTo(p.x,-p.z));shape.closePath();return shape;}
export function lakeOutline(){return createLakeShape().getPoints().map(p=>[p.x,-p.y] as [number,number]);}
export function islandOutline(){return Array.from({length:48},(_,i)=>{const a=i/48*Math.PI*2,r=5+Math.sin(a*3)*.55;return [60+Math.cos(a)*r,75+Math.sin(a)*r*.85] as [number,number]});}
export function oval(cx:number,cz:number,r:number,halfStraight:number,steps=120):[number,number][]{const points:[number,number][]=[];for(let i=0;i<=steps/2;i++){const a=Math.PI*i/(steps/2);points.push([cx+Math.cos(a)*r,cz+halfStraight+Math.sin(a)*r]);}for(let i=0;i<=steps/2;i++){const a=Math.PI+Math.PI*i/(steps/2);points.push([cx+Math.cos(a)*r,cz-halfStraight+Math.sin(a)*r]);}return points;}
export function campusDetails(){const boxes:DetailBox[]=[],surfaces:DetailSurface[]=[],lines:DetailLine[]=[],trees:DetailTree[]=[];
 const box=(x:number,z:number,w:number,d:number,h:number,color:number,y=0,id?:string)=>boxes.push({x,z,w,d,h,color,y,id});
 const surface=(points:[number,number][],y:number,color:number,id?:string)=>surfaces.push({points,y,color,id});
 const line=(points:XYZ[],color:number,id?:string,width=1)=>lines.push({points,color,id,width});
 const rect=(x:number,z:number,w:number,d:number,y:number,color:number,id?:string)=>surface([[x-w/2,z-d/2],[x+w/2,z-d/2],[x+w/2,z+d/2],[x-w/2,z+d/2]],y,color,id);
 // Solid platform beneath the second-floor passage in the A/admin opening.
 // Its top follows the gallery deck, while the space above remains open to the hall.
 box(5.5,101,26,13,7.1,0xb7987f,0,'a');
 box(5.5,101,26,13.6,.38,0xc6b49e,7.1,'a');
 // Continue the second-floor podium beneath the administration colonnade.
 box(28,101,19,13,7.1,0xb7987f,0,'admin');
 box(28,101,19,13.6,.38,0xc6b49e,7.1,'admin');
 // Extend the podium to the museum west facade, with an open entrance threshold.
 box(39.25,101,3.5,13,7.1,0xb7987f,0,'admin');
 box(39.25,101,3.5,13.6,.38,0xc6b49e,7.1,'admin');
 box(41.06,101,.12,3,2.8,0x5b7779,7.48,'museum');
 // Protect only the rear exposed edge; keep the hall and museum entrances clear.
 for(const y of [8.03,8.53])line([[25,y,94.2],[41,y,94.2]],0x263536,'admin',2);
 for(let x=26;x<=41;x+=2)box(x,94.2,.1,.1,1.05,0x263536,7.48,'admin');
 // Matching freestanding columns on the left side of the open central bay.
 for(const x of [-6.5,-1.5,3.5,8.5,13.5])for(const side of [-1,1])
  box(x,101+side*6.4,.5,.5,14.8-7.48,0xb7b09d,7.48,'a');
 // A and administration share an upper wing on floors 5–7; floors 1–4 stay open.
 const upperBase=14.8,upperRoof=26.2;
 box(5.5,101,26,10,upperRoof-upperBase,0xa45d50,upperBase,'a');
 for(const y of [14.8,18.6,22.4,26.2])box(5.5,101,26,14.8,.38,y===upperRoof?0xbe7b69:0xa45d50,y,'a');
 for(const y of [14.8,18.6,22.4])for(const side of [-1,1]){
  for(let x=-6;x<18;x+=3.2)box(x,101+side*5.16,2.55,.14,3.1,0x5b7779,y+.35,'a');
  box(5.5,101+side*7.1,26,.1,.15,0x263536,y+1.05,'a');
  for(let x=-5.5;x<18;x+=5.8)box(x,101+side*6.65,3.8,.65,.44,0x536949,y+.25,'a');
 }
 for(let x=-6.5;x<18;x+=5)for(const side of [-1,1])box(x,101+side*6.4,.5,.5,upperRoof-upperBase,0xb7b09d,upperBase,'a');
 for(const side of [-1,1])box(5.5,101+side*6.5,26,.15,.2,0x263536,27.3,'a');
 // Crossing continues north beside residence 1 and enters its east wall.
 // The deck top matches the second residence slab at y=7.19.
 for(const [x,z,w,d,vertical] of [[20,-16,6,38,true],[14.25,-34,11.5,6,false],[13,-65.8,5,63.6,true]] as const){
  box(x,z,w,d,.8,0xbac4b5,6.39,'bridge');box(x,z,w+.4,d+.4,.22,0x96b3b3,10,'bridge');
  for(const side of [-1,1]){
   if(vertical&&x===20&&side===-1)box(17.2,-14.9,.14,32.2,1,0x53676b,7.19,'bridge');
   else if(vertical&&x===13&&side===1){box(15.3,-49.25,.14,29.5,1,0x53676b,7.19,'bridge');box(15.3,-82.55,.14,30.1,1,0x53676b,7.19,'bridge');}
   else if(vertical&&x===20&&side===1)box(22.8,-14.75,.14,35.5,1,0x53676b,7.19,'bridge');
   else box(x+(vertical?side*(vertical&&x===13?2.3:2.8):0),z+(vertical?0:side*(vertical&&x===13?2.3:2.8)),vertical?.14:w,vertical?d:.14,1,0x53676b,7.19,'bridge');
   const length=vertical?d:w;
   for(let t=-length/2+1;t<length/2;t+=4){const px=x+(vertical?side*(vertical&&x===13?2.3:2.8):t),pz=z+(vertical?t:side*(vertical&&x===13?2.3:2.8));box(px,pz,.3,.3,10,0xaebcb1,0,'bridge');}
  }
  for(let t=-(vertical?d:w)/2+1;t<(vertical?d:w)/2;t+=3)box(x+(vertical?0:t),z+(vertical?t:0),vertical?w+.5:.14,vertical?.14:6.5,.14,0xd3d9ca,10.22,'bridge');
 }
 // A single rounded outline removes seams at both east-side platform turns.
 const platformOutline:[number,number][]=[[20,-32.5],[36.5,-32.5],[36.5,-40.5],[37.5,-40.5],[37.5,-43.5],[36.5,-43.5],[36.5,-67.5],[13,-67.5],[13,-64.5],[33.5,-64.5],[33.5,-35.5],[20,-35.5]];
 const rounded:[number,number][]=[];
 const railRuns:XYZ[][]=[];
 for(let i=0;i<platformOutline.length;i++){
  const prev=platformOutline[(i+platformOutline.length-1)%platformOutline.length],p=platformOutline[i],next=platformOutline[(i+1)%platformOutline.length];
  const before=Math.hypot(prev[0]-p[0],prev[1]-p[1]),after=Math.hypot(next[0]-p[0],next[1]-p[1]);
  const r=Math.min(1.1,before*.45,after*.45);
  const start:[number,number]=[p[0]+(prev[0]-p[0])*r/before,p[1]+(prev[1]-p[1])*r/before];
  const end:[number,number]=[p[0]+(next[0]-p[0])*r/after,p[1]+(next[1]-p[1])*r/after];
  const arc:[number,number][]=[];
  for(let j=0;j<=12;j++){const t=j/12,u=1-t;arc.push([u*u*start[0]+2*u*t*p[0]+t*t*end[0],u*u*start[1]+2*u*t*p[1]+t*t*end[1]]);}
  rounded.push(...arc);
  // Keep the three connection mouths open.
  const mouth=p[0]===next[0]&&[13,20,37.5].includes(p[0]);
  const nextAfter=platformOutline[(i+2)%platformOutline.length],nextBefore=Math.hypot(p[0]-next[0],p[1]-next[1]),nextLength=Math.hypot(nextAfter[0]-next[0],nextAfter[1]-next[1]);
  const nr=Math.min(1.1,nextBefore*.45,nextLength*.45);
  const nextStart:[number,number]=[next[0]+(p[0]-next[0])*nr/nextBefore,next[1]+(p[1]-next[1])*nr/nextBefore];
  if(!mouth)railRuns.push([...arc,nextStart].map(([x,z])=>[x,8.19,z] as XYZ));
 }
 surfaces.push({points:rounded,y:7.19,h:.8,color:0xbac4b5,id:'bridge'});
 for(const run of railRuns){line(run,0x53676b,'bridge',2);for(let i=0;i<run.length;i+=6){const [x,,z]=run[i];box(x,z,.12,.12,1,0x53676b,7.19,'bridge');}}
 for(const [x,z] of [[34,-35],[34,-45],[34,-55],[34,-65],[23,-34],[23,-66],[30,-34],[30,-66]])box(x,z,.3,.3,6.39,0xaebcb1,0,'bridge');
 // Door and threshold where the short eastern branch enters the sports hall.
 box(36.94,-42,.12,2.5,2.8,0x30494c,7.2,'gym');
 box(37,-42,.6,3,.12,0xbac4b5,7.19,'gym');
 // North end enters residence 5 at its south facade instead of ending in stairs.
 box(13,-96.94,4.5,.12,2.8,0x30494c,7.2,'dorm5');
 box(13,-96.8,5,.4,.12,0xbac4b5,7.19,'dorm5');
 // East-facing doorway and threshold: residence east wall is x=8.5.
 box(8.56,-34,.12,4.5,2.8,0x30494c,7.2,'dorm1');
 box(8.7,-34,.4,5,.12,0xbac4b5,7.19,'dorm1');
 // Ground stairs remain to the east of residence 1.
 for(let i=0;i<12;i++)box(20,-35.3-i*.6,5,.6,7.19-i*.56,0xbac4b5,0,'bridge');
 // Low lecture-hall annexes attached to C and B, with paired roof light wells.
 for(const id of ['north-lecture','south-lecture'] as const){
  const {z}=places.find(p=>p.id===id)!;
  box(41,z,18,12,5.8,0xbca991,0,id);
  box(41,z,18.4,12.4,.45,0xcac0a8,5.8,id);
  box(32.8,z,3.6,5,.4,0xb7987f,5.8,id);
  for(const x of [39,45]){
   box(x,z,3.2,8,.18,0x879c8c,6.25,id);
   for(const side of [-1,1])box(x+side*1.7,z,.25,8.5,.28,0xd5cdb9,6.25,id);
   for(const side of [-1,1])box(x,z+side*4.1,3.6,.25,.28,0xd5cdb9,6.25,id);
   for(let zz=z-3;zz<=z+3;zz+=2)box(x,zz,3.2,.13,.12,0xaab6a3,6.43,id);
  }
  box(48.8,z+6.4,3,1.5,.22,0xa7ac9d,.12,id);
 }
 // Low metal-roofed sculpture workshop beside block E.
 box(55,10,15,19,.25,0x999d92,.12,'sculpture-shed');
 for(const x of [48.5,61.5])for(const z of [2,6,10,14,18])box(x,z,.4,.4,7,0x879596,.37,'sculpture-shed');
 box(55,1.2,13,.35,5.5,0xa7b0ad,.37,'sculpture-shed');
 for(let i=0;i<14;i++){const x=48.5+i;box(x,10,1.08,18.6,.22,0xb6c5c9,7.2+(6.5-Math.abs(x-55))*.12,'sculpture-shed');}
 box(55,10,.3,19,.2,0x879596,8,'sculpture-shed');
 box(55,21,4,4,.18,0x8b9690,.13);
 // Courtyards and connected academic galleries traced from the supplied aerial view.
 // C–B contains a substantial central hall; the side courts remain open.
 for(const z of [20.5,43.5])for(const x of [-5,18]){
  box(x,z,18,8.3,.55,0x9a9b84,.25,'gardens');rect(x,z,17.2,7.5,.84,0x557951,'gardens');
  for(const tx of [x-5,x+4])trees.push({x:tx,z,r:2.6});
 }
 for(const x of [-22,27]){
  rect(x,66.5,12,8,.3,0x557951,'gardens');trees.push({x:x-3,z:66.5,r:2.2},{x:x+3,z:66.5,r:2.2});
 }
 // Central low hall connects C and B, continuing south to the A/admin bar.
 box(8.75,66.5,17.5,13,10.5,0xb7987f,0,'library');
 box(8.75,66.5,18.1,13.4,.45,0xc6b49e,10.5,'library');
 box(5,66.5,9,8,.2,0x829496,10.95,'library');
 for(let x=1;x<=9;x+=2)box(x,66.5,.12,8,.16,0xc8cec4,11.15,'library');
 // The user-identified 900-seat auditorium occupies the B–A central bay.
 box(8.75,89.5,17.5,13,10.5,0xb7987f,0,'auditorium900');
 box(8.75,89.5,18.1,13.5,.5,0xc6b49e,10.5,'auditorium900');
 // South-facing entrance opens onto the second-floor platform.
 box(8.75,96.08,14,.16,2.8,0x5b7779,7.48,'auditorium900');
 for(const x of [1.65,15.85])box(x,96.12,.2,.22,3,0xb7b09d,7.48,'auditorium900');
 box(8.75,96.12,14.4,.22,.2,0xb7b09d,10.28,'auditorium900');
 box(8.75,96.18,.12,.18,2.8,0x263536,7.48,'auditorium900');
 for(const x of [8.45,9.05])box(x,96.3,.08,.1,.6,0xb7b09d,8.48,'auditorium900');
 box(0.06,89.5,.12,3,2.8,0x5b7779,7.48,'auditorium900');
 for(const x of [-22,27]){rect(x,89.5,12,8,.3,0x557951,'gardens');trees.push({x,z:89.5,r:2.2});}
 const gallery=(x:number,start:number,end:number,w=3.2)=>{
  box(x,(start+end)/2,w,end-start,.38,0xb7987f,7.1);
  for(const side of [-1,1]){
   box(x+side*(w/2-.1),(start+end)/2,.1,end-start,.15,0x3b494a,8.3);
   for(let z=start+1;z<end;z+=4){box(x+side*(w/2-.25),z,.4,.45,7.1,0xb8b5a0);box(x+side*(w/2-.1),z,.1,.1,.95,0x3b494a,7.48);}
  }
 };
 box(-33,76,4.5,58,.2,0x8b8e82);
 box(-25.5,43.5,19,3,.2,0x8b8e82);
 // E's second-floor landing branches to the western and eastern galleries.
 box(9,19,26,3.2,.38,0xb7987f,7.1,'e');

 // User-marked second-floor circuit: two continuous spines, north/south crossbars.
 for(const x of [-2,20])for(const [start,end] of [[14.5,27.5],[36.5,50.5],[59.5,73.5],[82.5,93]])gallery(x,start,end);
 // Western gallery runs uninterrupted beside both low central annexes.
 // The wall openings carry it through C and B; its south end joins the podium.
 box(-2,66.5,3.2,13,.38,0xb7987f,7.1);
 box(-2,89.5,3.2,13,.38,0xb7987f,7.1);
 box(-2,96,3.2,6,.38,0xb7987f,7.1);
 box(4,93,40,3.2,.38,0xb7987f,7.1);
 box(-18,93.1,3.2,2.2,.38,0xb7987f,7.1);
 // Decks continue through the reserved gallery openings.
 for(const p of places.filter(p=>['b','library','d','e'].includes(p.id)))for(const x of [-2,20])
  if(p.id!=='e'&&x-2>p.x-p.w/2&&x+2<p.x+p.w/2)box(x,p.z,3.2,p.d+1,.38,0xb7987f,7.1,p.id);
 // Visible stair flights connect ground routes to the second-floor galleries.
 for(let i=0;i<15;i++){
  const h=.45+(i+1)*6.65/15;

  box(25,25.3-i*.6,3.4,.6,h,0xb8b5a0,0);
 }
 // Curved entrance flights span the opening and the open administration podium.
 // Stair treads finish at the second-floor deck, never at the upper connecting wing.
 const stairLeft=-6.9,stairRight=37.4,stairTop=7.48,stairBack=107.8;
 const stairArc=(depth:number):[number,number][]=>{
  const pts:[number,number][]=[[stairLeft,107.5],[stairRight,107.5]];
  for(let j=48;j>=0;j--){const t=j/48;pts.push([stairLeft+(stairRight-stairLeft)*t,stairBack+depth+3*Math.sin(Math.PI*t)]);}
  return pts;
 };
 surfaces.push({points:stairArc(0),y:stairTop,h:.38,color:0xc6b49e,id:'admin'});
 for(let i=0;i<32;i++)surfaces.push({points:stairArc((32-i)*.4),y:(i+1)*stairTop/32,h:stairTop/32,color:0xb8b5a0,id:'admin'});
 // Metal stair handrails follow the slope, with regularly spaced connected uprights.
 // Each end has a short horizontal grip, matching the supplied entrance photo.
 const railHeight=1.05;
 for(const fraction of [.035,.34,.66,.965]){
  const x=stairLeft+(stairRight-stairLeft)*fraction,curve=3*Math.sin(Math.PI*fraction);
  const lowerZ=stairBack+12.6+curve,upperZ=stairBack+.2+curve;
  const lowerY=stairTop/32,upperY=stairTop;
  line([[x,lowerY+railHeight,lowerZ+.55],[x,lowerY+railHeight,lowerZ],
        [x,upperY+railHeight,upperZ],[x,upperY+railHeight,upperZ-.55]],0x263536,'admin',2.5);
  for(const step of [0,4,8,12,16,20,24,28,31]){
   const z=stairBack+(32-step)*.4-.2+curve;
   const foot=(step+1)*stairTop/32;
   const hand=lowerY+railHeight+(lowerZ-z)/(lowerZ-upperZ)*(upperY-lowerY);
   box(x,z,.1,.1,hand-foot,0x263536,foot,'admin');
  }
 }

 // An open second-floor landing leads sideways into A, clear of its classroom facade.
 // A entrance ends at its north facade; no passage crosses the building.
 box(22.5,16.85,8,.7,.38,0xb7987f,7.1);
 // Southern forecourt: shallow, concentric fan steps, planter beds and a paved axis.
 for(const [x,z] of [[-17,119],[45,128],[-48,115]] as [number,number][]){box(x,z,7,6,.5,0x9f9b82,.25);rect(x,z,6.3,5.3,.81,0x526d4b);trees.push({x,z,r:2.8});}
 // Shore revetment and the island are flat, separate layers: no competing coplanar faces.
 const shore=lakeOutline();line([...shore.map(([x,z])=>[x,.42,z] as XYZ),[shore[0][0],.42,shore[0][1]]],0x9bb9a5,'lake',1.5);
 const island=islandOutline();surface(island,.75,0x9aab83,'lake');surface(island.map(([x,z])=>[60+(x-60)*.83,75+(z-75)*.83]),.81,0x658c64,'lake');
 // Sculptural center of the lake island; a small generic mass, not a claimed exact artwork.
 box(60,75,1.8,1.8,.5,0xb4b8ad,.82,'lake');box(60,75,.6,.8,2.2,0xc7d1c9,1.32,'lake');box(60.35,75,.75,.4,.75,0xc7d1c9,3.1,'lake');
 trees.push({x:58,z:73,r:1.9},{x:62,z:77,r:1.65});
 // Cross-lake pedestrian bridge aligned with the east gate and the C/D gap.
 box(58,43,38,3,.55,0xabae9d,1.05,'lake');for(const x of [43,54,65,75])box(x,43,.55,2.3,1.05,0x778e86,0,'lake');
 for(const z of [41.6,44.4]){box(58,z,38,.1,.12,0x728881,2.45,'lake');for(let x=40;x<78;x+=3)box(x,z,.1,.1,1.1,0x9fada0,1.45,'lake');}
 // Stone slabs and benches follow the west shore; planting stays out of the water.
 for(const z of [53,61,84,92]){box(39.2,z,3.2,2.2,.15,0x929f92,.29);box(38,z,1.1,3.5,.42,0x806b55,.43);trees.push({x:36,z:z+2.6,r:2.6});}
 // Regulation-like markings, a six-lane oval, starting marks and west grandstand.
 const cx=-55,cz=57;
 surface(oval(cx,cz,18,18),.3,0xa96257,'field');surface(oval(cx,cz,12.4,18),.34,0x537b54,'field');
 for(let i=0;i<=6;i++){const pts=oval(cx,cz,12.6+i*.82,18);line([...pts.map(([x,z])=>[x,.38,z] as XYZ),[pts[0][0],.38,pts[0][1]]],0xd9c4b1,'field',.65);}
 for(let i=0;i<12;i++)rect(cx,35+i*4,22,4,.42,i%2?0x4a8058:0x3e714f,'field');
 const fieldRect=(x:number,z:number,w:number,d:number)=>line([[x-w/2,.48,z-d/2],[x+w/2,.48,z-d/2],[x+w/2,.48,z+d/2],[x-w/2,.48,z+d/2],[x-w/2,.48,z-d/2]],0xdce3cb,'field',.9);
 fieldRect(cx,57,21,45);line([[cx-10.5,.48,57],[cx+10.5,.48,57]],0xdce3cb,'field');
 const ring:XYZ[]=[];for(let i=0;i<=48;i++){const a=i/48*Math.PI*2;ring.push([cx+Math.cos(a)*4.4,.49,57+Math.sin(a)*4.4]);}line(ring,0xdce3cb,'field');
 for(const side of [-1,1]){fieldRect(cx,57+side*18.3,14,8.4);fieldRect(cx,57+side*20.7,7,3.6);const z=57+side*22.5;line([[cx-3.2,.6,z],[cx-3.2,2.7,z],[cx+3.2,2.7,z],[cx+3.2,.6,z]],0xe2e3d4,'field');for(let x=cx-3.2;x<=cx+3.3;x+=.8)line([[x,.6,z+side*1.3],[x,2.7,z]],0x9baaa1,'field',.5);}
 for(let i=0;i<6;i++)line([[cx+12.7+i*.82,.4,68-i*.55],[cx+13.45+i*.82,.4,68-i*.55]],0xeee0c8,'field');
 // Rear rows rise to the west; the low front row faces the field to the east.
 for(let i=0;i<6;i++)box(-76.5+i*.58,57,1.2,50,.42,i%2?0x7faaa7:0xa2bcb2,.4+(5-i)*.5,'field');
 for(const z of [36,46,56,66,76]){box(-77,z,.35,.35,6.4,0xb5c1b0,0,'field');box(-74.8,z,5.2,8.8,.25,0xb8ccbd,6.5,'field');}
 for(const [x,z] of [[-72,22],[-37,22],[-72,91],[-37,91]] as [number,number][]){box(x,z,.35,.35,13,0x94a9a6,0,'field');box(x,z,3.4,.8,.5,0xdce4d7,13,'field');}
 // Residential precinct: separate east basketball courts and the west sports cluster.
 const paving=0x939b90;
 box(13,-57,4,70,.16,paving);box(35,-57,3,70,.16,paving);box(-31,-57,4,70,.16,paving);
 for(const z of [-24,-45,-67,-90])box(2,z,70,3,.17,paving);
 box(-34.5,-90,9,3,.18,paving);box(-38,-101,3,25,.18,paving);box(17,-112,57,3,.18,paving);box(-24,-112,31,3,.18,paving);box(44,-101,3,25,.18,paving);box(40,-90,10,3,.18,paving);box(-10,-122,3,23,.18,paving);box(10,-132,42,3,.18,paving);box(16.5,-26,10,4,.18,paving);
 function sportsCourt(x:number,z:number,w:number,d:number,id:string,basket=true){
  rect(x,z,w,d,.3,0xa87262,id);rect(x,z,w-1.5,d-1.5,.34,0x568880,id);
  const edge=(x:number,z:number,w:number,d:number)=>line([[x-w/2,.4,z-d/2],[x+w/2,.4,z-d/2],[x+w/2,.4,z+d/2],[x-w/2,.4,z+d/2],[x-w/2,.4,z-d/2]],0xe0ddc7,id,.8);
  edge(x,z,w-3,d-3);line([[x-w/2+1.5,.41,z],[x+w/2-1.5,.41,z]],0xe0ddc7,id,.8);
  if(basket){const ring:XYZ[]=[];for(let i=0;i<=40;i++){const a=i/40*Math.PI*2;ring.push([x+Math.cos(a)*w*.15,.42,z+Math.sin(a)*w*.15]);}line(ring,0xe0ddc7,id,.8);
   for(const side of [-1,1]){edge(x,z+side*(d/2-3.1),w*.34,3.2);box(x,z+side*(d/2-.9),.18,.18,2.5,0xdee2d4,.4,id);box(x,z+side*(d/2-1.5),2.2,.16,1.1,0xe6e8df,2.5,id);const hoop:XYZ[]=[];for(let i=0;i<=20;i++){const a=i/20*Math.PI*2;hoop.push([x+Math.cos(a)*.48,2.5,z+side*(d/2-2)+Math.sin(a)*.48]);}line(hoop,0xc78057,id,1.4);}
  }else{for(const side of [-1,1])box(x+side*(w/2-1),z,.13,.13,1.8,0xc1c7b5,.4,id);line([[x-w/2+1,2,z],[x+w/2-1,2,z]],0xdce1d5,id);}
 }
 sportsCourt(24,-54,16,20,'basketball');sportsCourt(24,-78,16,20,'basketball-north');
 // West courts remain their own destination; do not reuse an eastern court's picking ID.
 for(const x of [-56,-42])for(const z of [-102,-86,-70])sportsCourt(x,z,12,14,'west-courts',z===-86);
 for(const z of [-42,-65,-88]){box(35,z,2.2,1,.5,0x80674d,.3);}
 // Two offset pool basins follow the long north / short south shapes on the original plan.
 for(const [x,z,w,d] of [[-60.5,-123,9,20],[-66.5,-104,6,12]]){
  box(x,z,w+2.2,d+2.2,.3,0xc1c8b4,.16,'pool');
  rect(x,z,w,d,.49,0x478e9b,'pool');
  for(const side of [-1,1]){box(x+side*(w/2+.25),z,.45,d+.8,.2,0xdbe0ce,.46,'pool');box(x,z+side*(d/2+.25),w+.8,.45,.2,0xdbe0ce,.46,'pool');}
  for(let i=1;i<5;i++){const xx=x-w/2+i*w/5;line([[xx,.52,z-d/2+.4],[xx,.52,z+d/2-.4]],0xc8e4df,'pool',.7);line([[xx,.51,z-d/2+1.3],[xx,.51,z+d/2-1.3]],0x396d82,'pool',.55);}
  for(let i=0;i<4;i++)box(x-w/2+1+i*(w-2)/3,z-d/2-.6,.65,.65,.35,0xe5e4cd,.65,'pool');
 }
 box(-53,-111,11,2,.19,0x969f91);box(-46,-111,4,2,.19,0x969f91);box(-42,-112,12,3,.19,0x969f91);
 // Context city geometry omitted in the atlas to keep focus on documented campus places.
 return {boxes,surfaces,lines,trees};
}

// All planting sources share the same crown clearance, including hand-placed trees.
export function clearTreePlanting(candidates:DetailTree[],details:ReturnType<typeof campusDetails>){
 const obstacles=[...places.filter(p=>p.h>2).map(p=>({x:p.x,z:p.z,w:p.w+1.2,d:p.d+1.8})),...details.boxes.filter(b=>b.h>2||b.y>=2).map(b=>({x:b.x,z:b.z,w:b.w,d:b.d}))];
 for(const f of details.surfaces.filter(f=>f.h&&f.y>1)){
  const xs=f.points.map(p=>p[0]),zs=f.points.map(p=>p[1]);
  obstacles.push({x:(Math.min(...xs)+Math.max(...xs))/2,z:(Math.min(...zs)+Math.max(...zs))/2,w:Math.max(...xs)-Math.min(...xs),d:Math.max(...zs)-Math.min(...zs)});
 }
 const intersects=(t:DetailTree,r:number)=>obstacles.some(b=>{
  const dx=Math.max(0,Math.abs(t.x-b.x)-b.w/2),dz=Math.max(0,Math.abs(t.z-b.z)-b.d/2);
  return Math.hypot(dx,dz)<r+.9;
 });
 const result:DetailTree[]=[];
 for(const t of candidates){let r=t.r;while(r>=1.4&&intersects(t,r))r-=.2;if(r>=1.4)result.push({...t,r});}
 return result;
}


