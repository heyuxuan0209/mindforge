const axios = require('axios');

class ClaudeAgent {
  constructor() {
    this.baseURL = process.env.CLAUDE_BASE_URL;
    this.apiKey = process.env.CLAUDE_API_KEY;
    this.model = process.env.CLAUDE_MODEL || 'claude-opus-4-8';
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
          timeout: 60000
        }
      );

      return response.data.content[0].text;
    } catch (error) {
      console.error('Claude API Error:', error.response?.data || error.message);
      throw new Error(`Claude API 调用失败: ${error.message}`);
    }
  }

  buildSystemPrompt(context) {
    const { brief, decisions, handoff } = context;

    let prompt = `你是这个项目的架构师和开发者。\n\n`;

    if (brief) {
      prompt += `【项目背景】\n${brief}\n\n`;
    }

    if (decisions && decisions.length > 0) {
      prompt += `【已确认决策】\n`;
      decisions.slice(-5).forEach((decision, idx) => {
        prompt += `${idx + 1}. ${decision}\n`;
      });
      prompt += `\n`;
    }

    if (handoff) {
      prompt += `【交接包】\n${handoff}\n\n`;
    }

    prompt += `请基于以上上下文回答用户问题。如果做出重要决策，请在回复中明确说明。`;

    return prompt;
  }
}

module.exports = ClaudeAgent;
