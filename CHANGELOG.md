# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-04

### Added
- Initial release of Multi-AI Context Manager
- Terminal-based interactive CLI
- Support for Claude API (Builder role)
- Support for OpenAI-compatible APIs (Reviewer role)
- Support for Gemini API (Challenger role, optional)
- Automatic context management system
  - Project background tracking (brief.md)
  - Decision log (decisions.md)
  - Current solution tracking (current.md)
- Conversation history tracking
- Multi-AI collaboration workflow
- Interactive commands:
  - `@claude`, `@codex`, `@gemini` - Query specific AI
  - `/switch` - Switch default AI
  - `/context` - View project context
  - `/save` - Save decisions
  - `/history` - View conversation history
  - `/clear` - Clear history
  - `/help` - Show help
  - `/exit` - Exit
- Complete English and Chinese documentation
- MIT License
- Contributing guidelines

### Features
- 🤖 Multi-AI collaboration with role-based separation
- 📝 Automatic context and decision management
- 💬 User-friendly interactive terminal
- 🔄 Persistent conversation history
- 🎯 Flexible AI provider configuration
- 🌍 Bilingual documentation (EN/中文)

### Documentation
- Comprehensive README with usage examples
- Troubleshooting guide for common issues
- Best practices and use cases
- Contributing guidelines
- Quick deploy guide

---

## Future Plans

### [1.1.0] - Planned
- [ ] Add automated tests
- [ ] Support for more AI models (Claude Haiku, GPT-3.5-turbo)
- [ ] Configuration file support (.airc.json)
- [ ] Multi-project management
- [ ] Export conversations to Markdown
- [ ] Plugin system

### [1.2.0] - Ideas
- [ ] Web UI (optional)
- [ ] Team collaboration features
- [ ] Integration with popular tools (VS Code, Notion, etc.)
- [ ] Advanced context search
- [ ] AI response comparison mode

---

For detailed changes, see [GitHub Releases](https://github.com/yourusername/mindforge/releases).
