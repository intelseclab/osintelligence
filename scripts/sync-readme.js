#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

/**
 * README.md -> public/README.md synchronization script
 * This script copies README.md into the public folder
 */

async function syncReadme() {
  try {
    const rootReadmePath = path.join(process.cwd(), 'README.md')
    const publicReadmePath = path.join(process.cwd(), 'public', 'README.md')

    // Check if root README.md exists
    if (!fs.existsSync(rootReadmePath)) {
      console.error('❌ Root README.md file not found!')
      process.exit(1)
    }

    // Read README.md content
    const readmeContent = fs.readFileSync(rootReadmePath, 'utf8')
    
    // Check if the public folder exists
    const publicDir = path.join(process.cwd(), 'public')
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
      console.log('📁 public folder created')
    }

    // Write to public/README.md
    fs.writeFileSync(publicReadmePath, readmeContent, 'utf8')
    
    console.log('✅ README.md successfully synchronized to public/README.md')
    console.log(`📊 Content size: ${readmeContent.length} characters`)
    
    // Timestamp info
    const timestamp = new Date().toISOString()
    console.log(`🕐 Synchronization time: ${timestamp}`)
    
  } catch (error) {
    console.error('❌ README.md synchronization error:', error.message)
    process.exit(1)
  }
}

// When the script is run directly
if (require.main === module) {
  syncReadme()
}

module.exports = { syncReadme }
