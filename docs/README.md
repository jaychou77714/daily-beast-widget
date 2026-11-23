# 每日發病｜手機網頁 App（A+B+C+F）

一個不顯示日期、沒有簽到壓力的漫畫情緒急救站。使用 iPhone Safari 打開，選「分享 → 加入主畫面」即可用近似獨立 App 的方式啟動。

## 現有功能

**A 情緒急救漫畫室**：選「快爆炸／沒電了／想耍廢／欠吐槽／今天還行」，以標籤配對漫畫，能一直換下一篇。

**B 厭世扭蛋機**：免費不限次數。普通 75%、稀有 20%、SSR 5%；純娛樂，沒有付費、現金或能兌換的獎品。

**C 吐槽垃圾桶**：文字輸入最多 280 字，三種模式（欠揍／溫柔／擺爛）。在瀏覽器內依關鍵詞選原創回應，文字不送到 GitHub、不保存，也不是 GPT 或專業諮詢。

**F 私藏發病圖鑑**：分類、搜尋、收藏、全畫面閱讀、分享單篇連結。收藏存於裝置 localStorage；不同裝置不會自動同步。

## 漫畫內容與新鮮感

- **精繪版：20 篇漫畫**，舊有 16 篇簡筆 SVG 已改為高細節分鏡插畫，另新增 4 篇完整繪製的漫畫。圖片位於 `docs/assets/illustrations/`，依漫畫標題與故事對應。
- 原創台詞題庫：**125 則**，直接整理自這個儲存庫舊有的原創幹話。
- 舊 iPhone Scriptable 的 70 張漫畫尚未匯入網站，請勿將本機 `DailyComicFINAL` 當作已經雲端備份。
- 往後可在 `daily-comic/comics/` 增加 PNG/JPG 圖片，並更新 `daily-comic/comic-feed.json` 為 `published`。網站會額外讀取新漫畫清單並加入圖鑑（**不顯示日期**），不用更新 iPhone App。
- GitHub Pages 網址啟用後固定為：`https://jaychou77714.github.io/daily-beast-widget/`。

## 如何首次啟用 GitHub Pages

儲存庫 **Settings → Pages → Build and deployment**：

- **Source:** Deploy from a branch
- **Branch:** `main`
- **Folder:** `/docs`
- 按 **Save**，等 GitHub Pages 回報網站可訪問。

GitHub Connector 目前可寫入倉庫，但沒有啟用 Pages 的專用操作；**只有這個設定需要倉庫管理者自己操作一次**。之後網站更新只需上傳 GitHub，不必再碰 Scriptable。

## iPhone 安裝

1. 使用 Safari 打開 `https://jaychou77714.github.io/daily-beast-widget/`。
2. 點 Safari **分享** → **加入主畫面** → 開啟「作為網頁 App 開啟」→ 新增。
3. 點主畫面《每日發病》即可進入四個功能。沒有日期，不顯示原本桌面 Widget 的資訊。
4. 如果確認網頁正常，再長按桌面舊的 Scriptable Widget 移除（**不要因此刪掉 Scriptable App 或本機素材**，除非你確認不需要那些漫畫備份）。

## 專案檔案

- `docs/index.html`：網站畫面與四個模式。
- `docs/styles.css`：黑白漫畫／奶油底／少量紅色視覺。
- `docs/app.js`：漫畫圖片、心情配對、扭蛋、吐槽、收藏與原始 SVG 備援。
- `docs/assets/illustrations/`：20 張已實際發布的精繪 WebP 漫畫圖片。
- `docs/data/comics.json`：漫畫內容、分類及標籤。
- `docs/data/quips.json`：原創幹話題庫。
- `docs/manifest.webmanifest`：主畫面網頁 App 宣告。
- `docs/service-worker.js`：基礎網站與原創內容的離線快取。
- `docs/assets/...`：圖示。
- `daily-comic/comic-feed.json`：往後由 GitHub 發布的圖片清單。

## 隱私與限制

- 無登入、無外部 AI API、無付費、無分析追蹤服務。
- 吐槽不傳送、不永久保存；收藏僅留在此瀏覽器的儲存空間。
- 清除網站資料、變更瀏覽器或移除網頁 App，收藏可能遺失。
- 手機第一次進入需要網路；成功載入後，部分本機內容可離線使用。遠端新圖需要連網。
- 漫畫是幽默與情緒陪伴內容，不取代心理諮詢或醫療協助。
- iOS PWA 更新依 Safari／系統快取時機；不保證每次編輯 GitHub 立刻顯示。

## 未來擴充

可以陸續新增真正獨立繪製的漫畫、新幹話系列、情緒分類或分享卡片。**尚未設定自動每天生成全新 AI 插畫**，那需要圖像生成服務與額外費用。

## 2026-11 精繪更新

- 已提交完整圖檔，而不只是聊天室示意圖。漫畫改為適合手機直向閱讀的精繪兩格頁面；特刊漫畫保留橫向構圖。
- 20 篇漫畫均有實際 WebP 圖片，沒有直接用舊簡筆人偶補數量；其中 16 篇重繪、4 篇新增。
- 加強畫面細節、分鏡與對話，圖片保留完整比例，沒有日期；原 A／B／C／F 功能仍照常運作。
- 後續可以將新 PNG／WebP 上傳此網站圖庫並更新漫畫資料。iPhone 加入主畫面後無須重新安裝。
