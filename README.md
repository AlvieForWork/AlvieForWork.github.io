# alvieforwork.github.io

接案用的一頁式網站（**不是求職作品集**，兩者目的不同，不可合併）。

- 上線網址：https://alvieforwork.github.io/
- 手刻靜態站，無 build step，改完 push 就上線
- 設計規格：`Alvie_agent/作品集/接案網站-設計規格.md`
- 商業面（定價、接案範圍、交接原則）：`Alvie_agent/plans/2026-08-19-接案啟動計劃.md`

## 檔案

| 檔案 | 做什麼 |
|---|---|
| `tokens.css` | 設計 token 單一來源。顏色、字級、間距、圓角一律從這裡拿 |
| `style.css` | 版面樣式。**不重新定義變數、不硬填色碼與 px** |
| `index.html` | 頁面本體 |

## 四條硬規則

1. 主色 `--accent` 可見面積 ≤ 5%
2. 零 `box-shadow`
3. 零漸層、零玻璃擬態
4. 英文不用 Inter

## 進度

- [x] 部署管線打通、hero 骨架
- [ ] hero 周圍散落的作品縮圖
- [ ] ② 我能解決什麼問題 ／ ③ 服務與價格 ／ ④ 案例 ／ ⑤ 合作流程 ／ ⑥ 關於我 + 聯絡
- [ ] 文案定稿、聯絡方式、og:image
