function checkAuth(req) {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) return true;
    const provided = req.headers['x-admin-password'];
    return provided === adminPassword;
}

// 从页面对象中提取标题文本
function getTitleFromPage(page) {
    for (const [key, prop] of Object.entries(page.properties)) {
        if (prop.type === 'title') {
            return prop.title.map(t => t.plain_text).join('') || '未命名';
        }
    }
    return '未命名';
}

module.exports = async (req, res) => {
    if (!checkAuth(req)) {
        return res.status(401).json({ error: '未授权，请提供正确密码' });
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    const apiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!apiKey || !databaseId) {
        return res.status(500).json({ error: '缺少环境变量配置' });
    }

    try {
        const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ page_size: 100 })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Notion API 错误: ${data.message || JSON.stringify(data)}`);
        }

        const pages = data.results || [];
        const imageList = [];

        for (const page of pages) {
            const fileName = getTitleFromPage(page);

            const filesProperty = page.properties['Image'];
            let urls = [];
            if (filesProperty && filesProperty.type === 'files') {
                for (const file of filesProperty.files) {
                    const url = file.file?.url || file.external?.url;
                    if (url) urls.push(url);
                }
            }

            imageList.push({
                id: page.id,
                name: fileName,
                urls: urls,
                cover: urls[0] || null
            });
        }

        res.status(200).json({ total: imageList.length, data: imageList });

    } catch (error) {
        console.error('获取列表错误:', error);
        res.status(500).json({ error: '获取列表失败', detail: error.message });
    }
};
