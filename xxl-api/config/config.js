const fs = require('fs');

module.exports = {
  test:         JSON.parse(fs.readFileSync(__dirname + '/test.json')),
  development:  JSON.parse(fs.readFileSync(__dirname + '/development.json')),
  production:   JSON.parse(fs.readFileSync(__dirname + '/production.json'))
};
