const fs = require('fs')
const data = require('./data-v2.json')
const total = require('./total.json')

let hash = {}
for (let id of Object.keys(total)) {
  let item = total[id]
  for (let name of item.names) {
    hash[name] = item.source
  }
}

let newLinks = []
let links = data.links
for (let link of links) {
  let total = hash[link.source]
  let value = Math.round((link.value / total) * 460)
  newLinks.push({
    source: link.source,
    target: link.target,
    value: value,
    count: link.value,
    total: total
  })
}

data.links = newLinks

fs.writeFileSync('data-v3.json', JSON.stringify(data, null, 2))
