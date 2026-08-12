module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    const adminPassword = process.env.ADMIN_PASSWORD;

    // GET 请求：返回是否需要密码
    if (req.method === 'GET') {
        return res.status(200).json({
            needAuth: !!adminPassword // 如果有密码则返回 true
        });
    }

    // POST 请求：验证密码
    if (req.method === 'POST') {
        const { password } = req.body;
        if (!adminPassword) {
            // 未设置密码，任何密码都视为无效（但实际上不应出现POST）
            return res.status(200).json({ success: false, message: '未设置密码，无需登录' });
        }
        if (password === adminPassword) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(401).json({ success: false, message: '密码错误' });
        }
    }

    // 其他方法不允许
    res.status(405).json({ error: 'Method Not Allowed' });
};
