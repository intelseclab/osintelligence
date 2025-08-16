# Contributing to OSINT Intelligence Directory

Thank you for your interest in contributing to the OSINT Intelligence Directory! This document provides guidelines and instructions for contributing to our community-driven collection of OSINT tools.

## 🚀 Quick Start

1. **Fork the Repository**
   - Click the "Fork" button on the GitHub repository
   - Clone your fork locally: `git clone https://github.com/intelseclab/osintelligence.git`

2. **Create a Branch**
   \`\`\`bash
   git checkout -b add-new-tool
   \`\`\`

3. **Add Your Tool**
   - Edit the `README.md` file
   - Follow the format specified below
   - Test your changes locally

4. **Submit a Pull Request**
   - Push your changes: `git push origin add-new-tool`
   - Create a pull request with a clear description

## 📝 Tool Submission Format

When adding a new tool, please use this exact format in the appropriate category section of `README.md`:

\`\`\`markdown
- **Tool Name** - https://example.com
  - Description: Brief description of what the tool does (1-2 sentences)
  - Category: category-name
  - Tags: tag1, tag2, tag3
  - Free: true/false
\`\`\`

### Required Information

- **Tool Name**: Clear, concise name of the tool
- **URL**: Direct link to the tool (must be working)
- **Description**: 1-2 sentences explaining what the tool does
- **Category**: Must match one of the existing categories
- **Tags**: Relevant keywords (3-5 recommended)
- **Free**: Boolean indicating if the tool is free to use

### Categories

Use one of these existing categories:

- `search-engines` - Search engines and discovery tools
- `social-media` - Social media investigation tools
- `domain-network` - Domain and network analysis tools
- `email` - Email investigation and verification
- `image-video` - Image and video analysis tools
- `people-search` - People search and background checks
- `geolocation` - Location intelligence tools
- `dark-web` - Dark web search and monitoring
- `threat-intelligence` - Malware and threat analysis
- `metadata` - File metadata and forensics

## ✅ Submission Guidelines

### Do's
- ✅ Test the tool before submitting
- ✅ Verify the URL is working and accessible
- ✅ Use clear, descriptive language
- ✅ Check for existing entries to avoid duplicates
- ✅ Follow the exact format specified
- ✅ Use appropriate tags and categories
- ✅ Provide accurate free/paid status

### Don'ts
- ❌ Submit tools you haven't personally tested
- ❌ Add broken or dead links
- ❌ Use promotional or marketing language
- ❌ Submit malicious or illegal tools
- ❌ Ignore the format requirements
- ❌ Add duplicate entries
- ❌ Submit tools without proper research

## 🔍 Quality Standards

### Tool Requirements
- Must be actively maintained and functional
- Should serve a legitimate OSINT purpose
- Must be accessible (not requiring special permissions)
- Should have clear documentation or instructions
- Must comply with legal and ethical standards

### Description Guidelines
- Keep descriptions factual and objective
- Focus on what the tool does, not marketing claims
- Use 1-2 sentences maximum
- Avoid superlatives like "best" or "ultimate"
- Include key functionality or unique features

### Tag Guidelines
- Use lowercase, hyphenated format (e.g., "reverse-image")
- Include 3-5 relevant tags
- Focus on functionality, not technology stack
- Use existing tags when possible for consistency

## 🔄 Review Process

1. **Automated Checks**
   - GitHub Actions verify format compliance
   - Duplicate detection runs automatically
   - Link validation checks URL accessibility

2. **Community Review**
   - Maintainers review submissions for quality
   - Community members can provide feedback
   - Tools are tested by reviewers when possible

3. **Approval & Merge**
   - Approved submissions are merged
   - Changes are automatically deployed
   - Contributors are credited in commit history

## 📋 Pull Request Template

When submitting a pull request, please include:

\`\`\`markdown
## Tool Addition/Update

**Tool Name**: [Name of the tool]
**Category**: [Category name]
**URL**: [Tool URL]

### Description
Brief description of what this tool does and why it's useful for OSINT.

### Checklist
- [ ] I have tested this tool personally
- [ ] The URL is working and accessible
- [ ] I followed the exact format requirements
- [ ] I checked for duplicates
- [ ] The tool serves a legitimate OSINT purpose
- [ ] I provided accurate free/paid status

### Additional Notes
Any additional context or information about the tool.
\`\`\`

## 🛠️ Local Development

To test your changes locally:

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Run Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

3. **View Changes**
   - Open http://localhost:3000
   - Your tool additions should appear automatically

## 🤝 Community Guidelines

- Be respectful and professional in all interactions
- Provide constructive feedback on submissions
- Help newcomers understand the contribution process
- Report issues or concerns to maintainers
- Follow the project's code of conduct

## 📞 Getting Help

- **Issues**: Open a GitHub issue for bugs or questions
- **Discussions**: Use GitHub Discussions for general questions
- **Email**: Contact maintainers at [email@example.com]

## 🏆 Recognition

Contributors are recognized in several ways:
- Listed in commit history
- Mentioned in release notes for significant contributions
- Featured in the project's contributor list
- Invited to become maintainers for consistent contributors

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make OSINT tools more accessible to the community! 🎉
