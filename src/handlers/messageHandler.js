const ClaudeAgent = require('../agents/claudeAgent');
const CodexAgent = require('../agents/codexAgent');
const GeminiAgent = require('../agents/geminiAgent');

class MessageHandler {
  constructor(contextManager, feishuClient) {
    this.contextManager = contextManager;
    this.feishuClient = feishuClient;
    this.claudeAgent = new ClaudeAgent();
    this.codexAgent = new CodexAgent();
    this.geminiAgent = new GeminiAgent();
    this.conversationHistory = [];
  }

  // 解析消息，识别 @ 的 Bot
  parseMessage(text) {
    const botPatterns = {
      claude: /@Claude|@claude|@CLAUDE/i,
      codex: /@Codex|@codex|@CODEX/i,
      gemini: /@Gemini|@gemini|@GEMINI/i
    };

    for (const [bot, pattern] of Object.entries(botPatterns)) {
      if (pattern.test(text)) {
        // 移除 @ 标记，获取纯用户消息
        const userMessage = text.replace(pattern, '').trim();
        return { bot, userMessage };
      }
    }

    return null;
  }

  // 处理消息并调用对应 Agent
  async handleMessage(messageText, messageId = null) {
    const parsed = this.parseMessage(messageText);

    if (!parsed) {
      console.log('消息未 @ 任何 Bot，忽略');
      return;
    }

    const { bot, userMessage } = parsed;
    console.log(`识别到 @${bot.toUpperCase()}，用户消息: ${userMessage}`);

    try {
      // 获取上下文
      const context = await this.contextManager.getContext();

      let response;

      if (bot === 'claude') {
        response = await this.handleClaude(userMessage, context);
      } else if (bot === 'codex') {
        response = await this.handleCodex(userMessage, context);
      } else if (bot === 'gemini') {
        response = await this.handleGemini(userMessage, context);
      }

      // 发送响应到飞书群
      const replyText = `【${bot.toUpperCase()} 回复】\n\n${response}`;

      if (messageId) {
        // 使用回复 API
        await this.feishuClient.replyMessage(messageId, replyText);
      } else {
        // 使用 Webhook（兼容旧方式）
        await this.feishuClient.sendMessage(replyText);
      }

      // 检查是否需要更新文档
      await this.analyzeAndUpdateDocs(response, bot);

      this.conversationHistory.push({
        timestamp: new Date().toISOString(),
        agent: bot,
        user: userMessage,
        response,
      });

    } catch (error) {
      console.error('处理消息失败:', error);
      const errorText = `❌ 处理失败: ${error.message}`;
      if (messageId) {
        await this.feishuClient.replyMessage(messageId, errorText);
      } else {
        await this.feishuClient.sendMessage(errorText);
      }
    }
  }

  async handleClaude(userMessage, context) {
    const systemPrompt = this.claudeAgent.buildSystemPrompt(context);
    const messages = this.buildMessages(userMessage);
    return await this.claudeAgent.chat(messages, systemPrompt);
  }

  async handleCodex(userMessage, context) {
    const systemPrompt = this.codexAgent.buildReviewerPrompt(context, {
      userMessage,
      previousClaudeResponse: this.getLatestResponse('claude'),
      recentTranscript: this.buildRecentTranscript(),
    });
    const messages = [{ role: 'user', content: userMessage }];
    return await this.codexAgent.chat(messages, systemPrompt);
  }

  async handleGemini(userMessage, context) {
    const systemPrompt = this.geminiAgent.buildChallengerPrompt(context);
    const messages = [{ role: 'user', content: userMessage }];
    return await this.geminiAgent.chat(messages, systemPrompt);
  }

  // 分析响应内容，判断是否需要更新文档
  async analyzeAndUpdateDocs(response, bot) {
    // 简单的关键词检测
    const decisionKeywords = ['决定', '确定', '选择', '不考虑', '采用'];
    const hasDecision = decisionKeywords.some(keyword => response.includes(keyword));

    if (hasDecision) {
      console.log('检测到决策内容，建议手动更新文档');
      // 实际项目中可以用 LLM 提取决策并自动写入
    }

    // 如果是方案产出（长文本），更新 current.md
    if (response.length > 500 && bot === 'claude') {
      console.log('检测到方案产出，建议更新 current.md');
      await this.contextManager.updateContext('current', response);
    }

    // 如果是 Review 输出，更新 review.md
    if (bot === 'codex' && (response.includes('[S0]') || response.includes('[S1]'))) {
      console.log('检测到 Review 问题，建议更新 review.md');
      await this.contextManager.updateContext('review', response);
    }
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
}

module.exports = MessageHandler;
