# 每日發病 · Cloud 新漫畫 2.0

專用於 iPhone Scriptable **大型漫畫日曆**；保留原本的 70 張漫畫、365 則文案、農曆與節慶資料。

## 新鮮感怎麼運作？

1. 新漫畫先製作成一張 **16:9 橫向 PNG／JPG，建議 1400 × 788，畫面不要烘焙標題與日期**。
2. 漫畫圖片發佈在這個 GitHub 的 `daily-comic/comics/` 資料夾，例如 `2026-11-22-v1.png`。
3. 同時編輯 [comic-feed.json](comic-feed.json)，指定哪一天要顯示圖片與配對標題、短句：
```json
{
  "version": 1,
  "comics": {
    "2026-11-22": {
      "image": "2026-11-22-v1.png",
      "title": "版本修改輪迴",
      "punch": "改到最後一版，才發現最初的那張最好。",
      "status": "published"
    }
  }
}
```
4. 當天《每日發病 Cloud 新漫畫 2.0》會先讀 GitHub 發佈清單，**完整下載圖片成功後**才一併更新標題與短句，避免圖文錯配。
5. 沒有新漫畫／網路連不上／圖片無法讀取 → 回到既有 `cloud-overrides.json` 的日期文案，或本機 `DailyComicFINAL` 的原版內容。

## iPhone 一次安裝

1. 不要刪除舊腳本及 `iCloud Drive/Scriptable/DailyComicFINAL/` 內的 70 張漫畫、年度幹話、節慶與農曆 JSON。
2. 打開 [每日發病_Cloud_新漫畫2.0.js](../scriptable/每日發病_Cloud_新漫畫2.0.js)，按 Raw 複製，於 Scriptable 新增 **「每日發病 新漫畫」** 腳本並貼上。
3. 在 Scriptable 按 ▶ 預覽；當日還沒有上傳新圖片時，預覽應顯示正常的既有漫畫日曆。
4. 桌面長按原有**大型 Widget** → 編輯小工具 → Script 選 **每日發病 新漫畫**。
5. 往後新增漫畫只需要更新 GitHub 圖片與 `comic-feed.json`，**不用重新修改手機上的 JS 腳本**。

## 設計規格
- 保留黑白日系惡搞漫畫、細緻網點、少量紅色、米白背景。
- 保留原本的日期、農曆、節慶和下方標題、笑點字幕。
- 圖檔是 **無烘焙文字的漫畫插畫**，讓 Scriptable 自己畫繁體中文標題與日期。
- 新漫畫上傳後檔名加版號 `-v1`、`-v2` 等，避免 iPhone 讀到舊快取。
- 雲端圖檔快取在本機的 `daily-comic-fresh-cache`，減少重複下載。
- 只對**當天精確日期**顯示新漫畫。原本的節日特殊篇優先，不覆蓋重要節慶。
- 新稿需有相對應的新圖＋新梗，不把舊圖換字幕冒充新作品。

## 自動化與費用
- 我們可以在聊天中生成新漫畫，利用已連線的 GitHub 上傳圖檔與日期設定。
- **現階段不具備自動每天憑空生成一張漫畫的排程。** 要實現真正的每日全新 AI 漫畫，需另行串接圖像生成 API、設定 GitHub Actions Secrets 與預算。
- GitHub 上架圖片本身不需要額外生成式 AI 訂閱，但 GitHub 免費額度及儲存庫規範仍適用。
- iOS Widget 更新時間由系統決定，不能保證午夜準時。
- 舊圖和年度文案仍在手機；如果日後清除 Scriptable 資料，需從備份恢復。

## 目前已部署
- 新漫畫清單：`daily-comic/comic-feed.json`。
- 新漫畫顯示腳本：`scriptable/每日發病_Cloud_新漫畫2.0.js`。
- 雲端既有文案覆蓋：`daily-comic/cloud-overrides.json`。
- **目前新漫畫清單仍是空的；還沒有新生成的漫畫圖檔上架。** 舊漫畫照常顯示。
