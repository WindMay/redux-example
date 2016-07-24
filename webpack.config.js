var config = require('./webpack/config')

module.exports = require('./makewebpackconfig')({
  deploy: process.env.DEPLOY == 'true',
  build: process.env.DEPLOY == 'true' || process.env.BUILD == 'true'
});
