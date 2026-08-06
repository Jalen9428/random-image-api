module.exports = async (req, res) => {
    // 统一设置响应头为 JSON + UTF-8
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    const apiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!apiKey || !databaseId) {
        return res.status(500).json({ 
            error: '缺少环境变量', 
            detail: '请检查 NOTION_API_KEY 和 NOTION_DATABASE_ID 是否已配置' 
        });
    }

    try {
        // 使用原生 fetch 调用 Notion API
        const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        const data = await response.json();

        if (!response.ok) {
            // 把 Notion 返回的错误信息暴露出来
            const errorMsg = data.message || JSON.stringify(data);
            throw new Error(`Notion API 错误: ${errorMsg}`);
        }

        const pages = data.results || [];
        let imageUrls = [];

        for (const page of pages) {
            const filesProperty = page.properties['Image'];
            if (filesProperty && filesProperty.type === 'files') {
                for (const file of filesProperty.files) {
                    const url = file.file?.url || file.external?.url;
                    if (url) imageUrls.push(url);
                }
            }
        }

        if (imageUrls.length === 0) {
            return res.status(404).json({ error: '未在 Notion 数据库中找到图片' });
        }

        const randomImageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
        // 302 重定向到图片
        res.writeHead(302, { Location: randomImageUrl });
        res.end();

    } catch (error) {
        console.error('错误:', error);
        res.status(500).json({ 
            error: '获取图片失败', 
            detail: error.message 
        });
    }
};