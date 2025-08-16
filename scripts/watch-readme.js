#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { syncReadme } = require('./sync-readme')

/**
 * Watches README.md for file changes and automatically synchronizes it
 */

const readmePath = path.join(process.cwd(), 'README.md')

console.log('👀 Watching README.md for changes...')
console.log(`📁 File being watched: ${readmePath}`)

// Run initial synchronization
syncReadme()

// Watch for changes in README.md
fs.watchFile(readmePath, { interval: 1000 }, (curr, prev) => {
  if (curr.mtime !== prev.mtime) {
    console.log('\n📝 Change detected in README.md!')
    console.log(`🕐 Change time: ${new Date().toLocaleString()}`)
    
    // Sync after a short delay (to ensure file write is complete)
    setTimeout(() => {
      syncReadme()
    }, 500)
  }
})

// Cleanup when process ends
process.on('SIGINT', () => {
  console.log('\n👋 Stopping README.md watcher...')
  fs.unwatchFile(readmePath)
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n👋 Stopping README.md watcher...')
  fs.unwatchFile(readmePath)
  process.exit(0)
})

console.log('✅ README.md watcher active. Changes will be synchronized automatically.')
console.log('🛑 Press Ctrl+C to stop.')

// Keep process running
setInterval(() => {}, 1000)
