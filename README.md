# Random Image API

A lightweight random image API powered by **Vercel + Notion** with a built‑in management panel.  
Manage your image library via a web interface – add, preview, and delete images, all protected by an optional password.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FJalen9428%2Frandom-image-api&env=NOTION_API_KEY,NOTION_DATABASE_ID,ADMIN_PASSWORD&envDescription=Please%20enter%20your%20Notion%20credentials%20and%20(optionally)%20an%20admin%20password%20for%20the%20management%20panel)

---

## 🌐 Language / 语言切换

- [中文 README](#中文-readme)
- [English README](#english-readme)

---

## ✨ Features

- 📦 **Zero maintenance**: Manage images in Notion – changes take effect immediately, no redeploy
- 🖥️ **Web‑based management panel**: Add images via external links or file uploads, preview all images, and delete them with one click
- 🔐 **Optional password protection**: Protect the management panel with an environment variable; if not set, the panel is open
- ⚡ **Fast response**: Powered by Vercel edge functions and Notion CDN
- 🆓 **Free to use**: Works within free tiers of Vercel and Notion
- 🖼️ **Supports common formats**: JPG, PNG, WebP, GIF, etc.

---

## 🚀 Deployment Guide

### 1. Prepare your Notion database

1. In your Notion workspace, create a new **empty database**.
2. Add a new property with type **Files & media** and name it `Image`.
   - The property name must be exactly `Image`
   - If you want to use another name, you must update the code accordingly
3. Add your images to this property.
   - You can upload images directly
   - Or use external image URLs
   - For users in mainland China, external links are recommended because direct uploads may load slowly

### 2. Get your Notion API credentials

1. Go to [Notion Developers](https://www.notion.so/my-integrations) and create a new integration.
2. Enter any integration name, then click **Create connection**.
3. Open the integration page and copy the **Access token** under **Integration token**.
   - This token will be used as `NOTION_API_KEY`
4. Go back to your Notion database.
5. Click **Share** in the top‑right corner, then click **Publish**.
6. After publishing, go back to the integration settings page.
7. In **Content access**, click **Add pages & databases**.
8. Select the published database you just created and add it to the integration.
9. Copy the **Database ID**:
   - From the URL `app.notion.com/p/(Database ID)?v=...`
   - Or from `xxx.notion.site/...`, where the 32‑character ID appears after `notion.site/`

### 3. Deploy to Vercel

1. Click the **Deploy** button above or manually import the repository into Vercel.
2. In the Vercel project settings, add the following environment variables:
   - `NOTION_API_KEY` – your Notion access token
   - `NOTION_DATABASE_ID` – your Notion database ID
   - `ADMIN_PASSWORD` – (optional) password to protect the management panel. If omitted, the panel is accessible without login.
3. Click **Deploy** and wait for the build to finish.

After deployment, you can access:

- **Random image API**: `https://your-domain.vercel.app/api/random` – returns a 302 redirect to a random image.
- **Management panel**: `https://your-domain.vercel.app/` – browse, add, and delete images via a user‑friendly interface.

> **Note**: In mainland China, Vercel’s default domain may be inaccessible due to DNS issues. You may need to use a custom domain.

---

## 📁 Project Structure (Full)

```
random-image-api/
├── api/
│   ├── random.js         # Public API – returns random image (302 redirect)
│   ├── list.js           # (Protected) returns list of all images
│   ├── add.js            # (Protected) batch add image URLs to Notion
│   ├── delete.js         # (Protected) delete an image by page ID
│   └── check-auth.js     # Checks if password is set and validates login
├── public/
│   └── index.html        # Management panel frontend (login + dashboard)
├── package.json          # Dependencies (none required for core)
└── README.md
```

---

## 🔧 Management Panel Usage

### Login
- If `ADMIN_PASSWORD` is set, you will be prompted to enter it when accessing the root path `/`.
- The password is stored in `sessionStorage` for the current browser session.
- If `ADMIN_PASSWORD` is not set, the panel opens without authentication.

### Adding Images
- **Batch external links**: Paste multiple URLs (one per line) and click “Import”.
- **File upload**: Drag and drop image files or click to select.  
  *Note: This uses ImgBB as a free image host – you need to obtain a free API key from [ImgBB](https://api.imgbb.com/) and enter it in the panel (saved locally).*

### Preview & Delete
- All images from your Notion database are displayed as a grid.
- Hover over an image card to reveal a red **×** button – click to delete the image (moves it to the Notion trash).

> **Important**: The management panel is protected by the same password used for the API endpoints. All admin‑facing endpoints (`/api/list`, `/api/add`, `/api/delete`) require the `X-Admin-Password` header, which the frontend automatically adds after login.

---

## ⚙️ Customization

### Change the image property name
If your Notion property is not named `Image`, update the following files:
- `api/random.js`
- `api/list.js`
- `api/add.js`

Look for `page.properties['Image']` and replace `'Image'` with your property name.

### Return JSON instead of redirect
In `api/random.js`, replace:
```javascript
res.writeHead(302, { Location: randomImageUrl })
```
with:
```javascript
res.status(200).json({ url: randomImageUrl });
```

### Adjust batch upload concurrency
In `api/add.js`, a 400ms delay is used between each Notion API call to avoid rate limits. You can adjust this value inside the loop.

---

## 📌 FAQ

**Q: Why are images loading slowly?**  
A: Notion‑hosted files use Notion’s CDN; direct uploads may be slow from mainland China. Use external image links from domestic CDNs for better performance.

**Q: How do I update images?**  
A: Simply edit the Notion database, or use the management panel to add/delete images – no redeployment needed.

**Q: Is the management panel safe if `ADMIN_PASSWORD` is not set?**  
A: The panel is open, but your Notion database remains secure as long as your `NOTION_API_KEY` is kept secret. For production, we strongly recommend setting a password.

**Q: Can I use my own image host instead of ImgBB for file uploads?**  
A: Yes – you can modify the `handleFiles()` function in `public/index.html` to call your own upload endpoint.

---

## 📄 License

MIT © Jalen9428

---

# 中文 README

---

# Random Image API

一个基于 **Vercel + Notion** 的轻量级随机图片 API，并附带**可视化管理面板**。  
你可以通过 Web 界面管理图片库——添加、预览、删除图片，并可选择密码保护。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FJalen9428%2Frandom-image-api&env=NOTION_API_KEY,NOTION_DATABASE_ID,ADMIN_PASSWORD&envDescription=请填入%20Notion%20凭证和（可选）管理面板密码)

---

## ✨ 功能特性

- 📦 **零维护**：在 Notion 中管理图片，修改即时生效，无需重新部署
- 🖥️ **Web 管理面板**：支持外链批量添加、文件上传、图片列表预览、一键删除
- 🔐 **可选密码保护**：通过环境变量设置管理面板密码，不设置则无需登录
- ⚡ **响应迅速**：基于 Vercel 边缘函数 + Notion CDN
- 🆓 **完全免费**：使用 Vercel 和 Notion 免费额度即可运行
- 🖼️ **支持常见格式**：JPG、PNG、WebP、GIF 等

---

## 🚀 部署教程

### 1. 准备 Notion 数据库

1. 在 Notion 中新建一个**空数据库**。
2. 添加一个属性，类型选择 **Files & media（文件和媒体）**，并命名为 `Image`。
   - 属性名必须严格为 `Image`
   - 如果想用其他名称，需同步修改代码
3. 在该属性中添加图片（可直接上传或使用外链）。
   - 中国大陆用户建议使用外链，因为直接上传的图片可能加载较慢

### 2. 获取 Notion API 凭证

1. 前往 [Notion Developers](https://www.notion.so/my-integrations)，创建一个新的 integration。
2. 填写名称，点击 **Create connection**。
3. 复制 **Integration token** 下方的 **Access token**（该 token 将用作 `NOTION_API_KEY`）。
4. 回到 Notion 数据库页面，点击右上角 **Share** → **Publish** 发布数据库。
5. 在 integration 设置页面的 **Content access** 中，点击 **Add pages & databases**，选择刚刚发布的数据库，完成授权。
6. 获取 **Database ID**：
   - 从 URL `app.notion.com/p/(Database ID)?v=...` 中提取
   - 或从 `xxx.notion.site/...` 中 `notion.site/` 后面的 32 位字符

### 3. 部署到 Vercel

1. 点击上方 **Deploy** 按钮，或手动将仓库导入 Vercel。
2. 在 Vercel 项目设置中添加以下环境变量：
   - `NOTION_API_KEY` – Notion 访问令牌
   - `NOTION_DATABASE_ID` – Notion 数据库 ID
   - `ADMIN_PASSWORD` – （可选）管理面板登录密码。若不设置，面板将公开访问
3. 点击 **Deploy**，等待构建完成。

部署成功后，你可以访问：

- **随机图片 API**：`https://你的域名.vercel.app/api/random` – 返回 302 重定向到随机图片。
- **管理面板**：`https://你的域名.vercel.app/` – 通过可视化界面管理图片。

> **注意**：Vercel 默认域名在中国大陆可能因 DNS 问题无法访问，建议配置自定义域名。

---

## 📁 项目结构（完整）

```
random-image-api/
├── api/
│   ├── random.js         # 公开 API – 随机图片（302 重定向）
│   ├── list.js           # （受保护）获取所有图片列表
│   ├── add.js            # （受保护）批量添加外链到 Notion
│   ├── delete.js         # （受保护）根据页面 ID 删除图片
│   └── check-auth.js     # 检查密码状态并验证登录
├── public/
│   └── index.html        # 管理面板前端（登录 + 主界面）
├── package.json          # 依赖配置（核心无额外依赖）
└── README.md
```

---

## 🔧 管理面板使用说明

### 登录
- 若设置了 `ADMIN_PASSWORD`，访问根路径 `/` 时会弹出登录界面。
- 密码保存在 `sessionStorage` 中，关闭浏览器标签页即清除。
- 若未设置密码，面板直接进入。

### 添加图片
- **批量外链**：在文本框中每行一个 URL，点击“导入外链”。
- **文件上传**：拖拽或点击选择图片文件。  
  *注：使用免费图床 ImgBB，需要先在 [ImgBB](https://api.imgbb.com/) 获取免费 API Key，并在面板中填入（Key 会保存在本地）。*

### 预览与删除
- 所有图片以网格形式展示。
- 鼠标悬停到图片卡片上，右上角会出现红色 **×** 按钮，点击确认后即可删除图片（移入 Notion 回收站）。

> **重要**：管理面板的所有后端接口（`/api/list`、`/api/add`、`/api/delete`）均要求携带 `X-Admin-Password` 头，前端登录后会自动添加。这样即使绕过前端也无法直接调用。

---

## ⚙️ 自定义配置

### 修改图片属性名
如果 Notion 属性名不是 `Image`，请修改以下文件：
- `api/random.js`
- `api/list.js`
- `api/add.js`

将 `page.properties['Image']` 中的 `'Image'` 替换为你的属性名。

### 返回 JSON 而非重定向
在 `api/random.js` 中，将：
```javascript
res.writeHead(302, { Location: randomImageUrl })
```
替换为：
```javascript
res.status(200).json({ url: randomImageUrl });
```

### 调整批量添加的并发延迟
在 `api/add.js` 中，每次调用 Notion API 后会有 400ms 延迟以避免限流。你可以根据需要修改该值。

---

## 📌 常见问题

**Q：为什么图片加载很慢？**  
A：Notion 上传的文件使用其 CDN，从中国大陆访问可能较慢。建议使用国内图床的外链，并粘贴到 Notion 的“外链”类型中。

**Q：如何更新图片？**  
A：直接修改 Notion 数据库，或使用管理面板增删图片，无需重新部署。

**Q：不设置 `ADMIN_PASSWORD` 是否安全？**  
A：面板是公开的，但你的 Notion 数据库仍受 `NOTION_API_KEY` 保护。生产环境强烈建议设置密码。

**Q：上传文件用的 ImgBB 是否必须？**  
A：不是必须。如果你有自己的图片存储服务，可以修改 `public/index.html` 中的 `handleFiles()` 函数，调用你自己的上传接口。

---

## 📄 许可证

MIT © Jalen9428
