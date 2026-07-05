#!/usr/bin/env node

require('dotenv').config();
const readline = require('readline');
const fs = require('fs').promises;
const path = require('path');
const ClaudeAgent = require('./agents/claudeAgent');
const CodexAgent = require('./agents/codexAgent');
const GeminiAgent = require('./agents/geminiAgent');

class MultiAgentCLI {
  constructor() {
    this.claudeAgent = new ClaudeAgent();
    this.codexAgent = new CodexAgent();
    this.geminiAgent = new GeminiAgent();

    this.contextDir = path.join(process.cwd(), '.ai-context');
    this.context = {
      brief: '',
      decisions: [],
      current: '',
      handoff: '',
      review: '',
      memory: '',
      status: ''
    };

    this.conversationHistory = [];
    this.historyPath = path.join(this.contextDir, 'history.json');
    this.currentAgent = 'claude';
    this.pendingPaste = '';
    this.pasteTimer = null;

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '🤖 [claude] > '
    });
  }

  async init() {
    // 创建上下文目录
    try {
      await fs.mkdir(this.contextDir, { recursive: true });
    } catch (error) {
      // 目录已存在
    }

    // 加载已有上下文
    await this.loadContext();
    await this.loadHistory();

    console.log(`
╔════════════════════════════════════════════╗
║     🤖 多 Agent 协作终端工具              ║
╚════════════════════════════════════════════╝

可用命令：
  @claude <消息>    - 询问 Claude（Builder）
  @codex <消息>     - 询问 Codex（Reviewer）
  @gemini <消息>    - 询问 Gemini（Challenger）

  /discuss <话题>   - 多 AI 轮流讨论
  /switch <agent>   - 切换默认 AI (claude/codex/gemini)
  /context          - 查看当前项目上下文
  /decision <内容>  - 记录一条共享决策
  /record <内容>    - /decision 的别名
  /handoff [内容]   - 保存交接包；不填内容时自动保存最近对话
  /save <内容>      - 保存决策到文档
  /history          - 查看对话历史
  /clear            - 清空对话历史
  /help             - 显示帮助
  /exit             - 退出

当前 AI: ${this.currentAgent}
上下文目录: ${this.contextDir}
════════════════════════════════════════════
`);
  }

  async loadContext() {
    try {
      const briefPath = path.join(this.contextDir, 'brief.md');
      const decisionsPath = path.join(this.contextDir, 'decisions.md');
      const currentPath = path.join(this.contextDir, 'current.md');
      const handoffPath = path.join(this.contextDir, 'handoff.md');
      const reviewPath = path.join(this.contextDir, 'review.md');
      const memoryPath = path.join(this.contextDir, 'memory.md');
      const statusPath = path.join(this.contextDir, 'status.md');

      this.context.brief = await fs.readFile(briefPath, 'utf-8').catch(() => '');
      this.context.current = await fs.readFile(currentPath, 'utf-8').catch(() => '');
      this.context.handoff = await fs.readFile(handoffPath, 'utf-8').catch(() => '');
      this.context.review = await fs.readFile(reviewPath, 'utf-8').catch(() => '');
      this.context.memory = await fs.readFile(memoryPath, 'utf-8').catch(() => '');
      this.context.status = await fs.readFile(statusPath, 'utf-8').catch(() => '');

      const decisionsContent = await fs.readFile(decisionsPath, 'utf-8').catch(() => '');
      this.context.decisions = decisionsContent
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('- ') || line.startsWith('['));

    } catch (error) {
      // 首次使用，没有上下文文件
    }
  }

  async loadHistory() {
    try {
      const raw = await fs.readFile(this.historyPath, 'utf-8');
      const parsed = JSON.parse(raw);
      this.conversationHistory = Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      this.conversationHistory = [];
    }
  }

  async saveContext(section, content) {
    const filePath = path.join(this.contextDir, `${section}.md`);
    await fs.writeFile(filePath, content, 'utf-8');
    console.log(`✅ 已保存到 ${section}.md`);
  }

  async saveHistory() {
    await fs.writeFile(this.historyPath, JSON.stringify(this.conversationHistory, null, 2), 'utf-8');
  }

  async handleCommand(input) {
    const trimmed = input.trim();

    // 处理 @ 命令（支持有无空格）
    if (trimmed.startsWith('@')) {
      const match = trimmed.match(/^@(\w+)\s*(.*)$/);
      if (match) {
        const [, agent, message] = match;
        if (message) {
          await this.askAgent(agent, message);
          return;
        } else {
          console.log('❌ 请输入消息内容，例如: @codex 你好');
          return;
        }
      }
    }

    // 处理 / 命令
    if (trimmed.startsWith('/')) {
      const [cmd, ...args] = trimmed.slice(1).split(' ');
      await this.executeCommand(cmd, args.join(' '));
      return;
    }

    // 默认使用当前 AI
    if (trimmed) {
      await this.enqueueMessage(trimmed);
    }
  }

  async enqueueMessage(message) {
    this.pendingPaste = this.pendingPaste ? `${this.pendingPaste}\n${message}` : message;
    if (this.pasteTimer) clearTimeout(this.pasteTimer);
    this.pasteTimer = setTimeout(() => {
      void this.flushPendingPaste();
    }, 120);
  }

  async flushPendingPaste() {
    if (this.pasteTimer) {
      clearTimeout(this.pasteTimer);
      this.pasteTimer = null;
    }
    const message = this.pendingPaste.trim();
    this.pendingPaste = '';
    if (!message) return;
    await this.askAgent(this.currentAgent, message);
  }

  async askAgent(agentName, message) {
    let agent;
    let role;

    switch (agentName.toLowerCase()) {
      case 'claude':
        agent = this.claudeAgent;
        role = 'Builder';
        break;
      case 'codex':
        agent = this.codexAgent;
        role = 'Reviewer';
        break;
      case 'gemini':
        agent = this.geminiAgent;
        role = 'Challenger';
        break;
      default:
        console.log(`❌ 未知 Agent: ${agentName}`);
        return;
    }

    console.log(`\n💭 正在询问 ${agentName} (${role})...\n`);

    try {
      const systemPrompt = this.buildSystemPrompt(agentName);
      const messages = this.buildMessages(message);
      const response = await agent.chat(messages, systemPrompt);

      console.log(`\n【${agentName.toUpperCase()} 回复】\n`);
      console.log(response);
      console.log('\n' + '─'.repeat(50) + '\n');

      // 记录对话历史
      this.conversationHistory.push({
        timestamp: new Date().toISOString(),
        agent: agentName,
        user: message,
        response: response
      });
      await this.saveHistory();

      // 自动检测决策并保存
      await this.autoSaveDecisions(response);

    } catch (error) {
      console.error(`❌ 调用失败: ${error.message}`);
    }
  }

  buildSystemPrompt(agentName) {
    const context = this.buildSharedContext();
    const baseContext = `
项目背景：
${context.brief || '（暂无）'}

已做决策：
${context.decisions.join('\n') || '（暂无）'}

当前方案：
${context.current || '（暂无）'}
`;

    switch (agentName) {
      case 'claude':
        return this.claudeAgent.buildSystemPrompt(context);
      case 'codex':
        return this.codexAgent.buildReviewerPrompt(context, {
          userMessage: this.buildRecentTranscript(1),
          previousClaudeResponse: this.getLatestResponse('claude'),
          recentTranscript: this.buildRecentTranscript(),
        });
      case 'gemini':
        return this.geminiAgent.buildChallengerPrompt(context);
      default:
        return baseContext;
    }
  }

  buildSharedContext() {
    return {
      ...this.context,
      recentTranscript: this.buildRecentTranscript()
    };
  }

  buildMessages(userMessage) {
    const transcript = this.buildRecentTranscript();
    if (!transcript) {
      return [{ role: 'user', content: userMessage }];
    }

    return [
      { role: 'user', content: transcript },
      { role: 'user', content: userMessage }
    ];
  }

  buildRecentTranscript(limit = 6) {
    const entries = this.conversationHistory.slice(-limit);
    if (entries.length === 0) return '';

    return entries
      .map((entry) => {
        const label = entry.agent.toUpperCase();
        return `[${label}] 用户: ${entry.user}\n[${label}] 回复: ${entry.response}`;
      })
      .join('\n\n');
  }

  getLatestResponse(agentName) {
    for (let i = this.conversationHistory.length - 1; i >= 0; i -= 1) {
      const entry = this.conversationHistory[i];
      if (entry.agent === agentName && entry.response) {
        return entry.response;
      }
    }
    return '';
  }

  async autoSaveDecisions(response) {
    if (response.includes('/decision')) {
      console.log('\n💡 如果这是重要决策，请用 /decision <内容> 记录到共享决策文档。');
    }
  }

  async executeCommand(cmd, args) {
    switch (cmd) {
      case 'discuss':
        await this.multiAgentDiscuss(args);
        break;

      case 'switch':
        if (['claude', 'codex', 'gemini'].includes(args)) {
          this.currentAgent = args;
          this.rl.setPrompt(`🤖 [${args}] > `);
          console.log(`✅ 已切换到 ${args}`);
        } else {
          console.log('❌ 无效的 Agent，可选: claude, codex, gemini');
        }
        break;

      case 'context':
        console.log('\n【当前上下文】');
        console.log('项目背景:', this.context.brief || '（暂无）');
        console.log('决策数量:', this.context.decisions.length);
        console.log('当前方案:', this.context.current ? '已有' : '（暂无）');
        console.log('历史记录:', this.conversationHistory.length);
        break;

      case 'decision':
        await this.addDecision(args);
        break;

      case 'record':
        await this.addDecision(args);
        break;

      case 'handoff':
        await this.saveHandoff(args);
        break;

      case 'save':
        await this.saveContext('current', args);
        this.context.current = args;
        break;

      case 'history':
        console.log('\n【对话历史】');
        this.conversationHistory.slice(-5).forEach((entry, i) => {
          console.log(`\n${i + 1}. [${entry.agent}] ${entry.timestamp}`);
          console.log(`   User: ${entry.user.substring(0, 50)}...`);
          console.log(`   AI: ${entry.response.substring(0, 100)}...`);
        });
        break;

      case 'clear':
        this.conversationHistory = [];
        await this.saveHistory();
        console.log('✅ 对话历史已清空');
        break;

      case 'help':
        await this.init();
        break;

      case 'exit':
        console.log('\n👋 再见！');
        process.exit(0);
        break;

      default:
        console.log(`❌ 未知命令: /${cmd}`);
    }
  }

  async addDecision(content) {
    const trimmed = content.trim();
    if (!trimmed) {
      console.log('❌ 请输入决策内容，例如: /decision MVP 使用 Express + SQLite');
      return;
    }

    const date = new Date().toISOString().slice(0, 10);
    const line = `- [${date}] ${trimmed}`;
    this.context.decisions.push(line);
    await this.saveContext('decisions', this.context.decisions.join('\n'));
  }

  async saveHandoff(content) {
    const manual = content.trim();
    const handoff = manual || this.buildHandoffFromRecentTranscript();
    if (!handoff.trim()) {
      console.log('❌ 还没有可保存的对话。请先和 agent 讨论，或使用 /handoff <内容>');
      return;
    }

    await this.saveContext('handoff', handoff);
    this.context.handoff = handoff;
    console.log('✅ 已保存交接包。现在可以 @codex / @gemini 让下一个 agent 基于它继续。');
  }

  buildHandoffFromRecentTranscript(limit = 4) {
    const entries = this.conversationHistory.slice(-limit);
    if (entries.length === 0) return '';

    const lines = [
      `# 交接包`,
      ``,
      `生成时间: ${new Date().toISOString()}`,
      `来源: 最近 ${entries.length} 轮对话`,
      ``,
      `## 最近讨论`,
      ``,
    ];

    entries.forEach((entry, idx) => {
      const label = entry.agent.toUpperCase();
      lines.push(
        `### ${idx + 1}. ${label} - ${entry.timestamp}`,
        ``,
        `**用户:**`,
        entry.user,
        ``,
        `**${label} 回复:**`,
        entry.response,
        ``,
      );
    });

    lines.push(
      `## 给下一位 agent`,
      ``,
      `请基于上面的阶段性讨论继续，不要要求用户重新粘贴上下文。先判断当前方案是否合理，再给出建议或 review。`,
      ``,
    );

    return lines.join('\n');
  }

  async multiAgentDiscuss(topic) {
    console.log(`\n🎯 开始多 Agent 讨论：${topic}\n`);
    console.log('═'.repeat(50));

    const agents = [
      { name: 'claude', label: 'Builder' },
      { name: 'codex', label: 'Reviewer' },
      { name: 'gemini', label: 'Challenger' }
    ];

    for (const { name, label } of agents) {
      console.log(`\n🤖 ${name.toUpperCase()} (${label}) 的观点：\n`);
      await this.askAgent(name, topic);
      await new Promise(resolve => setTimeout(resolve, 1000)); // 间隔1秒
    }

    console.log('\n✅ 讨论结束\n');
  }

  start() {
    this.rl.prompt();

    this.rl.on('line', async (line) => {
      await this.handleCommand(line);
      this.rl.prompt();
    });

    this.rl.on('close', () => {
      void this.flushPendingPaste().catch(() => {});
      console.log('\n👋 再见！');
      process.exit(0);
    });
  }
}

// 启动
(async () => {
  const cli = new MultiAgentCLI();
  await cli.init();
  cli.start();
})();
