# 🚀 Quick Deploy Guide / 快速部署指南

## GitHub 部署步骤 / GitHub Deployment Steps

### 1. 创建 GitHub 仓库 / Create GitHub Repository

1. 登录 GitHub
2. 点击右上角 "+" → "New repository"
3. 填写仓库信息：
   - **Repository name**: `mindforge`
   - **Description**: A terminal-based tool for multi-AI collaboration
   - **Public** (推荐) 或 **Private**
   - **不要** 勾选 "Initialize this repository with a README"

### 2. 推送代码 / Push Code

在项目目录执行：

```bash
cd /Users/heyuxuan/mindforge

# 关联远程仓库（替换 yourusername 为你的 GitHub 用户名）
git remote add origin https://github.com/yourusername/mindforge.git

# 推送代码
git branch -M main
git push -u origin main
```

### 3. 更新 package.json

在推送前，记得更新 `package.json` 中的仓库地址：

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/你的用户名/mindforge.git"
  }
}
```

### 4. 添加主题标签 / Add Topics

在 GitHub 仓库页面：
1. 点击右侧 "About" 旁的设置图标
2. 添加 topics: `ai`, `multi-agent`, `claude`, `gpt`, `context-management`, `cli`

### 5. 启用 Discussions（可选）

Settings → Features → Discussions

---

## 用户安装步骤 / User Installation

其他用户可以这样使用你的项目：

```bash
# 克隆仓库
git clone https://github.com/yourusername/mindforge.git
cd mindforge

# 安装依赖
npm install

# 配置 API keys
cp .env.example .env
# 编辑 .env 填入 API keys

# 启动
npm start
```

---

## 🔐 安全检查清单 / Security Checklist

推送前确认：

- [x] `.env` 文件已添加到 `.gitignore`
- [x] `.env.example` 不包含真实 API keys
- [x] 所有敏感信息已移除
- [x] README 中没有暴露个人信息

---

## 📢 宣传你的项目 / Promote Your Project

**平台推荐：**
- Reddit: r/programming, r/MachineLearning
- Hacker News: https://news.ycombinator.com/submit
- 产品猎人 Product Hunt
- V2EX: 程序员板块
- 少数派、掘金等中文技术社区

**社交媒体：**
- Twitter/X: 添加话题 #AI #OpenSource
- LinkedIn: 分享到个人动态

---

## 🎯 下一步 / Next Steps

1. **添加 GitHub Actions**: 自动化测试和发布
2. **创建 Release**: 发布第一个版本 v1.0.0
3. **编写使用案例**: 在 README 添加真实使用场景
4. **收集反馈**: 鼓励用户提 Issues 和建议
5. **持续改进**: 根据用户反馈迭代

---

## 💡 Tips

- 及时回复 Issues 和 Pull Requests
- 保持 README 更新
- 定期发布新版本
- 维护 CHANGELOG.md 记录变更

祝你的开源项目成功！🎉

Good luck with your open source project! 🎉
