// 导入 Notion 客户端
const { Client } = require('@notionhq/client');

// 初始化 Notion 客户端
const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

module.exports = async (req, res) => {
    // 1. 从环境变量读取数据库 ID
    const databaseId = process.env.NOTION_DATABASE_ID;
    if (!databaseId) {
        return res.status(500).json({ error: '服务器配置错误: 缺少 NOTION_DATABASE_ID' });
    }

    try {
        // 2. 查询 Notion 数据库，获取所有条目
        // 注意：Notion API 单次最多返回 100 条[reference:4]，如果图片超过100张，需要处理分页
        const response = await notion.databases.query({
            database_id: databaseId,
        });

        const pages = response.results;

        // 3. 从所有条目中提取图片 URL
        let imageUrls = [];
        for (const page of pages) {
            // 假设存放图片的列名是 'Image'，请根据你的实际列名修改
            const filesProperty = page.properties['Image'];
            if (filesProperty && filesProperty.type === 'files') {
                // 遍历该列中的所有文件
                for (const file of filesProperty.files) {
                    // 获取图片的 URL
                    // 注意：Notion API 返回的 URL 是临时的，有效期约 1 小时[reference:6][reference:7]
                    // 但每次请求 API 都会获取最新 URL，因此可以正常工作
                    const url = file.file?.url || file.external?.url;
                    if (url) {
                        imageUrls.push(url);
                    }
                }
            }
        }

        // 4. 如果没有找到任何图片，返回错误
        if (imageUrls.length === 0) {
            return res.status(404).json({ error: '在 Notion 数据库中没有找到图片' });
        }

        // 5. 随机选择一张图片
        const randomImageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];

        // 6. 重定向到该图片地址
        res.writeHead(302, { Location: randomImageUrl });
        res.end();

    } catch (error) {
        console.error('Notion API 错误:', error);
        res.status(500).json({ error: '获取图片失败，请检查服务器日志' });
    }
};