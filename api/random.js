const { Client } = require('@notionhq/client');

const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

module.exports = async (req, res) => {
    // 统一设置响应头为 JSON + UTF-8
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    const databaseId = process.env.NOTION_DATABASE_ID;
    if (!databaseId) {
        return res.status(500).json({ error: '服务器配置错误: 缺少 NOTION_DATABASE_ID' });
    }

    try {
        const response = await notion.databases.query({
            database_id: databaseId,
        });

        const pages = response.results;
        let imageUrls = [];
        for (const page of pages) {
            const filesProperty = page.properties['Image'];
            if (filesProperty && filesProperty.type === 'files') {
                for (const file of filesProperty.files) {
                    const url = file.file?.url || file.external?.url;
                    if (url) {
                        imageUrls.push(url);
                    }
                }
            }
        }

        if (imageUrls.length === 0) {
            return res.status(404).json({ error: '在 Notion 数据库中没有找到图片' });
        }

        const randomImageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
        // 重定向响应不需要改 Content-Type，但 302 是无正文的，不影响
        res.writeHead(302, { Location: randomImageUrl });
        res.end();

    } catch (error) {
        // 输出详细错误信息（调试用，生产环境请酌情隐藏堆栈）
        console.error('Notion API 错误:', error);
        res.status(500).json({
            error: '获取图片失败',
            detail: error.message,           // 显示错误信息
            // stack: error.stack             // 如果需要更详细堆栈，可取消注释
        });
    }
};