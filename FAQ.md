# FAQ / 常见问题

[English](#english) | [中文](#chinese)

---

<a name="english"></a>
## English

### General Questions

**Q: What is Multi-AI Context Manager?**

A: It's a terminal-based tool that allows you to collaborate with multiple AI models (Claude, GPT, etc.) while automatically managing project context and decisions. Think of it as having a team of AI assistants with different roles working together on your project.

**Q: Why use multiple AIs instead of just one?**

A: Different AI models have different strengths. By having them play different roles (Builder, Reviewer, Challenger), you get:
- More comprehensive solutions
- Better error detection
- Multiple perspectives on problems
- Higher quality decisions

**Q: Do I need all three AIs (Claude, Codex, Gemini)?**

A: No! The tool works great with just Claude + Codex. Gemini is optional and adds a third perspective, but two AIs are sufficient for most use cases.

---

### Setup & Configuration

**Q: Where do I get API keys?**

A:
- **Claude**: Official Anthropic API or proxy services
- **OpenAI/GPT**: OpenAI official API or compatible proxies
- **Gemini**: Google AI Studio (optional)

**Q: Can I use API proxy services?**

A: Yes! The tool supports any OpenAI-compatible API endpoint. Just update the `BASE_URL` in your `.env` file.

**Q: I'm in a region where APIs are restricted. What should I do?**

A:
1. Use proxy services that operate in your region
2. Use a VPN for API access
3. Look for regional API providers

**Q: The model name from my provider doesn't work. What should I do?**

A: Check your provider's documentation for supported model names. Common variations:
- Standard: `gpt-4`, `gpt-4-turbo`, `claude-3-5-sonnet-20241022`
- Provider-specific: `gpt-5.5`, `gpt-4-turbo-preview`, etc.

---

### Usage

**Q: How do I start a conversation?**

A: Simply type `@claude` or `@codex` followed by your message:
```
@claude Design a user authentication system
```

**Q: Can I use it without the @ symbol?**

A: Yes! Use `/switch claude` to set a default AI, then just type your messages directly.

**Q: How is context shared between AIs?**

A: All AIs have access to:
- Project background (brief.md)
- Past decisions (decisions.md)
- Current solution (current.md)
- Conversation history in the current session

**Q: Where is my data stored?**

A: Everything is stored locally in the `.ai-context/` folder. Nothing is uploaded to any server except API calls to the AI providers.

**Q: Can I use this for multiple projects?**

A: Currently, context is per-directory. We recommend:
1. Create a separate directory for each project
2. Or manually clear/update context when switching projects
3. Future versions will support multi-project management

---

### Troubleshooting

**Q: I get "connection timeout" errors**

A:
1. Check your internet connection
2. Verify the API endpoint is accessible from your region
3. Try a different API provider or use a VPN
4. Check if your API key is valid

**Q: API calls are slow**

A: This is normal. AI model responses can take 5-30 seconds depending on:
- Model size and complexity
- API provider response time
- Your network connection
- Request queue on the provider side

**Q: I get "model not supported" errors**

A: Your API provider doesn't support that model name. Solutions:
1. Check provider's documentation for available models
2. Update `CODEX_MODEL` in `.env` to a supported model
3. Contact your API provider for model availability

**Q: Gemini keeps timing out**

A: Google's Gemini API may be restricted in your region. Solutions:
1. Leave `GEMINI_API_KEY` empty to disable Gemini
2. Use a VPN to access Google services
3. The tool works fine with just Claude + Codex

**Q: How do I update to the latest version?**

A:
```bash
cd /path/to/multi-ai-context
git pull origin main
npm install
```

---

### Best Practices

**Q: How should I structure my workflow?**

A: Recommended pattern:
1. **Claude (Builder)**: Design initial solution
2. **Codex (Reviewer)**: Review and identify issues
3. **Claude**: Refine based on feedback
4. **Save**: Document final decision

**Q: Should I save every decision?**

A: Save important architectural decisions, not every detail. Good to save:
- Technology choices
- Architecture patterns
- Important constraints
- Design tradeoffs

**Q: How often should I clear conversation history?**

A: Clear when:
- Starting a new project or phase
- Context gets too long (>50 messages)
- Switching to a different topic

**Q: Can I export conversations?**

A: Currently not supported, but planned for v1.1. As a workaround, conversations are stored in memory during the session.

---

### Cost & Performance

**Q: How much does it cost to use?**

A: Depends on your API provider's pricing:
- Typical conversation: 500-2000 tokens per message
- Cost per message: $0.01-0.10 (varies by model and provider)
- Budget: ~$10-50/month for regular use

**Q: How can I reduce costs?**

A:
1. Use smaller models (e.g., GPT-3.5-turbo instead of GPT-4)
2. Keep messages concise
3. Clear history regularly
4. Use `/context` to review before asking repetitive questions

**Q: Which model should I use for Codex?**

A: Recommendations:
- **Best quality**: GPT-4, GPT-4-turbo
- **Balanced**: GPT-4o, GPT-3.5-turbo
- **Budget**: GPT-3.5-turbo
- Provider-specific models: Check performance vs. cost

---

### Technical

**Q: What programming language is this written in?**

A: Node.js / JavaScript

**Q: Can I contribute to the project?**

A: Absolutely! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Q: Can I add my own AI provider?**

A: Yes! Create a new agent in `src/agents/` following the existing pattern. See CONTRIBUTING.md for details.

**Q: Is there a web interface?**

A: Not yet, but it's on the roadmap for v1.2. The terminal interface is intentionally simple and keyboard-friendly.

**Q: Can I use this in scripts or automation?**

A: Currently designed for interactive use. Programmatic API is planned for future versions.

---

<a name="chinese"></a>
## 中文

### 基本问题

**问：Multi-AI Context Manager 是什么？**

答：这是一个终端工具，让你可以同时与多个 AI 模型（Claude、GPT 等）协作，同时自动管理项目上下文和决策。可以理解为有一个由不同角色 AI 助手组成的团队在协助你的项目。

**问：为什么要用多个 AI 而不是一个？**

答：不同的 AI 模型各有优势。让它们扮演不同角色（建设者、审查者、挑战者），可以得到：
- 更全面的解决方案
- 更好的错误检测
- 多角度的问题分析
- 更高质量的决策

**问：我需要配置全部三个 AI（Claude、Codex、Gemini）吗？**

答：不需要！只用 Claude + Codex 就很好用。Gemini 是可选的，可以提供第三个视角，但对大多数场景来说两个 AI 就足够了。

---

### 安装配置

**问：在哪里获取 API 密钥？**

答：
- **Claude**: Anthropic 官方 API 或中转服务
- **OpenAI/GPT**: OpenAI 官方 API 或兼容代理
- **Gemini**: Google AI Studio（可选）

**问：可以使用 API 中转服务吗？**

答：可以！工具支持任何 OpenAI 兼容的 API 端点。只需在 `.env` 文件中更新 `BASE_URL`。

**问：我所在地区 API 受限，怎么办？**

答：
1. 使用本地区的中转服务
2. 使用 VPN 访问 API
3. 寻找区域性 API 提供商

**问：我的服务商的模型名称不工作，怎么办？**

答：查看服务商文档了解支持的模型名称。常见变体：
- 标准名称: `gpt-4`, `gpt-4-turbo`, `claude-3-5-sonnet-20241022`
- 服务商特定: `gpt-5.5`, `gpt-4-turbo-preview` 等

---

### 使用方法

**问：如何开始对话？**

答：输入 `@claude` 或 `@codex` 后跟你的消息：
```
@claude 设计一个用户认证系统
```

**问：可以不用 @ 符号吗？**

答：可以！使用 `/switch claude` 设置默认 AI，然后直接输入消息即可。

**问：AI 之间如何共享上下文？**

答：所有 AI 都可以访问：
- 项目背景（brief.md）
- 过往决策（decisions.md）
- 当前方案（current.md）
- 当前会话的对话历史

**问：我的数据存储在哪里？**

答：所有内容都存储在本地的 `.ai-context/` 文件夹。除了向 AI 服务商发送 API 调用外，不会上传任何内容到服务器。

**问：可以用于多个项目吗？**

答：目前上下文是按目录管理的。建议：
1. 为每个项目创建单独的目录
2. 或切换项目时手动清空/更新上下文
3. 未来版本会支持多项目管理

---

### 故障排查

**问：我遇到"连接超时"错误**

答：
1. 检查网络连接
2. 确认 API 端点在你的地区可访问
3. 尝试其他 API 服务商或使用 VPN
4. 检查 API 密钥是否有效

**问：API 调用很慢**

答：这是正常的。AI 模型响应需要 5-30 秒，取决于：
- 模型大小和复杂度
- API 服务商响应时间
- 网络连接
- 服务商请求队列

**问：我遇到"模型不支持"错误**

答：你的 API 服务商不支持该模型名称。解决方法：
1. 查看服务商文档了解可用模型
2. 更新 `.env` 中的 `CODEX_MODEL` 为支持的模型
3. 联系服务商确认模型可用性

**问：Gemini 一直超时**

答：Google 的 Gemini API 在某些地区可能受限。解决方法：
1. 将 `GEMINI_API_KEY` 留空以禁用 Gemini
2. 使用 VPN 访问 Google 服务
3. 只用 Claude + Codex 也完全够用

**问：如何更新到最新版本？**

答：
```bash
cd /path/to/multi-ai-context
git pull origin main
npm install
```

---

### 最佳实践

**问：应该如何组织工作流？**

答：推荐模式：
1. **Claude（建设者）**：设计初始方案
2. **Codex（审查者）**：审查并找出问题
3. **Claude**：根据反馈优化
4. **保存**：记录最终决策

**问：应该保存每个决策吗？**

答：保存重要的架构决策，而不是每个细节。适合保存的：
- 技术选型
- 架构模式
- 重要约束
- 设计权衡

**问：多久清空一次对话历史？**

答：在以下情况清空：
- 开始新项目或新阶段
- 上下文太长（>50 条消息）
- 切换到不同话题

**问：可以导出对话吗？**

答：目前不支持，但计划在 v1.1 加入。临时方案：对话在会话期间存储在内存中。

---

### 成本与性能

**问：使用成本是多少？**

答：取决于 API 服务商定价：
- 典型对话：每条消息 500-2000 tokens
- 每条消息成本：$0.01-0.10（取决于模型和服务商）
- 预算：常规使用约 $10-50/月

**问：如何降低成本？**

答：
1. 使用小模型（如 GPT-3.5-turbo 而不是 GPT-4）
2. 保持消息简洁
3. 定期清空历史
4. 用 `/context` 查看上下文，避免重复提问

**问：Codex 应该用哪个模型？**

答：推荐：
- **最佳质量**: GPT-4, GPT-4-turbo
- **均衡**: GPT-4o, GPT-3.5-turbo
- **预算**: GPT-3.5-turbo
- 服务商特定模型：对比性能与成本

---

### 技术问题

**问：这个项目用什么语言编写？**

答：Node.js / JavaScript

**问：我可以贡献代码吗？**

答：当然！查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解指南。

**问：可以添加自己的 AI 服务商吗？**

答：可以！在 `src/agents/` 创建新 agent，参考现有模式。详见 CONTRIBUTING.md。

**问：有网页界面吗？**

答：目前没有，但在 v1.2 的路线图中。终端界面刻意设计得简单和键盘友好。

**问：可以用于脚本或自动化吗？**

答：目前设计用于交互式使用。程序化 API 计划在未来版本中加入。

---

还有其他问题？请在 [GitHub Issues](https://github.com/yourusername/multi-ai-context/issues) 提问！

Have more questions? Ask in [GitHub Issues](https://github.com/yourusername/multi-ai-context/issues)!
