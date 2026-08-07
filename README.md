# Random Image API

A lightweight random image API powered by **Vercel + Notion**.  
Manage your image library directly in a Notion database — add, remove, or replace images anytime without redeploying.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FJalen9428%2Frandom-image-api&env=NOTION_API_KEY,NOTION_DATABASE_ID&envDescription=Please%20enter%20your%20Notion%20integration%20token%20and%20database%20ID)

---

## 🌐 Language / 语言切换

- [中文 README](#中文-readme)
- [English README](#english-readme)

---

## ✨ Features

- 📦 **Zero maintenance**: Manage images in Notion, and changes take effect immediately without redeploying
- ⚡ **Fast response**: Powered by Vercel and Notion CDN
- 🔐 **Secure**: Sensitive credentials are stored in environment variables
- 🆓 **Free to use**: Works within the free tiers of Vercel and Notion
- 🖼️ **Supports common image formats**: JPG, PNG, WebP, GIF, etc.

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
5. Click **Share** in the top-right corner, then click **Publish**.
6. After publishing, go back to the integration settings page.
7. In **Content access**, click **Add pages & databases**.
8. Select the published database you just created and add it to the integration.
9. Copy the **Database ID**:
   - From the URL `app.notion.com/p/(Database ID)?v=...`
   - Or from `xxx.notion.site/...`, where the 32-character ID appears after `notion.site/`

### 3. Deploy to Vercel

1. Open the project page and click the **Deploy** button, or deploy manually.
2. Import the GitHub repository into Vercel.
3. Add the following environment variables:
   - `NOTION_API_KEY`: your Notion integration access token
   - `NOTION_DATABASE_ID`: your Notion Database ID
4. Click **Deploy** and wait for the build to finish.

After deployment, visit:

```bash
https://your-domain.vercel.app/api/random
```

The request will automatically redirect to a random image in your Notion database.

> Note: In mainland China, Vercel’s default domain may be inaccessible due to DNS issues. You may need to use a custom domain.

---

## 📁 Project Structure

```bash
random-image-api/
├── api/
│   └── random.js # Core API code
├── package.json  # Dependency config
└── README.md     # Project documentation
```

---

## 🔧 Customization

### Change the image property name

If your Notion property is not named `Image`, update the corresponding field in `api/random.js`:

```javascript
const filesProperty = page.properties['YourPropertyName'];
```

### Return JSON instead of redirect

If you want the API to return JSON instead of a 302 redirect, replace:

```javascript
res.writeHead(302, { Location: randomImageUrl })
```

with:

```javascript
res.status(200).json({ url: randomImageUrl });
```

### Add caching

You can reduce Notion API calls by adding cache headers on Vercel or implementing in-memory caching in code.

---

## 📌 FAQ

**Q: Why is image loading slow?**  
A: Notion-hosted files use Notion’s CDN, and direct uploads may load slowly for users in mainland China. External image hosting is recommended for better performance.

**Q: How do I update images?**  
A: Simply edit the Notion database. No redeployment is needed.

**Q: Why do I get a 404 after deployment?**  
A: Check whether the environment variables are set correctly and whether the integration has access to the database.

**Q: Is Vercel’s free tier enough?**  
A: Yes. This API only returns a redirect, so the actual image traffic is handled by Notion or your image host.

---

## 📄 License

MIT © Jalen9428

---

# 中文 README

---

# Random Image API

一个基于 **Vercel + Notion** 的轻量级随机图片 API。  
你可以直接通过 Notion 数据库管理图片，无需修改 GitHub 仓库或重新部署，图片增删改可即时生效。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FJalen9428%2Frandom-image-api&env=NOTION_API_KEY,NOTION_DATABASE_ID&envDescription=Please%20enter%20your%20Notion%20integration%20token%20and%20database%20ID)

---

## 🌐 Language / 语言切换

- [中文 README](#中文-readme)
- [English README](#english-readme)

---

## ✨ 特性

- 📦 **零维护**：图片直接管理在 Notion 中，修改后立即生效，无需重新部署
- ⚡ **响应快**：基于 Vercel + Notion CDN
- 🔐 **安全**：敏感信息通过环境变量管理
- 🆓 **免费可用**：可在 Vercel 和 Notion 免费额度内运行
- 🖼️ **支持常见图片格式**：JPG、PNG、WebP、GIF 等

---

## 🚀 部署教程

### 1. 准备 Notion 数据库

1. 在你的 Notion 工作区中，新建一个**空数据库**。
2. 新建一个属性，类型选择 **Files & media（文件和媒体）**，并将该属性命名为 `Image`。
   - 属性名必须严格叫做 `Image`
   - 如果你想使用其他属性名，需要同步修改代码
3. 在这个属性中添加你的图片。
   - 可以直接上传图片
   - 也可以使用外链图片地址
   - 中国大陆用户推荐使用外链，因为直接上传的图片加载速度可能较慢

### 2. 获取 Notion API 凭证

1. 前往 [Notion Developers](https://www.notion.so/my-integrations)，创建一个新的 integration。
2. 输入任意连接名称，然后点击 **Create connection（创建连接）**。
3. 打开 integration 页面，复制 **Integration token（集成令牌）** 下方的 **Access token（访问令牌）**。
   - 这个 token 将作为 `NOTION_API_KEY`
4. 回到你的 Notion 数据库页面。
5. 点击右上角的 **Share（共享）**，然后点击 **Publish（发布）**。
6. **必须先发布数据库**，然后回到 integration 设置页面。
7. 在 **Content access（内容访问权限）** 中点击 **Add pages & databases（添加页面和数据库）**。
8. 选择你刚刚发布的数据库，并将其添加到该 integration。
9. 复制 **Database ID**：
   - 可以从 `app.notion.com/p/(Database ID)?v=...` 这样的链接中获取
   - 也可以从 `xxx.notion.site/...` 链接中找到 `notion.site/` 后面的 32 位字符

### 3. 部署到 Vercel

1. 打开项目页面，点击 README 中的 **Deploy** 按钮，或者手动部署。
2. 将 GitHub 仓库导入 Vercel。
3. 添加以下环境变量：
   - `NOTION_API_KEY`：你的 Notion Access token
   - `NOTION_DATABASE_ID`：你的 Notion Database ID
4. 点击 **Deploy**，等待部署完成。

部署成功后，访问：

```bash
https://你的域名.vercel.app/api/random
```

即可自动跳转到 Notion 数据库中的一张随机图片。

> 注意：Vercel 默认域名在中国大陆可能会受到 DNS 问题影响，导致无法访问。如有需要，请自行配置自定义域名。

---

## 📁 项目结构

```bash
random-image-api/
├── api/
│   └── random.js # 核心 API 代码
├── package.json  # 依赖配置
└── README.md     # 项目说明
```

---

## 🔧 自定义与扩展

### 修改图片属性名

如果你的 Notion 属性名不是 `Image`，请修改 `api/random.js` 中对应字段：

```javascript
const filesProperty = page.properties['你的属性名'];
```

### 返回 JSON 而不是重定向

如果你希望接口返回 JSON，而不是 302 跳转，可以将：

```javascript
res.writeHead(302, { Location: randomImageUrl })
```

改为：

```javascript
res.status(200).json({ url: randomImageUrl });
```

### 添加缓存

你可以在 Vercel 层配置缓存头，或者在代码中实现简单的内存缓存，以减少 Notion API 调用次数。

---

## 📌 常见问题

**Q：为什么图片加载很慢？**  
A：Notion 上传的文件会走它自己的 CDN，对于中国大陆用户可能会比较慢。建议使用支持直链的外链图床或对象存储服务。

**Q：如何更新图片？**  
A：直接在 Notion 数据库中增删改即可，无需重新部署。

**Q：部署后访问 404？**  
A：请检查环境变量是否正确配置，并确认你的 Notion 数据库已经通过 `Add pages & databases` 授权给对应的 integration。

**Q：Vercel 免费额度够用吗？**  
A：够用。这个 API 只返回重定向，图片流量主要由 Notion 或你的图床承担，Vercel 消耗很小。

---

## 📄 License

MIT © Jalen9428
