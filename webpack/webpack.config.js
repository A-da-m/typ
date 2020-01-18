module.exports = require(
  process.argv.includes('-p')
    ? './production.config.js'
    : './development.config.js'
)
