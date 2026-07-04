# Multi-AI Context Manager

[English](#english) | [中文](#chinese)

---

<a name="english"></a>
## English

A terminal-based tool for multi-AI collaboration with automatic context and decision management.

### ✨ Features

- 🤖 **Multi-AI Collaboration**: Integrate Claude (Builder) + GPT (Reviewer) for comprehensive solution design
- 📝 **Automatic Context Management**: Auto-save project background, decisions, and current solutions
- 💬 **Interactive Terminal**: Easy-to-use command-line interface
- 🔄 **Conversation History**: All dialogues are automatically saved locally
- 🎯 **Role-based AI**: Different AIs play specific roles (Builder, Reviewer, Challenger)

### 🚀 Quick Start

#### Installation

```bash
git clone https://github.com/yourusername/multi-ai-context.git
cd multi-ai-context
npm install
```

#### Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your API keys in `.env`:
   ```env
   CLAUDE_API_KEY=your_claude_key
   CODEX_API_KEY=your_openai_key
   ```

#### Usage

Start the CLI:
```bash
npm run cli
```

Or add an alias for quick access (optional):
```bash
echo 'alias ai="cd /path/to/multi-ai-context && npm run cli"' >> ~/.zshrc
source ~/.zshrc
```

Then simply type `ai` to start.

### 📖 Usage Guide

#### Basic Commands

```bash
# Ask Claude (Builder role)
@claude Design a user points system

# Ask Codex (Reviewer role)
@codex Review the design above and identify potential issues

# Switch default AI
/switch codex

# View project context
/context

# Save decision to document
/save Use 1-year expiration policy for points

# View conversation history
/history

# Clear history
/clear

# Show help
/help

# Exit
/exit
```

#### Example Workflow

```bash
# 1. Claude designs initial solution
> @claude Design a high-concurrency user points system

# 2. Codex reviews the solution
> @codex Review the design, focus on performance and security

# 3. Claude optimizes based on feedback
> @claude Optimize the design based on Codex's concurrency concerns

# 4. Save final decision
> /save Adopt Redis + MySQL dual-write approach, Redis for hot data cache
```

### 📁 Project Structure

```
multi-ai-context/
├── .ai-context/          # Auto-generated context directory
│   ├── brief.md         # Project background
│   ├── decisions.md     # Decision log
│   └── current.md       # Current solution
├── src/
│   ├── cli.js           # CLI main program
│   ├── agents/          # AI agent implementations
│   │   ├── claudeAgent.js
│   │   ├── codexAgent.js
│   │   └── geminiAgent.js
│   ├── handlers/        # Message and context handlers
│   └── utils/           # Utility functions
├── .env.example         # Environment template
├── .gitignore
├── package.json
└── README.md
```

### 🤖 AI Roles

- **Claude (Builder)**: Solution designer, proposes comprehensive technical solutions
- **Codex (Reviewer)**: Solution reviewer, identifies potential issues and optimization suggestions
- **Gemini (Challenger)**: Optional, challenges proposals from different angles

### ⚙️ Configuration

#### API Providers

The tool supports various API providers:

**Claude:**
- Official: `https://api.anthropic.com/v1`
- Proxy services (for regions with API restrictions)

**GPT/Codex:**
- Official OpenAI: `https://api.openai.com/v1`
- OpenAI-compatible proxies

**Important Notes:**
1. **Model Names**: Different providers may use different model names
   - Standard: `gpt-4`, `gpt-4-turbo`, `gpt-4o`
   - Some proxies: `gpt-5.5`, `gpt-4-turbo-preview`, etc.
   - Check your provider's documentation

2. **API Compatibility**: Ensure your provider uses OpenAI-compatible API format

### 🎯 When to Use

**Best Use Cases:**
- Technical solution design and review
- Architecture decision-making
- Multi-perspective problem analysis
- Project context management
- Long-term decision tracking

**Not Suitable For:**
- Simple Q&A (overkill)
- Code generation only (use IDE tools)
- Real-time collaboration (use Slack/Teams instead)

### 🚨 Common Issues & Solutions

#### 1. API Connection Issues

**Problem:** `timeout` or `connection refused`

**Solutions:**
- Check if your network can access the API endpoint
- Try using a proxy service in your region
- Verify API key is valid
- Check if API endpoint URL is correct

#### 2. Invalid Model Name

**Problem:** `model not supported` or similar errors

**Solutions:**
- Check your provider's supported model list
- Update `CODEX_MODEL` in `.env` to the correct name
- Examples: `gpt-4`, `gpt-4-turbo`, `gpt-5.5` (provider-specific)

#### 3. Gemini API Timeout

**Problem:** Gemini API times out (common in some regions)

**Solutions:**
- Leave `GEMINI_API_KEY` empty to disable Gemini
- The tool works perfectly with just Claude + Codex
- Or use a VPN/proxy to access Google APIs

#### 4. API Rate Limits

**Problem:** `429 Too Many Requests`

**Solutions:**
- Wait a few seconds between requests
- Check your API plan's rate limits
- Consider upgrading your API plan

### 💡 Best Practices

1. **Start with Context**: Use `/save` to document project background before starting
2. **Iterative Design**: Claude designs → Codex reviews → Claude refines
3. **Decision Tracking**: Immediately save important decisions with `/save`
4. **Regular Review**: Use `/history` to review past discussions
5. **Cost Control**: Each message costs API tokens, be mindful of usage

### 🛠️ Troubleshooting

**Debug Mode:**
```bash
NODE_ENV=development npm run cli
```

**Test API Connection:**
```bash
# Test Claude API
curl -X POST $CLAUDE_BASE_URL/messages \
  -H "x-api-key: $CLAUDE_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-3-5-sonnet-20241022","max_tokens":100,"messages":[{"role":"user","content":"test"}]}'

# Test OpenAI-compatible API
curl -X POST $CODEX_BASE_URL/chat/completions \
  -H "Authorization: Bearer $CODEX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-4","messages":[{"role":"user","content":"test"}],"max_tokens":10}'
```

### 📝 License

MIT

### 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

<a name="chinese"></a>
## 中文

多 AI 协作的终端工具，自动管理项目上下文和决策文档。

### ✨ 功能特点

- 🤖 **多 AI 协作**: 集成 Claude（建设者）+ GPT（审查者），全方位设计方案
- 📝 **自动上下文管理**: 自动保存项目背景、决策记录和当前方案
- 💬 **交互式终端**: 简洁易用的命令行界面
- 🔄 **对话历史**: 所有对话自动保存在本地
- 🎯 **角色分工**: 不同 AI 扮演特定角色（建设者、审查者、挑战者）

### 🚀 快速开始

#### 安装

```bash
git clone https://github.com/yourusername/multi-ai-context.git
cd multi-ai-context
npm install
```

#### 配置

1. 复制 `.env.example` 为 `.env`：
   ```bash
   cp .env.example .env
   ```

2. 在 `.env` 中填入你的 API 密钥：
   ```env
   CLAUDE_API_KEY=你的_claude_密钥
   CODEX_API_KEY=你的_openai_密钥
   ```

#### 使用

启动 CLI：
```bash
npm run cli
```

或者添加快捷命令（可选）：
```bash
echo 'alias ai="cd /path/to/multi-ai-context && npm run cli"' >> ~/.zshrc
source ~/.zshrc
```

之后直接输入 `ai` 即可启动。

### 📖 使用指南

#### 基础命令

```bash
# 询问 Claude（建设者角色）
@claude 设计一个用户积分系统

# 询问 Codex（审查者角色）
@codex 审查上面的设计，找出潜在问题

# 切换默认 AI
/switch codex

# 查看项目上下文
/context

# 保存决策到文档
/save 采用积分1年过期策略

# 查看对话历史
/history

# 清空历史
/clear

# 显示帮助
/help

# 退出
/exit
```

#### 工作流示例

```bash
# 1. Claude 设计初始方案
> @claude 设计一个高并发的用户积分系统

# 2. Codex 审查方案
> @codex 审查上面的设计，关注性能和安全性

# 3. Claude 根据反馈优化
> @claude 针对 Codex 提出的并发问题，优化设计

# 4. 保存最终决策
> /save 采用 Redis + MySQL 双写方案，Redis 做热数据缓存
```

### 📁 项目结构

```
multi-ai-context/
├── .ai-context/          # 自动生成的上下文目录
│   ├── brief.md         # 项目背景
│   ├── decisions.md     # 决策记录
│   └── current.md       # 当前方案
├── src/
│   ├── cli.js           # CLI 主程序
│   ├── agents/          # AI agent 实现
│   │   ├── claudeAgent.js
│   │   ├── codexAgent.js
│   │   └── geminiAgent.js
│   ├── handlers/        # 消息和上下文处理
│   └── utils/           # 工具函数
├── .env.example         # 环境变量模板
├── .gitignore
├── package.json
└── README.md
```

### 🤖 AI 角色说明

- **Claude (Builder)**: 方案设计者，负责提出完整的技术方案
- **Codex (Reviewer)**: 方案审查者，负责找出潜在问题和优化建议
- **Gemini (Challenger)**: 可选，从不同角度挑战方案

### ⚙️ 配置说明

#### API 服务商

本工具支持多种 API 服务商：

**Claude:**
- 官方: `https://api.anthropic.com/v1`
- 中转商（适用于 API 受限地区）

**GPT/Codex:**
- 官方 OpenAI: `https://api.openai.com/v1`
- OpenAI 兼容的中转服务

**重要提示:**
1. **模型名称**: 不同服务商可能使用不同的模型名称
   - 标准名称: `gpt-4`, `gpt-4-turbo`, `gpt-4o`
   - 部分中转商: `gpt-5.5`, `gpt-4-turbo-preview` 等
   - 请查看你的服务商文档

2. **API 兼容性**: 确保服务商使用 OpenAI 兼容的 API 格式

### 🎯 适用场景

**最佳使用场景:**
- 技术方案设计和审查
- 架构决策制定
- 多角度问题分析
- 项目上下文管理
- 长期决策追踪

**不适合的场景:**
- 简单问答（大材小用）
- 纯代码生成（用 IDE 工具更好）
- 实时协作（用 Slack/Teams 等更合适）

### 🚨 常见问题与解决方案

#### 1. API 连接问题

**现象:** `timeout` 或 `connection refused`

**解决方案:**
- 检查网络是否能访问 API 端点
- 尝试使用本地区的中转服务
- 确认 API 密钥是否有效
- 检查 API 端点 URL 是否正确

#### 2. 模型名称无效

**现象:** `model not supported` 或类似错误

**解决方案:**
- 查看你的服务商支持的模型列表
- 更新 `.env` 中的 `CODEX_MODEL` 为正确名称
- 示例: `gpt-4`, `gpt-4-turbo`, `gpt-5.5`（取决于服务商）

#### 3. Gemini API 超时

**现象:** Gemini API 连接超时（部分地区常见）

**解决方案:**
- 将 `GEMINI_API_KEY` 留空以禁用 Gemini
- 只用 Claude + Codex 也完全够用
- 或使用 VPN/代理访问 Google API

#### 4. API 请求限流

**现象:** `429 Too Many Requests`

**解决方案:**
- 请求之间等待几秒
- 检查你的 API 套餐限制
- 考虑升级 API 套餐

### 💡 最佳实践

1. **从上下文开始**: 开始前用 `/save` 记录项目背景
2. **迭代设计**: Claude 设计 → Codex 审查 → Claude 优化
3. **决策追踪**: 重要决策立即用 `/save` 保存
4. **定期回顾**: 用 `/history` 查看历史讨论
5. **成本控制**: 每条消息都消耗 API token，注意使用量

### 🛠️ 故障排查

**调试模式:**
```bash
NODE_ENV=development npm run cli
```

**测试 API 连接:**
```bash
# 测试 Claude API
curl -X POST $CLAUDE_BASE_URL/messages \
  -H "x-api-key: $CLAUDE_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-3-5-sonnet-20241022","max_tokens":100,"messages":[{"role":"user","content":"test"}]}'

# 测试 OpenAI 兼容 API
curl -X POST $CODEX_BASE_URL/chat/completions \
  -H "Authorization: Bearer $CODEX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-4","messages":[{"role":"user","content":"test"}],"max_tokens":10}'
```

### 📝 开源协议

MIT

### 🤝 贡献

欢迎贡献！请随时提交 Pull Request。

### 🙏 致谢

感谢所有使用和贡献本项目的开发者。

---

Made with ❤️ by the community
