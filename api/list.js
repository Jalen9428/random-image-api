module.exports = async (req, res) => {
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
            body: JSON.stringify({ page_size: 100 }) // 最多返回 100 张，可修改
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Notion API 错误: ${data.message || JSON.stringify(data)}`);
        }

        const pages = data.results || [];
        const imageList = [];

        for (const page of pages) {
            // 获取图片名称（Notion 默认第一列是 Name）
            const nameProperty = page.properties['Name'];
            const fileName = nameProperty?.title?.[0]?.plain_text || '未命名';

            // 获取图片 URL
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
                urls: urls, // 一列可能存多张图，这里返回数组
                cover: urls[0] || null // 取第一张作为封面预览
            });
        }

        res.status(200).json({ total: imageList.length, data: imageList });

    } catch (error) {
        console.error('获取列表错误:', error);
        res.status(500).json({ error: '获取列表失败', detail: error.message });
    }
};
