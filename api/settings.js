function checkAuth(req) {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) return true;
    const provided = req.headers['x-admin-password'];
    return provided === adminPassword;
}

module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    const apiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_DATABASE_ID;
    if (!apiKey || !databaseId) {
        return res.status(500).json({ error: '缺少环境变量配置' });
    }

    const CONFIG_NAME = 'site_title';
    const DEFAULT_TITLE = '我的随机图库';

    // 1. 获取数据库 schema，确定标题属性名并检查 Value 列
    let titlePropName = '名称'; // 默认
    let valuePropExists = false;
    try {
        const dbRes = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Notion-Version': '2022-06-28'
            }
        });
        const dbData = await dbRes.json();
        if (!dbRes.ok) {
            throw new Error(dbData.message || '无法获取数据库信息');
        }
        const props = dbData.properties;
        // 查找标题属性
        const titleProp = Object.values(props).find(p => p.type === 'title');
        if (titleProp) titlePropName = titleProp.name;
        // 检查 Value 列（类型为 rich_text，名称为 'Value'）
        const valueProp = Object.values(props).find(p => p.type === 'rich_text' && p.name === 'Value');
        if (valueProp) valuePropExists = true;
    } catch (err) {
        console.error('获取数据库 schema 失败:', err);
        return res.status(500).json({ error: '获取数据库信息失败', detail: err.message });
    }

    if (!valuePropExists) {
        return res.status(400).json({ 
            error: '数据库中缺少 "Value" 列（类型为 Text），请手动添加该列。' 
        });
    }

    if (req.method === 'GET') {
        try {
            // 使用动态标题属性名进行过滤
            const filter = {
                property: titlePropName,
                title: { equals: CONFIG_NAME }
            };
            const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Notion-Version': '2022-06-28',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ filter })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || '查询配置失败');
            }

            let title = DEFAULT_TITLE;
            if (data.results && data.results.length > 0) {
                const page = data.results[0];
                const valueProp = page.properties['Value'];
                if (valueProp && valueProp.type === 'rich_text' && valueProp.rich_text.length > 0) {
                    title = valueProp.rich_text[0].plain_text;
                }
            }
            res.status(200).json({ title });
        } catch (err) {
            console.error('获取配置错误:', err);
            res.status(500).json({ error: '获取配置失败', detail: err.message });
        }
    } else if (req.method === 'POST') {
        if (!checkAuth(req)) {
            return res.status(401).json({ error: '未授权，请提供正确密码' });
        }

        const { title } = req.body;
        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({ error: '标题不能为空' });
        }
        const newTitle = title.trim();

        try {
            // 查询是否存在配置记录
            const filter = {
                property: titlePropName,
                title: { equals: CONFIG_NAME }
            };
            const queryRes = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Notion-Version': '2022-06-28',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ filter })
            });
            const queryData = await queryRes.json();
            if (!queryRes.ok) {
                throw new Error(queryData.message || '查询配置失败');
            }

            let pageId;
            if (queryData.results && queryData.results.length > 0) {
                pageId = queryData.results[0].id;
            }

            let updateRes;
            if (pageId) {
                // 更新现有记录
                updateRes = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Notion-Version': '2022-06-28',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        properties: {
                            'Value': {
                                rich_text: [{ text: { content: newTitle } }]
                            }
                        }
                    })
                });
            } else {
                // 创建新记录
                updateRes = await fetch(`https://api.notion.com/v1/pages`, {
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
                                title: [{ text: { content: CONFIG_NAME } }]
                            },
                            'Value': {
                                rich_text: [{ text: { content: newTitle } }]
                            }
                        }
                    })
                });
            }

            const data = await updateRes.json();
            if (!updateRes.ok) {
                throw new Error(data.message || '更新配置失败');
            }

            res.status(200).json({ success: true, title: newTitle });
        } catch (err) {
            console.error('更新配置错误:', err);
            res.status(500).json({ error: '更新配置失败', detail: err.message });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};
