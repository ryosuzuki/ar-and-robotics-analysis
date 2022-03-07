const fs = require('fs')
const _ = require('lodash')
const items = require('./result.json')

let res = []
for (let item of items) {
  let original = item.citations.length
  item.citations = _.uniq(item.citations)
  item.count = item.citations.length
  res.push({
    id: item.id,
    title: item.title,
    count: item.count,
    citations: item.citations
  })
}

fs.writeFileSync('result-v2.json', JSON.stringify(res, null, 2))