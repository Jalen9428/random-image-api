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

    const { pageId, newName } = req.body;
    if (!pageId || !newName) {
        return res.status(400).json({ error: '缺少 pageId 或 newName' });
    }

    const apiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_DATABASE_ID;
    if (!apiKey || !databaseId) {
        return res.status(500).json({ error: '缺少环境变量配置' });
    }

    try {
        // 获取数据库的标题属性名
        let titlePropName = '名称';
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

        // 更新页面标题
        const updateRes = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                properties: {
                    [titlePropName]: {
                        title: [{ text: { content: newName } }]
                    }
                }
            })
        });

        const data = await updateRes.json();
        if (!updateRes.ok) {
            throw new Error(data.message || '更新失败');
        }

        res.status(200).json({ success: true, id: pageId, newName });
    } catch (error) {
        console.error('重命名错误:', error);
        res.status(500).json({ error: '重命名失败', detail: error.message });
    }
};
