function checkAuth(req) {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) return true;
    const provided = req.headers['x-admin-password'];
    return provided === adminPassword;
}

module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    // 验证权限
    if (!checkAuth(req)) {
        return res.status(401).json({ error: '未授权，请提供正确密码' });
    }

    // 只允许 DELETE 方法（为了简化，也可以用 POST 但传递 _method=DELETE）
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const apiKey = process.env.NOTION_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: '缺少 NOTION_API_KEY 环境变量' });
    }

    // 从 URL 获取 pageId（例如 /api/delete?pageId=xxx）
    const { pageId } = req.query;
    if (!pageId) {
        return res.status(400).json({ error: '缺少 pageId 参数' });
    }

    try {
        // 调用 Notion API 删除页面（将页面移至回收站）
        const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
            method: 'PATCH',   // Notion 使用 PATCH 更新页面状态
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                archived: true   // 设置为 true 表示删除（归档）
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || '删除失败');
        }

        res.status(200).json({ success: true, id: pageId });

    } catch (error) {
        console.error('删除错误:', error);
        res.status(500).json({ error: '删除失败', detail: error.message });
    }
};
