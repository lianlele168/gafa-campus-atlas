import {useEffect,useMemo,useRef,type RefObject} from 'react';
import {Canvas,useFrame,useThree,type ThreeEvent} from '@react-three/fiber';
import {OrbitControls,Line} from '@react-three/drei';
import type {OrbitControls as OrbitControlsImpl} from 'three-stdlib';
import * as THREE from 'three';
import {buildCampus} from './campus-model';
import {places,type Place,type RoutePoint} from './data/campus';

export type CameraCommand={kind:'overview'|'top'|'focus'|'route'|'zoom-in'|'zoom-out';nonce:number};
export type SceneProps={selected:string|null;category:string;zone:string;night:boolean;labels:boolean;route:RoutePoint[]|null;command:CameraCommand;onSelect:(id:string)=>void;labelLayer:RefObject<HTMLDivElement|null>};

function World(props:SceneProps){
 const {selected,category,zone,night,route,command,onSelect,labelLayer}=props;
 const model=useMemo(()=>buildCampus(),[]);
 const {camera,size,gl,invalidate}=useThree();
 const controls=useRef<OrbitControlsImpl>(null);
 const target=useRef({pos:new THREE.Vector3(235,305,340),look:new THREE.Vector3(0,0,-8),zoom:1.8,active:true});
 const frame=useRef(0),lastLayout=useRef(-1),previous=useRef(new Set<string>());
 const projected=useMemo(()=>new THREE.Vector3(),[]),ray=useMemo(()=>new THREE.Raycaster(),[]);
 const blockers=useMemo(()=>places.filter(p=>p.h>8&&p.kind!=='bridge').map(p=>({id:p.id,box:new THREE.Box3(new THREE.Vector3(p.x-p.w/2,0,p.z-p.d/2),new THREE.Vector3(p.x+p.w/2,p.h,p.z+p.d/2))})),[]);
 const materialColors=useMemo(()=>{
  const colors=new Map<THREE.Material,THREE.Color>();
  model.buildingGroups.forEach(g=>g.traverse(o=>{if(o instanceof THREE.Mesh){o.material=Array.isArray(o.material)?o.material.map(m=>m.clone()):o.material.clone();for(const m of Array.isArray(o.material)?o.material:[o.material])if('color' in m)colors.set(m,(m as THREE.MeshStandardMaterial).color.clone());}}));
  return colors;
 },[model]);
 useEffect(()=>()=>{const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>();model.scene.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.Line){geometries.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));}});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());materialColors.forEach((_,m)=>m.dispose());},[model,materialColors]);
 useEffect(()=>{
  model.buildingGroups.forEach((group,id)=>{const p=places.find(v=>v.id===id);const relevant=(!p||category==='全部'||p.category===category)&&(!p||zone==='all'||(zone==='teaching'?p.z>=-15:p.z<0));group.traverse(o=>{if(!(o instanceof THREE.Mesh))return;for(const m of Array.isArray(o.material)?o.material:[o.material]){const base=materialColors.get(m);if(!base)continue;const material=m as THREE.MeshStandardMaterial;material.color.copy(base);if(!relevant)material.color.lerp(new THREE.Color('#e1dfd6'),.75);if(id===selected){material.color.lerp(new THREE.Color('#e6aa78'),.25);material.emissive?.set('#9c4724');material.emissiveIntensity=.13;}else{material.emissive?.set('#000000');}}});});invalidate();lastLayout.current=-1;
 },[model,category,zone,selected,materialColors,invalidate]);
 useEffect(()=>{gl.toneMappingExposure=night?.85:1.12;invalidate();},[night,gl,invalidate]);
 useEffect(()=>{lastLayout.current=-1;invalidate();},[props.labels,route,invalidate]);
 useEffect(()=>{
  const cam=camera as THREE.OrthographicCamera;const ctl=controls.current;if(!ctl)return;
  const fit=Math.min(size.width/290,size.height/290)*.94;
  const t=target.current;t.active=true;
  if(command.kind==='zoom-in'||command.kind==='zoom-out'){t.pos.copy(camera.position);t.look.copy(ctl.target);t.zoom=THREE.MathUtils.clamp(cam.zoom*(command.kind==='zoom-in'?1.3:.77),.6,8);}
  else if(command.kind==='focus'&&selected){const p=places.find(v=>v.id===selected)!;t.look.set(p.x,p.h*.35,p.z);t.pos.copy(t.look).add(new THREE.Vector3(105,150,150));t.zoom=Math.min(size.width/(p.w+55),size.height/105,5);}
  else if(command.kind==='route'&&route?.length){const box=new THREE.Box3().setFromPoints(route.map(([x,z,y])=>new THREE.Vector3(x,y,z)));const center=box.getCenter(new THREE.Vector3()),span=box.getSize(new THREE.Vector3());t.look.copy(center);t.pos.copy(center).add(new THREE.Vector3(20,380,120));t.zoom=Math.min(size.width/(span.x+120),size.height/(span.z+110),4);}
  else if(command.kind==='top'){t.look.set(0,0,-8);t.pos.set(0,420,-7.9);t.zoom=Math.min(size.width/205,size.height/310)*.86;}
  else if(zone!=='all'){const z=zone==='teaching'?65:-80;t.look.set(0,0,z);t.pos.set(150,240,z+190);t.zoom=Math.min(size.width/220,size.height/190)*.87;}
  else{t.look.set(0,0,-8);t.pos.set(235,305,340);t.zoom=fit;}
  lastLayout.current=-1;invalidate();
 },[command,size.width,size.height,zone,camera,invalidate]);
 const choose=(event:ThreeEvent<MouseEvent>)=>{if(event.delta>5)return;let object:THREE.Object3D|null=event.object;while(object&&!object.userData.placeId)object=object.parent;if(object?.userData.placeId){event.stopPropagation();onSelect(object.userData.placeId);}};
 useFrame((state,delta)=>{
  const ctl=controls.current;if(!ctl)return;const t=target.current,cam=camera as THREE.OrthographicCamera;
  if(t.active){const a=1-Math.exp(-delta*6);camera.position.lerp(t.pos,a);ctl.target.lerp(t.look,a);cam.zoom=THREE.MathUtils.lerp(cam.zoom,t.zoom,a);cam.updateProjectionMatrix();ctl.update();if(camera.position.distanceTo(t.pos)<.12&&Math.abs(cam.zoom-t.zoom)<.003)t.active=false;invalidate();}
  frame.current+=delta;
  if(!labelLayer.current||frame.current-lastLayout.current<.09)return;lastLayout.current=frame.current;
  const mobile=size.width<600,used:{x:number;y:number;w:number;h:number}[]=[],visible=new Set<string>();
  const prominent=['a','library','j','museum','canteen','gym','dorm1','lake','field','bridge'];
  const maxLabels=route?3:selected?(mobile?3:5):mobile?6:10;let count=0;
  const ranked=places.map(p=>({p,score:p.id===selected?1000:route&&p.id==='south'?950:(prominent.includes(p.id)?100:0)+(previous.current.has(p.id)?18:0)-(Math.hypot(p.x-ctl.target.x,p.z-ctl.target.z)/10)})).sort((a,b)=>b.score-a.score);
  const forward=camera.getWorldDirection(new THREE.Vector3());
  for(const {p} of ranked){const el=labelLayer.current.querySelector<HTMLButtonElement>(`[data-place="${p.id}"]`);if(!el)continue;
   const isSelected=p.id===selected;let show=props.labels||isSelected;
   show&&=isSelected||((category==='全部'||p.category===category)&&(zone==='all'||(zone==='teaching'?p.z>=-15:p.z<0)));
   show&&=isSelected||count<maxLabels;show&&=isSelected||cam.zoom>2||prominent.includes(p.id);
   const anchor=new THREE.Vector3(p.x,p.h+2.2,p.z);projected.copy(anchor).project(camera);const x=(projected.x*.5+.5)*size.width,y=(-projected.y*.5+.5)*size.height;
   const w=el.offsetWidth||90,h=el.offsetHeight||30;
   show&&=projected.z>-1&&projected.z<1&&x>w/2+12&&x<size.width-w/2-62&&y>(mobile?140:100)+h&&y<size.height-65;
   if(show&&!isSelected){ray.set(anchor.clone().addScaledVector(forward,-900),forward);const hit=new THREE.Vector3();show=!blockers.some(b=>b.id!==p.id&&ray.ray.intersectBox(b.box,hit)&&hit.distanceTo(ray.ray.origin)<895);}
   if(show&&used.some(u=>Math.abs(u.x-x)<(u.w+w)/2+12&&Math.abs(u.y-y)<(u.h+h)/2+12))show=false;
   el.style.display=show?'flex':'none';if(show){el.style.transform=`translate(${x-w/2}px,${y-h-7}px)`;used.push({x,y,w,h});visible.add(p.id);count++;}
  }
  previous.current=visible;
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
  <OrbitControls ref={controls} makeDefault enableDamping dampingFactor={.09} minZoom={.6} maxZoom={8} minPolarAngle={.02} maxPolarAngle={Math.PI*.36} maxDistance={800} target={[0,0,-8]} onStart={()=>{target.current.active=false;}} onChange={()=>invalidate()}/>
 </>;
}
export default function CampusScene(props:SceneProps){return <Canvas orthographic shadows="percentage" frameloop="demand" dpr={[1,1.5]} camera={{position:[235,305,340],zoom:1.8,near:.1,far:1800}} gl={{antialias:true,powerPreference:'high-performance'}}><World {...props}/></Canvas>;}


