# 📇 My Business Card

一個互動式、可翻轉的網頁名片，展示個人基本資訊、社群連結與 QR Code，提供優雅的使用體驗與複製功能。點擊卡片可翻轉查看正反面內容。



---

## 🚀 Demo

👉 [Live Demo](https://a920604a.github.io/my-business-card/)

---

## 🛠 技術架構

- **React 18**：主框架，負責組件化 UI 建構。
- **Vite**：快速的 React 開發工具，取代 Create React App。
- **Chakra UI**：現代化的元件庫，提供一致的設計與風格。
- **react-qr-code**：生成個人網站 QR Code。
- **data.json**：使用靜態 JSON 檔案載入個人資訊，方便日後維護與擴充。
- **GitHub Pages**：部署靜態網站。

---

## 📁 專案結構

```

my-business-card/
├── public/
│   └── data.json            # 個人名片資料 (name, title, company, links)
├── src/
│   └── App.jsx              # 核心 React 元件，包含翻轉邏輯與樣式
├── index.html               # HTML 標頭
├── vite.config.js           # Vite 設定
└── README.md                # 專案說明文件

```

---

## 📦 安裝與啟動

1. 安裝依賴：

```bash
npm install
```

2. 本地開發伺服器：

```bash
npm run dev
```

3. 打包靜態檔案：

```bash
npm run build
```

4. 預覽打包結果：

```bash
npm run preview
```

---

## 🔧 自訂資料

編輯 `public/data.json` 以修改個人資訊：

```json
{
  "name": "小安",
  "title": "主任軟體工程師",
  "company": "夢想科技股份有限公司",
  "phone": "0912-345-678",
  "email": "an@example.com",
  "linkedin": "https://linkedin.com/in/example",
  "github": "https://github.com/a920604a",
  "website": "https://an.dev"
}
```

---

## ✨ 功能特色

* 點擊卡片即可翻轉查看正反兩面
* 背面包含社群連結、QR Code、電話與 Email 快速複製功能
* 響應式設計，手機與桌面皆適用
* 資料與畫面分離，方便重複使用與部署

---

## 📌 延伸功能建議

* 支援多語言顯示
* 加入個人照片或頭像
* 整合名片下載（如 PDF）
* 加入動畫過場或聲音效果
* API 連接以動態載入資料

---

## 🖥 部署到 GitHub Pages

1. 修改 `vite.config.js` 設定 `base`：

```js
base: '/my-business-card/',
```

2. 執行部署指令（需安裝 gh-pages）：

```bash
npm run build
npx gh-pages -d dist
```

---

## 📄 授權

本專案採用 MIT License 授權，歡迎自由使用與修改。

---

## 🙌 作者

由 [小安](https://github.com/a920604a) 製作，如有問題或建議歡迎 PR / Issue 🙏

```

如果你有加上 `screenshot.png` 預覽圖，可以放在專案根目錄中提供封面圖預覽；若尚未製作，我也可以幫你設計一張。

是否需要我幫你建立 `data.json` 範例與 QR Code 預設頁？
```
