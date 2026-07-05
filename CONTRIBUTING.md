# Contributing to Multi-AI Context Manager

感谢你对本项目的关注！欢迎任何形式的贡献。

Thank you for your interest in this project! All contributions are welcome.

## 🌟 如何贡献 / How to Contribute

### 报告问题 / Report Issues

如果你发现了 bug 或有功能建议，请：

If you find a bug or have a feature request:

1. 先搜索现有的 Issues，避免重复
2. 创建新 Issue 时提供详细信息：
   - 问题描述
   - 复现步骤
   - 预期行为
   - 实际行为
   - 环境信息（OS、Node 版本等）

### 提交代码 / Submit Code

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -am 'Add some feature'`
4. 推送分支：`git push origin feature/your-feature`
5. 创建 Pull Request

### 代码规范 / Code Style

- 使用有意义的变量和函数名
- 添加必要的注释（特别是复杂逻辑）
- 保持代码简洁易读
- 遵循现有代码风格

### 提交信息规范 / Commit Messages

使用清晰的提交信息：

```
feat: 添加新功能
fix: 修复 bug
docs: 更新文档
refactor: 重构代码
test: 添加测试
chore: 构建/工具相关
```

## 🎯 优先级 / Priority

**高优先级 / High Priority:**
- Bug 修复
- 文档改进
- 性能优化
- 安全问题

**中优先级 / Medium Priority:**
- 新功能（需先讨论）
- 代码重构
- 测试覆盖

**低优先级 / Low Priority:**
- UI 美化
- 示例代码
- 辅助工具

## 🚀 开发指南 / Development Guide

### 本地开发 / Local Development

```bash
# 克隆仓库
git clone https://github.com/yourusername/mindforge.git
cd mindforge

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入你的 API keys

# 启动开发
npm run cli
```

### 测试 / Testing

目前暂无自动化测试，手动测试重点：

1. 基本命令是否正常工作
2. API 调用是否成功
3. 上下文保存是否正确
4. 错误处理是否友好

### 新增 AI Agent

如果要添加新的 AI provider：

1. 在 `src/agents/` 创建新文件，如 `newAgent.js`
2. 实现 `chat()` 方法和对应的 prompt builder
3. 在 `src/cli.js` 中注册新 agent
4. 更新 `.env.example` 添加配置项
5. 更新 README 文档

## 📋 待办事项 / TODO

欢迎认领以下任务：

- [ ] 添加自动化测试
- [ ] 支持更多 AI 模型（Anthropic Haiku, GPT-3.5-turbo 等）
- [ ] 添加配置文件支持（`.airc.json`）
- [ ] 支持多项目切换
- [ ] 导出对话为 Markdown
- [ ] Web UI 界面（可选）
- [ ] 插件系统

## 🤝 行为准则 / Code of Conduct

- 尊重所有贡献者
- 建设性地讨论
- 专注于技术本身
- 保持开放和包容

## 📞 联系方式 / Contact

- GitHub Issues: 用于 bug 报告和功能建议
- Pull Requests: 用于代码贡献
- Discussions: 用于一般讨论和问题

再次感谢你的贡献！

Thanks again for your contribution!
