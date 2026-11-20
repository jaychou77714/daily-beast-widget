# 每日發病 × 爆肝獸 3.0 🐾

這是 **iPhone Scriptable 中型桌面小工具** 的公開內容儲存庫。保持米白底、黑白漫畫與少量紅色重點，右側使用你手機裡已安裝的四種「爆肝獸」原創 PNG。

## 目前已上線
- **125 則原創幹話**：`data/jokes.json`；分為設計師、月底、遊戲、日常、家庭五類。不是巴哈文章，也不是 AI 即時產生。
- **節日特別篇**：`data/specials.json`，按日期覆蓋當日幹話；節慶不等於法定假日。
- **每日雲端 JSON**：`data/today.json`，每次 GitHub Actions 排程執行後更新。
- **每日更新排程**：`.github/workflows/daily.yml`，每日台灣時間約 00:21 排程（GitHub 可能延遲，iOS Widget 刷新由系統控制）。
- **Scriptable 3.0**：`scriptable/鄉民今日發病_爆肝獸3.0.js`，若連線失敗，會讀取本機快取題庫或離線備援，不會把假文章冒充巴哈。
- **90 天試行期**：每日產生器從 2026-11-20 開始，到 2027-02-18 停止寫入新內容。**這不等於撤銷 GitHub App 授權，屆時請另外在 GitHub 設定撤銷或停用 Actions。**

## iPhone 升級步驟
1. **保留**現有 `iCloud Drive / Scriptable / 爆肝獸 / beast-*.png` 四張圖片；上方《每日發病 FINAL》不用改。
2. 在 GitHub 打開 `scriptable/鄉民今日發病_爆肝獸3.0.js`，點 **Raw** 全選複製。
3. 打開 iPhone Scriptable，按「＋」新增腳本，貼上完整 JS，命名 **鄉民今日發病3**，執行預覽。
4. 在 iPhone 桌面長按下方中型 Scriptable 小工具 → 編輯小工具 → Script 選 **鄉民今日發病3**。
5. 桌面會優先顯示 GitHub 的當日內容；斷網時切換題庫或內建文案。

## 手動驗證每日自動發布
打開儲存庫的 **Actions** → 左側 **爆肝獸每日內容更新** → **Run workflow**，日期留空，點綠色執行。成功後在 `data/today.json` 查看 `date`、`title`、`punch`、`category`；第一次手動執行可能需要先於 Settings → Actions → General 啟用執行或給予寫入權限。

## 使用與隱私
- 此儲存庫是 Public，請勿上傳個人帳號、心情日記、私訊、API Token 或公司資料。
- 目前不使用付費 API 或任何額外的 GitHub Personal Access Token；僅使用 GitHub Actions 自帶的 `GITHUB_TOKEN` 寫入公開內容。
- 沒有承諾準時 00:00 換日。更新後的 Widget 何時顯示由 iOS 決定。
- 如果未來要加入 AI 自動寫作，應以 GitHub Actions Secrets 安全儲存你自己決定使用的 API 金鑰；會另外產生費用。
- 不抓取或重發他人的巴哈貼文；目前所有句子為原創。

## 每日發病漫畫日曆 Cloud（上方大型 Widget）

- [安裝說明](daily-comic/README.md)
- [Scriptable 腳本](scriptable/每日發病_FINAL_Cloud.js)
- [雲端指定日期漫畫幹話](daily-comic/cloud-overrides.json)
- 漫畫、365 則原文案與節慶資料仍使用手機上的 `DailyComicFINAL`；目前雲端只管理指定日期的補充內容，與下方爆肝獸獨立。

## 爆肝獸 4.0 · 養成 RPG（下方中型 Widget）

**第一版已上線：** 每日事件二選一、人生卡抽卡、四條進化、角色卡與成就，存檔只留在 iPhone。

- [安裝教學與玩法](game/README.md)
- [iPhone Scriptable 4.0 程式碼](scriptable/鄉民今日發病_爆肝獸4.0.js)
- [24 個原創事件與 20 張人生卡](game/game-data.json)
- **3.0 舊版保留，不要刪除。上方《每日發病 Cloud》不需修改。**
