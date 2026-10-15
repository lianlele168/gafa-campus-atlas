import assert from 'node:assert/strict';
import test from 'node:test';
import {layoutAllLabels,overlaps} from '../src/label-layout.ts';
import {inZone} from '../src/data/zones.ts';
import {places} from '../src/data/campus.ts';

test('zone membership keeps the north gate in teaching and shares only the bridge',()=>{
 const teaching=places.filter(p=>inZone(p,'teaching'));
 const residential=places.filter(p=>inZone(p,'residential'));
 assert.equal(teaching.length,20);
 assert.equal(residential.length,18);
 assert.deepEqual(teaching.filter(p=>residential.includes(p)).map(p=>p.id),['bridge']);
 assert.ok(teaching.some(p=>p.id==='teaching-north'));
 assert.ok(!residential.some(p=>p.id==='teaching-north'));
 assert.equal(places.filter(p=>inZone(p,'all')).length,37);
});

for(const [name,width,height] of [['desktop',1092,868],['phone',393,597]] as const){
 test(`${name}: dense anchors retain all names without collisions or clipping`,()=>{
  // Deliberately cluster the nine dormitories and several long teaching names.
  const anchors=places.map((p,i)=>({id:p.id,x:width*.5+(i%5-2)*9,y:height*.55+Math.floor(i/5)*8,w:i%4===0?91:56,h:22}));
  const bounds={left:12,top:143,right:width-58,bottom:height-67};
  const result=layoutAllLabels(anchors,bounds);
  assert.equal(new Set(result.map(b=>b.id)).size,37);
  result.forEach((b,i)=>{
   assert.ok(b.x-b.w/2>=bounds.left&&b.x+b.w/2<=bounds.right,`${b.id}: horizontal bounds`);
   assert.ok(b.y-b.h/2>=bounds.top&&b.y+b.h/2<=bounds.bottom,`${b.id}: vertical bounds`);
   assert.ok(!result.slice(i+1).some(other=>overlaps(b,other,0)),`${b.id}: collision`);
  });
  assert.deepEqual(layoutAllLabels(anchors,bounds),result,'stable layout with unchanged camera');
 });
}
