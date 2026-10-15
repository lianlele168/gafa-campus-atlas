export type Category = '教学' | '生活' | '运动' | '景观';
export type Place = { id:string; name:string; en:string; category:Category; zone:string; x:number; z:number; w:number; d:number; h:number; info:string; aliases:string; kind?:string; photo?:string; entry:[number,number] };
export const places:Place[] = [
 {id:'teaching-north',name:'教学区北门',en:'ACADEMIC NORTH GATE',category:'景观',zone:'教学区 · 北侧',x:-14.5,z:-1,w:9,d:3,h:5,info:'位于教学区北侧，J栋与E栋之间，面向大学城中环西路。',aliases:'教学区北门 教学北门 北门',kind:'gate',entry:[-14.5,1]},
 {id:'residence-south',name:'生活区南门',en:'RESIDENTIAL SOUTH GATE',category:'景观',zone:'生活区 · 南侧',x:-29,z:-26,w:10,d:3,h:5,info:'位于生活区南侧，食堂与宿舍1栋之间，面向大学城中环西路。',aliases:'生活区南门 生活南门 宿舍区南门',kind:'gate',entry:[-29,-24]},
 {id:'residence-east',name:'生活区东门',en:'RESIDENTIAL EAST GATE',category:'景观',zone:'生活区 · 东侧',x:44,z:-112,w:3,d:10,h:5,info:'位于生活区东侧，5栋与6栋之间的东侧出入口。',aliases:'生活区东门 生活东门 宿舍区东门',kind:'gate',entry:[44,-112]},
 {id:'auditorium900',name:'九百座报告厅',en:'900-SEAT AUDITORIUM',category:'教学',zone:'教学区 · B栋南侧',x:8.75,z:89.5,w:17.5,d:13,h:11,info:'位于B栋与A栋、行政楼之间，按你提供的标注定位。',aliases:'九百座报告厅 900座报告厅 九百座 900座 报告厅 礼堂',kind:'lectureHall',entry:[-10,89.5]},
 {id:'library',name:'教学楼 C栋 · 图书馆',en:'LIBRARY / BLOCK C',category:'教学',zone:'教学区',x:0,z:55,w:64,d:11,h:26.2,info:'教学区中部，邻近广美湖。图书馆位于 C 栋，沿中央步行轴可到达。',aliases:'图书馆 c栋 教学楼c栋 library tushuguan c',photo:'/photos/teaching.jpg',entry:[-33,64]},
 {id:'museum',name:'大学城美术馆',en:'UNIVERSITY ART MUSEUM',category:'教学',zone:'教学区 · 东南侧',x:53,z:108,w:24,d:24,h:12,info:'位于教学区东南侧，临近南门与广美湖。入口以现场导向标识为准。',aliases:'美术馆 艺术馆 展览 museum meishuguan',kind:'museum',entry:[36,108]},
 {id:'a',name:'教学楼 A栋',en:'ACADEMIC / BLOCK A',category:'教学',zone:'教学区 · 南侧',x:-35,z:101,w:55,d:13,h:26.2,info:'位于教学区南侧长条建筑的西段，与东侧行政楼在 5–7 层相连，二层设平台，平台上方至四层保留开口，可见后方九百座报告厅。各层为教学课室，首层与上层一样设正常墙体和窗户。',aliases:'a栋 a6 教学楼a栋 a',photo:'/photos/aerial.jpg',entry:[-19,112]},
 {id:'b',name:'教学楼 B栋',en:'ACADEMIC / BLOCK B',category:'教学',zone:'教学区',x:0,z:78,w:64,d:11,h:26.2,info:'位于 A 栋与 C 栋之间，可沿中央步行轴进入教学组团。',aliases:'b栋 教学楼b栋 b',photo:'/photos/courtyard.jpg',entry:[-33,87]},
 {id:'d',name:'教学楼 D栋',en:'ACADEMIC / BLOCK D',category:'教学',zone:'教学区',x:7,z:32,w:50,d:11,h:26.2,info:'教学区中北部，西侧邻近网球场，东侧留有室外间隔，与美术馆不相连。',aliases:'d栋 教学楼d栋 d',photo:'/photos/teaching.jpg',entry:[0,41]},
 {id:'e',name:'教学楼 E栋',en:'ACADEMIC / BLOCK E',category:'教学',zone:'教学区 · 北侧',x:16,z:9,w:59,d:13,h:26.2,info:'教学区北侧教学楼，通过连接天桥可前往生活区。',aliases:'e栋 教学楼e栋 e',photo:'/photos/aerial.jpg',entry:[20,19]},
 {id:'north-lecture',name:'北阶梯教室',en:'NORTH LECTURE HALL',category:'教学',zone:'教学区 · C栋东侧',x:41,z:55,w:18,d:12,h:6.4,info:'按用户提供的卫星截图补充，位于C栋东侧的低层阶梯教室；体量与屋顶细节为参考示意。',aliases:'北阶梯 北阶梯室 北阶梯教室 北阶梯式 阶梯教室',kind:'lectureHall',entry:[39,63]},
 {id:'south-lecture',name:'南阶梯教室',en:'SOUTH LECTURE HALL',category:'教学',zone:'教学区 · B栋东侧',x:41,z:78,w:18,d:12,h:6.4,info:'按用户提供的卫星截图补充，位于B栋东侧的低层阶梯教室；体量与屋顶细节为参考示意。',aliases:'南阶梯 南阶梯室 南阶梯教室 南阶梯式 阶梯教室',kind:'lectureHall',entry:[39,86]},
 {id:'sculpture-shed',name:'雕院大棚',en:'SCULPTURE WORKSHOP',category:'教学',zone:'教学区 · E栋东侧',x:55,z:10,w:14,d:18,h:8,info:'位于教学楼 E 栋右侧的雕塑工作大棚，按提供的卫星截图近似定位。',aliases:'雕院 大棚 雕塑 雕塑学院 工作棚',kind:'shed',entry:[55,22]},
 {id:'j',name:'教学楼 J栋',en:'ACADEMIC / BLOCK J',category:'教学',zone:'教学区 · 北侧',x:-37,z:9,w:43,d:13,h:26.2,info:'与 E 栋并列的北侧教学楼，靠近操场及连接天桥。',aliases:'j栋 教学楼j栋 j',entry:[-35,19]},
 {id:'admin',name:'行政楼',en:'ADMINISTRATION',category:'教学',zone:'教学区 · 南侧',x:28,z:101,w:19,d:13,h:26.2,info:'位于南侧长条建筑的东段，与 A 栋在 5–7 层相连，下方架空，弧形台阶通往二楼平台；前方为弧形台阶广场，东侧连接湖畔步道。',aliases:'行政楼 行政 办公',entry:[30,112]},
 {id:'lake',name:'广美湖',en:'GAFA LAKE',category:'景观',zone:'教学区 · 东侧',x:60,z:67,w:36,d:132,h:1,info:'教学区东侧狭长湖区。北段水道沿校园边界延伸，中南段展开为湖面，设湖心岛与跨湖步桥。',aliases:'广美湖 湖 湖边 湖畔',kind:'lake',entry:[39,64]},
 {id:'field',name:'田径场',en:'TRACK & FIELD',category:'运动',zone:'教学区 · 西侧',x:-55,z:57,w:36,d:72,h:1,info:'位于教学区西侧，包含环形跑道、足球场和西侧看台；东侧为网球场及教学组团。',aliases:'操场 足球场 田径场 跑步',kind:'field',photo:'/photos/sports.jpg',entry:[-33,64]},
 {id:'tennis',name:'网球场',en:'TENNIS COURT',category:'运动',zone:'教学区 · 西侧',x:-30,z:31,w:15,d:18,h:1,info:'位于教学楼与田径场之间的室外网球场。',aliases:'网球 网球场',kind:'court',photo:'/photos/sports.jpg',entry:[-19,41]},
 {id:'gardens',name:'教学区楼间花园',en:'ACADEMIC COURTYARDS',category:'景观',zone:'B、C、D 栋之间',x:9,z:66.5,w:48,d:10,h:1,info:'参考航拍图重建的楼间绿化庭院，包含花坛、步道与架空连廊。花园名称为位置描述。',aliases:'花园 庭院 楼间花园 绿化',kind:'garden',entry:[-19,64]},
 {id:'bridge',name:'校园连接天桥',en:'CAMPUS FOOTBRIDGE',category:'景观',zone:'连接教学区与生活区',x:15.5,z:-45.5,w:15,d:97,h:10,info:'横跨大学城中环西路，生活区一端向左转，直接从宿舍 1 栋东侧接入，并沿宿舍东侧向北延伸，尾端接入宿舍 5 栋。',aliases:'天桥 连廊 桥',kind:'bridge',photo:'/photos/bridge.jpg',entry:[20,-14]},
 {id:'dorm1',name:'宿舍 1栋',en:'RESIDENCE / 01',category:'生活',zone:'生活区 · 南侧',x:-7,z:-34,w:32,d:12,h:21,info:'生活区南侧宿舍，与校园连接天桥的左转连廊相接。',aliases:'宿舍1栋 1栋 一栋 1',photo:'/photos/dorm.jpg',entry:[8.5,-34]},
 {id:'dorm2',name:'宿舍 2栋',en:'RESIDENCE / 02',category:'生活',zone:'生活区',x:-7,z:-56,w:32,d:11,h:21,info:'生活区中部宿舍楼，西侧为食堂与运动区。',aliases:'宿舍2栋 2栋 二栋 2',photo:'/photos/dorm.jpg',entry:[-7,-45]},
 {id:'dorm3',name:'宿舍 3栋',en:'RESIDENCE / 03',category:'生活',zone:'生活区',x:-7,z:-78,w:32,d:11,h:21,info:'位于 2 栋与 4 栋之间，邻近生活区篮球场。',aliases:'宿舍3栋 3栋 三栋 3',photo:'/photos/dorm.jpg',entry:[-7,-67]},
 {id:'dorm4',name:'宿舍 4栋',en:'RESIDENCE / 04',category:'生活',zone:'生活区',x:-16,z:-101,w:36,d:11,h:21,info:'生活区北侧宿舍组团，西侧邻近室外球场。',aliases:'宿舍4栋 4栋 四栋 4',entry:[-16,-90]},
 {id:'dorm5',name:'留学生公寓 · 5栋',en:'INTERNATIONAL RESIDENCE',category:'生活',zone:'生活区',x:21,z:-101,w:35,d:11,h:21,info:'生活区北侧公寓，毗邻 4 栋及东侧校园道路。',aliases:'5栋 五栋 留学生公寓 宿舍5栋 5',entry:[13,-97.4]},
 {id:'dorm6',name:'宿舍 6栋',en:'RESIDENCE / 06',category:'生活',zone:'生活区 · 北侧东段',x:29,z:-120,w:21,d:11,h:21,info:'依据用户提供的当前宿舍编号图，位于7栋东侧、5栋北侧。',aliases:'6栋 六栋 宿舍6栋 6',entry:[29,-112]},
 {id:'dorm7',name:'宿舍 7栋',en:'RESIDENCE / 07',category:'生活',zone:'生活区 · 北侧西段',x:6,z:-120,w:24,d:11,h:21,info:'依据用户提供的当前宿舍编号图，与6栋并列，位于6栋西侧。',aliases:'7栋 七栋 宿舍7栋 7',entry:[6,-112]},
 {id:'dorm8',name:'宿舍 8栋',en:'RESIDENCE / 08',category:'生活',zone:'生活区 · 西北侧',x:-29,z:-134,w:28,d:22,h:24,info:'依据用户提供的当前宿舍编号图补充，位于9栋西侧、游泳池东北侧。建筑外观和尺度为参考示意。',aliases:'8栋 八栋 宿舍8栋 8',entry:[-29,-122]},
 {id:'dorm9',name:'宿舍 9栋',en:'RESIDENCE / 09',category:'生活',zone:'生活区 · 北端',x:4,z:-139,w:20,d:12,h:24,info:'依据用户提供的当前宿舍编号图，位于7栋北侧、8栋东侧；替换原先未核实的教师公寓标注。',aliases:'9栋 九栋 宿舍9栋 9',entry:[4,-130]},
 {id:'canteen',name:'学生食堂',en:'STUDENT CANTEEN',category:'生活',zone:'生活区 · 西侧',x:-48,z:-42,w:24,d:23,h:12,info:'生活区西南侧餐饮区域，邻近宿舍 1 栋、2 栋。',aliases:'食堂 饭堂 吃饭 餐厅',entry:[-31,-45]},
 {id:'gym',name:'体育馆',en:'SPORTS HALL',category:'运动',zone:'生活区 · 东侧',x:49,z:-53,w:24,d:30,h:15,info:'生活区东侧室内运动场馆。西侧为两块独立篮球场，再向西是宿舍 2、3 栋。',aliases:'体育馆 羽毛球 体育',kind:'gym',entry:[37.2,-42]},
 {id:'basketball',name:'篮球场 · 南场',en:'BASKETBALL / SOUTH',category:'运动',zone:'生活区 · 宿舍 2栋东侧',x:24,z:-54,w:16,d:20,h:1,info:'按原平面图的南侧篮球场定位，位于宿舍 2 栋与体育馆之间，与北场由步道分隔。',aliases:'篮球 篮球场 南场 体育馆旁',kind:'residentialCourt',entry:[13,-45]},
 {id:'basketball-north',name:'篮球场 · 北场',en:'BASKETBALL / NORTH',category:'运动',zone:'生活区 · 宿舍 3栋东侧',x:24,z:-78,w:16,d:20,h:1,info:'按原平面图的北侧篮球场定位，位于宿舍 3 栋东侧、体育馆西北方向。',aliases:'篮球 篮球场 北场',kind:'residentialCourt',entry:[13,-67]},
 {id:'west-courts',name:'西侧综合球场',en:'WEST SPORTS COURTS',category:'运动',zone:'生活区 · 食堂北侧',x:-49,z:-86,w:27,d:49,h:1,info:'生活区西侧成组的室外球场，位于食堂北侧、宿舍 2 至 4 栋西侧，与宿舍东侧的两块篮球场分开。',aliases:'综合球场 西侧球场 篮球 排球 网球 乒乓球',kind:'residentialCourt',entry:[-31,-67]},
 {id:'pool',name:'游泳池',en:'SWIMMING POOLS',category:'运动',zone:'生活区 · 西北侧',x:-62,z:-117,w:18,d:38,h:1,info:'按原平面图重建西北侧泳池区：北侧长池与南侧短池错开布置，池边设平台，东侧连接综合球场。池体比例为参考示意。',aliases:'游泳池 泳池 游泳 长池 短池',kind:'residentialPool',entry:[-56,-111]},
 {id:'south',name:'教学区南门',en:'SOUTH ENTRANCE',category:'景观',zone:'教学区 · 南侧',x:9,z:126,w:12,d:3,h:5,info:'导航终端的默认出发点。选择目的地后可查看校园步行示意路线。',aliases:'南门 教学区南门 大门',kind:'gate',entry:[9,122]},
 {id:'east',name:'教学区东门',en:'EAST ENTRANCE',category:'景观',zone:'教学区 · 东侧',x:78,z:43,w:3,d:12,h:5,info:'教学区东侧入口，沿湖畔通道进入校园。',aliases:'东门 教学区东门',kind:'gate',entry:[72,43]}
];
export function searchPlaces(query:string,category='全部') { const q=query.trim().toLowerCase().replace(/\s+/g,''); return places.filter(p=>(category==='全部'||p.category===category)&&(!q||(p.name+p.aliases+p.en).toLowerCase().replace(/\s+/g,'').includes(q))); }
// A deliberately approximate pedestrian graph based on the supplied plans.
export type RoutePoint=[number,number,number];
const nodes:Record<string,RoutePoint>={teachingNorth:[-14.5,1,1],teachingNorthInner:[-14.5,19,1],residenceSouth:[-29,-24,1],s:[9,122,1],a:[9,112,1],aWest:[-33,112,1],b:[-33,87,1],c:[-33,64,1],bendWest:[-33,43.5,1],bendEast:[-19,43.5,1],d:[-19,41,1],e:[-19,19,1],join:[20,19,1],bridge:[20,-14,1],bridgeTurn:[20,-34,1],bridgeWest:[12,-34,1],dormLanding:[8.5,-34,1],dormApproach:[20,-43,1],bridgeSide:[13,-34,1],courtGapWest:[13,-66,1],courtGapEast:[35,-66,1],platformSouth:[35,-34,1],platformGym:[35,-42,1],gymLanding:[37.2,-42,1],bridgeNorth:[13,-90,1],bridgeExit:[13,-97.4,1],shed:[55,22,1],n1:[13,-24,1],n2:[13,-45,1],n3:[13,-67,1],n4:[13,-90,1],n5:[-10,-112,1],n6:[-10,-132,1],w1:[-31,-24,1],w2:[-31,-45,1],w3:[-31,-67,1],w4:[-31,-90,1],nw1:[-38,-90,1],w5:[-38,-112,1],g1:[35,-24,1],g2:[35,-45,1],g3:[35,-67,1],g4:[35,-90,1],g5:[44,-90,1],g6:[44,-112,1],n5e:[29,-112,1],se:[36,112,1],l1:[39,87,1],l2:[39,64,1],l3:[39,43,1],l4:[39,19,1],east:[72,43,1],museum:[36,108,1]};
const edges=[['teachingNorth','teachingNorthInner'],['teachingNorthInner','e'],['teachingNorthInner','join'],['residenceSouth','w1'],['residenceSouth','n1'],['s','a'],['a','aWest'],['aWest','b'],['b','c'],['c','bendWest'],['bendWest','bendEast'],['bendEast','d'],['d','e'],['e','join'],['join','bridge'],['bridge','bridgeTurn'],['bridgeTurn','bridgeSide'],['bridgeSide','bridgeWest'],['bridgeSide','courtGapWest'],['courtGapWest','bridgeNorth'],['bridgeTurn','platformSouth'],['platformSouth','platformGym'],['platformGym','courtGapEast'],['courtGapEast','courtGapWest'],['platformGym','gymLanding'],['bridgeNorth','bridgeExit'],['bridgeNorth','n4'],['bridgeWest','dormLanding'],['bridgeTurn','dormApproach'],['dormApproach','n2'],['l4','shed'],['n1','n2'],['n2','n3'],['n3','n4'],['n5','n6'],['n1','w1'],['w1','w2'],['w2','w3'],['w3','w4'],['w4','nw1'],['nw1','w5'],['w2','n2'],['w3','n3'],['w4','n4'],['w5','n5'],['n1','g1'],['n2','g2'],['n3','g3'],['n4','g4'],['g1','g2'],['g2','g3'],['g3','g4'],['g4','g5'],['g5','g6'],['g6','n5e'],['n5e','n5'],['a','se'],['se','museum'],['se','l1'],['l1','l2'],['l2','l3'],['l3','l4'],['l4','join'],['l3','east'],['b','l1'],['c','l2'],['d','l3']];
// Floor-specific nodes; stairs are the only edges between ground and gallery level.
for(const id of ['join','bridge','bridgeTurn','bridgeWest','dormLanding','bridgeSide','courtGapWest','courtGapEast','platformSouth','platformGym','gymLanding','bridgeNorth','bridgeExit'])nodes[id][2]=7.7;
Object.assign(nodes,{
 westFork:[-2,19,7.7],upE:[20,9,7.7],upJ:[-35,9,7.7],upENorth:[-2,9,7.7],upD:[20,32,7.7],upDWest:[-2,32,7.7],upC:[20,55,7.7],upCWest:[-2,55,7.7],upCenterC:[5,55,7.7],upBWest:[-2,78,7.7],upBEast:[20,78,7.7],southWest:[-2,93,7.7],southEast:[20,93,7.7],southToA:[-18,93,7.7],upB:[5,78,7.7],upHall:[5,96.2,7.7],upA:[-18,94.1,7.7],upAdmin:[28,101,7.7],upASpine:[5,101,7.7],
 southStairFoot:[5,122.9,1],southStairTop:[5,110.1,7.7],northStairFoot:[25,25.6,1],northStairTop:[25,16.85,7.7],northLanding:[20,16.85,7.7]
});
for(let i=edges.length-1;i>=0;i--){const [a,b]=edges[i];if(nodes[a][2]!==nodes[b][2])edges.splice(i,1);}
edges.push(['upJ','upENorth'],['upENorth','upDWest'],['upDWest','upCWest'],['upE','upD'],['upD','upC'],['upD','upDWest'],['upC','upCWest'],['upC','upCenterC'],['upCWest','upBWest'],['upC','upBEast'],['upBWest','southWest'],['upBEast','southEast'],['southWest','southEast'],['southWest','southToA'],['southToA','upA'],['upBWest','upB'],['upBEast','upB'],['southWest','upHall'],['upHall','southEast'],['southEast','upAdmin'],['upA','southStairTop'],['southStairTop','southStairFoot'],['southStairFoot','a'],['southStairFoot','aWest'],['upE','northLanding'],['join','westFork'],['westFork','upENorth'],['westFork','upDWest'],['join','upD'],['northLanding','join'],['northLanding','northStairTop'],['northStairTop','northStairFoot'],['northStairFoot','l4'],['northStairFoot','teachingNorthInner'],['bridgeTurn','dormApproach']);
const upperEntries:Record<string,string>={a:'upA',admin:'upAdmin',b:'upB',library:'upC',d:'upD',e:'upE',j:'upJ',auditorium900:'upHall',dorm1:'dormLanding',dorm5:'bridgeExit',gym:'gymLanding',bridge:'bridge'};

const distance=(a:number[],b:number[])=>Math.hypot(a[0]-b[0],a[1]-b[1],(a[2]??1)-(b[2]??1));
export function routeBetween(startId:string,endId:string){
 const start=places.find(p=>p.id===startId)!,end=places.find(p=>p.id===endId)!;
 const nearest=(p:[number,number])=>Object.keys(nodes).filter(k=>nodes[k][2]===1).reduce((a,b)=>distance(p,nodes[a])<distance(p,nodes[b])?a:b);
 const a=upperEntries[startId]??nearest(start.entry),b=upperEntries[endId]??nearest(end.entry);
 const dist:Record<string,number>={},prev:Record<string,string>={},pending=new Set(Object.keys(nodes));Object.keys(nodes).forEach(k=>dist[k]=Infinity);dist[a]=0;
 while(pending.size){const u=[...pending].reduce((x,y)=>dist[x]<dist[y]?x:y);pending.delete(u);if(u===b||!Number.isFinite(dist[u]))break;for(const [v,w] of edges){const n=v===u?w:w===u?v:null;if(n&&pending.has(n)){const alt=dist[u]+distance(nodes[u],nodes[n]);if(alt<dist[n]){dist[n]=alt;prev[n]=u;}}}}
 const path=[b];while(path[0]!==a&&prev[path[0]])path.unshift(prev[path[0]]);
 const endpoint=(p:Place,k:string):RoutePoint=>upperEntries[p.id]?nodes[k]:[p.entry[0],p.entry[1],1];
 const pts=[endpoint(start,a),...path.map(k=>nodes[k]),endpoint(end,b)].filter((p,i,all)=>i===0||distance(p,all[i-1])>.1);
 const meters=Math.round(pts.slice(1).reduce((sum,p,i)=>sum+distance(p,pts[i]),0)*2.7/10)*10;
 return {points:pts,meters,minutes:Math.max(1,Math.ceil(meters/75)),crossesBridge:path.includes('bridge')};
}
export type Weather={temperature:number;code:number;wind:number;cloud:number;time:string;sunrise:string;sunset:string;fetchedAt:number};
export function weatherLabel(code:number){if(code===0)return '晴';if(code<=2)return '多云';if(code===3)return '阴';if(code<=48)return '雾';if(code>=95)return '雷雨';if(code>=71&&code<=77)return '雪';return '雨';}
export function isRain(code:number){return (code>=51&&code<=67)||(code>=80&&code<=82)||code>=95;}
export function guangzhouHour(date:Date){const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Shanghai',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(date).split(':');return Number(parts[0])+Number(parts[1])/60;}

export const WEATHER_URL='https://api.open-meteo.com/v1/forecast?latitude=23.04&longitude=113.37&current=temperature_2m,weather_code,wind_speed_10m,cloud_cover&daily=sunrise,sunset&timezone=Asia%2FShanghai&forecast_days=1';
export function parseWeather(d:any):Weather{if(!d?.current||typeof d.current.temperature_2m!=='number'||!d.daily?.sunrise?.[0]||!d.daily?.sunset?.[0])throw new Error('Weather data unavailable');return {temperature:d.current.temperature_2m,code:d.current.weather_code,wind:d.current.wind_speed_10m,cloud:d.current.cloud_cover,time:d.current.time,sunrise:d.daily.sunrise[0],sunset:d.daily.sunset[0],fetchedAt:Date.now()};}

// Route elevation follows the east-side crossing and residence entrance.
export function walkwayHeight(x:number,z:number){if(Math.abs(z+34)<=1.5&&x>=20&&x<=35||Math.abs(x-35)<=1.5&&z>=-66&&z<=-34||Math.abs(z+66)<=1.5&&x>=13&&x<=35||Math.abs(z+42)<=1.5&&x>=35&&x<=37.5)return 7.45;if(Math.abs(x-13)<=2.5&&z>=-98&&z<=-34)return 7.45;if(Math.abs(x-20)<=3&&z>=-35&&z<=3||Math.abs(z+34)<=3&&x>=8&&x<=23)return 7.45;if(Math.abs(x-20)<=3&&z<-35&&z>=-43)return 1+6.45*(z+43)/8;return 1;}

