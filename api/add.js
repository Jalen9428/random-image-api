function checkAuth(req) {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) return true;
    const provided = req.headers['x-admin-password'];
    return provided === adminPassword;
}

module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    if (!checkAuth(req)) {
        return res.status(401).json({ error: '未授权，请提供正确密码' });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const apiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!apiKey || !databaseId) {
        return res.status(500).json({ error: '缺少环境变量配置' });
    }

    // 获取数据库的标题属性名
    let titlePropName = '名称'; // 默认
    try {
        const dbRes = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Notion-Version': '2022-06-28'
            }
        });
        const dbData = await dbRes.json();
        if (dbRes.ok) {
            const titleProp = Object.values(dbData.properties).find(p => p.type === 'title');
            if (titleProp) titlePropName = titleProp.name;
        }
    } catch (e) {
        console.warn('无法获取数据库标题属性，使用默认值 "名称"', e);
    }

    const { urls } = req.body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
        return res.status(400).json({ error: '请提供至少一个图片 URL' });
    }

    const validUrls = urls.filter(u => u.startsWith('http://') || u.startsWith('https://'));

    if (validUrls.length === 0) {
        return res.status(400).json({ error: '没有有效的图片链接' });
    }

    const results = [];
    const errors = [];

    for (let i = 0; i < validUrls.length; i++) {
        const url = validUrls[i];
        const fileName = url.split('/').pop().substring(0, 50) || `图片_${i + 1}`;

        try {
            const response = await fetch(`https://api.notion.com/v1/pages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Notion-Version': '2022-06-28',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    parent: { database_id: databaseId },
                    properties: {
                        [titlePropName]: {
                            title: [{ text: { content: fileName } }]
                        },
                        'Image': {
                            files: [
                                {
                                    name: fileName,
                                    external: { url: url }
                                }
                            ]
                        }
                    }
                })
            });

            const data = await response.json();

            if (!response.ok) {
                errors.push({ url, error: data.message || '未知错误' });
            } else {
                results.push({ url, id: data.id });
            }

            if (i < validUrls.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 400));
            }

        } catch (err) {
            errors.push({ url, error: err.message });
        }
    }

    res.status(200).json({
        success: results.length,
        failed: errors.length,
        results: results,
        errors: errors
    });
};
