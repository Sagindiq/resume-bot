const fs = require('fs')
const path = require('path')

const read = dir => JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'model', dir + '.json')))
const write = (dir, data) => fs.writeFileSync(path.join(__dirname, '..', 'model', dir + '.json'), JSON.stringify(data, null, 4))

module.exports = { read, write }