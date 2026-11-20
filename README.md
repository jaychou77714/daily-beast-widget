# 每日發病 × 小栗精神助理

這個公開儲存庫目前保留兩個 iPhone Scriptable 專案，原本的「爆肝獸／場外」小工具已停止維護與每日自動更新。

## 目前使用

### 1. 每日發病 FINAL Cloud（上方漫畫日曆）
- [使用說明](daily-comic/README.md)
- [Scriptable 程式](scriptable/每日發病_FINAL_Cloud.js)
- [雲端指定日期內容](daily-comic/cloud-overrides.json)
- 漫畫和原有 365 則文案仍在手機的 `DailyComicFINAL` 資料夾。這部分不受爆肝獸停用影響。

### 2. 小栗 1.0（中型精神助理）
- [安裝說明](companion/README.md)
- [Scriptable 程式](scriptable/小栗_桌面精神助理1.0.js)
- [公開原創時段問候](companion/public-lines.json)
- 文字聊天、近期話題、本機相簿頭像、可自行開關的問候通知。屬免費規則式回覆，不是生成式 AI。
- 照片及聊天紀錄保存在 iPhone 本機，不會上傳 GitHub。

## 已封存：爆肝獸 3.0／4.0

使用者已決定不再使用場外爆肝獸。

- 舊腳本與遊戲資料仍留在儲存庫作為歷史備份，不需要下載、安裝或維護。
- **GitHub Actions 的自動排程已停用**；`.github/workflows/daily.yml` 僅保留手動觸發，平常不會自行發布爆肝獸內容。
- 不影響《每日發病 FINAL Cloud》或小栗。
- 如果手機桌面還有爆肝獸的中型 Widget，可長按 → **編輯小工具** → 將 Script 改為「小栗精神助理」，或直接移除爆肝獸 Widget。
- 如要刪除本機的爆肝獸腳本／資料，請先確認不需要保留既有養成存檔。

## 隱私
此儲存庫是 **Public**，請勿將個人聊天紀錄、私人照片、公司文件、API 金鑰上傳至此。
