export type CampusEvent={id:string;title:string;kind:string;start:string|null;end:string|null;time:string;location:string;building:string|null;summary:string;url:string};
export function guangzhouDate(){return new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
export function occursOn(event:CampusEvent,date:string){return !!event.start&&event.start<=date&&(event.end??event.start)>=date;}
export const verifiedEvents:CampusEvent[]=[
{id:'185474',title:'走出工作室：在当代陶瓷领域构建生活与职业',kind:'讲座',start:'2026-09-20',end:'2026-09-20',time:'2026年9月20日 · 官网未提供具体时刻',location:'广州美术学院大学城校区教学楼J栋101',building:'j',summary:'主讲：汤隽洋。主办：工艺美术学院；学术主持：谭红宇。',url:'https://www.gzarts.edu.cn/info/4240/185474.htm'},
{id:'185404',title:'探融媒之道，解叙事巧思——非遗的现代传播',kind:'讲座',start:'2026-09-17',end:'2026-09-17',time:'2026年9月17日 · 官网未提供具体时刻',location:'广州美术学院大学城校区教学区J栋101',building:'j',summary:'主讲：肖洋洋。主办：工艺美术学院；主持：方昕。',url:'https://www.gzarts.edu.cn/info/4240/185404.htm'},
{id:'175634',title:'沉浸式设计未来：人工智能、创意技术与文化体验的未来',kind:'讲座',start:'2026-05-12',end:'2026-05-12',time:'2026年5月12日 14:30',location:'广州美术学院大学城美术馆 a cube 多功能厅',building:'museum',summary:'主讲：Marc Aurel Schnabel。围绕人工智能、沉浸式媒体与文化体验展开讨论。',url:'https://www.gzarts.edu.cn/info/4240/175634.htm'}];
export function textFromHtml(html:string){return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<(?:br\b[^>]*|\/p|\/div)>/gi,'\n').replace(/<[^>]+>/g,'').replace(/&nbsp;|&#160;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/[ \t]+/g,' ').replace(/\n\s*\n/g,'\n').trim();}
export function datesFromText(text:string){const dates=[...text.matchAll(/(20\d{2})\s*[年.\/-]\s*(\d{1,2})\s*[月.\/-]\s*(\d{1,2})\s*日?/g)].map(m=>`${m[1]}-${m[2].padStart(2,'0')}-${m[3].padStart(2,'0')}`);let end=dates[1]??dates[0]??null;const partial=text.match(/(?:至|—|–|-|~|～)\s*(\d{1,2})[月.\/-](\d{1,2})/);if(dates.length===1&&partial)end=`${dates[0].slice(0,4)}-${partial[1].padStart(2,'0')}-${partial[2].padStart(2,'0')}`;return {start:dates[0]??null,end};}
export function mapEventBuilding(location:string){if(!/大学城/.test(location)||/昌岗|延安|校外/.test(location))return null;if(/大学城.*美术馆/.test(location))return 'museum';if(/图书馆/.test(location))return 'library';const m=location.match(/(?:教学(?:楼|区)?\s*)?([ABCDEJ])\s*(?:栋|楼)/i);return m?({a:'a',b:'b',c:'library',d:'d',e:'e',j:'j'} as Record<string,string>)[m[1].toLowerCase()]??null:null;}
export function parseEventHtml(html:string,url:string,kind:string):CampusEvent|null{
 const title=textFromHtml(html.match(/class=["']bigtitle["'][^>]*>([\s\S]*?)<\/div>/i)?.[1]??'');if(!title)return null;
 const metadata=textFromHtml(html.match(/class=["'][^"']*right hb detail[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)?.[1]??'');
 const body=textFromHtml(html.match(/class=["']v_news_content["'][^>]*>([\s\S]*?)<\/div>/i)?.[1]??'');
 const time=metadata.match(/(?:时间|展期)\s*[：:]\s*([\s\S]*?)(?=地点\s*[：:]|$)/)?.[1]?.trim()??body.match(/(?:活动时间|展览时间|时间|展期)\s*[：:]\s*([^\n]+)/)?.[1]?.trim()??'';
 const location=metadata.match(/地点\s*[：:]\s*([^\n]+)/)?.[1]?.trim()??body.match(/(?:展览地点|地点)\s*[：:]\s*([^\n]+)/)?.[1]?.trim()??'官网未明确地点';
 const dates=datesFromText(time);const summary=body.split('\n').filter(v=>/^(主讲|主持|学术主持|主办|协办)/.test(v)).slice(0,3).join(' · ').slice(0,210);
 return {id:url.split('/').pop()!.replace('.htm',''),title,kind,...dates,time:time||'官网未明确活动日期',location,building:mapEventBuilding(location),summary:summary||'完整介绍与报名要求请查看官网原文。',url};
}
