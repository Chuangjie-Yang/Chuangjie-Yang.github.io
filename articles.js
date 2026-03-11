const articles = [
  {
    "id": 2,
    "title": "第二篇文章",
    "date": "2026-03-11",
    "desc": "无摘要",
    "content": "# 第二篇文章\n\n这是我的第二篇markdown文章，测试更复杂的markdown语法。\n\n## 强调\n\n**粗体文字**\n\n*斜体文字*\n\n***粗斜体文字***\n\n## 代码行内\n\n这里有一段行内代码：`const x = 10;`\n\n## 分隔线\n\n---\n\n## 任务列表\n\n- [x] 完成任务1\n- [ ] 完成任务2\n- [ ] 完成任务3\n\n## 数学公式\n\n使用KaTeX语法：$E = mc^2$\n\n## 脚注\n\n这里有一个脚注[^1]。\n\n[^1]: 这是脚注的内容\n\n## 标题锚点\n\n[跳转到二级标题](#二级标题)\n\n## 段落\n\n这是一个段落。\n\n这是另一个段落，通过空行分隔。",
    "category": "tech"
  },
  {
    "id": 3,
    "title": "第三篇文章",
    "date": "2026-03-11",
    "desc": "无摘要",
    "content": "# 第三篇文章\r\n这是我的第三篇markdown文章，测试代码块和引用。\r\n## 多行代码块\r\n```python\r\n# Python代码示例\r\ndef fibonacci(n):\r\n    if n <= 0:\r\n        return 0\r\n    elif n == 1:\r\n        return 1\r\n    else:\r\n        return fibonacci(n-1) + fibonacci(n-2)\r\n# 测试\r\nfor i in range(10):\r\n    print(f\"F({i}) = {fibonacci(i)}\")\r\n```\r\n```java\r\n// Java代码示例\r\npublic class HelloWorld {\r\n    public static void main(String[] args) {\r\n        System.out.println(\"Hello, World!\");\r\n    }\r\n}\r\n```\r\n## 嵌套引用\r\n> 这是第一层引用\r\n> \r\n> > 这是第二层引用\r\n> > \r\n> > > 这是第三层引用\r\n## 图片链接\r\n[![示例图片](https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20sunset%20over%20ocean&image_size=square)](https://github.com)\r\n## 自动链接\r\nhttps://www.google.com\r\n## 邮箱链接\r\n<example@example.com>\r\n## 特殊字符\r\n 反引号\r\n\\ 反斜杠\r\n* 星号\r\n_ 下划线\r\n{} 花括号\r\n[] 方括号\r\n() 圆括号\r\n# 井号\r\n+ 加号\r\n- 减号\r\n. 点\r\n! 感叹号",
    "category": "tech"
  },
  {
    "id": 4,
    "title": "手记1",
    "date": "2026-03-10",
    "desc": "无摘要",
    "content": "# 手记1\n\ndescription: 这是一篇手记，记录生活中的点滴。\n\n这是一篇手记，记录生活中的点滴。\n\n今天天气很好，出去散步，看到了美丽的风景。\n\n## 感悟\n\n生活中有很多美好的瞬间，我们应该珍惜当下。",
    "category": "note"
  },
  {
    "id": 1,
    "title": "第一篇文章",
    "date": "2025-03-11",
    "desc": "这是我的第一篇markdown文章，测试markdown解析功能。",
    "content": "\n# 第一篇文章\n\n这是我的第一篇markdown文章，测试markdown解析功能。\n\n## 二级标题\n\n这是二级标题下的内容。\n\n### 三级标题\n\n这是三级标题下的内容。\n\n## 列表\n\n### 无序列表\n- 项目1\n- 项目2\n- 项目3\n\n### 有序列表\n1. 第一项\n2. 第二项\n3. 第三项\n\n## 链接\n\n[GitHub](https://github.com)\n\n## 图片\n\n![示例图片](https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20landscape%20with%20mountains%20and%20lake&image_size=landscape_16_9)\n\n## 引用\n\n> 这是一段引用文字\n> 引用的第二行\n\n## 代码\n\n```javascript\nfunction hello() {\n    console.log('Hello, world!');\n}\n```\n\n## 表格\n\n| 姓名 | 年龄 | 职业 |\n|------|------|------|\n| 张三 | 25   | 工程师 |\n| 李四 | 30   | 设计师 |\n| 王五 | 35   | 产品经理 |",
    "category": "tech"
  }
];