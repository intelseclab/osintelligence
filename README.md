# OSINT Intelligence Directory

<img src="logo.png" width="250"/><br/>
[![osintelligence.net](https://img.shields.io/website?url=https%3A%2F%2Fosintelligence.net&up_message=ONLINE&down_message=OFFLINE&style=for-the-badge&label=osintelligence.net&labelColor=000000&logo=open-source-initiative&logoColor=white)](https://osintelligence.net)


A comprehensive collection of Open Source Intelligence (OSINT) tools and resources for cybersecurity professionals, researchers, and investigators.

## 🚀 Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a pull request.

**Important for Contributors**: When adding new tools, you should update the corresponding markdown files in the `public/tools/` directory, NOT the main README.md file. Each category has its own markdown file that contains the actual tool listings.

## 📋 Categories

- [Archive & History Tools](public/tools/archive-history-tools.md)
- [Code Repository Intelligence](public/tools/code-repository-intelligence.md)
- [Company & Organization Research](public/tools/company-organization-research.md)
- [Data & Statistics](public/tools/data-statistics.md)
- [Domain & Network Analysis](public/tools/domain-network-analysis.md)
- [Email Investigation](public/tools/email-investigation.md)
- [File & Document Intelligence](public/tools/file-document-intelligence.md)
- [Financial Intelligence](public/tools/financial-intelligence.md)
- [Geolocation](public/tools/geolocation.md)
- [Image & Video Analysis](public/tools/image-video-analysis.md)
- [Maritime & Aviation OSINT](public/tools/maritime-aviation-osint.md)
- [Metadata Analysis](public/tools/metadata-analysis.md)
- [News & Media Monitoring](public/tools/news-media-monitoring.md)
- [People Search](public/tools/people-search.md)
- [Phone Number Research](public/tools/phone-number-research.md)
- [Privacy & Security Tools](public/tools/privacy-security-tools.md)
- [Search Engines](public/tools/search-engines.md)
- [Social Media Intelligence](public/tools/social-media-intelligence.md)
- [Threat Intelligence](public/tools/threat-intelligence.md)
- [Username & Handle Tracking](public/tools/username-handle-tracking.md)
- [Visualization & Analysis Tools](public/tools/visualization-analysis-tools.md)

## 📝 Tool Format

When adding new tools, please follow this format:

```markdown
- **Tool Name** - https://example.com
  - Description: Brief description of what the tool does
  - Category: category-name
  - Tags: tag1, tag2, tag3
  - Free: true/false
```

## 📁 File Structure for Contributors

**To add new tools, update these files:**
- **Main README.md** (this file): Only update category links if you add new categories
- **Category-specific files**: Update the corresponding markdown file in `public/tools/` directory
  - Example: To add a new archive tool, edit `public/tools/archive-history-tools.md`
  - Example: To add a new social media tool, edit `public/tools/social-media-intelligence.md`

**To add a NEW category, you need to update these files:**
1. **Create a new markdown file** in `public/tools/` directory (e.g., `public/tools/new-category-name.md`)
2. **Update the main README.md** (this file) to add the new category link in the Categories section
3. **Update the public README.md** to add the new category link
4. **Follow the tool format** in your new category file
5. **Optional: Add custom emoji and description** in `lib/category-config.ts` (if you want a custom icon/description instead of the default 🔧)

**Example of adding a new category:**
```markdown
# In your new category file (public/tools/new-category-name.md):
# New Category Name

Tools and resources for [description of category].

- **Tool Name** - https://example.com
  - Description: Brief description of what the tool does
  - Category: new-category-name
  - Tags: tag1, tag2, tag3
  - Free: true/false
```

**Optional: Custom category styling in `lib/category-config.ts`:**
```typescript
"new-category-name": {
  id: "new-category-name",
  name: "Custom Category Name",
  icon: "🚀", // Your custom emoji
  description: "Your custom description for the category",
  markdownHeader: "Custom Category Name"
}
```

**Note:** If you don't add the category to `category-config.ts`, the system will automatically use:
- Default icon: 🔧
- Auto-generated name from the filename
- Default description: "OSINT tools and resources"

**Do NOT edit:**
- `app/` directory files (Next.js application code)
- `components/` directory files (React components)
- `lib/` directory files (utility functions)

**Only edit:**
- `public/tools/*.md` files (for adding/updating tools)
- `README.md` (for major structural changes only)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⭐ Star History

If you find this repository useful, please consider giving it a star!

[![Star History Chart](https://api.star-history.com/svg?repos=intelseclab/osintelligence&type=Date)](https://www.star-history.com/#intelseclab/osintelligence&Date)

---

**Disclaimer**: This collection is for educational and legitimate research purposes only. Users are responsible for ensuring their activities comply with applicable laws and regulations.
