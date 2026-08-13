# Random Image API

A lightweight random image API powered by **Vercel + Notion** with a built‑in management panel.  
Manage your image library via a web interface – add, preview, rename, and delete images, all protected by an optional password.  
**Guest mode** allows anyone to browse and download images without logging in.  
**Global site title** can be set once by the admin and is visible to all visitors.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FJalen9428%2Frandom-image-api&env=NOTION_API_KEY,NOTION_DATABASE_ID,ADMIN_PASSWORD&envDescription=Please%20enter%20your%20Notion%20credentials%20and%20(optionally)%20an%20admin%20password%20for%20the%20management%20panel)

---

## 🌐 Language / 语言切换

- [中文 README](#中文-readme)
- [English README](#english-readme)

---

## ✨ Features

- 📦 **Zero maintenance**: Manage images in Notion – changes take effect immediately, no redeploy
- 🖥️ **Web‑based management panel**: Add images via external links or file uploads, preview, rename, delete, and download any image
- 👤 **Guest mode**: Anyone can browse the gallery and download images without a password; management functions remain protected
- 🔐 **Optional password protection**: Protect the management panel with an environment variable; if not set, the panel is open (admin only)
- 🌏 **Multi‑language compatible**: Automatically adapts to both `Name` (English) and `名称` (Chinese) title properties in Notion
- 🏷️ **Global site title**: Admin can change the site title once, and it is stored in Notion – all visitors see the updated title
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
4. **Add a `Value` property** (type **Text**) – this column stores the global site title. It is **required** for the global title feature to work.

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
   - `NOTION_API_KEY` – your Notion access token **(required)**
   - `NOTION_DATABASE_ID` – your Notion database ID **(required)**
   - `ADMIN_PASSWORD` – (optional) password to protect the management panel. **If left empty, the panel will be accessible without a password (full admin access).**
3. Click **Deploy** and wait for the build to finish.

After deployment, you can access:

- **Random image API**: `https://your-domain.vercel.app/api/random` – returns a 302 redirect to a random image.
- **Management panel**: `https://your-domain.vercel.app/` – browse, add, rename, delete, and download images, and manage the global site title.

> **Note**: In mainland China, Vercel’s default domain may be inaccessible due to DNS issues. You may need to use a custom domain.

---

## 📁 Project Structure (Full)

代码块
random-image-api/
├── api/
│   ├── random.js         # Public API – returns random image (302 redirect)
│   ├── list.js           # (Protected) returns list of all images
│   ├── add.js            # (Protected) batch add image URLs to Notion
│   ├── delete.js         # (Protected) delete an image by page ID
│   ├── rename.js         # (Protected) rename an image
│   ├── settings.js       # (Protected) get/set global site title
│   ├── public-list.js    # Public list for guest viewing (no auth)
│   ├── download.js       # Proxy download endpoint for images
│   └── check-auth.js     # Checks if password is set and validates login
├── public/
│   └── index.html        # Management panel frontend (login + dashboard + guest mode)
├── package.json          # Dependencies (none required for core)
└── README.md
代码块

---

## 🔧 Management Panel Usage

### Login & Guest Mode
- If `ADMIN_PASSWORD` is set, the login screen will appear when accessing `/`.
- Enter the password to gain full admin access (add/rename/delete functions, and change global title).
- Click **“以访客身份查看图库”** (Guest View) to browse all images without logging in – you can preview and download, but not add, rename, delete, or change the title.
- If `ADMIN_PASSWORD` is **not** set, the login screen will be bypassed, and you will have full admin access immediately.

### Global Site Title
- **Admin only**: Edit the title in the input field, then click the **“保存标题”** (Save Title) button. The title will be saved to Notion and immediately visible to all visitors.
- **Guest**: The title input is disabled; guests see the globally set title.
- The title is stored in your Notion database as a special record (with the name `site_title`). The `Value` column (type Text) is used to store the title string.

### Adding Images (Admin only)
- **Batch external links**: Paste multiple URLs (one per line) and click “Import”.
- **File upload**: Drag and drop image files or click to select.  
  *Note: This uses ImgBB as a free image host – you need to obtain a free API key from [ImgBB](https://api.imgbb.com/) and enter it in the panel (saved locally).*

### Preview, Rename, Download & Delete
- All images are displayed in a responsive grid.
- **Rename (Admin only)**: Hover over an image card to reveal a pencil ✏️ icon at the top‑left – click to change the image name.
- **Download**: Click the “⬇ 下载” button on any image card to download the original image (proxied through the server to avoid CORS issues).
- **Delete (Admin only)**: Hover over an image card to reveal a red **×** button at the top‑right – click to delete the image (moves it to the Notion trash).

> **Important**: Admin endpoints (`/api/list`, `/api/add`, `/api/rename`, `/api/delete`, `/api/settings` POST) require the `X-Admin-Password` header. The frontend automatically adds it after admin login. Guest users use the public endpoints (`/api/public-list`, `/api/download`, and `/api/settings` GET) which do not require authentication.

---

## ⚙️ Customization

### Change the image property name
The code automatically detects whether your title property is `Name` (English) or `名称` (Chinese). If you use a custom name, update the following files:
- `api/random.js`
- `api/list.js`
- `api/add.js`
- `api/public-list.js`
- `api/rename.js`
- `api/settings.js`

Look for `page.properties['Image']` and replace `'Image'` with your actual image‑column name.  
For the title column, the system will fallback to `名称` if `Name` is not found – you can modify that logic as needed.

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
A: Simply edit the Notion database, or use the management panel to add/rename/delete images – no redeployment needed.

**Q: Is the management panel safe if `ADMIN_PASSWORD` is not set?**  
A: The panel is open to anyone with the URL, but your Notion database remains secure as long as your `NOTION_API_KEY` is kept secret. For production, we strongly recommend setting a password.

**Q: Can I use my own image host instead of ImgBB for file uploads?**  
A: Yes – you can modify the `handleFiles()` function in `public/index.html` to call your own upload endpoint.

**Q: How does guest mode work?**  
A: Guest mode uses a separate public API endpoint (`/api/public-list`) that returns the same image list without requiring the admin password. Download is handled via a public proxy endpoint (`/api/download`). All admin actions (add/rename/delete) remain protected.

**Q: I get `Name is not a property` error when adding images?**  
A: This error indicates that your Notion database does not have a title‑type property named `Name` or `名称`. The code already tries to auto‑detect between these two common names, but if you have a custom title column name (e.g., `Title`), you need to modify the files listed in the **Customization** section above. Alternatively, ensure your database has a column with type **Title** and that it is named `Name` or `名称`. If you are using a different language, you may need to adjust the fallback logic in the code.

**Q: I get an error about missing `Value` column when changing the global title?**  
A: The `Value` column (type **Text**) is required to store the global title. Please add a column named `Value` of type `Text` to your Notion database and redeploy.

**Q: How do I change the global site title?**  
A: Log in as admin, edit the title in the input field, and click the “保存标题” button. The title is saved to Notion and becomes visible to all visitors.

---

## 📄 License

MIT © Jalen9428

---

# 中文 README

---

# Random Image API

一个基于 **Vercel + Notion** 的轻量级随机图片 API，并附带**可视化管理面板**。  
你可以通过 Web 界面管理图片库——添加、预览、重命名、删除图片，并支持**访客模式**（无需密码即可浏览和下载图片）。  
**全局网站标题**可由管理员一次设置，所有访客共享。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FJalen9428%2Frandom-image-api&env=NOTION_API_KEY,NOTION_DATABASE_ID,ADMIN_PASSWORD&envDescription=请填入%20Notion%20凭证和（可选）管理面板密码)

---

## ✨ 功能特性

- 📦 **零维护**：在 Notion 中管理图片，修改即时生效，无需重新部署
- 🖥️ **Web 管理面板**：支持外链批量添加、文件上传、图片列表预览、重命名、一键删除，以及下载功能
- 👤 **访客模式**：无需密码即可浏览全部图片并下载，管理功能受密码保护
- 🔐 **可选密码保护**：通过环境变量设置管理面板密码，不设置则管理员可直接进入
- 🌏 **多语言兼容**：自动适配 Notion 中的 `Name`（英文）或 `名称`（中文）标题属性
- 🏷️ **全局标题设置**：管理员修改标题后保存到 Notion，所有访客即时看到新标题
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
4. **添加一个 `Value` 属性**（类型为 **Text**）—— 该列用于存储全局网站标题，**必须添加**才能使用标题功能。

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
   - `NOTION_API_KEY` – Notion 访问令牌（**必填**）
   - `NOTION_DATABASE_ID` – Notion 数据库 ID（**必填**）
   - `ADMIN_PASSWORD` – （可选）管理面板登录密码。**留空则无需密码即可进入管理界面（管理员权限）。**
3. 点击 **Deploy**，等待构建完成。

部署成功后，你可以访问：

- **随机图片 API**：`https://你的域名.vercel.app/api/random` – 返回 302 重定向到随机图片。
- **管理面板**：`https://你的域名.vercel.app/` – 通过可视化界面管理图片，访客也可预览下载，管理员可修改全局标题。

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
│   ├── rename.js         # （受保护）重命名图片
│   ├── settings.js       # （受保护）获取/设置全局标题
│   ├── public-list.js    # 公开列表 – 供访客预览（无需认证）
│   ├── download.js       # 代理下载图片（解决跨域）
│   └── check-auth.js     # 检查密码状态并验证登录
├── public/
│   └── index.html        # 管理面板前端（登录 + 主界面 + 访客模式）
├── package.json          # 依赖配置（核心无额外依赖）
└── README.md
```

---

## 🔧 管理面板使用说明

### 登录与访客模式
- 若设置了 `ADMIN_PASSWORD`，访问根路径 `/` 时会弹出登录界面。
- 输入密码可进入完整管理界面（添加/重命名/删除功能，以及修改全局标题）。
- 点击 **“以访客身份查看图库”** 按钮，无需密码即可预览所有图片，并可下载，但不能增删改标题。
- 若未设置 `ADMIN_PASSWORD`，登录界面将不会出现，直接进入管理面板（管理员权限）。

### 全局网站标题
- **仅管理员**：在标题输入框中编辑，点击 **“保存标题”** 按钮，标题会保存到 Notion，所有访客立即看到新标题。
- **访客**：标题输入框禁用，只能看到已设置的全局标题。
- 标题存储在 Notion 数据库中的一条特殊记录（名称为 `site_title`），`Value` 列（Text 类型）存储标题字符串。

### 添加图片（仅管理员）
- **批量外链**：在文本框中每行一个 URL，点击“导入外链”。
- **文件上传**：拖拽或点击选择图片文件。  
  *注：使用免费图床 ImgBB，需要先在 [ImgBB](https://api.imgbb.com/) 获取免费 API Key，并在面板中填入（Key 会保存在本地）。*

### 预览、重命名、下载与删除
- 所有图片以网格形式展示。
- **重命名（仅管理员）**：鼠标悬停到图片卡片上，左上角出现铅笔 ✏️ 图标，点击后输入新名称即可修改。
- **下载**：每个图片卡片下方有“⬇ 下载”按钮，点击即可通过代理下载原图（解决跨域问题）。
- **删除（仅管理员）**：鼠标悬停到图片卡片上，右上角会出现红色 **×** 按钮，点击确认后即可删除图片（移入 Notion 回收站）。

> **重要**：管理功能的后端接口（`/api/list`、`/api/add`、`/api/rename`、`/api/delete`、`/api/settings` POST）需要携带 `X-Admin-Password` 头，前端登录后自动添加。访客使用公开接口（`/api/public-list`、`/api/download` 和 `/api/settings` GET），无需认证。

---

## ⚙️ 自定义配置

### 修改图片属性名
代码现在会自动检测标题属性是 `Name`（英文）还是 `名称`（中文）。如果你使用了其他名称，请修改以下文件：
- `api/random.js`
- `api/list.js`
- `api/add.js`
- `api/public-list.js`
- `api/rename.js`
- `api/settings.js`

将 `page.properties['Image']` 中的 `'Image'` 替换为你的实际图片列名。  
标题列系统会优先查找 `Name`，若不存在则使用 `名称` —— 你可以根据需要调整该逻辑。

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
A：直接修改 Notion 数据库，或使用管理面板增删改图片，无需重新部署。

**Q：不设置 `ADMIN_PASSWORD` 是否安全？**  
A：面板是公开的（管理员权限），但你的 Notion 数据库仍受 `NOTION_API_KEY` 保护。生产环境强烈建议设置密码。

**Q：上传文件用的 ImgBB 是否必须？**  
A：不是必须。如果你有自己的图片存储服务，可以修改 `public/index.html` 中的 `handleFiles()` 函数，调用你自己的上传接口。

**Q：访客模式如何工作？**  
A：访客模式使用独立的公开 API 端点（`/api/public-list`）获取图片列表，下载通过 `/api/download` 代理。管理操作（添加/重命名/删除）始终受密码保护。

**Q：添加图片时提示 `Name is not a property` 错误怎么办？**  
A：这个错误表示您的 Notion 数据库没有名为 `Name` 或 `名称` 的标题类型属性。代码已经尝试自动适配这两种常见的命名，但如果您使用了自定义标题列名（例如 `Title`），则需要按照上方 **自定义配置** 中的说明修改相应文件。或者，确保您的数据库中有一个类型为 **Title** 的列，并且命名为 `Name` 或 `名称`。如果使用其他语言，可能需要调整代码中的后备逻辑。

**Q：修改全局标题时提示缺少 `Value` 列？**  
A：`Value` 列（类型为 Text）是存储全局标题所必需的，请先在 Notion 数据库中添加一个名为 `Value`、类型为 `Text` 的列，然后重新部署。

**Q：如何修改全局网站标题？**  
A：以管理员身份登录，在标题输入框中编辑新标题，点击“保存标题”按钮即可。标题会保存到 Notion，所有访客即时看到。

---

## 📄 许可证

MIT © Jalen9428
