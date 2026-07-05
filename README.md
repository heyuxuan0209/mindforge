# MindForge

Turn vague ideas into clear decisions, better designs, and stronger execution.

把模糊想法逐步锻造成清晰决策、更优设计与更稳执行。

MindForge is currently implemented in this repository as a terminal-based workflow for multi-role AI collaboration, while the product direction evolves toward a broader platform.

MindForge 当前在这个仓库中先以终端工作流的形式实现，用于多角色 AI 协作，产品定位会逐步演进为更完整的平台。

[English](#english) | [中文](#chinese)

---

<a name="english"></a>
## English

MindForge is a multi-role AI platform for complex product work. It helps users turn vague goals into clear decisions, then continue through design, development, testing, and iteration with shared context across AI roles.

### Why Multi-Role AI Collaboration?

This project is not about calling several models for novelty. It is about creating a more reliable thinking and decision environment for uncertain work.

Many real projects do not start with a clear task. They start with a vague goal, a concern, or a rough direction. A single agent can too quickly translate that ambiguity into a concrete task and start producing output. Multi-role AI collaboration helps turn fuzzy intent into a clearer problem: one role expands the idea, another challenges whether the understanding is correct, and the user gets a more reviewable path forward.

Single-agent conversations also tend to develop inertia over long sessions. The agent may keep following its earlier assumptions, avoid reopening weak premises, or move toward implementation before the problem is fully understood. A second agent provides an external review loop that can question the plan, expose hidden risks, and prevent a plausible answer from becoming an unchallenged answer.

There is also a human factor: a single assistant often tries to be helpful by agreeing, accelerating, and pushing the user forward. That is useful for clear tasks, but risky for strategy, architecture, product decisions, or debugging. In those cases, thinking clearly before doing quickly matters more. This terminal gives the user a workflow for discussion, handoff, review, and decision capture.

The goal is therefore:

- Clarify vague goals before execution.
- Separate solution generation from solution review.
- Break single-agent path dependence and blind spots.
- Preserve intermediate consensus across model switches and restarts.
- Record final decisions so future agents can continue from shared context.

### ✨ Features

- 🤖 **Multi-Role AI Collaboration**: Combine Builder, Reviewer, and Challenger roles for stronger solution design
- 📝 **Automatic Context Management**: Auto-save project background, decisions, and current solutions
- 💬 **Interactive Terminal**: Easy-to-use command-line interface
- 🔄 **Conversation History**: All dialogues are automatically saved locally
- 🎯 **Role-based AI**: Different AIs play specific roles (Builder, Reviewer, Challenger)

### 🚀 Quick Start

#### Installation

```bash
git clone https://github.com/yourusername/mindforge.git
cd mindforge
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
echo 'alias ai="cd /path/to/mindforge && npm run cli"' >> ~/.zshrc
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

# Save the latest stage discussion for the next agent
/handoff

# Record a final decision
/decision Use 1-year expiration policy for points

# Save the current solution body
/save Use Redis + MySQL dual-write approach

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
> /handoff
> @codex Review the handoff, focus on performance and security

# 3. Claude optimizes based on feedback
> @claude Optimize the design based on Codex's concurrency concerns

# 4. Save final decision
> /decision Adopt Redis + MySQL dual-write approach, Redis for hot data cache
```

### 📁 Project Structure

```
mindforge/
├── .ai-context/          # Auto-generated context directory
│   ├── brief.md         # Project background
│   ├── decisions.md     # Decision log
│   ├── handoff.md       # Stage handoff for the next agent
│   ├── history.json     # Local conversation history
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

1. **Start with Context**: Use `/save` to document the current solution or project state
2. **Iterative Design**: Claude designs → Codex reviews → Claude refines
3. **Handoff Before Review**: Use `/handoff` after a stage discussion so the next agent can review without asking you to paste context again
4. **Decision Tracking**: Use `/decision` only when a conclusion is actually settled
5. **Regular Review**: Use `/history` to review past discussions
6. **Cost Control**: Each message costs API tokens, be mindful of usage

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

MindForge 是一个面向复杂产品工作的多角色 AI 协作平台，帮助用户把模糊目标逐步变成清晰决策，并在共享上下文的基础上继续推进设计、开发、测试与迭代。

### 为什么做多角色 AI 协作？

这个项目不是为了“同时调用多个模型”而做多角色 AI 协作。它真正要解决的是：在高不确定性的工作里，给用户一个更可靠的思考、交接和决策环境。

很多真实项目一开始并不是清晰任务，而是一个模糊目标、一个焦虑点、一个大概方向。单一 agent 很容易过早把模糊问题翻译成一个看似明确的任务，然后直接开始产出。多角色 AI 协作的价值，是让一个角色帮用户展开问题，让另一个角色审视这个理解是否偏了，让问题从“模糊想法”逐渐变成“可判断、可执行、可 review 的任务”。

单一 agent 在长轮次对话里也容易形成惯性：沿着自己前面说过的话继续走，不愿意推翻早期假设，或者在问题还没想清楚时就推动实现。第二个 agent 的意义，不只是换一个模型，而是引入外部视角，对前一个方案进行挑战、审查和纠偏，避免一个“说得通”的方案未经检验就变成默认答案。

还有一个现实问题：单一助手往往会为了显得有帮助而顺着用户、推动用户快点开始做。对于清晰任务，这很好；但对于产品方向、架构设计、复杂调试和策略判断，先想清楚往往比马上开干更重要。这个终端希望把“讨论、交接、审查、决策沉淀”变成一个稳定流程。

因此，这个工具解决的核心痛点是：

- 把模糊目标逐步澄清，而不是过早执行。
- 把方案生成和方案审查拆开，避免单一视角。
- 打破单一 agent 的路径依赖、信息茧房和隐性降质。
- 在切换模型、重启终端、进入下一阶段时保留上下文。
- 把阶段性讨论保存成交接包，把最终结论沉淀为决策文档。

### ✨ 功能特点

- 🤖 **多角色 AI 协作**: 通过建设者、审查者、挑战者等角色共同推进方案
- 📝 **自动上下文管理**: 自动保存项目背景、决策记录和当前方案
- 💬 **交互式终端**: 简洁易用的命令行界面
- 🔄 **对话历史**: 所有对话自动保存在本地
- 🎯 **角色分工**: 不同 AI 扮演特定角色（建设者、审查者、挑战者）

### 🚀 快速开始

#### 安装

```bash
git clone https://github.com/yourusername/mindforge.git
cd mindforge
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
echo 'alias ai="cd /path/to/mindforge && npm run cli"' >> ~/.zshrc
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

# 保存阶段性讨论，交给下一个 agent
/handoff

# 记录最终决策
/decision 采用积分1年过期策略

# 保存当前方案正文
/save 采用 Redis + MySQL 双写方案

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
> /handoff
> @codex 基于交接包审查方案，关注性能和安全性

# 3. Claude 根据反馈优化
> @claude 针对 Codex 提出的并发问题，优化设计

# 4. 保存最终决策
> /decision 采用 Redis + MySQL 双写方案，Redis 做热数据缓存
```

### 📁 项目结构

```
mindforge/
├── .ai-context/          # 自动生成的上下文目录
│   ├── brief.md         # 项目背景
│   ├── decisions.md     # 决策记录
│   ├── handoff.md       # 给下一个 agent 的阶段交接包
│   ├── history.json     # 本地对话历史
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

1. **从上下文开始**: 用 `/save` 记录当前方案或项目状态
2. **迭代设计**: Claude 设计 → Codex 审查 → Claude 优化
3. **审查前交接**: 阶段讨论后用 `/handoff` 保存交接包，下一位 agent 不需要你重新粘贴上下文
4. **决策追踪**: 真正拍板后再用 `/decision` 保存最终结论
5. **定期回顾**: 用 `/history` 查看历史讨论
6. **成本控制**: 每条消息都消耗 API token，注意使用量

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
