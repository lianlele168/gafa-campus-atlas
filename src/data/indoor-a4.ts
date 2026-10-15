// Relative room positions transcribed from the user's annotated floor photographs.
export type IndoorSpace={id:string;label:string;code?:string;note?:string;x:number;z:number;w:number;d:number;kind:'room'|'stairs'|'service'};
function floorData(floor:number){const out:IndoorSpace[]=[];const add=(side:string,l:number,r:number,label:string,kind:IndoorSpace['kind']='room',note='')=>out.push({id:floor+'-'+side+'-'+l,label,code:/^(A|SLD|工作室)/.test(label)?label:undefined,note,x:(l+r)/2-70,z:side==='n'?-6:6,w:r-l,d:8,kind});
 if(floor===4){
  const north:[number,number,string][]=[[0,7,'A424'],[7,21,'A422'],[21,39,'A418'],[39,46,'厕所'],[46,51,'A416'],[51,57,'A414'],[57,64,'A413'],[64,78,'A412'],[78,85,'A411'],[85,92,'A410'],[92,99,'A408'],[99,106,'A406'],[106,120,'A404'],[120,131,'厕所'],[131,140,'A402']];
  north.forEach(([l,r,n])=>add('n',l,r,n,n==='厕所'?'service':'room'));
  const south:[number,number,string][]=[[7,14,'西侧楼梯'],[14,28,'A423'],[28,31,'A421'],[31,35,'A420'],[35,42,'A419'],[42,49,'A417'],[49,63,'A415'],[75,82,'中部楼梯'],[82,85,'强电间'],[85,89,'未命名空间'],[89,96,'SLD-411 教师研究室'],[96,103,'A409'],[103,110,'A407'],[110,117,'A405'],[117,124,'A403'],[124,131,'梯台'],[134,140,'A401']];south.forEach(([l,r,n])=>add('s',l,r,n,n.includes('楼梯')?'stairs':n.includes('电间')?'service':'room',n==='未命名空间'?'手写用途无法辨认，待确认':''));
 }else{
  const north:[number,number,string][]=[[0,14,'未标注房间'],[14,28,'未标注房间'],[28,43,'A212'],[43,50,'厕所'],[50,57,'A210'],[57,71,'A208'],[71,85,'A206'],[85,99,'A204'],[99,113,'开放空间'],[113,127,'房间标识待确认'],[127,134,'厕所'],[134,140,'东侧楼梯与电梯']];north.forEach(([l,r,n])=>add('n',l,r,n,n==='厕所'?'service':n.includes('楼梯')?'stairs':'room',n==='房间标识待确认'?'照片手写标识似为 A203W，请以现场确认为准':''));
  add('s',7,14,'SLD-A213 服装配饰教研室','room','教研室全称字迹不清，待确认');add('s',14,21,'西侧楼梯','stairs');
  ['F','E','D','C','B','A'].forEach((n,i)=>add('s',21+i*6,27+i*6,'工作室 '+n));
  add('s',57,64,'空地');add('s',75,82,'中部楼梯','stairs');add('s',82,89,'强电间','service');add('s',89,92,'A201');add('s',92,96,'A207');add('s',96,110,'A205');add('s',110,124,'SLD-A203');add('s',124,131,'未命名房间','room','手写名称无法辨认，待确认');
 }
 return out;
}
export const a4Spaces=floorData(4);
export const a2Spaces=floorData(2);
export const getAFloorSpaces=(floor:number)=>floor===2?a2Spaces:a4Spaces;
