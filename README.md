# Random Image API

一个基于 Vercel + Notion 的轻量级随机图片 API，支持一键部署，图片库通过 Notion 数据库管理，无需重新部署即可随时增删图片。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FJalen9428%2Frandom-image-api&env=NOTION_API_KEY,NOTION_DATABASE_ID&envDescription=请填入你的%20Notion%20集成密钥和数据库%20ID)

---

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
3. 在表格中逐行添加图片（可直接上传或粘贴外链，由于Notion数据库图片存储在中国境外服务器，建议使用外链，如果您的位置不在中国或不为中国用户提供服务，可忽略）。

> 💡 **注意**：列名必须为 `Image`，否则需要修改代码中的对应字段。

### 2. 获取 Notion API 凭证

1. 访问 [Notion Developers](https://www.notion.so/my-integrations)，点击 **New integration**。
2. 填写名称，选择工作区，创建后复制生成的 **Internal Integration Token**（形如 `ntn_xxxxxxxx` 或 `secret_xxxx`）。
3. 回到你的 Notion 数据库页面，点击右上角 `...` → **Connections**，添加你刚刚创建的集成。
4. 从浏览器地址栏中获取 **Database ID**：在 URL 中 `notion.so/` 后面那串 32 位字符（例如 `abc123def456...`）。

### 3. 一键部署到 Vercel

点击上方的一键部署按钮，或手动操作：

1. Fork 本仓库到你的 GitHub 账号。
2. 登录 [Vercel](https://vercel.com)，点击 **Add New Project**，导入你的仓库。
3. 在配置页面，添加以下环境变量：
   - `NOTION_API_KEY`：你的 Notion 集成 Token
   - `NOTION_DATABASE_ID`：你的 Notion 数据库 ID
4. 点击 **Deploy**，等待部署完成。

部署成功后，访问 `https://你的项目名.vercel.app/api/random` 即可获得随机图片（302 重定向）。

---

## 📁 项目结构
```
random-image-api/
├── api/
│ └── random.js # 核心 API 代码（原生 fetch 调用 Notion）
├── package.json # 依赖配置（无需额外依赖）
└── README.md # 本文件
```
---

## 🔧 自定义与扩展

### 修改图片列名

如果你的 Notion 列名不是 `Image`，请修改 `api/random.js` 中第 31 行：
```javascript
const filesProperty = page.properties['你的列名'];
```

### 返回 JSON 格式（而非重定向）

将代码最后的`res.writeHead(302, { Location: randomImageUrl })`改为：
```javascript
res.status(200).json({ url: randomImageUrl });
```

### 添加缓存（减少 Notion API 调用）

可在 Vercel 边缘配置缓存头，或在代码中实现简单内存缓存（注意免费版内存限制）。

---

## 📌 常见问题
**Q：图片访问慢怎么办？**
A：Notion 的图片存储在 AWS S3（美国），对国内用户可能较慢。建议在 Notion 数据库中使用国内图床的外链（如阿里云 OSS、又拍云等），粘贴“Link”类型即可。

**Q：如何更新图片？**
A：直接在 Notion 表格中增删改图片即可，无需任何代码操作，即时生效。

**Q：部署后访问出现 404？**
A：检查环境变量是否正确配置，并确保 Notion 数据库已与你的集成连接。

**Q：Vercel 免费额度够用吗？**
A：本 API 只返回 302 重定向，图片流量由 Notion 承担，Vercel 仅消耗极少的计算资源，免费版（100GB 流量/月）绰绰有余。

---

##📄 License

MIT © Jalen9428
