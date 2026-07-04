class ContextManager {
  constructor(feishuClient) {
    this.feishuClient = feishuClient;
    this.cachedContext = null;
    this.cacheTime = null;
    this.cacheTTL = 60000; // 1 分钟缓存
  }

  async getContext() {
    // 简单缓存机制
    const now = Date.now();
    if (this.cachedContext && this.cacheTime && (now - this.cacheTime < this.cacheTTL)) {
      console.log('使用缓存的上下文');
      return this.cachedContext;
    }

    console.log('从飞书文档读取上下文...');
    try {
      const rawContent = await this.feishuClient.readDocument();
      const context = this.feishuClient.parseDocumentContent(rawContent);

      this.cachedContext = context;
      this.cacheTime = now;

      return context;
    } catch (error) {
      console.log('飞书文档读取失败，使用空上下文:', error.message);
      // 返回空上下文，让系统可以继续工作
      const emptyContext = {
        brief: '',
        decisions: '',
        handoff: ''
      };
      return emptyContext;
    }
  }

  invalidateCache() {
    this.cachedContext = null;
    this.cacheTime = null;
  }

  async updateContext(section, content) {
    await this.feishuClient.appendToDocument(section, content);
    this.invalidateCache();
  }
}

module.exports = ContextManager;
