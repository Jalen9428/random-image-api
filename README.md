# Random Image API

A lightweight random image API powered by **Vercel + Notion**.  
Supports one-click deployment. Your image library is managed through a Notion database, so you can add or remove images anytime without redeploying.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FJalen9428%2Frandom-image-api&env=NOTION_API_KEY,NOTION_DATABASE_ID&envDescription=Please%20enter%20your%20Notion%20integration%20token%20and%20database%20ID)

---

## 🌐 Language / 语言切换

- [中文 README](#中文-readme)
- [English README](#english-readme)

> This README supports both Chinese and English.  
> 本 README 同时支持中文与英文。

---

# English README

## ✨ Features

- 📦 **Zero maintenance**: Images are stored in Notion; adding, deleting, or editing images takes effect immediately without redeployment
- ⚡ **Fast response**: Powered by Vercel Edge Functions + Notion CDN
- 🔐 **Secure and reliable**: Sensitive information is managed through environment variables
- 🆓 **Completely free**: Works within the free tiers of Vercel and Notion
- 🖼️ **Supports multiple formats**: JPG, PNG, WebP, GIF, and other common image formats

---

## 🚀 Quick Deployment

### 1. Prepare your Notion database

1. Create a new page in Notion and choose **Table** view to create a database.
2. Add a column of type **Files & media** and name it `Image` (case-sensitive).
3. Add images row by row. You can upload files directly or paste external links. 

> 💡 **Note**: The column name must be `Image`, otherwise you need to modify the corresponding field in the code.

### 2. Get your Notion API credentials

1. Go to [Notion Developers](https://www.notion.so/my-integrations) and click **New integration**.
2. Fill in the name, select your workspace, and create the integration. Copy the generated **Internal Integration Token** (e.g. `ntn_xxxxxxxx` or `secret_xxxx`).
3. Go back to your Notion database page, click `...` in the top right corner → **Connections**, then add the integration you just created.
4. Get the **Database ID** from the browser address bar. It is the 32-character string after `notion.site/` in the URL.

### 3. One-click deploy to Vercel

Click the deployment button above, or deploy manually:

1. Fork this repository to your GitHub account.
2. Log in to [Vercel](https://vercel.com), then click **Add New Project** and import your repository.
3. Add the following environment variables:
   - `NOTION_API_KEY`: Your Notion integration token
   - `NOTION_DATABASE_ID`: Your Notion database ID
4. Click **Deploy** and wait for the deployment to finish.

After deployment, visit:

```bash
https://your-project.vercel.app/api/random
```

You will get a random image via **302 redirect**.

---

## 📁 Project Structure

```bash
random-image-api/
├── api/
│   └── random.js # Core API code (native fetch to Notion)
├── package.json  # Dependency config (no extra dependencies required)
└── README.md     # This file
```

---

## 🔧 Customization and Extension

### Change the image column name

If your Notion column name is not `Image`, modify line 31 in `api/random.js`:

```javascript
const filesProperty = page.properties['YourColumnName'];
```

### Return JSON instead of redirect

Replace the final line:

```javascript
res.writeHead(302, { Location: randomImageUrl })
```

with:

```javascript
res.status(200).json({ url: randomImageUrl });
```

### Add caching to reduce Notion API calls

You can configure cache headers at the Vercel Edge level, or implement simple in-memory caching in the code  
(note: free-tier memory limits apply).

---

## 📌 FAQ

**Q: Why is image loading slow?**  
A: Notion stores images on AWS S3 (US), so loading may be slower for users in China. It is recommended to use external image hosting links in the Notion database, such as Alibaba Cloud OSS, UpYun, etc.

**Q: How do I update images?**  
A: Simply add, delete, or edit images in the Notion table. No code changes or redeployment are needed.

**Q: I get a 404 after deployment. Why?**  
A: Check whether the environment variables are configured correctly, and make sure your Notion database is connected to the integration.

**Q: Is the Vercel free tier enough?**  
A: This API only returns a 302 redirect, so the image traffic is handled by Notion. Vercel only consumes very little compute, and the free tier (100GB/month bandwidth) is more than enough.

---

## 📄 License

MIT © Jalen9428

---

# Random Image API

一个基于 **Vercel + Notion** 的轻量级随机图片 API，支持一键部署，图片库通过 Notion 数据库管理，无需重新部署即可随时增删图片。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FJalen9428%2Frandom-image-api&env=NOTION_API_KEY,NOTION_DATABASE_ID&envDescription=Please%20enter%20your%20Notion%20integration%20token%20and%20database%20ID)

---

## 🌐 Language / 语言切换

- [中文 README](#中文-readme)
- [English README](#english-readme)

> This README supports both Chinese and English.  
> 本 README 同时支持中文与英文。

---

# 中文 README

## ✨ 特性

- 📦 **零维护**：图片存储在 Notion，增删改即时生效，无需重新部署
- ⚡ **极速响应**：Vercel 边缘函数 + Notion CDN，访问速度快
- 🔐 **安全可靠**：所有敏感信息通过环境变量管理
- 🆓 **完全免费**：使用 Vercel 和 Notion 的免费额度即可运行
- 🖼️ **支持多种格式**：jpg、png、webp、gif 等常见图片格式

---

## 🚀 快速部署

### 1. 准备 Notion 数据库

1. 在 Notion 中新建一个页面，选择 **Table** 视图创建数据库。
2. 添加一列，类型选择 **Files & media**，命名为 `Image`（区分大小写）。
3. 在表格中逐行添加图片（可直接上传或粘贴外链）。

> 💡 **注意**：列名必须为 `Image`，否则需要修改代码中的对应字段。

### 2. 获取 Notion API 凭证

1. 访问 [Notion Developers](https://www.notion.so/my-integrations)，点击 **New integration**。
2. 填写名称，选择工作区，创建后复制生成的 **Internal Integration Token**（形如 `ntn_xxxxxxxx` 或 `secret_xxxx`）。
3. 回到你的 Notion 数据库页面，点击右上角 `...` → **Connections**，添加你刚刚创建的集成。
4. 从浏览器地址栏中获取 **Database ID**：在 URL 中 `notion.site/` 后面那串 32 位字符（例如 `abc123def456...`）。

### 3. 一键部署到 Vercel

点击上方的一键部署按钮，或手动操作：

1. Fork 本仓库到你的 GitHub 账号。
2. 登录 [Vercel](https://vercel.com)，点击 **Add New Project**，导入你的仓库。
3. 在配置页面，添加以下环境变量：
   - `NOTION_API_KEY`：你的 Notion 集成 Token
   - `NOTION_DATABASE_ID`：你的 Notion 数据库 ID
4. 点击 **Deploy**，等待部署完成。

部署成功后，访问：

```bash
https://你的项目名.vercel.app/api/random
```

即可获得随机图片（302 重定向）。

---

## 📁 项目结构

```bash
random-image-api/
├── api/
│   └── random.js # 核心 API 代码（原生 fetch 调用 Notion）
├── package.json  # 依赖配置（无需额外依赖）
└── README.md     # 本文件
```

---

## 🔧 自定义与扩展

### 修改图片列名

如果你的 Notion 列名不是 `Image`，请修改 `api/random.js` 中对应字段：

```javascript
const filesProperty = page.properties['你的列名'];
```

### 返回 JSON 格式（而非重定向）

将代码最后的：

```javascript
res.writeHead(302, { Location: randomImageUrl })
```

改为：

```javascript
res.status(200).json({ url: randomImageUrl });
```

### 添加缓存（减少 Notion API 调用）

可在 Vercel Edge 配置缓存头，或在代码中实现简单内存缓存（注意免费版内存限制）。

---

## 📌 常见问题

**Q：图片访问慢怎么办？**  
A：Notion 的图片存储在 AWS S3（美国），对国内用户可能较慢。建议在 Notion 数据库中使用国内图床的外链（如阿里云 OSS、又拍云等），粘贴“Link”类型即可。

**Q：如何更新图片？**  
A：直接在 Notion 表格中增删改图片即可，无需任何代码操作，即时生效。

**Q：部署后访问出现 404？**  
A：检查环境变量是否正确配置，并确保 Notion 数据库已与你的集成连接。

**Q：Vercel 免费额度够用吗？**  
A：本 API 只返回 302 重定向，图片流量由 Notion 承担，Vercel 仅消耗极少的计算资源，免费版额度通常足够。

---

## 📄 License

MIT © Jalen9428
