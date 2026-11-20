// Variables used by Scriptable.
// icon-color: red; icon-glyph: paw;
// 爆肝獸 4.0 · 場外生存日誌（中型 Widget + 點擊養成）
// 不覆寫「鄉民今日發病3」；舊版可當還原備份。
// 個人存檔只在 iPhone 本機，不上傳到公開 GitHub。
const ROOT = "https://raw.githubusercontent.com/jaychou77714/daily-beast-widget/main/";
const SCRIPT_REPO = "jaychou77714/daily-beast-widget";
const COLORS = {paper:"#F8F4EC",ink:"#282523",muted:"#776B64",red:"#B74138",line:"#DED6CD",pale:"#EFE7DB"};
const MASCOT_PATH = "爆肝獸";
const LOOKS = {worker:"beast-deadline.png",gamer:"beast-gamer.png",broke:"beast-broke.png",sloth:"beast-coffee.png"};
const PATHS = ["worker","gamer","broke","sloth"];
const PATH_NAMES = {worker:"社畜",gamer:"宅獸",broke:"窮鬼",sloth:"擺爛"};
const EVOLUTIONS = {
  worker:["爆肝幼獸","爆肝主任","地獄總監"],
  gamer:["爆肝幼獸","熬夜勇者","暗黑遊戲魔王"],
  broke:["爆肝幼獸","泡麵戰士","負債財神"],
  sloth:["爆肝幼獸","沙發寄生獸","究極躺平神"]
};
const FBACK = {
 version:1,
 events:[
  {id:"base1",category:"worker",title:"最後一改傳說",story:"客戶說只是小改，結果又來了十八張參考圖。",options:[{text:"保持專業繼續努力",path:"worker",xp:20,coins:18,energy:-9,rage:10,reply:"獲得專業假笑技能。"},{text:"先喝一杯咖啡",path:"sloth",xp:15,coins:19,energy:10,rage:-7,reply:"這次咖啡有拯救一點世界。"}]},
  {id:"base2",category:"gamer",title:"傳說裝備掉落",story:"你面前出現閃閃發光的寶物，背包卻滿了。",options:[{text:"馬上整理背包",path:"gamer",xp:23,coins:20,energy:-7,rage:5,reply:"冒險永不停止。"},{text:"先休息再決定",path:"sloth",xp:15,coins:18,energy:10,rage:-5,reply:"休息也是一件戰利品。"}]},
  {id:"base3",category:"broke",title:"月底金融風暴",story:"銀行餘額薄得像一張透明的紙。",options:[{text:"記帳守住零用錢",path:"broke",xp:22,coins:25,energy:-6,rage:5,reply:"荷包防禦力提升了。"},{text:"煮泡麵犒賞自己",path:"sloth",xp:16,coins:18,energy:10,rage:-5,reply:"泡麵才是生活的溫柔。"}]},
  {id:"base4",category:"sloth",title:"床墊召喚術",story:"假日早晨，床墊決定把你吸回去。",options:[{text:"批准自己放鬆",path:"sloth",xp:20,coins:17,energy:16,rage:-8,reply:"身心終於連上 Wi-Fi。"},{text:"先完成一件工作",path:"worker",xp:24,coins:20,energy:-7,rage:6,reply:"待辦少一格，勇氣多一分。"}]},
  {id:"base5",category:"worker",title:"星期一王再臨",story:"星期一像 Boss 一樣站在門口，還帶了會議通知。",options:[{text:"扛著鍵盤迎擊",path:"worker",xp:22,coins:21,energy:-10,rage:9,reply:"獲得上班求生勳章。"},{text:"穿上拖鞋戰術後撤",path:"sloth",xp:16,coins:19,energy:10,rage:-6,reply:"拖鞋是最忠實的隊友。"}]},
  {id:"base6",category:"gamer",title:"只打最後一場",story:"凌晨兩點，遊戲問你要不要再來一場。",options:[{text:"再戰一次",path:"gamer",xp:22,coins:19,energy:-12,rage:7,reply:"關卡通過，生理時鐘戰敗。"},{text:"果斷關機",path:"sloth",xp:16,coins:20,energy:13,rage:-8,reply:"你擊敗了真正的最後 Boss。"}]},
  {id:"base7",category:"broke",title:"購物車的誘惑",story:"特價倒數十分鐘，購物車誘惑你把夢想結帳。",options:[{text:"不買就是賺到",path:"broke",xp:21,coins:28,energy:-5,rage:3,reply:"解鎖錢包結界。"},{text:"先把購物車當博物館",path:"sloth",xp:16,coins:18,energy:9,rage:-6,reply:"免費參觀也很快樂。"}]},
  {id:"base8",category:"sloth",title:"假日的和平",story:"太陽很好，事情很多，爆肝獸只想躺。",options:[{text:"慢慢享受陽光",path:"sloth",xp:20,coins:18,energy:15,rage:-9,reply:"今天也可以不那麼用力。"},{text:"玩一小時遊戲",path:"gamer",xp:22,coins:18,energy:2,rage:-7,reply:"快樂副本已開啟。"}]}
 ],
 cards:[
  {id:"bc1",rarity:"N",name:"白開水治癒術",description:"先喝水，世界等一下再說。",xp:9,coins:10,energy:12,rage:-6},
  {id:"bc2",rarity:"N",name:"半杯咖啡",description:"至少能量條亮起一格。",xp:10,coins:13,energy:8,rage:-3},
  {id:"bc3",rarity:"N",name:"破洞的襪子",description:"普通人生，也能有不普通的勇氣。",xp:10,coins:12,energy:3,rage:0},
  {id:"bc4",rarity:"N",name:"野生泡麵",description:"獲得一點溫暖與湯頭。",xp:10,coins:11,energy:9,rage:-3},
  {id:"bc5",rarity:"R",name:"準時下班券",description:"都市傳說級的自由空氣。",xp:22,coins:34,energy:15,rage:-10},
  {id:"bc6",rarity:"R",name:"史詩級休息日",description:"世界今天願意讓你安靜一點。",xp:21,coins:37,energy:14,rage:-12},
  {id:"bc7",rarity:"SSR",name:"傳說帶薪躺平",description:"SSR：時間為你暫停兩分鐘。",xp:55,coins:95,energy:25,rage:-23},
  {id:"bc8",rarity:"SSR",name:"財神附體但忘記帶錢",description:"財神至少給了你獸幣。",xp:50,coins:100,energy:20,rage:-21}
 ]
};
const fm=FileManager.local();
const home=fm.documentsDirectory();
const savePath=fm.joinPath(home,"beast4-save.json");
const backupPath=fm.joinPath(home,"beast4-save-backup.json");
const cachePath=fm.joinPath(home,"beast4-world-cache.json");
function pad(n){return String(n).padStart(2,"0");}
function todayKey(d){return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());}
function dayNumber(k){return Math.floor(Date.parse(k+"T00:00:00Z")/86400000);}
function between(v,min,max){return Math.max(min,Math.min(max,Number(v)||0));}
function defaultState(){return {schema:1,createdAt:new Date().toISOString(),xp:0,coins:40,energy:75,rage:20,affinity:{worker:0,gamer:0,broke:0,sloth:0},events:{},draws:{},activeDays:{},badges:[],lastCalmDate:null,seed:Math.floor(Math.random()*1000000000),lastSaved:""};}
function validState(s){return s&&s.schema===1&&Number.isFinite(s.xp)&&s.affinity&&s.events&&s.draws&&s.activeDays;}
function loadState(){
 for(const p of [savePath,backupPath]){
  try{if(fm.fileExists(p)){const x=JSON.parse(fm.readString(p));if(validState(x))return x;}}catch(e){console.log("存檔讀取失敗："+String(e));}
 }
 return defaultState();
}
function saveState(s){
 s.xp=Math.max(0,Math.floor(s.xp));s.coins=Math.max(0,Math.floor(s.coins));
 s.energy=between(s.energy,0,100);s.rage=between(s.rage,0,100);
 s.lastSaved=new Date().toISOString();
 try{
   if(fm.fileExists(savePath)){
     if(fm.fileExists(backupPath))fm.remove(backupPath);
     fm.copy(savePath,backupPath);
   }
   fm.writeString(savePath,JSON.stringify(s));
   return true;
 }catch(e){console.log("存檔失敗："+String(e));return false;}
}
function level(s){return 1+Math.floor(s.xp/65);}
function stage(s){return level(s)>=10?2:level(s)>=5?1:0;}
function route(s){
 let name="sloth",max=-1;
 for(const p of PATHS){const n=Number(s.affinity[p])||0;if(n>max){max=n;name=p;}}
 return max<=0?"sloth":name;
}
function form(s){const p=route(s);return stage(s)===0?"爆肝幼獸":EVOLUTIONS[p][stage(s)];}
function makeup(s,mods){
 s.xp=Math.max(0,s.xp+(Number(mods.xp)||0));
 s.coins=Math.max(0,s.coins+(Number(mods.coins)||0));
 s.energy=between(s.energy+(Number(mods.energy)||0),0,100);
 s.rage=between(s.rage+(Number(mods.rage)||0),0,100);
}
function markDay(s,k){s.activeDays[k]=true;const arr=Object.keys(s.activeDays).sort();if(arr.length>180)for(const q of arr.slice(0,-180))delete s.activeDays[q];}
function awardBadges(s){
 const found=new Set(s.badges||[]), n=Object.keys(s.activeDays||{}).length;
 if(Object.keys(s.events).length)found.add("首次出征");
 if(Object.keys(s.draws).length)found.add("初次召喚");
 if(n>=3)found.add("三日求生者");
 if(level(s)>=5)found.add("進化成功");
 if(level(s)>=10)found.add("終極爆肝");
 if(s.coins>=400)found.add("獸幣大戶");
 for(const p of PATHS)if((s.affinity[p]||0)>=6)found.add(PATH_NAMES[p]+"之魂");
 if(Object.values(s.draws).some(x=>x.rarity==="SSR"))found.add("歐皇降臨");
 s.badges=Array.from(found);
}
function saneWorld(obj){return obj&&Array.isArray(obj.events)&&obj.events.length>=8&&Array.isArray(obj.cards)&&obj.cards.length>=8&&obj.events.every(e=>e.id&&e.story&&Array.isArray(e.options)&&e.options.length===2)&&obj.cards.every(c=>c.id&&["N","R","SSR"].includes(c.rarity));}
async function getJson(url){const r=new Request(url);r.timeoutInterval=5;return await r.loadJSON();}
async function loadWorld(k){
 let cache={};try{if(fm.fileExists(cachePath))cache=JSON.parse(fm.readString(cachePath));}catch(e){}
 let data=saneWorld(cache.data)?cache.data:FBACK, daily=cache.daily;
 if(cache.checked!==k||!saneWorld(cache.data)){
   try{
     const json=await getJson(ROOT+"game/game-data.json");
     if(saneWorld(json))data=json;
   }catch(e){console.log("雲端故事庫離線備援");}
   try{const obj=await getJson(ROOT+"game/today.json?date="+k);if(obj&&obj.date===k)daily=obj;else daily=null;}catch(e){daily=null;}
   try{fm.writeString(cachePath,JSON.stringify({checked:k,data,daily}));}catch(e){}
 }
 if(!daily||daily.date!==k)daily=null;
 return {data,daily};
}
function eventFor(world,k){
 const events=world.data.events, forced=world.daily?events.find(e=>e.id===world.daily.event_id):null;
 if(forced)return forced;
 return events[(dayNumber(k)*31+11)%events.length];
}
function drawCard(world){
 const roll=Math.random();const rarity=roll<0.05?"SSR":roll<0.25?"R":"N";
 const pool=world.data.cards.filter(c=>c.rarity===rarity);
 return pool[Math.floor(Math.random()*pool.length)]||world.data.cards[0];
}
function t(st,s,size,color,bold){const v=st.addText(String(s));v.font=bold?Font.boldSystemFont(size):Font.systemFont(size);v.textColor=new Color(color);return v;}
async function loadBeast(name){
 for(const manager of [FileManager.iCloud(),FileManager.local()]){
   const p=manager.joinPath(manager.joinPath(manager.documentsDirectory(),MASCOT_PATH),name);
   if(!manager.fileExists(p))continue;
   try{
     if(manager.isFileDownloaded&&!manager.isFileDownloaded(p))await manager.downloadFileFromiCloud(p);
     return manager.readImage(p);
   }catch(e){}
 }
 return null;
}
async function buildWidget(s,wdata,k){
 const w=new ListWidget();w.backgroundColor=new Color(COLORS.paper);w.setPadding(11,13,10,13);
 w.url=URLScheme.forRunningScript();
 const top=w.addStack();top.layoutHorizontally();top.centerAlignContent();
 t(top,"爆肝獸養成日誌",14,COLORS.ink,true);top.addSpacer();t(top,"LV "+level(s),12,COLORS.red,true);
 w.addSpacer(4);
 const bar=w.addStack();bar.backgroundColor=new Color(COLORS.line);bar.size=new Size(270,4);
 const fill=bar.addStack();fill.backgroundColor=new Color(COLORS.red);fill.size=new Size(270*((s.xp%65)/65),4);
 bar.addSpacer();w.addSpacer(5);
 const body=w.addStack();body.layoutHorizontally();body.centerAlignContent();
 const left=body.addStack();left.layoutVertically();left.size=new Size(178,86);
 const name=t(left,form(s),15,COLORS.ink,true);name.lineLimit=1;name.minimumScaleFactor=0.74;
 left.addSpacer(3);
 const msg=s.events[k]?"今日事件已通關 · "+s.events[k].reply:"今日事件："+eventFor(wdata,k).title;
 const caption=t(left,msg,11,COLORS.muted,false);caption.lineLimit=3;caption.minimumScaleFactor=0.7;
 left.addSpacer();
 const stat=t(left,"獸幣 "+s.coins+"   活力 "+s.energy+"   怨念 "+s.rage,9,COLORS.muted,false);stat.lineLimit=1;stat.minimumScaleFactor=0.76;
 body.addSpacer(3);
 const right=body.addStack();right.size=new Size(96,88);right.centerAlignContent();
 const img=await loadBeast(LOOKS[route(s)]||LOOKS.sloth);
 if(img){const pic=right.addImage(img);pic.imageSize=new Size(91,87);pic.centerAlignImage();}
 else {const none=t(right,"爆肝獸\n圖片未找到",9,COLORS.muted,false);none.centerAlignText();}
 w.addSpacer(3);
 const footer=w.addStack();footer.layoutHorizontally();footer.centerAlignContent();
 t(footer,(s.events[k]?"事件 ✓":"事件 ◯")+"  "+(s.draws[k]?"抽卡 ✓":"抽卡 ◯"),10,COLORS.ink,true);
 footer.addSpacer();t(footer,"點我養成 ›",10,COLORS.red,true);
 const next=new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()+1,0,45);
 const threeHours=new Date(Date.now()+3*3600000);
 w.refreshAfterDate=threeHours<next?threeHours:next;
 return w;
}
async function pick(title,message,buttons,cancel="返回"){
 const a=new Alert();a.title=title;a.message=message;
 for(const x of buttons)a.addAction(x);
 a.addCancelAction(cancel);
 return await a.presentSheet();
}
async function notice(title,message){const a=new Alert();a.title=title;a.message=message;a.addAction("知道了");await a.presentAlert();}
async function dailyEvent(s,world,k){
 if(s.events[k]){await notice("今天已經闖關成功",s.events[k].reply+"\n\n每天只有一個事件，不用一直打卡。");return;}
 const event=eventFor(world,k), n=await pick(event.title,event.story,event.options.map(x=>x.text));
 if(n<0)return;
 const opt=event.options[n], before=level(s);
 makeup(s,opt);s.affinity[opt.path]=(s.affinity[opt.path]||0)+2;
 s.events[k]={eventId:event.id,choice:n,path:opt.path,reply:opt.reply};markDay(s,k);
 awardBadges(s);
 if(!saveState(s)){await notice("儲存失敗","這次選擇未能安全保存，請檢查 Scriptable 儲存空間。");return;}
 let msg=opt.reply+"\n\n經驗 +"+opt.xp+"｜獸幣 +"+opt.coins+"\n"+PATH_NAMES[opt.path]+"傾向 +2";
 if(level(s)>before)msg+="\n\n★ 升到 LV "+level(s)+"！";
 if(stage(s)>0)msg+="\n進化型態："+form(s);
 await notice("今日事件結算",msg);
}
async function cardDraw(s,world,k){
 if(s.draws[k]){const prev=s.draws[k];await notice("今日已抽過卡",prev.rarity+"｜"+prev.name+"\n每天免費抽一次，明天再來。 ");return;}
 const i=await pick("每日人生卡","每天免費一抽，機率：N 75%｜R 20%｜SSR 5%。\n不花錢，也沒有額外購買。",["抽一張卡"]);
 if(i!==0)return;
 const card=drawCard(world),before=level(s);
 makeup(s,card);s.draws[k]={id:card.id,rarity:card.rarity,name:card.name};markDay(s,k);awardBadges(s);
 if(!saveState(s)){await notice("儲存失敗","抽卡結果未能安全保存，請檢查儲存空間。");return;}
 await notice((card.rarity==="SSR"?"★ SSR ★ ":card.rarity+" ")+card.name,card.description+"\n\n經驗 +"+card.xp+"｜獸幣 +"+card.coins+(level(s)>before?"\n升到 LV "+level(s)+"！":""));
}
async function profile(s){
 const routeValue=route(s),progress=s.xp%65;
 const affin=PATHS.map(p=>PATH_NAMES[p]+" "+(s.affinity[p]||0)).join("｜");
 await notice("爆肝獸角色卡","LV "+level(s)+"　"+form(s)+"\nEXP "+progress+" / 65\n獸幣 "+s.coins+"　活力 "+s.energy+"　怨念 "+s.rage+"\n目前路線："+PATH_NAMES[routeValue]+"\n\n四大進化傾向\n"+affin+"\n\n已遊玩 "+Object.keys(s.activeDays).length+" 天。\n選擇累積到 LV 5、LV 10 會進化；沒有寵物死亡或強制打卡。");
}
async function badges(s){
 await notice("爆肝獸成就圖鑑",(s.badges.length?s.badges.map((b,i)=>(i+1)+". "+b).join("\n"):"還沒有成就。先進行第一個事件或抽一張卡！")+"\n\n成就只記錄在這支 iPhone 裡。");
}
async function menu(s,world,k){
 for(let i=0;i<24;i++){
  const msg="LV "+level(s)+" · "+form(s)+"\n獸幣 "+s.coins+"｜活力 "+s.energy+"｜怨念 "+s.rage+"\n\n"+
    (s.events[k]?"✓ 今天已完成事件":"◯ 今日事件還沒選")+"　"+(s.draws[k]?"✓ 今日已抽卡":"◯ 今日免費抽卡待領")+"\n\n不逼你打卡，休息也算一種超能力。";
  const c=await pick("爆肝獸：場外生存日誌",msg,["每日事件（二選一）","抽一張人生卡","角色卡與進化","成就圖鑑","預覽桌面小工具"],"離開遊戲");
  if(c<0)return;
  if(c===0)await dailyEvent(s,world,k);
  if(c===1)await cardDraw(s,world,k);
  if(c===2)await profile(s);
  if(c===3)await badges(s);
  if(c===4){const w=await buildWidget(s,world,k);await w.presentMedium();}
 }
}
const today=new Date(), key=todayKey(today);
const state=loadState();
const world=await loadWorld(key);
if(config.runsInWidget){
 Script.setWidget(await buildWidget(state,world,key));
}else{
 await menu(state,world,key);
}
Script.complete();
