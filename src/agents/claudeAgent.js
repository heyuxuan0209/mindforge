const axios = require('axios');
const { readTimeoutMs } = require('../utils/httpConfig');

class ClaudeAgent {
  constructor() {
    this.baseURL = process.env.CLAUDE_BASE_URL;
    this.apiKey = process.env.CLAUDE_API_KEY;
    this.model = process.env.CLAUDE_MODEL || 'claude-opus-4-8';
    this.timeoutMs = readTimeoutMs('CLAUDE_API_TIMEOUT_MS', 180000);
  }

  async chat(messages, systemPrompt = '') {
    try {
      const response = await axios.post(
        `${this.baseURL}/messages`,
        {
          model: this.model,
          max_tokens: 4096,
          system: systemPrompt,
          messages: messages
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01'
          },
          timeout: this.timeoutMs
        }
      );

      return response.data.content[0].text;
    } catch (error) {
      console.error('Claude API Error:', error.response?.data || error.message);
      throw new Error(`Claude API 调用失败: ${error.message}`);
    }
  }

  buildSystemPrompt(context) {
    const {
      brief,
      decisions,
      current,
      handoff,
      memory,
      status,
      review,
      recentTranscript,
    } = context;

    let prompt = `你是这个项目的架构师和开发者。\n\n`;

    if (brief) {
      prompt += `【项目背景】\n${brief}\n\n`;
    }

    if (decisions && decisions.length > 0) {
      prompt += `【已确认决策】\n`;
      decisions.slice(-10).forEach((decision, idx) => {
        prompt += `${idx + 1}. ${decision}\n`;
      });
      prompt += `\n`;
    }

    if (current) {
      prompt += `【当前方案/产物】\n${current}\n\n`;
    }

    if (handoff) {
      prompt += `【交接包】\n${handoff}\n\n`;
    }

    if (memory) {
      prompt += `【长期记忆】\n${memory}\n\n`;
    }

    if (status) {
      prompt += `【当前状态】\n${status}\n\n`;
    }

    if (review) {
      prompt += `【最近 Review】\n${review}\n\n`;
    }

    if (recentTranscript) {
      prompt += `【最近对话摘录】\n${recentTranscript}\n\n`;
    }

    prompt += `请基于以上共享上下文回答用户问题。不要声称不知道之前讨论，除非共享上下文确实为空。如果做出重要决策，请提醒用户用 /decision 记录。`;

    return prompt;
  }
}

module.exports = ClaudeAgent;
