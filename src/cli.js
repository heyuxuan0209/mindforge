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
    this.currentAgent = 'claude';

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

      this.context.brief = await fs.readFile(briefPath, 'utf-8').catch(() => '');
      this.context.current = await fs.readFile(currentPath, 'utf-8').catch(() => '');

      const decisionsContent = await fs.readFile(decisionsPath, 'utf-8').catch(() => '');
      this.context.decisions = decisionsContent.split('\n').filter(line => line.trim());

    } catch (error) {
      // 首次使用，没有上下文文件
    }
  }

  async saveContext(section, content) {
    const filePath = path.join(this.contextDir, `${section}.md`);
    await fs.writeFile(filePath, content, 'utf-8');
    console.log(`✅ 已保存到 ${section}.md`);
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
      await this.askAgent(this.currentAgent, trimmed);
    }
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
      const messages = [{ role: 'user', content: message }];
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

      // 自动检测决策并保存
      await this.autoSaveDecisions(response);

    } catch (error) {
      console.error(`❌ 调用失败: ${error.message}`);
    }
  }

  buildSystemPrompt(agentName) {
    const baseContext = `
项目背景：
${this.context.brief || '（暂无）'}

已做决策：
${this.context.decisions.join('\n') || '（暂无）'}

当前方案：
${this.context.current || '（暂无）'}
`;

    switch (agentName) {
      case 'claude':
        return this.claudeAgent.buildSystemPrompt(this.context);
      case 'codex':
        return this.codexAgent.buildReviewerPrompt(this.context);
      case 'gemini':
        return this.geminiAgent.buildChallengerPrompt(this.context);
      default:
        return baseContext;
    }
  }

  async autoSaveDecisions(response) {
    const decisionKeywords = ['决定', '确定', '选择', '采用', '不考虑'];
    const hasDecision = decisionKeywords.some(kw => response.includes(kw));

    if (hasDecision) {
      console.log('\n💡 检测到决策内容，是否保存? (y/n)');
      // 简化版：自动保存
      const timestamp = new Date().toLocaleString();
      const decision = `[${timestamp}] ${response.substring(0, 200)}...`;
      this.context.decisions.push(decision);
      await this.saveContext('decisions', this.context.decisions.join('\n\n'));
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
