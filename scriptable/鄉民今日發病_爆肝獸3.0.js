// 爆肝獸 3.0 — GitHub 雲端版 / iPhone Scriptable 中型小工具
// GitHub 來源：jaychou77714/daily-beast-widget
// 安裝：建立新 Scriptable 腳本貼上，桌面中型 Widget 選它。
// 保留現有「Scriptable/爆肝獸/」四張 PNG，不需要重搬圖片。
const BASE = "https://raw.githubusercontent.com/jaychou77714/daily-beast-widget/main/data/";
const REPO = "https://github.com/jaychou77714/daily-beast-widget";
const MASCOT_FOLDER = "爆肝獸";
const C = {bg:"#F8F4EC", ink:"#292725", red:"#B84137", muted:"#81766F"};
const mascots={coffee:"beast-coffee.png",deadline:"beast-deadline.png",broke:"beast-broke.png",gamer:"beast-gamer.png",family:"beast-coffee.png"};
const fallback=[
["今天不是沒效率","是我的靈魂還沒打卡。","coffee"],
["客戶說小改一下","我聽見電腦風扇開始替我哭。","deadline"],
["錢包走極簡風","裡面連空氣都收納好了。","broke"],
["再打一場就睡","這是我最擅長的都市傳說。","gamer"],
["今天也不容易","活過這一天就值得蓋章。","coffee"],
["週末親子行程","孩子充滿電，我只剩一格。","family"],
["又收到新修改了","我們的故事真是永遠沒有結局。","deadline"],
["薪水只是過客","進來打聲招呼就趕下一班車。","broke"]
];
function pad(n){return String(n).padStart(2,"0")}
function keyOf(d){return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())}
const today=new Date(), key=keyOf(today);
const fm=FileManager.local(), cache=fm.joinPath(fm.documentsDirectory(),"daily-beast-cloud-v3.json");
let stored={};
try{if(fm.fileExists(cache))stored=JSON.parse(fm.readString(cache));}catch(e){stored={}}
function good(x){return x&&x.date===key&&typeof x.title==="string"&&typeof x.punch==="string"&&typeof x.category==="string"}
async function readJson(url){
  const req=new Request(url);req.timeoutInterval=7;return await req.loadJSON();
}
let entry=null, source="離線備援";
if(good(stored.today)&&stored.fromCloud===true){entry=stored.today;source="今日快取"}
else {
  try{
    const fresh=await readJson(BASE+"today.json?v="+key);
    if(good(fresh)){entry=fresh;source="GitHub 雲端"}
  }catch(e){}
  if(!entry) {
    let pool=stored.jokes||null,specials=stored.specials||{};
    if(!pool){
      try {
        const obj=await readJson(BASE+"jokes.json");
        if(Array.isArray(obj.jokes)&&obj.jokes.length>=30){pool=obj.jokes;stored.jokes=pool}
      }catch(e){}
    }
    if(!stored.specials){
      try{
        const obj=await readJson(BASE+"specials.json");
        if(obj.dates){specials=obj.dates;stored.specials=specials}
      }catch(e){}
    }
    const special=specials[key];
    if(special){
      entry={date:key,...special};source="節慶特別篇";
    }else if(pool&&pool.length){
      const day=Math.floor(Date.UTC(today.getFullYear(),today.getMonth(),today.getDate())/86400000);
      // 即使網路離線，也依本地日期換句子，不需要靠舊內容。
      entry={date:key,...pool[((day%pool.length)+pool.length)%pool.length]};
      source="雲端題庫備援";
    }
  }
}
if(!entry){
  const n=Math.floor(Date.UTC(today.getFullYear(),today.getMonth(),today.getDate())/86400000);
  const a=fallback[((n%fallback.length)+fallback.length)%fallback.length];
  entry={date:key,title:a[0],punch:a[1],category:a[2]};source="離線原創幹話";
}
try{stored.today=entry;stored.fromCloud=(source==="GitHub 雲端"||source==="今日快取");fm.writeString(cache,JSON.stringify(stored))}catch(e){}
async function loadBeast(name){
  for(const manager of [FileManager.iCloud(),FileManager.local()]){
    const p=manager.joinPath(manager.joinPath(manager.documentsDirectory(),MASCOT_FOLDER),name);
    if(!manager.fileExists(p))continue;
    try{if(manager.isFileDownloaded&& !manager.isFileDownloaded(p))await manager.downloadFileFromiCloud(p);return manager.readImage(p)}catch(e){}
  }
  return null;
}
const image=await loadBeast(mascots[entry.category]||mascots.coffee);
const w=new ListWidget();w.backgroundColor=new Color(C.bg);w.setPadding(12,14,10,14);w.url=REPO;
function text(stack,s,size,color,bold){
  const t=stack.addText(String(s));t.font=bold?Font.boldSystemFont(size):Font.systemFont(size);t.textColor=new Color(color);return t;
}
const top=w.addStack();top.layoutHorizontally();top.centerAlignContent();
text(top,"鄉民今日發病",15,C.ink,true);top.addSpacer();text(top,pad(today.getMonth()+1)+"."+pad(today.getDate()),11,C.muted,true);
w.addSpacer(5);const rule=w.addStack();rule.backgroundColor=new Color(C.red);rule.size=new Size(0,2);rule.addSpacer();w.addSpacer(6);
const body=w.addStack();body.layoutHorizontally();body.centerAlignContent();
const left=body.addStack();left.layoutVertically();left.size=new Size(178,85);
const title=text(left,entry.title,16,C.ink,true);title.lineLimit=2;title.minimumScaleFactor=0.68;
left.addSpacer(3);
const subtitle=text(left,entry.punch,11,"#625850",false);subtitle.lineLimit=3;subtitle.minimumScaleFactor=0.7;
left.addSpacer();
body.addSpacer(3);
const right=body.addStack();right.size=new Size(94,89);right.centerAlignContent();
if(image){const pic=right.addImage(image);pic.imageSize=new Size(91,88);pic.centerAlignImage()}
else{const missing=text(right,"爆肝獸\n圖片待放入",9,C.muted,false);missing.centerAlignText()}
w.addSpacer(2);
const footer=w.addStack();footer.layoutHorizontally();footer.centerAlignContent();
text(footer,(entry.label?entry.label+" · ":"")+source,9,C.muted,false);footer.addSpacer();text(footer,"爆肝獸日誌 ›",9,C.red,true);
const tomorrow=new Date(today.getFullYear(),today.getMonth(),today.getDate()+1,1,10);
const retry=new Date(today.getTime()+3*3600000);
w.refreshAfterDate=retry<tomorrow?retry:tomorrow;
if(config.runsInWidget){Script.setWidget(w)}else{await w.presentMedium()}
Script.complete();
