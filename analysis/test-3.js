const fs = require('fs')
const _ = require('lodash')
const items = require('./result-v2.json')
const citations = require('./citations.json')

let hash = {}
for (let item of items) {
}

for (let citation of citations) {
  hash[citation] = []
  for (let item of items) {
    if (item.citations.includes(citation)) {
      hash[citation].push(item.id)
    }
  }
}

fs.writeFileSync('hash.json', JSON.stringify(hash, null, 2))