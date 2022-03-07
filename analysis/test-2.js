const fs = require('fs')
const _ = require('lodash')
const items = require('./result-v2.json')
const key = require('./original.json')

let all = []

for (let item of items) {
  for (let citation of item.citations) {
    all.push(citation)
  }
}

all = _.uniq(all)
console.log(all.length)

fs.writeFileSync('citations.json', JSON.stringify(all, null, 2))