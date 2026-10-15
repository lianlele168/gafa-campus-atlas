import * as THREE from 'three';
import {galleryWallSpans,academicLevels,clearTreePlanting,campusDetails,createLakeShape,TEACHING_IDS} from './data/campus-detail';
import {places} from './data/campus';
export function buildCampus(){
 const scene=new THREE.Group();
  const mat=(c:number,r=.85,m=.05)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m});
  const ground=mat(0xb5c3a0),edge=mat(0xe0d9cb,.5,.4),paving=mat(0xd8d2c3,.95),asphalt=mat(0xa4aca6,.8),red=mat(0xbe866c,.65,.12),roof=mat(0xe2bda3,.6,.12),dorm=mat(0xddd6c6,.78),concrete=mat(0xe9e2d2),rail=mat(0x566e6b,.5,.65),glass=mat(0x729491,.15,.55);
  const nightWindow=new THREE.MeshStandardMaterial({color:0xd6c391,emissive:0xffb767,emissiveIntensity:.2,roughness:.2,metalness:.25});
  const glowMat=new THREE.MeshBasicMaterial({color:0xfbd6a0});const cyanMat=new THREE.MeshBasicMaterial({color:0x83cfc2,transparent:true,opacity:.5});
  const boxGeo=new THREE.BoxGeometry(1,1,1);const pickables:THREE.Object3D[]=[];const buildingGroups=new Map<string,THREE.Group>();
  function box(w:number,h:number,d:number,x:number,y:number,z:number,material:THREE.Material,parent:THREE.Object3D=scene){const mesh=new THREE.Mesh(boxGeo,material);mesh.position.set(x,y,z);mesh.scale.set(w,h,d);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
  function line(points:number[][],color:number,opacity=1,parent:THREE.Object3D=scene){const geo=new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p as [number,number,number])));const obj=new THREE.Line(geo,new THREE.LineBasicMaterial({color,transparent:opacity<1,opacity}));parent.add(obj);return obj;}
  function poly(points:number[][],h:number,material:THREE.Material){const shape=new THREE.Shape();points.forEach(([x,z],i)=>i===0?shape.moveTo(x,-z):shape.lineTo(x,-z));shape.closePath();const geo=new THREE.ExtrudeGeometry(shape,{depth:h,bevelEnabled:false,steps:1});geo.rotateX(-Math.PI/2);const mesh=new THREE.Mesh(geo,material);mesh.position.y=-h;mesh.receiveShadow=true;mesh.castShadow=true;scene.add(mesh);return mesh;}
  const south=[[-79,-1],[72,-1],[81,24],[81,126],[62,137],[-65,126],[-79,111]],north=[[-64,-26],[59,-26],[67,-43],[43,-134],[17,-151],[-8,-149],[-9,-128],[-28,-139],[-51,-143],[-67,-135],[-73,-118],[-73,-94]];
  // A recessed plinth and a single lawn top. Previously both tops were at y=0 (z-fighting).
  poly(south,4,edge).position.y-=.16;poly(north,4,edge).position.y-=.16;poly(south,.1,ground);poly(north,.1,ground);
  // Road between the two precincts and the perimeter avenue.
  box(176,.2,14,0,-.35,-15,asphalt);box(10,.2,174,87,-.35,53,asphalt);box(10,.2,115,-78,-.35,-67,asphalt);box(170,.2,9,2,-.35,142,asphalt);
  for(let x=-88;x<89;x+=9)box(4,.04,.18,x,-.21,-15,concrete);
  for(let z=-27;z<139;z+=10)box(.16,.04,4,87,-.21,z,concrete);
  for(let i=0;i<7;i++){box(.9,.06,9,55+i*1.8,-.18,-15,concrete);box(9,.06,.9,87,-.18,29+i*1.8,concrete);}
  // Broad pedestrian spine, courtyards and elevated corridors.
  box(6,.22,115,-19,.13,59,paving);box(5,.22,108,38,.13,65,paving);
  for(const z of [19,41,64,87,112])box(112,.22,5,-9,.13,z,paving);
  box(35,.22,18,8,.13,121,paving);

  // Footbridge with a translucent canopy, longitudinal ribs and columns.
  const bridgeGroup=new THREE.Group();bridgeGroup.userData.placeId='bridge';scene.add(bridgeGroup);buildingGroups.set('bridge',bridgeGroup);
  for(const p of places){
   if(p.kind){if(p.kind==='lectureHall'||p.kind==='shed'||p.kind==='bridge'||p.kind==='lake'||p.kind==='field'||p.kind==='court'||p.kind==='residentialCourt'||p.kind==='residentialPool'||p.kind==='garden')continue;}
   const group=new THREE.Group();group.userData.placeId=p.id;scene.add(group);buildingGroups.set(p.id,group);let material=p.category==='生活'&&p.id!=='canteen'?dorm:red;
   if(p.kind==='gate'){const alongZ=p.d>p.w;for(const side of [-1,1])box(1.2,5,1.2,p.x+(alongZ?0:side*p.w/2),2.5,p.z+(alongZ?side*p.d/2:0),concrete,group);box(alongZ?2:p.w+1,.8,alongZ?p.d+1:2,p.x,5,p.z,red,group);continue;}
   if(p.kind==='gym'){box(p.w,p.h,p.d,p.x,p.h/2,p.z,red,group);box(p.w+2,.9,p.d+2,p.x,p.h,p.z,roof,group);for(let i=-2;i<=2;i++)box(2,.3,p.d-3,p.x+i*4,p.h+.6,p.z,glass,group);for(let i=-2;i<=2;i++)box(3,8,.2,p.x+i*4,6,p.z+p.d/2+.2,glass,group);continue;}
   if(p.kind==='museum'){box(p.w,p.h,p.d,p.x,p.h/2,p.z,red,group);box(p.w-7,p.h+2,p.d-7,p.x+1,(p.h+2)/2,p.z,concrete,group);box(p.w+1,.8,p.d+1,p.x,p.h,p.z,roof,group);for(let i=-1;i<=1;i++)box(3,.2,p.d-5,p.x+i*5,p.h+.6,p.z,glass,group);box(16,7,.2,p.x,3.5,p.z+p.d/2+.1,glass,group);continue;}
   const academic=TEACHING_IDS.includes(p.id);const levels=academic?academicLevels(p.id,p.h):Array.from({length:Math.round(p.h/3.3)},(_,i)=>(i+1)*p.h/Math.round(p.h/3.3));
   const floors=levels.length,base=levels[0];
   if(academic&&['b','library','d','e'].includes(p.id)){
    box(p.w-1,7.2-base,p.d-3,p.x,(7.2+base)/2,p.z,material,group);
    for(const [l,r] of galleryWallSpans(p,7.2))box(r-l,3.8,p.d-3,(l+r)/2,9.1,p.z,material,group);
    box(p.w-1,p.h-11,p.d-3,p.x,(p.h+11)/2,p.z,material,group);
   }else box(p.w-1,p.h-base,p.d-3,p.x,(p.h+base)/2,p.z,material,group);
   for(let f=0;f<floors;f++){
    const y=levels[f];box(p.w+1,.38,p.d+1.8,p.x,y,p.z,f===floors-1?roof:material,group);
    if(f<floors-1){for(const side of [-1,1]){if(p.id==='dorm5'&&f===1&&side===1){for(const [cx,w] of [[7,7],[27,23]]){box(w,.10,.10,cx,y+1.15,p.z+side*(p.d/2+.6),rail,group);box(w,.06,.1,cx,y+.62,p.z+side*(p.d/2+.6),rail,group);}}else{for(const [l,r] of galleryWallSpans(p,y)){box(r-l,.10,.10,(l+r)/2,y+1.15,p.z+side*(p.d/2+.6),rail,group);box(r-l,.06,.1,(l+r)/2,y+.62,p.z+side*(p.d/2+.6),rail,group);}}
      if(academic)for(let x=p.x-p.w/2+2;x<p.x+p.w/2-1;x+=5.8){if(galleryWallSpans(p,y).some(([l,r])=>x-1.9>=l&&x+1.9<=r))box(3.8,.44,.65,x,y+.47,p.z+side*(p.d/2+.15),mat(0x536949),group);}
    }}
   }
   // Repeat facade glazing as instanced meshes, keeping the scene responsive.
   const cols=Math.floor(p.w/3.2);const winCount=cols*(floors-1)*2;
   const windows=new THREE.InstancedMesh(boxGeo,glass,winCount),lit=new THREE.InstancedMesh(boxGeo,nightWindow,Math.ceil(winCount/6));let wi=0,li=0;const matrix=new THREE.Matrix4();
   for(let f=0;f<floors-1;f++)for(let col=0;col<cols;col++)for(const side of [-1,1]){const x=p.x+(col-(cols-1)/2)*3.2,fh=levels[f+1]-levels[f];if(!galleryWallSpans(p,levels[f]).some(([l,r])=>x-1.275>=l&&x+1.275<=r))continue;matrix.compose(new THREE.Vector3(x,levels[f]+fh*.5,p.z+side*(p.d/2-1.36)),new THREE.Quaternion(),new THREE.Vector3(2.55,fh-.7,.14));if(wi%6===0&&li<lit.count){lit.setMatrixAt(li++,matrix);matrix.elements[0]=0;matrix.elements[5]=0;matrix.elements[10]=0;}windows.setMatrixAt(wi++,matrix);}
   windows.count=wi;windows.instanceMatrix.needsUpdate=true;lit.count=li;lit.instanceMatrix.needsUpdate=true;group.add(windows,lit);
   const columns=new THREE.InstancedMesh(boxGeo,concrete,Math.ceil(p.w/5)*2);let ci=0;for(let x=p.x-p.w/2+1;x<=p.x+p.w/2;x+=5)for(const side of [-1,1]){if(ci>=columns.count)break;if(academic&&galleryWallSpans(p,7.2).length>1&&!galleryWallSpans(p,7.2).some(([l,r])=>x-.25>=l&&x+.25<=r))continue;matrix.compose(new THREE.Vector3(x,p.h/2,p.z+side*(p.d/2-.1)),new THREE.Quaternion(),new THREE.Vector3(.5,p.h,.5));columns.setMatrixAt(ci++,matrix);}columns.count=ci;columns.castShadow=true;group.add(columns);
   for(let i=0;i<Math.floor(p.w/15);i++){box(3,1.3,2,p.x-p.w/2+7+i*15,p.h+.9,p.z,concrete,group);box(3.2,.12,2.2,p.x-p.w/2+7+i*15,p.h+1.62,p.z,rail,group);}
   for(const side of [-1,1])box(p.w,.2,.15,p.x,p.h+1.2,p.z+side*p.d/2,rail,group);
  }
  // Light courts connected to their real selectable destinations.
  const courtSurface=mat(0x3b7970,.85),courtBorder=mat(0x885c50);
  function court(id:string,x:number,z:number,w:number,d:number){const group=new THREE.Group();group.userData.placeId=id;scene.add(group);buildingGroups.set(id,group);box(w,.3,d,x,.22,z,courtBorder,group);box(w-2,.15,d-2,x,.42,z,courtSurface,group);line([[x-w/2+2,.55,z-d/2+2],[x+w/2-2,.55,z-d/2+2],[x+w/2-2,.55,z+d/2-2],[x-w/2+2,.55,z+d/2-2],[x-w/2+2,.55,z-d/2+2]],0xb6cbc0,1,group);line([[x-w/2+2,.55,z],[x+w/2-2,.55,z]],0xb6cbc0,1,group);const circle=[];for(let i=0;i<=64;i++){let a=i/64*Math.PI*2;circle.push([x+Math.sin(a)*3,.56,z+Math.cos(a)*3]);}line(circle,0xb6cbc0,1,group);if(id==='tennis'){box(w,.8,.1,x,.95,z,rail,group);for(const side of [-1,1])box(.1,3,d,x+side*w/2,1.5,z,rail,group);}}
  court('tennis',-30,31,15,18);
  const detail=campusDetails();const detailMaterials=new Map<number,THREE.MeshStandardMaterial>();
  const dm=(color:number)=>{if(!detailMaterials.has(color))detailMaterials.set(color,mat(color,.82));return detailMaterials.get(color)!;};
  for(const id of ['auditorium900','north-lecture','south-lecture','sculpture-shed','field','gardens','lake','basketball','basketball-north','west-courts','pool']){const g=new THREE.Group();g.userData.placeId=id;scene.add(g);buildingGroups.set(id,g);}
  const detailParent=(id?:string)=>id?buildingGroups.get(id)??scene:scene;
  const facadeMaterials=new Map([[0xa45d50,red],[0xbe7b69,roof],[0x5b7779,glass],[0xb7b09d,concrete],[0x263536,rail]]);
  for(const b of detail.boxes)box(b.w,b.h,b.d,b.x,b.y+b.h/2,b.z,facadeMaterials.get(b.color)??dm(b.color),detailParent(b.id));
  for(const f of detail.surfaces){const shape=new THREE.Shape();f.points.forEach(([x,z],i)=>i?shape.lineTo(x,-z):shape.moveTo(x,-z));shape.closePath();const geo=f.h?new THREE.ExtrudeGeometry(shape,{depth:f.h,bevelEnabled:false}):new THREE.ShapeGeometry(shape);geo.rotateX(-Math.PI/2);const m=new THREE.Mesh(geo,dm(f.color));m.position.y=f.y-(f.h??0);m.receiveShadow=true;detailParent(f.id).add(m);}
  for(const l of detail.lines)line(l.points,l.color,1,detailParent(l.id));
  const waterMat=new THREE.MeshPhysicalMaterial({color:0x78aaa4,metalness:.28,roughness:.21,clearcoat:.9,clearcoatRoughness:.15,side:THREE.DoubleSide});
  const lakeGeo=new THREE.ShapeGeometry(createLakeShape(),100);lakeGeo.rotateX(-Math.PI/2);const lake=new THREE.Mesh(lakeGeo,waterMat);lake.position.y=.22;lake.receiveShadow=true;buildingGroups.get('lake')!.add(lake);
  // Subtle narrow ripples, fully inside the wider southern basin.
  const rippleGroup=new THREE.Group();scene.add(rippleGroup);for(let i=0;i<8;i++){const pts=[];for(let j=0;j<22;j++)pts.push([50+j*.7,.28,83+i*.75+Math.sin(j*.5+i)*.1]);line(pts,0x9fb8a0,.13,rippleGroup);}
  // Instanced landscape: hundreds of softly shaded trees, avoiding buildings and paths.
  const treePoints:number[][]=[];let seed=741;function rand(){seed=(seed*16807)%2147483647;return(seed-1)/2147483646;}
  function occupied(x:number,z:number){if(places.some(p=>Math.abs(x-p.x)<p.w/2+3&&Math.abs(z-p.z)<p.d/2+3))return true;if(z>0){if(Math.abs(x+19)<4||Math.abs(x-38)<4||[19,41,64,87,112].some(v=>Math.abs(z-v)<3))return true;}else if(Math.abs(x-20)<4||Math.abs(x+31)<3||[-26,-49,-69,-89,-110,-130].some(v=>Math.abs(z-v)<3))return true;return false;}
  for(let i=0;i<650;i++){let x=-72+rand()*143,z=-135+rand()*264;if(z>-25&&z<0)continue;if(z<-100&&x>42)continue;if(z<-128&&x<-10)continue;if(!occupied(x,z))treePoints.push([x,z,2+rand()*2.2]);}
  for(let z=0;z<132;z+=6)treePoints.push([78,z,2.4]);for(let x=-58;x<59;x+=6)treePoints.push([x,124,2.2]);for(const t of detail.trees)treePoints.push([t.x,t.z,t.r]);
  const clearTrees=clearTreePlanting(treePoints.map(([x,z,r])=>({x,z,r})),detail);
  treePoints.splice(0,treePoints.length,...clearTrees.map(t=>[t.x,t.z,t.r]));
  const trunks=new THREE.InstancedMesh(new THREE.CylinderGeometry(.22,.35,2.8,5),mat(0x625d48),treePoints.length);const crowns=new THREE.InstancedMesh(new THREE.SphereGeometry(1,9,7),mat(0x46654b,.95),treePoints.length*2);let idx=0;const dummy=new THREE.Object3D();treePoints.forEach(([x,z,size],i)=>{dummy.position.set(x,1.4,z);dummy.scale.set(1,1,1);dummy.updateMatrix();trunks.setMatrixAt(i,dummy.matrix);for(let j=0;j<2;j++){dummy.position.set(x+j*.7,3+size*.4+j*1.1,z);dummy.scale.set(size*(j?.75:1),size*(j?1:1.1),size*(j?.8:1));dummy.rotation.y=rand()*6;dummy.updateMatrix();crowns.setMatrixAt(idx,dummy.matrix);crowns.setColorAt(idx++,new THREE.Color().setHSL(.26+rand()*.07,.2+rand()*.15,.25+rand()*.11));}});trunks.castShadow=true;crowns.castShadow=true;crowns.receiveShadow=true;scene.add(trunks,crowns);

 return {scene,buildingGroups};
}



