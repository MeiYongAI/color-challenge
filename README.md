# 色盲挑战

一个简单的网页颜色辨识游戏，帮助测试和提高用户的颜色辨别能力。

## 特点

- 准确的颜色展示
- 实时得分统计
- 颜色辨别能力评估
- 支持中文颜色名称

## 文件说明

- `color-challenge.html`: 主游戏文件
- `color_diff_auto_grid.py`: 自动网格颜色生成工具
- `color_diff_challenge.py`: 颜色挑战逻辑处理
- `color_diff_grid_index.py`: 颜色网格索引处理
- `detect_color_diff.py`: 颜色差异检测工具

## 如何使用

1. 克隆此仓库：
```bash
git clone https://github.com/MeiYongAI/color-challenge.git
```

2. 直接在浏览器中打开 `color-challenge.html` 文件

3. 或使用本地服务器（推荐）：
```bash
# 使用 Python 启动简单的 HTTP 服务器
python -m http.server 8000
# 然后在浏览器中访问 http://localhost:8000/color-challenge.html
```

## 游戏规则

1. 观察显示的颜色
2. 从选项中选择正确的颜色名称
3. 每次正确选择得1分
4. 错误选择不扣分

## 技术说明

- 使用纯 HTML/CSS/JavaScript 构建
- Python 脚本用于颜色处理和测试
- 支持所有现代浏览器

## 开发计划

- [ ] 添加难度级别选择
- [ ] 增加更多颜色选项
- [ ] 添加统计分析功能
- [ ] 优化移动端体验

## 贡献

欢迎提出建议和改进意见！

## 许可证

MIT