const fs = require('fs');
const path = require('path');

const articlesDir = path.join(__dirname, 'articles');
const outputFile = path.join(__dirname, 'articles.js');

function buildArticles() {
  const articles = [];
  const categories = ['tech', 'note'];
  
  categories.forEach(category => {
    const categoryDir = path.join(articlesDir, category);
    if (fs.existsSync(categoryDir)) {
      const files = fs.readdirSync(categoryDir);
      files.forEach(file => {
        if (file.endsWith('.md')) {
          const filePath = path.join(categoryDir, file);
          let content = fs.readFileSync(filePath, 'utf8');
          
          // 提取文章日期（从文件内容中，第一行）
          const dateMatch = content.match(/^date:\s*(.+)$/m);
          const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];
          
          // 提取文章简述（从文件内容中，第二行）
          const abstractMatch = content.match(/^abstract:\s*(.+)$/m);
          let desc = abstractMatch ? abstractMatch[1] : '无摘要';
          
          // 确保摘要不包含markdown标记
          desc = desc.replace(/#/g, '').trim();
          
          // 移除date和abstract行，避免它们出现在正文中
          content = content.replace(/^date:\s*.+$/m, '');
          content = content.replace(/^abstract:\s*.+$/m, '');
          
          // 提取文章标题
          const titleMatch = content.match(/^#\s+(.+)$/m);
          const title = titleMatch ? titleMatch[1] : file.replace('.md', '');
          
          // 清理内容，移除多余的空行
          content = content.replace(/^\s*$/gm, '').replace(/\n{3,}/g, '\n\n');
          
          articles.push({
            id: articles.length + 1,
            title,
            date,
            desc,
            content,
            category
          });
        }
      });
    }
  });
  
  // 按日期排序，最新的文章排在前面
  articles.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  fs.writeFileSync(outputFile, `const articles = ${JSON.stringify(articles, null, 2)};`);
  console.log('构建完成！生成了articles.js文件');
  console.log(`共处理了 ${articles.length} 篇文章`);
}

buildArticles();