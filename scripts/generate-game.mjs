// 爆肝獸養成：生成當日原創事件指派；無付費 API。
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const launch='2026-11-20',expiry='2027-02-18';
function taipeiDate(d=new Date()){
 const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(d);
 const p=t=>parts.find(x=>x.type===t)?.value;
 return p('year')+'-'+p('month')+'-'+p('day');
}
const dateArg=process.argv.find(a=>a.startsWith('--date='));
const date=dateArg?dateArg.slice(7):taipeiDate();
if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||Number.isNaN(Date.parse(date+'T00:00:00Z')))throw Error('Invalid date');
if(date<launch||date>expiry){console.log('超出 90 天試行期：'+date);process.exit(0);}
const events=JSON.parse(readFileSync('game/game-data.json','utf8')).events;
if(!Array.isArray(events)||events.length<8)throw Error('Missing events');
const n=Math.round((Date.parse(date+'T00:00:00Z')-Date.parse(launch+'T00:00:00Z'))/86400000);
const e=events[(n*7)%events.length];
const obj={version:1,date,event_id:e.id,title:e.title,updated_at:new Date().toISOString(),source:'爆肝獸原創養成事件（非巴哈即時文章）'};
mkdirSync('game',{recursive:true});
writeFileSync('game/today.json',JSON.stringify(obj,null,2)+'\n','utf8');
console.log('今日爆肝獸事件：'+e.title+' ('+e.id+')');
