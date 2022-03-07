const fs = require('fs')
const _ = require('lodash')
const items = require('./init.json')
const entries = require('./hash.json')

for (let i = 0; i < items.length; i++) {
  let item = items[i]
  let source = item.source
  let target = item.target

  for (let key of Object.keys(entries)) {
    let ids = entries[key]
    if (ids.includes(source) && ids.includes(target)) {
      item.value = item.value + 1
      if (!item.citations) item.citations = []
      item.citations.push(key)
    }
  }
  items[i] = item
}

fs.writeFileSync('flow.json', JSON.stringify(items, null, 2))