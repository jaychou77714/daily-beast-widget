(function dailyComicApp(){
"use strict";
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
const STORE="daily-comic:web:favorites:v1";
const moodConfig=[
 {id:"explode",label:"快爆炸",face:"🤯",note:"今天要炸就炸一下。漫畫先替你承擔三秒鐘。"},
 {id:"drained",label:"沒電了",face:"🪫",note:"電量不足也不是你的錯。這裡允許進入省電模式。"},
 {id:"sloth",label:"想耍廢",face:"🫠",note:"恭喜獲准暫時不當有效率的大人。"},
 {id:"snark",label:"欠吐槽",face:"😈",note:"想嘴砲就來吧，這裡不會傳給主管。"},
 {id:"okay",label:"今天還行",face:"😎",note:"很好，快把這份難得的順利享受一下。"}
];
const categoryLabels={all:"全部",work:"社畜／設計師",money:"月底錢包",game:"遊戲刷寶",life:"生活家庭",rest:"耍廢療癒",favorites:"我的最愛"};
const stage={comics:[],quips:[],favorites:new Set(),mood:"explode",current:null,filter:"all",query:"",tone:"roast",shown:[],dialog:null};
function readFav(){try{const saved=JSON.parse(localStorage.getItem(STORE)||"[]");return new Set(Array.isArray(saved)?saved:[])}catch(_){return new Set()}}
function writeFav(){try{localStorage.setItem(STORE,JSON.stringify([...stage.favorites]))}catch(_){}}
function esc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}
function xml(s){return esc(s)}
function randomInt(n){if(n<1)return 0;try{const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]%n}catch(_){return Math.floor(Math.random()*n)}}
function choice(a){return a.length?a[randomInt(a.length)]:null}
function short(s,n){const t=String(s||"");return t.length>n?t.slice(0,n)+"…":t}
let toastTimer=null;
function toast(msg){const e=$("#toast");e.textContent=msg;e.classList.add("visible");clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.classList.remove("visible"),2700)}
function svgProp(scene,x){
const y=295;
if(["desk","meeting"].includes(scene))return `<path d="M${x+5} 492 h375" stroke="#231f1f" stroke-width="13"/><rect x="${x+42}" y="${y+74}" width="173" height="115" rx="12" fill="#ded9d1" stroke="#272323" stroke-width="8"/><path d="M${x+64} ${y+104} h123 M${x+64} ${y+133} h98" stroke="#a7a19d" stroke-width="6"/><rect x="${x+246}" y="${y+44}" width="93" height="147" rx="5" fill="#fffdf6" stroke="#231f1f" stroke-width="8"/><path d="M${x+257} ${y+84} h66 M${x+257} ${y+118} h66 M${x+257} ${y+153} h66" stroke="#ba4546" stroke-width="6"/>`;
if(scene==="game")return `<ellipse cx="${x+185}" cy="${y+168}" rx="165" ry="30" fill="#bfb5ac" opacity=".4"/><path d="M${x+77} ${y+72} Q${x+185} ${y+6} ${x+278} ${y+80} l18 70 -72 13 -25 -35 h-59 l-25 35 -68 -14Z" fill="#272325" stroke="#131313" stroke-width="9"/><path d="M${x+132} ${y+93} v42 m-20 -20 h40" stroke="#fff" stroke-width="9"/><circle cx="${x+254}" cy="${y+115}" r="10" fill="#be444a"/><circle cx="${x+276}" cy="${y+93}" r="10" fill="#fff"/>`;
if(scene==="money")return `<rect x="${x+65}" y="${y+60}" width="270" height="145" rx="17" fill="#272323" stroke="#171313" stroke-width="8"/><rect x="${x+91}" y="${y+89}" width="214" height="90" rx="9" fill="#fff7ef"/><text x="${x+198}" y="${y+155}" text-anchor="middle" font-size="67" font-family="Arial" font-weight="900" fill="#242020">$</text><circle cx="${x+63}" cy="${y+58}" r="28" fill="#bf454b" stroke="#231f1f" stroke-width="6"/>`;
if(["couch","laundry"].includes(scene))return `<rect x="${x+36}" y="${y+74}" width="320" height="124" rx="27" fill="#d6d0c8" stroke="#242020" stroke-width="9"/><path d="M${x+72} ${y+84} q66 68 136 0 q69 60 134 0" fill="none" stroke="#aaa19a" stroke-width="8"/><rect x="${x+78}" y="${y+133}" width="113" height="56" rx="13" fill="#f1eae0" stroke="#a29b95" stroke-width="4"/>${scene==="laundry"?`<path d="M${x+82} ${y+12} l118 17 -9 70 -103 -9Z" fill="#fff" stroke="#222" stroke-width="7"/><path d="M${x+117} ${y+42} h58" stroke="#bc4746" stroke-width="7"/>`:""}`;
if(scene==="fridge")return `<rect x="${x+80}" y="${y+1}" width="227" height="242" rx="13" fill="#e6e2dc" stroke="#242020" stroke-width="10"/><path d="M${x+80} ${y+138} h227" stroke="#242020" stroke-width="8"/><path d="M${x+269} ${y+76} v45 M${x+269} ${y+163} v44" stroke="#242020" stroke-width="11" stroke-linecap="round"/><ellipse cx="${x+167}" cy="${y+170}" rx="34" ry="22" fill="#fff" stroke="#242020" stroke-width="7"/>`;
if(scene==="train")return `<rect x="${x+35}" y="${y+35}" width="340" height="209" rx="16" fill="#ddd6cb" stroke="#222" stroke-width="9"/><rect x="${x+58}" y="${y+60}" width="129" height="110" rx="9" fill="#fffdf6" stroke="#222" stroke-width="7"/><path d="M${x+212} ${y+45} v192" stroke="#222" stroke-width="10"/><circle cx="${x+85}" cy="${y+226}" r="19" fill="#252020"/><circle cx="${x+327}" cy="${y+226}" r="19" fill="#252020"/>`;
if(scene==="phone")return `<rect x="${x+94}" y="${y+5}" width="176" height="245" rx="22" fill="#262020" stroke="#161414" stroke-width="7"/><rect x="${x+110}" y="${y+29}" width="144" height="191" rx="7" fill="#fffaf2"/><rect x="${x+125}" y="${y+71}" width="112" height="63" rx="9" fill="#c5474a"/><path d="M${x+142} ${y+95} h70 M${x+142} ${y+115} h51" stroke="#fff" stroke-width="7"/><circle cx="${x+180}" cy="${y+194}" r="11" fill="#272020"/>`;
return `<path d="M${x+82} ${y+80} h215 l-20 130 h-167Z" fill="#fffbf4" stroke="#242020" stroke-width="8"/><path d="M${x+293} ${y+103} q65 -16 57 31 q-5 45 -63 24" fill="none" stroke="#242020" stroke-width="12"/><path d="M${x+140} ${y+55} q-25 -25 0 -56 M${x+213} ${y+55} q-20 -23 0 -56" fill="none" stroke="#be4146" stroke-width="7"/>`;
}
function svgChar(x,y,face,mirrored){
let eyes="";
if(face==="sleep")eyes='<path d="M-53 4 q22 18 42 0 M16 5 q21 18 42 0" stroke="#221f1e" stroke-width="10" fill="none" stroke-linecap="round"/>';
else if(face==="rage")eyes='<path d="M-53 -2 l43 17 M16 15 l43 -17" stroke="#221f1e" stroke-width="10"/><circle cx="-30" cy="27" r="7"/><circle cx="34" cy="27" r="7"/>';
else if(face==="shock")eyes='<ellipse cx="-30" cy="18" rx="13" ry="18"/><ellipse cx="35" cy="18" rx="13" ry="18"/>';
else eyes='<path d="M-52 12 q21 -13 42 0 M13 12 q21 -13 45 0" stroke="#221f1e" stroke-width="9" fill="none" stroke-linecap="round"/>';
const mouth=face==="rage"?'<path d="M-17 71 q20 -15 42 0 l-7 28 q-15 9 -28 -1Z" stroke="#221f1e" stroke-width="6" fill="#b94445"/>':face==="shock"?'<ellipse cx="4" cy="83" rx="17" ry="21" fill="#221f1e"/>':face==="sleep"?'<path d="M-14 74 q21 16 38 0" stroke="#221f1e" stroke-width="6" fill="none"/>':'<path d="M-20 71 q26 22 48 -1" stroke="#221f1e" stroke-width="7" fill="none"/>';
return `<g transform="translate(${x} ${y}) ${mirrored?"scale(-1 1)":""}">
<path d="M-104 132 Q-129 178 -141 227 L145 227 Q121 142 98 129Z" fill="#282528" stroke="#161414" stroke-width="9"/>
<path d="M-25 127 L-2 167 L22 130" fill="none" stroke="#f9f0e2" stroke-width="9"/>
<path d="M-94 146 Q-132 116 -148 151 L-158 179 M101 142 Q136 129 150 157 L158 179" fill="none" stroke="#221f1e" stroke-width="27" stroke-linecap="round"/>
<path d="M-98 -74 Q-140 -28 -126 45 Q-109 132 -8 140 Q90 137 117 59 Q134 -30 95 -81 Q8 -134 -98 -74Z" fill="#fff8ed" stroke="#221f1e" stroke-width="9"/>
<path d="M-120 -68 l-9 -43 51 12 18 -37 38 24 29 -38 31 33 31 -19 25 34 34 -14 9 51 21 25 -35 11 -3 -30 -22 -36 -30 20 -26 -32 -29 29 -30 -14 -31 31 -30 -23 -23 26 -17 8Z" fill="#282425" stroke="#181414" stroke-width="8" stroke-linejoin="round"/>
<path d="M-63 46 l52 -7 M19 39 l53 7" stroke="#222" stroke-width="6" opacity=".35"/>
${eyes}${mouth}<path d="M-78 63 q21 -14 36 -3 M51 59 q18 -12 34 0" fill="none" stroke="#e1b1a4" stroke-width="7" opacity=".8"/>
<path d="M84 38 q20 16 3 40" fill="none" stroke="#c34548" stroke-width="7"/></g>`;
}
function svgSpeech(x,lines){
return `<g><path d="M${x} 96 Q${x} 70 ${x+27} 70 h309 q24 0 25 26 v99 q0 23 -26 24 h-95 l-34 34 8 -34 H${x+28} q-27 0 -28 -27Z" fill="#fffdf7" stroke="#222" stroke-width="8"/><text x="${x+179}" y="127" text-anchor="middle" font-family="-apple-system, 'PingFang TC',sans-serif" font-size="38" font-weight="900" fill="#211b1a"><tspan x="${x+179}">${xml(lines[0]||"")}</tspan><tspan x="${x+179}" dy="53">${xml(lines[1]||"")}</tspan></text></g>`;
}
const arts=new Map();
function comicSVG(c){
if(arts.has(c.id))return arts.get(c.id);
const i=Number(c.index)||1,scene=c.scene||"desk",reaction=c.reaction||"shock";
const accent=reaction==="rage"?'<path d="M905 268 l35 -53 M952 284 l53 -24 M882 241 l-4 -48" stroke="#c44345" stroke-width="13" stroke-linecap="round"/>':reaction==="shock"?'<path d="M886 252 v-62 M913 263 l36 -55 M855 256 l-26 -46" stroke="#c44345" stroke-width="12" stroke-linecap="round"/>':'<path d="M906 254 l16 -28 M873 231 l-10 -35" stroke="#c44345" stroke-width="11" stroke-linecap="round"/>';
const art=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 608" role="img" aria-label="${xml(c.title)}：${xml(c.punch)}">
<defs><pattern id="dots" width="17" height="17" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="2" fill="#ada398" opacity=".35"/></pattern><pattern id="hatch" width="19" height="19" patternUnits="userSpaceOnUse"><path d="M0 19 L19 0" stroke="#222" stroke-width="2" opacity=".1"/></pattern><clipPath id="left"><rect x="31" y="36" width="497" height="520" rx="17"/></clipPath><clipPath id="right"><rect x="553" y="36" width="497" height="520" rx="17"/></clipPath></defs>
<rect width="1080" height="608" rx="19" fill="#faf5e9"/>
<rect x="25" y="30" width="505" height="535" rx="20" fill="${i%3===0?"#e9e5df":"#f0ece6"}" stroke="#242020" stroke-width="8"/><rect x="550" y="30" width="505" height="535" rx="20" fill="#f6f1e8" stroke="#242020" stroke-width="8"/>
<g clip-path="url(#left)"><rect x="30" y="35" width="500" height="520" fill="url(#dots)"/>${svgProp(scene,51)}${svgChar(355,354,i%3===0?"shock":"sleep",false)}</g>
<g clip-path="url(#right)"><rect x="552" y="36" width="498" height="520" fill="url(#hatch)"/>${svgProp(scene,580)}${svgChar(900,351,reaction,true)}${accent}</g>
${svgSpeech(58,c.lead||["救命","快瘋了"])}${svgSpeech(578,c.twist||["好啦","先笑一下"])}
<g fill="none" stroke="#bf4245" stroke-width="7" stroke-linecap="round"><path d="M52 580 h103"/><path d="M905 580 h118"/></g>
<text x="540" y="591" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" font-weight="900" letter-spacing="4" fill="#8b8074">DAILY COMIC · ORIGINAL ${String(i).padStart(2,"0")}</text></svg>`;
const src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(art);
arts.set(c.id,src);return src;
}
function imageSrc(c){return c.remoteImage||comicSVG(c)}
function cardHTML(c,compact=false){
const image=esc(imageSrc(c)),title=esc(c.title),alt=esc(c.title+"。"+c.punch);
if(compact)return `<article class="library-card"><div class="library-art-wrap"><button class="library-art ${c.layout==="landscape"?"landscape":""}" type="button" data-open="${esc(c.id)}" aria-label="開啟${title}"><img loading="lazy" decoding="async" src="${image}" alt="${alt}"></button><button type="button" class="favorite-mini ${stage.favorites.has(c.id)?"is-favorite":""}" data-fav="${esc(c.id)}" aria-label="${stage.favorites.has(c.id)?"取消收藏":"收藏"}${title}">${stage.favorites.has(c.id)?"♥":"♡"}</button></div><div class="library-body"><h3>${title}</h3><p>${esc(short(c.punch,29))}</p></div></article>`;
return `<div class="comic-art ${c.layout==="landscape"?"landscape":""}"><img decoding="async" src="${image}" alt="${alt}"></div><div class="comic-meta"><div class="comic-overline"><span>原創漫畫 / ${esc(categoryLabels[c.category]||"生活")}</span><span>★ ${esc((c.tags||[]).slice(0,1).join(""))}</span></div><h3>${title}</h3><p>${esc(c.punch)}</p><div class="tag-row">${(c.tags||[]).slice(0,3).map(t=>`<span class="tiny-tag"># ${esc(t)}</span>`).join("")}</div></div>`;
}
function chooseComic(mood,avoidId){
let pool=stage.comics.filter(c=>(c.moods||[]).includes(mood));
if(!pool.length)pool=stage.comics;
const filtered=pool.filter(c=>c.id!==avoidId);
return choice(filtered.length?filtered:pool);
}
function refreshFavoriteUI(){
const c=stage.comics.find(x=>x.id===stage.current);
const b=$("#favorite-feature");
if(!c)return;
const yes=stage.favorites.has(c.id);
b.textContent=yes?"♥ 已收藏":"♡ 收藏這篇";
b.setAttribute("aria-pressed",yes?"true":"false");
}
function drawFeatured(next){
if(!next)return;
stage.current=next.id;
$("#featured-comic").innerHTML=cardHTML(next);
refreshFavoriteUI();
}
function selectMood(id,newComic){
stage.mood=id;
$$(".mood-chip").forEach(b=>{const on=b.dataset.mood===id;b.classList.toggle("selected",on);b.setAttribute("aria-pressed",on?"true":"false")});
const setting=moodConfig.find(x=>x.id===id)||moodConfig[0];
$("#mood-note").textContent="✳ "+setting.note;
if(newComic)drawFeatured(chooseComic(id,stage.current));
}
function initMood(){
$("#mood-chips").innerHTML=moodConfig.map(m=>`<button type="button" class="mood-chip" data-mood="${m.id}" aria-pressed="false"><span class="face" aria-hidden="true">${m.face}</span><span class="words">${m.label}</span></button>`).join("");
$("#mood-chips").addEventListener("click",e=>{const b=e.target.closest("[data-mood]");if(b)selectMood(b.dataset.mood,true)});
$("#shuffle-mood").addEventListener("click",()=>{drawFeatured(chooseComic(stage.mood,stage.current));toast("這篇送給現在的你。")});
$("#favorite-feature").addEventListener("click",()=>toggleFavorite(stage.current));
selectMood(stage.mood,true);
}
function toggleFavorite(id){
if(!id)return;
if(stage.favorites.has(id)){stage.favorites.delete(id);toast("已從最愛移除");}else{stage.favorites.add(id);toast("收進你的發病圖鑑了 ♡");}
writeFav();refreshFavoriteUI();renderLibrary();
if(stage.dialog===id)updateDialogFavorite();
}
function updateDialogFavorite(){const b=$("#dialog-fav");b.textContent=stage.favorites.has(stage.dialog)?"♥ 已收藏":"♡ 收進最愛";}
function openComic(id){
const c=stage.comics.find(x=>x.id===id);if(!c)return;
stage.dialog=id;
$("#dialog-body").innerHTML=`<div class="comic-art ${c.layout==="landscape"?"landscape":""}"><img src="${esc(imageSrc(c))}" alt="${esc(c.title)}"></div><h2>${esc(c.title)}</h2><p>${esc(c.punch)}</p><div class="tag-row">${(c.tags||[]).map(t=>`<span class="tiny-tag"># ${esc(t)}</span>`).join("")}</div>`;
updateDialogFavorite();
const dialog=$("#comic-dialog");
if(typeof dialog.showModal==="function")dialog.showModal();else dialog.setAttribute("open","");
}
function closeDialog(el){if(typeof el.close==="function")el.close();else el.removeAttribute("open")}
async function shareComic(){
const c=stage.comics.find(x=>x.id===stage.dialog);if(!c)return;
const link=new URL(window.location.href);link.hash="comic="+encodeURIComponent(c.id);
try{
if(navigator.share){await navigator.share({title:"每日發病｜"+c.title,text:c.punch,url:link.toString()});return;}
if(navigator.clipboard){await navigator.clipboard.writeText(link.toString());toast("分享連結已複製！");return;}
}catch(e){if(e.name==="AbortError")return;}
toast("複製網址列的連結即可分享！");
}
function initDialogs(){
$("#dialog-close").onclick=()=>closeDialog($("#comic-dialog"));
$("#about-close").onclick=()=>closeDialog($("#about-dialog"));
$("#about-btn").onclick=()=>$("#about-dialog").showModal();
$("#dialog-fav").onclick=()=>toggleFavorite(stage.dialog);
$("#dialog-share").onclick=shareComic;
$$("dialog").forEach(d=>d.addEventListener("click",e=>{if(e.target===d)closeDialog(d)}));
}
const prizes={
N:["暫時免開會券","你不是懶，你只是資源合理分配。","小確幸護身符","今天的你可以先不完美。"],
R:["稀有・準時下班符","人生的高級待遇：沒有人在找你。","稀有・咖啡滿血包","雖然世界還在吵，你可以先喝一口。"],
SSR:["SSR・傳說帶薪躺平","恭喜！你獲得一張不存在但很值得幻想的假單。","SSR・人生存檔點","今天的努力已經夠多了，允許自己先存檔。"]
};
let spinning=false;
function drawGacha(){
if(spinning)return;spinning=true;
$("#machine").classList.add("is-spinning");$("#gacha-btn").disabled=true;
setTimeout(()=>{
const roll=randomInt(1000);const rarity=roll<50?"SSR":roll<250?"R":"N";
const list=prizes[rarity],ix=randomInt(list.length/2)*2;
const c=choice(stage.comics);
const titles={N:"普通補給",R:"稀有驚喜",SSR:"傳說級情緒補充"};
$("#gacha-result").innerHTML=`<div class="gacha-quote"><div><span class="rarity ${rarity}">${rarity}</span><span class="eyebrow" style="display:inline-block">${titles[rarity]}</span></div><h3>${esc(list[ix])}</h3><p>${esc(list[ix+1])}</p><p>還送你一篇漫畫：<strong>${esc(c.title)}</strong></p><button type="button" class="btn btn-quiet" data-open="${esc(c.id)}">打開這篇漫畫 →</button></div>`;
$("#machine").classList.remove("is-spinning");$("#gacha-btn").disabled=false;spinning=false;
$("#gacha-result").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"nearest"});
},720);
}
function initGacha(){
$("#gacha-btn").addEventListener("click",drawGacha);
$("#gacha-result").addEventListener("click",e=>{const b=e.target.closest("[data-open]");if(b)openComic(b.dataset.open)});
}
function ventTopic(s){
if(/工作|客戶|開會|修改|老闆|主管|同事|圖面|工程|工地|報價|加班|進度|案子/.test(s))return "work";
if(/錢|薪水|帳單|費用|刷卡|貸款|薪資|沒錢|價格|預算/.test(s))return "money";
if(/遊戲|打王|裝備|掉寶|steam|卡關|副本|刷圖|電動/i.test(s))return "game";
if(/兒子|老婆|老公|小孩|家人|家庭|父母|孩子|吃飯/.test(s))return "life";
if(/累|睡|懶|不想動|休息|煩|緊張|難過|低落|沒力/.test(s))return "rest";
return "random";
}
const reactionMap={
work:{roast:["一聽到「最後一改」，我就知道這系列還會出續集。","職場怪獸的血量，永遠比你的休假長。"],gentle:["事情很多，不代表每件都要現在解決。你可以先挑一件最重要的。","你已經在處理了；休息幾分鐘不會抹掉你的努力。"],sloth:["今日辦公室法則：先喝水，方案自己慢慢長。","把工作切成最小塊，至少先不要把自己切成兩半。"]},
money:{roast:["錢包不是空，是正在進行極簡主義策展。","帳單根本是每月固定更新的恐怖漫畫。"],gentle:["壓力大的時候，可以先把需要處理的金額分開看，不必一次面對全部。","錢的事情會讓人煩。先照顧自己，再一步一步整理。"],sloth:["今天先不打開購物車，讓荷包享受一點寧靜。","泡杯茶，等你準備好再跟數字談判。"]},
game:{roast:["遊戲的 Boss 至少還會掉裝，你的人生 Boss 掉的是訊息通知。","輸了不要緊，反正攻略都寫得像簡單模式。"],gentle:["遊戲本來就是要帶來樂趣，卡關也可以先休息一下。","喜歡的東西偶爾不順很正常，換個節奏也不錯。"],sloth:["存檔、喝水、躺一下，這也是勇者的三連技。","今天先當村民，不必每次都去打魔王。"]},
life:{roast:["家庭副本最可怕的設定：沒有暫停鍵。","人生的隱藏任務總在你剛坐下時跳出來。"],gentle:["事情一件件來。不需要同時把每個角色都扮演得滿分。","今天光是照顧生活，就已經做了不少事。"],sloth:["今晚如果只做一件事，就做最值得做的那件。其他明天再說。","家事永遠做不完，先讓自己坐著喘口氣。"]},
rest:{roast:["你不是當機，是人生正在更新，請勿拔電源。","你目前的電量不適合跑高畫質人生。"],gentle:["今天感覺很累的話，先休息一下也完全可以。","你不必時時刻刻都很有精神，慢慢來。"],sloth:["官方公告：躺著也算一種姿勢管理。","現在開始執行高階技能——什麼都不急著做。"]},
random:{roast:["恭喜，你又遭遇了人類世界的隱藏副本。","你的煩惱已經進垃圾桶，剩下的請它自己分類。"],gentle:["嗯，有時候只是想把心裡的事說出來。我有聽到。","沒必要立刻找到答案，先讓自己舒服一點。"],sloth:["深呼吸，今天先別當生活的最強 NPC。","先休息再說。人生沒有每件事都需要秒回。"]}
};
function vent(){
const area=$("#vent-text"),input=area.value.trim();
if(!input){toast("先把想吐槽的事情打出來～");area.focus();return;}
const topic=ventTopic(input),phrases=reactionMap[topic][stage.tone],line=choice(phrases);
let suggested=stage.comics.filter(c=>c.category===topic);if(!suggested.length)suggested=stage.comics;
const comic=choice(suggested);
const box=$("#vent-reply");
box.hidden=false;
box.innerHTML=`<span class="eyebrow">煩惱已被退貨 · ORIGINAL RESPONSE</span><h3>✳ 今日吐槽回收完成</h3><p>${esc(line)}</p><div class="inline-suggest">順便送你一篇：<strong>${esc(comic.title)}</strong><br>${esc(comic.punch)}</div><button type="button" class="btn btn-quiet" data-open="${esc(comic.id)}" style="width:100%;margin-top:12px">看這篇漫畫 ↗</button>`;
area.value="";$("#vent-count").textContent="0 / 280";
toast("煩惱已丟掉。先不撿回來。");
}
function initVent(){
$("#vent-text").addEventListener("input",()=>{$("#vent-count").textContent=$("#vent-text").value.length+" / 280"});
$$(".tone-btn").forEach(b=>b.addEventListener("click",()=>{$$(".tone-btn").forEach(x=>{const active=x===b;x.classList.toggle("selected",active);x.setAttribute("aria-pressed",active?"true":"false")});stage.tone=b.dataset.tone}));
$("#vent-submit").onclick=vent;
$("#vent-reply").onclick=e=>{const b=e.target.closest("[data-open]");if(b)openComic(b.dataset.open)};
}
function filterLibrary(filter){
stage.filter=filter;
$$(".filter-chip").forEach(b=>{const on=b.dataset.filter===filter;b.classList.toggle("selected",on);b.setAttribute("aria-pressed",on?"true":"false")});
renderLibrary();
}
function renderLibrary(){
let data=stage.comics;
if(stage.filter==="favorites")data=data.filter(c=>stage.favorites.has(c.id));
else if(stage.filter!=="all")data=data.filter(c=>c.category===stage.filter);
const query=stage.query.trim().toLowerCase();
if(query)data=data.filter(c=>[c.title,c.punch,c.category,...(c.tags||[])].join(" ").toLowerCase().includes(query));
$("#library-grid").innerHTML=data.length?data.map(c=>cardHTML(c,true)).join(""):'<div class="empty-state"><strong>這裡還空空的。</strong>換個分類，或者先去漫畫急救室收藏一篇。</div>';
$("#library-total").textContent=stage.comics.length+" 篇原創漫畫";
$("#library-favorite-count").textContent="♥ "+stage.favorites.size+" 篇最愛";
}
function initLibrary(){
$("#library-filters").innerHTML=Object.entries(categoryLabels).map(([id,label])=>`<button class="filter-chip" data-filter="${id}" type="button" aria-pressed="false">${esc(label)}</button>`).join("");
$("#library-filters").onclick=e=>{const b=e.target.closest("[data-filter]");if(b)filterLibrary(b.dataset.filter)};
$("#library-grid").onclick=e=>{const favorite=e.target.closest("[data-fav]");if(favorite){toggleFavorite(favorite.dataset.fav);return;}const b=e.target.closest("[data-open]");if(b)openComic(b.dataset.open)};
$("#library-search").addEventListener("input",e=>{stage.query=e.target.value;renderLibrary()});
filterLibrary("all");
}
function viewChange(id){
$$(".view").forEach(v=>{const active=v.id==="view-"+id;v.hidden=!active;v.classList.toggle("active",active)});
$$(".nav-btn").forEach(b=>{const active=b.dataset.view===id;b.classList.toggle("selected",active);if(active)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current")});
window.scrollTo({top:0,behavior:"auto"});
}
function initNav(){
$$(".nav-btn").forEach(b=>b.addEventListener("click",()=>viewChange(b.dataset.view)));
}
async function getJson(path){
 const ctrl=new AbortController();const timer=setTimeout(()=>ctrl.abort(),5000);
 try{const r=await fetch(path,{cache:"no-store",signal:ctrl.signal});if(!r.ok)throw new Error("HTTP "+r.status);return await r.json();}
 finally{clearTimeout(timer);}
}
async function remoteFresh(){
try{
const host="https://raw.githubusercontent.com/jaychou77714/daily-beast-widget/main/daily-comic/";
const manifest=await getJson(host+"comic-feed.json");
return Object.entries(manifest.comics||{}).filter(([key,v])=>v&&v.status==="published"&&/^20\d{2}-\d{2}-\d{2}$/.test(key)&&/^20\d{2}-\d{2}-\d{2}-v\d+\.(png|jpg|jpeg)$/.test(String(v.image||""))&&typeof v.title==="string"&&typeof v.punch==="string").map(([key,v])=>({
id:"fresh-"+key+"-"+v.image, title:short(v.title,30),punch:short(v.punch,90),
category:["work","money","game","life","rest"].includes(v.category)?v.category:"life",
moods:Array.isArray(v.moods)?v.moods:["okay","snark"],tags:["最新漫畫","原創"],
remoteImage:host+"comics/"+v.image,lead:[],twist:[],scene:"desk",reaction:"smug"
})).slice(0,60);
}catch(_){return []}
}
async function boot(){
stage.favorites=readFav();
initDialogs();initGacha();initVent();initNav();
try{
const local=await getJson("./data/comics.json");
const remote=await remoteFresh();
stage.comics=[...(remote||[]),...(local.comics||[])];
stage.favorites=new Set([...stage.favorites].filter(id=>stage.comics.some(c=>c.id===id)));
if(!stage.comics.length)throw new Error("沒有漫畫內容");
const quips=await getJson("./data/quips.json").catch(()=>({jokes:[]}));
stage.quips=quips.jokes||[];
$("#ticker-text").textContent=choice(stage.quips)?.punch||"人生已經很難了，至少漫畫要好笑。";
initMood();initLibrary();
const id=decodeURIComponent((location.hash||"").replace(/^#comic=/,""));
if(id&&stage.comics.some(c=>c.id===id))setTimeout(()=>openComic(id),280);
}catch(e){
$("#mood-chips").innerHTML='<p>漫畫正在整理中，請稍後重新開啟。</p>';
$("#mood-note").textContent="資料載入失敗："+e.message;
$("#featured-comic").innerHTML='<div class="empty-state"><strong>今天先休息一下。</strong>連線恢復再來看看漫畫。</div>';
$("#library-grid").innerHTML='<div class="empty-state"><strong>漫畫庫尚未載入。</strong>請確認網路。</div>';
}
if("serviceWorker" in navigator && location.protocol==="https:")navigator.serviceWorker.register("./service-worker.js").catch(()=>{});
}
boot();
})();
