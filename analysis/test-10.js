const fs = require('fs')
const data = require('./data-v2.json')


let sources = {}
let targets = {}
for (let link of data.links) {
  let source = link.source
  if (!sources[source]) sources[source] = 0
  sources[source] += link.value

  let target = link.target
  if (!targets[target]) targets[target] = 0
  targets[target] += link.value
}

const json = require('./category.json')

let hash = {}
for (let key of Object.keys(json)) {
  let items = json[key]
  let sourceTotal = 0
  let targetTotal = 0
  for (let item of items) {
    sourceTotal += sources[item.name]
    targetTotal += targets[item.name]
  }
  if (!sourceTotal) sourceTotal = 0
  if (!targetTotal) targetTotal = 0
  hash[key] = {
    source: sourceTotal,
    target: targetTotal,
    names: items.map(i => i.name)
  }
}

fs.writeFileSync('total.json', JSON.stringify(hash, null, 2))