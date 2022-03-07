const fs = require('fs')
const _ = require('lodash')
const hash = require('./hash.json')
const original = require('./original.json')

let res = []
for (let source of Object.keys(original)) {
  for (let target of Object.keys(original)) {
    let sourceCategory = Number(source.split('-')[0])
    let targetCategory = Number(target.split('-')[0])
    if (targetCategory - sourceCategory === 1) {
      res.push({
        source: source,
        target: target,
        value: 0
      })
    }
  }
}

fs.writeFileSync('init.json', JSON.stringify(res, null, 2))