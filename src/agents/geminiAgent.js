const axios = require('axios');
const { readTimeoutMs } = require('../utils/httpConfig');

class GeminiAgent {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.model = process.env.GEMINI_MODEL || 'gemini-pro';
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta';
    this.timeoutMs = readTimeoutMs('GEMINI_API_TIMEOUT_MS', 180000);
  }

  async chat(messages, systemPrompt = '') {
    try {
      // Gemini API 格式：合并 system 和 user messages
      let fullPrompt = '';

      if (systemPrompt) {
        fullPrompt += `${systemPrompt}\n\n`;
      }

      messages.forEach(msg => {
        if (msg.role === 'user') {
          fullPrompt += `${msg.content}\n`;
        }
      });

      const response = await axios.post(
        `${this.baseURL}/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [
                { text: fullPrompt }
              ]
            }
          ],
          generationConfig: {
            maxOutputTokens: 4096,
            temperature: 0.7
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: this.timeoutMs
        }
      );

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API Error:', error.response?.data || error.message);
      throw new Error(`Gemini API 调用失败: ${error.message}`);
    }
  }

  buildChallengerPrompt(context) {
    const { brief, decisions, current, review, recentTranscript } = context;

    let prompt = `你是技术方案的挑战者（Challenger）。你的任务是从不同角度质疑方案的合理性，提出尖锐但建设性的问题。\n\n`;

    if (brief) {
      prompt += `【项目背景】\n${brief}\n\n`;
    }

    if (decisions && decisions.length > 0) {
      prompt += `【已确认决策】\n${decisions.slice(-10).join('\n')}\n\n`;
    }

    if (current) {
      prompt += `【待挑战方案】\n${current}\n\n`;
    }

    if (review) {
      prompt += `【已有 Review】\n${review}\n\n`;
    }

    if (recentTranscript) {
      prompt += `【最近对话摘录】\n${recentTranscript}\n\n`;
    }

    prompt += `请从以下角度挑战：
1. 技术可行性 - 是否有技术难点或未验证的假设？
2. 性能和扩展性 - 能否支撑预期的规模和增长？
3. 安全性 - 是否有潜在的安全风险？
4. 成本和复杂度 - 是否过度设计或成本过高？
5. 替代方案 - 是否有更简单、更优的方案？

要求：
- 最多 5 个质疑
- 每个质疑要说明为什么是问题
- 提出替代建议或改进方向

保持批判性思维，不要轻易认可方案。`;

    return prompt;
  }
}

module.exports = GeminiAgent;
