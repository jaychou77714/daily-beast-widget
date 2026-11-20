// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: book-open;
/*
 每日發病 FINAL Cloud — iPhone Scriptable 大型 Widget
 保留既有 Scriptable/DailyComicFINAL/ 裡的 365 則文案、70 張漫畫、節慶、農曆。
 只追加 GitHub 線上日期覆蓋能力；沒有新文案或連線失敗，完全用原有資料。
 與「鄉民今日發病3」不同，請放在上方大型 Widget。
*/
const CLOUD_URL = "https://raw.githubusercontent.com/jaychou77714/daily-beast-widget/main/daily-comic/cloud-overrides.json";
const PREVIEW_DATE = "";  // 驗證日期例："2027-02-06"，平常務必留空。
const now=/^\d{4}-\d{2}-\d{2}$/.test(PREVIEW_DATE)
  ? new Date(PREVIEW_DATE+"T12:00:00"):new Date();
const yy=now.getFullYear(), mm=now.getMonth()+1, dd=now.getDate();
const pad=n=>String(n).padStart(2,"0");
const key=yy+"-"+pad(mm)+"-"+pad(dd), shortKey=pad(mm)+"-"+pad(dd);
const dayOfYear=Math.floor((Date.UTC(yy,mm-1,dd)-Date.UTC(yy,0,1))/86400000);
const week="星期"+["日","一","二","三","四","五","六"][now.getDay()];
const fmCloud=FileManager.iCloud(), fmLocal=FileManager.local();
let fm=fmCloud,root=fm.joinPath(fm.documentsDirectory(),"DailyComicFINAL");
if(!fm.fileExists(root)){
  const local=fmLocal.joinPath(fmLocal.documentsDirectory(),"DailyComicFINAL");
  if(fmLocal.fileExists(local)){fm=fmLocal;root=local;}
}
async function readJson(name,fallback){
  try{
    const p=fm.joinPath(root,name);
    if(!fm.fileExists(p))return fallback;
    if(fm===fmCloud&&fm.isFileStoredIniCloud(p))await fm.downloadFileFromiCloud(p);
    return JSON.parse(fm.readString(p));
  }catch(e){console.log(name+" 無法讀取："+String(e));return fallback;}
}
const [days,scenes,holidayMap,recurringMap,lunarMap]=await Promise.all([
  readJson("daily-365.json",[]),readJson("scenes.json",[]),
  readJson("holidays-2027.json",{}),readJson("festivals-recurring.json",{}),
  readJson("lunar-2027.json",{})
]);
let daily=days.length?days[((dayOfYear%365)+365)%365]:null;
if(!daily)daily={title:"今日漫畫載入中",punch:"請檢查 Scriptable/DailyComicFINAL 位置。",scene:1};
const special=holidayMap[key]||recurringMap[shortKey]||null;
let display=special?{title:special.title,punch:special.punch,scene:special.scene}:daily;
let label=special?special.name:"原創幹話",dayType=special?special.type:"";
if(!special&&days.length&&scenes.length){
  try{
    const req=new Request(CLOUD_URL+"?d="+key);
    req.timeoutInterval=4;
    const cloud=await req.loadJSON();
    const change=cloud&&cloud.date_overrides&&cloud.date_overrides[key];
    // 線上內容必須完整帶 scene 以對應漫畫，不讓雲端隨意更動圖文。
    if(change&&typeof change.title==="string"&&typeof change.punch==="string"
      &&change.title.length>0&&change.title.length<=24&&change.punch.length>0&&change.punch.length<=70
      &&Number.isInteger(change.scene)&&change.scene>=1&&change.scene<=60
      &&scenes.some(s=>Number(s.scene)===change.scene)){
      display={title:change.title,punch:change.punch,scene:change.scene};
      label="GitHub 原創新篇";
    }
  }catch(e){console.log("GitHub 暫時無法讀取，已使用本機原版。");}
}
let lunar="";
try{
  lunar=new Intl.DateTimeFormat("zh-TW-u-ca-chinese",{month:"long",day:"numeric"}).format(now);
  const lunarDays=["","初一","初二","初三","初四","初五","初六","初七","初八","初九","初十","十一","十二","十三","十四","十五","十六","十七","十八","十九","二十","廿一","廿二","廿三","廿四","廿五","廿六","廿七","廿八","廿九","三十"];
  lunar=lunar.replace(/(\d+)日/,(_,v)=>lunarDays[Number(v)]||v);
}catch(e){}
if(lunarMap[key])lunar=lunarMap[key];
const sceneId=Math.max(1,Math.min(60,Number(display.scene)||1));
const scene=scenes.find(s=>Number(s.scene)===sceneId);
const imageName=(special&&special.image)?special.image:
  (scene&&scene.image)?scene.image:"comics/scene-"+pad(sceneId).padStart(3,"0")+".jpg";
// 延續既有 FINAL 的 640 x 640 畫布、比例與文字位置。
const W=640,H=640,ctx=new DrawContext();
ctx.size=new Size(W,H);ctx.opaque=true;ctx.respectScreenScale=true;
const ink=new Color("#222020"),muted=new Color("#74716D"),
  ivory=new Color("#FAF7F0"),red=new Color("#AD3538");
ctx.setFillColor(ivory);ctx.fillRect(new Rect(0,0,W,H));
function txt(value,x,y,w,h,size=23,bold=true,color=ink,align="left"){
  ctx.setTextColor(color);
  ctx.setFont(bold?Font.boldSystemFont(size):Font.systemFont(size));
  if(align==="center")ctx.setTextAlignedCenter();
  else if(align==="right")ctx.setTextAlignedRight();
  else ctx.setTextAlignedLeft();
  ctx.drawTextInRect(String(value),new Rect(x,y,w,h));
}
function rule(x,y,width,color=red,thick=3){
  ctx.setFillColor(color);ctx.fillRect(new Rect(x,y,width,thick));
}
function badge(value,x,y,w=115){
  ctx.setFillColor(red);ctx.fillRect(new Rect(x,y,w,25));
  txt(value,x,y+2,w,22,15,true,Color.white(),"center");
}
const flip=sceneId%4===0;
if(flip){
  txt("每日發病",30,18,290,50,36);
  txt("DAILY COMIC · FINAL",32,70,305,24,14,false,muted);
  txt(mm+"月"+dd+"日",325,17,285,52,39,true,ink,"right");
  txt(week,325,69,285,25,19,true,muted,"right");
}else{
  txt(mm+"月"+dd+"日",29,17,300,52,39);
  txt(week,30,69,210,25,19,true,muted);
  txt("每日發病",325,18,285,50,36,true,ink,"right");
  txt("DAILY COMIC · FINAL",325,70,285,24,14,false,muted,"right");
}
if(lunar)txt(lunar,30,100,580,20,14,false,muted,"center");
rule(28,125,584,red,4);
const rect=new Rect(28,139,584,327);
let loaded=false;
try{
  const filename=fm.joinPath(root,imageName);
  if(fm.fileExists(filename)){
    if(fm===fmCloud&&fm.isFileStoredIniCloud(filename))await fm.downloadFileFromiCloud(filename);
    const im=fm.readImage(filename);
    const scale=Math.max(rect.width/im.size.width,rect.height/im.size.height);
    const iw=im.size.width*scale,ih=im.size.height*scale;
    ctx.drawImageInRect(im,new Rect(rect.x+(rect.width-iw)/2,rect.y+(rect.height-ih)/2,iw,ih));
    loaded=true;
  }
}catch(e){console.log("漫畫讀取失敗："+String(e));}
if(!loaded){
  ctx.setFillColor(new Color("#EAE2D8"));ctx.fillRect(rect);
  txt("漫畫素材尚未就定位",46,258,548,35,27,true,ink,"center");
  txt("請把 DailyComicFINAL 放在 Scriptable 資料夾",44,302,552,24,16,false,muted,"center");
}
rule(29,475,582,ink,2);
if(special){
  badge(dayType==="國定假日"?"國定假日":dayType,30,490,dayType==="國定假日"?100:92);
  txt(label,133,492,470,24,17,true,muted);
}
const headY=special?521:491;
txt(String(display.title||"今日幹話"),35,headY,570,40,28,true,ink,"center");
const punch=String(display.punch||"請勿催促，人生正在讀取中。");
let lines;
if(punch.length<=27)lines=[punch];
else{
  const split=punch.lastIndexOf("，",26)>=9?punch.lastIndexOf("，",26)+1:26;
  lines=[punch.slice(0,split),punch.slice(split)];
}
lines.forEach((line,i)=>txt(line,35,headY+41+i*26,570,25,18,true,new Color("#5F5953"),"center"));
rule(28,611,582,new Color("#DDD7CC"),1);
txt("每日發病 · "+(label.length>14?label.slice(0,14)+"…":label),30,617,385,18,13,false,muted);
txt(key.replace(/-/g,"."),432,617,180,18,13,false,muted,"right");
const widget=new ListWidget();widget.setPadding(0,0,0,0);
widget.backgroundImage=ctx.getImage();
// iOS 可能延後刷新，不能保證 00:12 即時更新。
widget.refreshAfterDate=new Date(yy,mm-1,dd+1,0,12);
if(config.runsInWidget)Script.setWidget(widget);
else await widget.presentLarge();
Script.complete();
