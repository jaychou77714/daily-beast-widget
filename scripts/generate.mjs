// 爆肝獸 · 每日內容產生器（無付費 API、無外部爬蟲）
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
const jokes = JSON.parse(readFileSync('data/jokes.json','utf8')).jokes;
const specials = JSON.parse(readFileSync('data/specials.json','utf8')).dates;
const launch = '2026-11-20';
const expiry = '2027-02-18'; // 90 天測試授權的資料更新期限
function taipeiDate(d = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(d);
  const get = type => parts.find(x=>x.type===type)?.value;
  return get('year')+'-'+get('month')+'-'+get('day');
}
function daysSince(date) {
  return Math.floor((Date.parse(date+'T00:00:00Z') - Date.parse(launch+'T00:00:00Z'))/86400000);
}
function shuffle(arr, seed) {
  const out = [...arr];
  let s = (seed ^ 0x9e3779b9) >>> 0;
  for(let i=out.length-1;i>0;i--) {
    s ^= s<<13; s ^= s>>>17; s ^= s<<5; s >>>= 0;
    const j=s%(i+1); [out[i],out[j]]=[out[j],out[i]];
  }
  return out;
}
const categoryMascot = {coffee:'beast-coffee.png',deadline:'beast-deadline.png',broke:'beast-broke.png',gamer:'beast-gamer.png',family:'beast-coffee.png'};
function selectFor(date) {
  const n = daysSince(date);
  if(n<0) throw new Error('日期早於專案開始日');
  const cycle=Math.floor(n/jokes.length);
  const selected=shuffle(jokes,73013+cycle)[n%jokes.length];
  const special=specials[date];
  const entry = special ? {...selected,...special} : selected;
  return {
    version:1, date, type:special?'festival':'original',
    source:'爆肝獸原創內容庫（非即時巴哈文章）',
    category:entry.category,
    title:entry.title, punch:entry.punch,
    label:special?.label||null,
    mascot_file:categoryMascot[entry.category]||categoryMascot.coffee,
    joke_id:special?null:selected.id,
    updated_at:new Date().toISOString(),
    repo:'jaychou77714/daily-beast-widget'
  };
}
const arg=process.argv.find(a=>a.startsWith('--date='));
const target=arg?arg.slice(7):taipeiDate();
if(!/^\d{4}-\d{2}-\d{2}$/.test(target))throw new Error('Invalid date');
if(target > expiry) {
  console.log('90 天實驗期已結束；停止發布新的每日內容：'+target);
  process.exit(0);
}
const out=selectFor(target);
mkdirSync('data',{recursive:true});
writeFileSync('data/today.json',JSON.stringify(out,null,2)+'\n','utf8');
console.log('已產生 '+target+' 的 '+out.type+' 貼文：'+out.title);
