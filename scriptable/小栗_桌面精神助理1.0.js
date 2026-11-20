// Variables used by Scriptable.
// icon-color: orange; icon-glyph: comment-dots;
// 小栗 1.0 · 桌面精神助理（中型 Widget／本機聊天）
// 原創免 API 版：使用關鍵字與本機記憶回應，不是生成式 AI。
// 角色照片經相簿選取，僅儲存於 iPhone；不會上傳 GitHub。
const NAME = "小栗";
const REMOTE = "https://raw.githubusercontent.com/jaychou77714/daily-beast-widget/main/companion/public-lines.json";
const fm = FileManager.local();
const dir = fm.joinPath(fm.documentsDirectory(),"xiaoli-companion");
if (!fm.fileExists(dir)) fm.createDirectory(dir, true);
const memoryFile = fm.joinPath(dir,"memory-v1.json");
const avatarFile = fm.joinPath(dir,"xiaoli-avatar.png");
const remoteFile = fm.joinPath(dir,"public-cache.json");
const COLORS = {paper:"#FAF5ED",ink:"#302824",secondary:"#74665F",accent:"#C66F60",light:"#EFE3D8"};
const notificationIds = ["xiaoli-checkin-noon","xiaoli-checkin-evening"];
const fallbackLines = {
  morning:["早安～今天的你是戰鬥模式，還是省電模式？","起床了嗎？先喝點水，等一下再跟世界交手。","早上好！今天也別把自己排得滿滿的。"],
  afternoon:["下午還活著嗎？要不要偷偷休息三分鐘？","今天進度如何？我可以陪你吐槽，不收修改費。","工作還順利嗎？不要連水都忘記喝。"],
  evening:["你今天過得怎樣？有好玩的說來聽聽。","下班了嗎？今天最荒謬的一件事是什麼？","晚上好。今天辛苦的地方，可以跟我講。"],
  night:["夜貓子，怎麼還醒著？又在刷寶嗎？","深夜到了，靈魂也需要存檔喔。","還沒睡喔？今天想聊天還是想放空？"]
};
function pad(n){return String(n).padStart(2,"0");}
function dateKey(d){return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());}
function currentPeriod(h){
  if(h>=5&&h<11)return "morning";
  if(h>=11&&h<18)return "afternoon";
  if(h>=18&&h<23)return "evening";
  return "night";
}
function seedIndex(salt,len){
  let s=0;const str=dateKey(new Date())+"|"+salt;
  for(let i=0;i<str.length;i++)s=(Math.imul(s,31)+str.charCodeAt(i))>>>0;
  return s%len;
}
function choose(arr,salt){
  if(!Array.isArray(arr)||!arr.length)return "";
  return String(arr[seedIndex(salt,arr.length)]);
}
function blankState(){
 return {version:1,createdAt:new Date().toISOString(),messages:[],lastTopic:null,lastReply:"",reminders:false,avatarReady:false,checkinSeen:""};
}
function readState(){
  try{
    if(fm.fileExists(memoryFile)){
      const obj=JSON.parse(fm.readString(memoryFile));
      if(obj&&obj.version===1&&Array.isArray(obj.messages))return obj;
    }
  }catch(e){console.log("小栗記憶讀取失敗："+String(e));}
  return blankState();
}
function saveState(s){
  s.messages=s.messages.slice(-60);
  fm.writeString(memoryFile,JSON.stringify(s,null,2));
}
async function publicLines(){
  let old={};
  try{if(fm.fileExists(remoteFile))old=JSON.parse(fm.readString(remoteFile));}catch(e){}
  const key=dateKey(new Date());
  if(old.checked===key&&old.lines)return old.lines;
  try{
    const req=new Request(REMOTE+"?d="+key);req.timeoutInterval=3;
    const obj=await req.loadJSON();
    if(obj&&obj.version===1&&obj.lines&&obj.lines.morning&&obj.lines.night){
      fm.writeString(remoteFile,JSON.stringify({checked:key,lines:obj.lines}));
      return obj.lines;
    }
  }catch(e){/* 離線時使用原創內建文案 */}
  return old.lines||fallbackLines;
}
function backgroundQuestion(s,lines){
  const now=new Date(), period=currentPeriod(now.getHours());
  if(s.lastTopic && s.lastTopic.date!==dateKey(now)
     && s.lastTopic.date>=dateKey(new Date(now.getFullYear(),now.getMonth(),now.getDate()-4))){
    const last=s.lastTopic.label;
    if(last==="工作")return "欸，上次你提到工作有點煩，後來順利了嗎？";
    if(last==="遊戲")return "你上次玩的遊戲，後來有出好東西嗎？";
    if(last==="睡眠")return "上次說有點累，今天有好好休息嗎？";
    if(last==="心情")return "你前幾天心情不太好，今天有好一點嗎？";
    if(last==="家人")return "上次你提到家裡的事，後來還順利嗎？";
  }
  return choose(lines[period]||fallbackLines[period],period);
}
function topicFor(message){
  if(/不想活|自傷|傷害自己|自殺/.test(message))return "危機";
  if(/累|睡|困|想休息|疲倦|熬夜/.test(message))return "睡眠";
  if(/心情|難過|煩|焦慮|不開心|孤單|壓力|低落|憂鬱/.test(message))return "心情";
  if(/工作|客戶|設計|改圖|工地|主管|上班|加班|開會|進度/.test(message))return "工作";
  if(/遊戲|刷寶|打王|電動|裝備|副本|steam|暗黑|掉寶/.test(message.toLowerCase()))return "遊戲";
  if(/老婆|太太|家人|小孩|兒子|家庭|孩子/.test(message))return "家人";
  if(/好事|好消息|開心|成功|太爽|賺到|中了|過關/.test(message))return "喜事";
  return "閒聊";
}
function replyFor(message,s){
 const topic=topicFor(message), n=s.messages.filter(x=>x.role==="user").length;
 const pick=a=>a[(Math.max(0,n-1))%a.length];
 let response="";
 if(topic==="危機"){
  response="我有聽到你說現在很難受。若你可能傷害自己，請先聯絡身邊可信任的人，並立即尋求當地緊急協助。你願意先告訴我，現在是否安全嗎？";
 }else if(topic==="工作"){
  response=pick([
   "蛤，又是工作副本？先讓我替你的滑鼠默哀三秒。你想吐槽，還是一起整理下一步？",
   "今天的改稿魔王又出現了喔。你最想先解決哪一件事？",
   "有些事真的不是多努力就能馬上解決。先說說最煩的是哪個部分？"
  ]);
 }else if(topic==="遊戲"){
  response=pick([
   "喔？你提到遊戲我就醒了！今天是出神裝，還是被保底教育？",
   "等等，這個我有興趣。你現在在刷什麼副本？",
   "遊戲的王可以重打，睡眠可別全拿去獻祭欸。今天玩得開心嗎？"
  ]);
 }else if(topic==="睡眠"){
  response=pick([
   "你今天的電量感覺剩 9% 了。先喝口水，能休息的話休息一下，好嗎？",
   "欸，累就不用硬把自己調成高效能模式。今天最消耗你的事是什麼？",
   "這種狀況我只准你先對自己好一點。想跟我抱怨一下嗎？"
  ]);
 }else if(topic==="心情"){
  response=pick([
   "嗯，我在聽。現在不用把自己整理得很完美，你想慢慢說也可以。",
   "今天不好過喔。要我陪你吐槽，還是一起想個小辦法？",
   "先讓世界小聲一點。你想跟我講發生什麼事嗎？"
  ]);
 }else if(topic==="家人"){
  response=pick([
   "家庭副本常常沒有暫停鍵欸。是發生好玩的事，還是又要你出任務？",
   "聽起來今天家裡也很熱鬧。你想說說後續嗎？",
   "嗯，家裡的事有時比上班還難解。現在需要幫忙想辦法嗎？"
  ]);
 }else if(topic==="喜事"){
  response=pick([
   "哇，這個要記進今天的成就欄！快說細節。",
   "今天是你的人生 SSR 日嗎？我先幫你放煙火啦。",
   "嘿嘿，我就喜歡聽你講好消息。再多說一點！"
  ]);
 }else if(/早安|午安|晚安|你好|嗨|哈囉/.test(message)){
  response=pick(["嘿，你來啦！今天的精神狀態如何？","在！我的工作就是等你來吐槽人生。","有，我在。今天想聊點什麼？"]);
 }else if(/謝謝|感謝/.test(message)){
  response="小事啦。你有想到什麼，隨時都可以再來聊。";
 }else{
  const excerpt=message.replace(/\s+/g," ").slice(0,22);
  response=pick([
   "我有收到你說的「"+excerpt+"」。想多講一點嗎？",
   "嗯嗯，我聽著。這件事對你來說最重要的是哪個部分？",
   "欸，這個值得展開聊。你是想聽吐槽版，還是認真版？"
  ]);
 }
 if(["工作","遊戲","睡眠","心情","家人"].includes(topic))s.lastTopic={label:topic,date:dateKey(new Date())};
 return response;
}
async function showAlert(title,message,buttons){
 const a=new Alert();a.title=title;a.message=message;
 buttons.forEach(x=>a.addAction(x));a.addCancelAction("返回");
 return a.presentSheet();
}
async function notify(title,body){
 const a=new Alert();a.title=title;a.message=body;a.addAction("好");await a.presentAlert();
}
async function importPortrait(s){
  const a=new Alert();
  a.title="設定小栗照片";
  a.message="選擇你提供的女生圖片；只會複製到本機，不上傳 GitHub。系統會裁切成臉部方形頭像。";
  a.addAction("從相簿選取");a.addCancelAction("暫不設定");
  if(await a.presentAlert()!==0)return;
  try{
   const im=await Photos.fromLibrary();
   const w=im.size.width,h=im.size.height;
   const side=Math.min(w,h);
   const x=(w-side)/2;
   let y=(h-side)/2;
   if(h/w>1.65)y=Math.min(h-side,h*0.32);
   const D=360,scale=D/side;
   const ctx=new DrawContext();ctx.size=new Size(D,D);ctx.opaque=true;
   ctx.setFillColor(new Color(COLORS.paper));ctx.fillRect(new Rect(0,0,D,D));
   ctx.drawImageInRect(im,new Rect(-x*scale,-y*scale,w*scale,h*scale));
   fm.writeImage(avatarFile,ctx.getImage());
   s.avatarReady=true;saveState(s);
   await notify("頭像設定成功","小栗已在桌面等你。Widget 更新可能稍有延遲。");
  }catch(e){await notify("尚未設定照片","相簿沒有完成選取，原有資料不受影響。");}
}
async function configureReminders(s){
 const choice=await showAlert("小栗會主動關心你","開啟後，小栗每天約 12:30、20:30 各發一則本機通知。\n你可以隨時在這裡關閉。iOS 的通知設定仍可能影響送達。",["開啟每日兩次問候","關閉所有小栗問候"]);
 if(choice<0)return;
 if(choice===0){
  try{
   for(const [i,h,m,body] of [[0,12,30,"吃午餐了嗎？今天工作還好嗎？"],[1,20,30,"晚上好～你在幹嘛？今天有什麼好玩的？"]]){
    const no=new Notification();no.identifier=notificationIds[i];
    no.title="小栗來找你了 ♡";no.body=body;no.sound="default";
    no.threadIdentifier="xiaoli-companion";
    no.openURL=URLScheme.forRunningScript();
    no.setDailyTrigger(h,m,true);await no.schedule();
   }
   s.reminders=true;saveState(s);
   await notify("已開啟","每天兩次，別擔心，她不會像主管每五分鐘催一次。");
  }catch(e){await notify("通知設定未完成","請檢查 iPhone 的 Scriptable 通知權限。"+String(e));}
 }else{
  try{await Notification.removePending(notificationIds);}catch(e){}
  s.reminders=false;saveState(s);
  await notify("已關閉","不會再安排小栗的主動問候通知。");
 }
}
async function clearHistory(s){
 const a=new Alert();a.title="清除小栗的本機記憶";
 a.message="會刪除聊天紀錄與已記住的話題；照片和提醒設定保留。此動作無法復原。";
 a.addDestructiveAction("清除聊天記憶");a.addCancelAction("取消");
 if(await a.presentAlert()!==0)return;
 s.messages=[];s.lastTopic=null;s.lastReply="";saveState(s);
 await notify("已清除聊天紀錄","小栗會從新的對話重新開始認識你。");
}
async function chat(s){
 for(let i=0;i<30;i++){
   const recent=s.messages.slice(-4).map(x=>(x.role==="user"?"你：":"小栗：")+x.text).join("\n");
   const a=new Alert();a.title="小栗 ♡ 跟我說話";
   a.message=(recent||"欸，你來啦！今天想說些什麼？").slice(-700);
   a.addTextField("輸入想跟小栗說的話…","");
   a.addAction("傳送");a.addCancelAction("先聊到這裡");
   if(await a.presentAlert()!==0)return;
   const message=String(a.textFieldValue(0)||"").trim().slice(0,350);
   if(!message)continue;
   s.messages.push({role:"user",text:message,date:dateKey(new Date())});
   const response=replyFor(message,s);
   s.messages.push({role:"assistant",text:response,date:dateKey(new Date())});
   s.lastReply=response;saveState(s);
   const b=new Alert();b.title="小栗 ♡";b.message=response;
   b.addAction("繼續聊");b.addCancelAction("結束聊天");
   if(await b.presentAlert()!==0)return;
 }
 await notify("今天先到這裡","已經聊了不少了，下次見。");
}
function addText(stack,s,size,color,bold){
 const t=stack.addText(String(s));t.font=bold?Font.boldSystemFont(size):Font.systemFont(size);
 t.textColor=new Color(color);return t;
}
async function buildWidget(s,lines){
 const now=new Date(),greet=backgroundQuestion(s,lines),w=new ListWidget();
 w.backgroundColor=new Color(COLORS.paper);w.setPadding(12,13,11,13);
 w.url=URLScheme.forRunningScript();
 const top=w.addStack();top.layoutHorizontally();top.centerAlignContent();
 addText(top,"小栗 · 精神助理",15,COLORS.ink,true);
 top.addSpacer();addText(top,pad(now.getMonth()+1)+"."+pad(now.getDate()),11,COLORS.secondary,true);
 w.addSpacer(5);
 const strip=w.addStack();strip.backgroundColor=new Color(COLORS.accent);strip.size=new Size(0,2);strip.addSpacer();
 w.addSpacer(7);
 const body=w.addStack();body.layoutHorizontally();body.centerAlignContent();
 const left=body.addStack();left.layoutVertically();left.size=new Size(187,87);
 const bodyText=addText(left,greet,12,COLORS.ink,true);bodyText.lineLimit=4;bodyText.minimumScaleFactor=0.73;
 left.addSpacer();
 const prompt=addText(left,"點這裡跟我說話 ♡",10,COLORS.accent,true);prompt.lineLimit=1;
 body.addSpacer(7);
 const right=body.addStack();right.size=new Size(88,91);right.centerAlignContent();
 if(fm.fileExists(avatarFile)){
   try{
    const face=right.addImage(fm.readImage(avatarFile));face.imageSize=new Size(86,86);face.cornerRadius=15;
   }catch(e){addText(right,"小栗\n♡",18,COLORS.accent,true);}
 }else{
   const p=addText(right,"小栗\n♡",18,COLORS.accent,true);p.centerAlignText();
 }
 w.addSpacer(4);
 const footer=w.addStack();footer.layoutHorizontally();footer.centerAlignContent();
 addText(footer,"你的生活吐槽搭檔",9,COLORS.secondary,false);footer.addSpacer();
 addText(footer,s.reminders?"問候已開啟 ●":"有空來找我 ◌",9,COLORS.accent,true);
 w.refreshAfterDate=new Date(now.getTime()+2*60*60*1000);
 return w;
}
async function menu(s,lines){
 for(let i=0;i<30;i++){
  const last=s.messages.length?s.messages[s.messages.length-1].text:"嗨～今天想聊什麼？";
  const select=await showAlert("小栗 · 精神助理","「"+last.slice(0,90)+"」\n\n這是免付費 API 的聊天版；能記住你在這支手機聊過的話題，但不是 ChatGPT。",[
   "打字跟小栗聊天","選小栗的照片","主動關心通知："+(s.reminders?"已開":"關閉"),"看看最近聊什麼","清除聊天記憶","預覽橫向 Widget"
  ]);
  if(select<0)return;
  if(select===0)await chat(s);
  if(select===1)await importPortrait(s);
  if(select===2)await configureReminders(s);
  if(select===3){
    const history=s.messages.slice(-12).map(x=>(x.role==="user"?"你：":"小栗：")+x.text).join("\n\n");
    await notify("最近的聊天紀錄",history||"還沒聊過呢。先說聲嗨吧！");
  }
  if(select===4)await clearHistory(s);
  if(select===5)await(await buildWidget(s,lines)).presentMedium();
 }
}
const state=readState();
const lines=await publicLines();
if(config.runsInWidget){Script.setWidget(await buildWidget(state,lines));}
else{await menu(state,lines);}
Script.complete();
