module.exports = async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).json({ error: '缺少 url 参数' });
    }

    try {
        new URL(url);
    } catch {
        return res.status(400).json({ error: '无效的 URL' });
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`下载失败: ${response.status}`);
        }

        const contentType = response.headers.get('content-type') || 'application/octet-stream';
        const filename = url.split('/').pop().split('?')[0] || 'image';

        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', contentType);

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        res.send(buffer);
    } catch (error) {
        console.error('下载错误:', error);
        res.status(500).json({ error: '下载失败', detail: error.message });
    }
};
