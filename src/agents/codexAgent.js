const axios = require('axios');

class CodexAgent {
  constructor() {
    this.baseURL = process.env.CODEX_BASE_URL;
    this.apiKey = process.env.CODEX_API_KEY;
    this.model = process.env.CODEX_MODEL || 'gpt-4';
  }

  async chat(messages, systemPrompt = '') {
    try {
      const formattedMessages = [
        { role: 'system', content: systemPrompt },
        ...messages
      ];

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages: formattedMessages,
          max_tokens: 4096,
          temperature: 0.7
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          timeout: 60000
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Codex API Error:', error.response?.data || error.message);
      throw new Error(`Codex API 调用失败: ${error.message}`);
    }
  }

  buildReviewerPrompt(context) {
    const { brief, current } = context;

    let prompt = `你是代码和方案审查者。你的任务是挑战，不是帮忙完成。\n\n`;

    if (brief) {
      prompt += `【项目约束】\n${brief}\n\n`;
    }

    if (current) {
      prompt += `【被审查产物】\n${current}\n\n`;
    }

    prompt += `要求：
- 最多提出 5 个问题
- 按严重程度排序（S0 最严重，S2 次要）
- 格式：[S0|S1|S2] 位置: 问题描述 -> 建议修复
- 不要超出 5 个，强制选择最重要的

请开始审查。`;

    return prompt;
  }
}

module.exports = CodexAgent;
