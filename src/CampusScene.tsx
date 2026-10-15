import {useEffect,useMemo,useRef,type RefObject} from 'react';
import {Canvas,useFrame,useThree,type ThreeEvent} from '@react-three/fiber';
import {OrbitControls,Line} from '@react-three/drei';
import type {OrbitControls as OrbitControlsImpl} from 'three-stdlib';
import * as THREE from 'three';
import {buildCampus} from './campus-model';
import {places,type RoutePoint} from './data/campus';
import {inZone} from './data/zones';
import {layoutAllLabels,type LabelAnchor} from './label-layout';

export type CameraCommand={kind:'overview'|'top'|'focus'|'route'|'zoom-in'|'zoom-out';nonce:number};
export type LabelStatus={complete:boolean;visible:number;total:number};
export type SceneProps={selected:string|null;category:string;zone:string;night:boolean;labels:boolean;route:RoutePoint[]|null;command:CameraCommand;onSelect:(id:string)=>void;labelLayer:RefObject<HTMLDivElement|null>;allLabels:boolean;onLabelStatus:(status:LabelStatus)=>void};

function World(props:SceneProps){
 const {selected,category,zone,night,route,command,onSelect,labelLayer}=props;
 const model=useMemo(()=>buildCampus(),[]);
 const {camera,size,gl,invalidate}=useThree();
 const controls=useRef<OrbitControlsImpl>(null);
 const target=useRef({pos:new THREE.Vector3(235,305,340),look:new THREE.Vector3(0,0,-8),zoom:1.8,active:true});
 const frame=useRef(0),lastLayout=useRef(-1),previous=useRef(new Set<string>());
 const overviewContext=useRef(true),interacting=useRef(false),overviewZoom=useRef(1),layoutSignature=useRef(''),statusSignature=useRef('');
 const projected=useMemo(()=>new THREE.Vector3(),[]),ray=useMemo(()=>new THREE.Raycaster(),[]);
 const blockers=useMemo(()=>places.filter(p=>p.h>8&&p.kind!=='bridge').map(p=>({id:p.id,box:new THREE.Box3(new THREE.Vector3(p.x-p.w/2,0,p.z-p.d/2),new THREE.Vector3(p.x+p.w/2,p.h,p.z+p.d/2))})),[]);
 const materialColors=useMemo(()=>{
  const colors=new Map<THREE.Material,THREE.Color>();
  model.buildingGroups.forEach(g=>g.traverse(o=>{if(o instanceof THREE.Mesh){o.material=Array.isArray(o.material)?o.material.map(m=>m.clone()):o.material.clone();for(const m of Array.isArray(o.material)?o.material:[o.material])if('color' in m)colors.set(m,(m as THREE.MeshStandardMaterial).color.clone());}}));
  return colors;
 },[model]);
 useEffect(()=>()=>{const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>();model.scene.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.Line){geometries.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));}});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());materialColors.forEach((_,m)=>m.dispose());},[model,materialColors]);
 useEffect(()=>{
  model.buildingGroups.forEach((group,id)=>{const p=places.find(v=>v.id===id);const relevant=(!p||category==='全部'||p.category===category)&&(!p||inZone(p,zone));group.traverse(o=>{if(!(o instanceof THREE.Mesh))return;for(const m of Array.isArray(o.material)?o.material:[o.material]){const base=materialColors.get(m);if(!base)continue;const material=m as THREE.MeshStandardMaterial;material.color.copy(base);if(!relevant)material.color.lerp(new THREE.Color('#e1dfd6'),.75);if(id===selected){material.color.lerp(new THREE.Color('#e6aa78'),.25);material.emissive?.set('#9c4724');material.emissiveIntensity=.13;}else{material.emissive?.set('#000000');}}});});invalidate();lastLayout.current=-1;layoutSignature.current='';
 },[model,category,zone,selected,materialColors,invalidate]);
 useEffect(()=>{gl.toneMappingExposure=night?.85:1.12;invalidate();},[night,gl,invalidate]);
 useEffect(()=>{lastLayout.current=-1;layoutSignature.current='';invalidate();},[props.labels,props.allLabels,route,invalidate]);
 useEffect(()=>{
  const cam=camera as THREE.OrthographicCamera;const ctl=controls.current;if(!ctl)return;
  const fit=Math.min(size.width/290,size.height/290)*.94;
  const t=target.current;t.active=true;overviewContext.current=command.kind==='overview'||command.kind==='top';
  if(command.kind==='zoom-in'||command.kind==='zoom-out'){t.pos.copy(camera.position);t.look.copy(ctl.target);t.zoom=THREE.MathUtils.clamp(cam.zoom*(command.kind==='zoom-in'?1.3:.77),.6,8);}
  else if(command.kind==='focus'&&selected){const p=places.find(v=>v.id===selected)!;t.look.set(p.x,p.h*.35,p.z);t.pos.copy(t.look).add(new THREE.Vector3(105,150,150));t.zoom=Math.min(size.width/(p.w+55),size.height/105,5);}
  else if(command.kind==='route'&&route?.length){const box=new THREE.Box3().setFromPoints(route.map(([x,z,y])=>new THREE.Vector3(x,y,z)));const center=box.getCenter(new THREE.Vector3()),span=box.getSize(new THREE.Vector3());t.look.copy(center);t.pos.copy(center).add(new THREE.Vector3(20,380,120));t.zoom=Math.min(size.width/(span.x+120),size.height/(span.z+110),4);}
  else if(command.kind==='top'){const z=zone==='all'?-8:zone==='teaching'?65:-80;t.look.set(0,0,z);t.pos.set(0,420,z+8.5);t.zoom=Math.min(size.width/205,size.height/(zone==='all'?310:190))*.86;}
  else if(zone!=='all'){const z=zone==='teaching'?65:-80;t.look.set(0,0,z);t.pos.set(150,240,z+190);t.zoom=Math.min(size.width/220,size.height/190)*.87;}
  else{t.look.set(0,0,-8);t.pos.set(235,305,340);t.zoom=fit;}
  if(overviewContext.current)overviewZoom.current=t.zoom;
  lastLayout.current=-1;layoutSignature.current='';invalidate();
 },[command,size.width,size.height,zone,camera,invalidate]);
 const choose=(event:ThreeEvent<MouseEvent>)=>{if(event.delta>5)return;let object:THREE.Object3D|null=event.object;while(object&&!object.userData.placeId)object=object.parent;if(object?.userData.placeId){event.stopPropagation();onSelect(object.userData.placeId);}};
 useFrame((state,delta)=>{
  const ctl=controls.current;if(!ctl)return;const t=target.current,cam=camera as THREE.OrthographicCamera;
  if(t.active){const a=1-Math.exp(-delta*6);camera.position.lerp(t.pos,a);ctl.target.lerp(t.look,a);cam.zoom=THREE.MathUtils.lerp(cam.zoom,t.zoom,a);cam.updateProjectionMatrix();ctl.update();if(camera.position.distanceTo(t.pos)<.12&&Math.abs(cam.zoom-t.zoom)<.003){t.active=false;lastLayout.current=-1;layoutSignature.current='';}invalidate();}
  frame.current+=delta;
  if(!labelLayer.current||frame.current-lastLayout.current<.09)return;lastLayout.current=frame.current;
  const mobile=size.width<600;
  const complete=props.allLabels||(!selected&&!route&&!interacting.current&&!t.active&&(overviewContext.current||cam.zoom<=overviewZoom.current*1.08||ctl.getPolarAngle()<.24&&cam.zoom<=overviewZoom.current*1.3));
  const signature=[...camera.matrixWorld.elements,cam.zoom,size.width,size.height,complete,props.labels,category,zone,selected,route?.length].join(',');
  if(layoutSignature.current===signature)return;layoutSignature.current=signature;
  const layer=labelLayer.current;
  layer.dataset.mode=complete?'complete':'sparse';
  const eligible=places.filter(p=>(category==='全部'||p.category===category)&&inZone(p,zone));
  const visible=new Set<string>(),used:{x:number;y:number;w:number;h:number}[]=[];
  const elements=new Map([...layer.querySelectorAll<HTMLButtonElement>('[data-place]')].map(el=>[el.dataset.place!,el]));
  const links=new Map([...layer.querySelectorAll<SVGLineElement>('[data-link]')].map(el=>[el.dataset.link!,el]));
  const prominent=['a','library','j','museum','canteen','gym','dorm1','lake','field','bridge'];
  const maxLabels=route?3:selected?(mobile?5:8):mobile?9:16;
  const ranked=places.map(p=>({p,score:p.id===selected?1000:(prominent.includes(p.id)?100:0)+(previous.current.has(p.id)?18:0)-(Math.hypot(p.x-ctl.target.x,p.z-ctl.target.z)/10)})).sort((a,b)=>b.score-a.score);
  const forward=camera.getWorldDirection(new THREE.Vector3());
  const anchors:LabelAnchor[]=[];
  for(const {p} of ranked){
   const el=elements.get(p.id);if(!el)continue;
   const link=links.get(p.id);if(link)link.style.display='none';
   const isSelected=p.id===selected;
   if(!(props.labels||isSelected)||!isSelected&&!eligible.includes(p)){el.style.display='none';continue;}
   // Measure at its real compact/regular size, including labels hidden in the preceding view.
   el.style.display='flex';
   const w=el.offsetWidth,h=el.offsetHeight;
   const anchor=new THREE.Vector3(p.x,p.h+2.2,p.z);projected.copy(anchor).project(camera);
   const x=(projected.x*.5+.5)*size.width,y=(-projected.y*.5+.5)*size.height;
   if(complete){anchors.push({id:p.id,x,y:y-h/2-3,w,h});continue;}
   let show=isSelected||visible.size<maxLabels;
   show&&=projected.z>-1&&projected.z<1&&x>w/2+12&&x<size.width-w/2-58&&y>(mobile?140:100)+h&&y<size.height-65;
   if(show&&!isSelected){ray.set(anchor.clone().addScaledVector(forward,-900),forward);const hit=new THREE.Vector3();show=!blockers.some(b=>b.id!==p.id&&ray.ray.intersectBox(b.box,hit)&&hit.distanceTo(ray.ray.origin)<895);}
   if(show&&used.some(u=>Math.abs(u.x-x)<(u.w+w)/2+8&&Math.abs(u.y-y)<(u.h+h)/2+8))show=false;
   el.style.display=show?'flex':'none';
   if(show){el.style.transform=`translate(${x-w/2}px,${y-h-7}px)`;used.push({x,y,w,h});visible.add(p.id);}
  }
  if(complete){
   const boxes=layoutAllLabels(anchors,{left:12,top:mobile?143:108,right:size.width-58,bottom:size.height-67});
   for(const box of boxes){const el=elements.get(box.id)!;
    el.style.transform=`translate(${box.x-box.w/2}px,${box.y-box.h/2}px)`;visible.add(box.id);
    const link=links.get(box.id);if(!link)continue;
    const ax=box.anchorX,ay=box.anchorY+box.h/2+3;
    const ex=THREE.MathUtils.clamp(ax,box.x-box.w/2,box.x+box.w/2),ey=THREE.MathUtils.clamp(ay,box.y-box.h/2,box.y+box.h/2);
    if(Math.hypot(ex-ax,ey-ay)>5){link.setAttribute('x1',String(ax));link.setAttribute('y1',String(ay));link.setAttribute('x2',String(ex));link.setAttribute('y2',String(ey));link.style.display='block';}
   }
  }
  previous.current=visible;
  const status={complete,visible:visible.size,total:eligible.length},key=JSON.stringify(status);
  if(key!==statusSignature.current){statusSignature.current=key;props.onLabelStatus(status);}

 });
 const chosen=places.find(p=>p.id===selected);
 return <>
  <color attach="background" args={[night?'#192c30':'#eeeee5']}/>
  <hemisphereLight args={[night?'#a9c5db':'#fff7e7',night?'#293a3b':'#c5cdb7',night?1.8:2.3]}/>
  <directionalLight position={[-100,200,80]} intensity={night?1.3:3} color={night?'#b7d6e9':'#ffe3bd'} castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-210} shadow-camera-right={210} shadow-camera-top={210} shadow-camera-bottom={-210} shadow-camera-far={650} shadow-normalBias={.6} shadow-bias={-.00015}/>
  <directionalLight position={[80,130,-120]} intensity={.65} color="#e1f0f0"/>
  <mesh rotation={[-Math.PI/2,0,0]} position={[0,-4.4,0]} receiveShadow><planeGeometry args={[2000,2000]}/><meshStandardMaterial color={night?'#203438':'#eeeee5'} roughness={1}/></mesh>
  <gridHelper args={[1200,120,night?'#344a4d':'#d9ded3',night?'#263e41':'#e3e6dc']} position={[0,-4.2,0]}/>
  <primitive object={model.scene} onClick={choose}/>
  {chosen&&<Line points={[[chosen.x-chosen.w/2-1.6,.5,chosen.z-chosen.d/2-1.6],[chosen.x+chosen.w/2+1.6,.5,chosen.z-chosen.d/2-1.6],[chosen.x+chosen.w/2+1.6,.5,chosen.z+chosen.d/2+1.6],[chosen.x-chosen.w/2-1.6,.5,chosen.z+chosen.d/2+1.6],[chosen.x-chosen.w/2-1.6,.5,chosen.z-chosen.d/2-1.6]]} color="#bb593b" lineWidth={2.5} depthTest={false}/ >}
  {route&&route.length>1&&<><Line points={route.map(([x,z,y])=>[x,y+1.4,z] as [number,number,number])} color="#f5f0df" lineWidth={8} depthTest={false}/><Line points={route.map(([x,z,y])=>[x,y+1.5,z] as [number,number,number])} color="#bd5234" lineWidth={4} depthTest={false}/></>}
  <OrbitControls ref={controls} makeDefault enableDamping dampingFactor={.09} minZoom={.6} maxZoom={8} minPolarAngle={.02} maxPolarAngle={Math.PI*.36} maxDistance={800} target={[0,0,-8]} onStart={()=>{target.current.active=false;interacting.current=true;overviewContext.current=false;lastLayout.current=-1;layoutSignature.current='';invalidate();}} onEnd={()=>{interacting.current=false;lastLayout.current=-1;layoutSignature.current='';invalidate();}} onChange={()=>invalidate()}/>
 </>;
}
export default function CampusScene(props:SceneProps){return <Canvas orthographic shadows="percentage" frameloop="demand" dpr={[1,1.5]} camera={{position:[235,305,340],zoom:1.8,near:.1,far:1800}} gl={{antialias:true,powerPreference:'high-performance'}}><World {...props}/></Canvas>;}
