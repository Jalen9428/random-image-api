const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  // 指向 public/images 文件夹
  const imagesDir = path.join(process.cwd(), 'public', 'images');
  
  let files;
  try {
    // 读取文件夹中的所有文件
    files = fs.readdirSync(imagesDir);
    // 只保留常见图片格式，过滤掉其他文件
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    files = files.filter(file => imageExtensions.includes(path.extname(file).toLowerCase()));
  } catch (e) {
    // 如果文件夹不存在或无法读取，返回错误提示
    return res.status(500).json({ error: '图片目录不存在或无法读取' });
  }

  // 如果文件夹内没有图片文件
  if (files.length === 0) {
    return res.status(404).json({ error: '目录中没有找到图片文件' });
  }

  // 随机挑选一张图片
  const randomFile = files[Math.floor(Math.random() * files.length)];
  
  // 设置状态码为 302（临时重定向），自动跳转到该图片的静态访问地址
  res.writeHead(302, { Location: `/images/${randomFile}` });
  res.end();
};