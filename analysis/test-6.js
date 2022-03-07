const fs = require('fs')
let original = require('./original.json')
let items = require('./flow.json')

let nodes = []
for (let id of Object.keys(original)) {
  nodes.push({
    id: id,
    name: original[id]
  })
}

let links = []
for (let item of items) {
  links.push({
    source: original[item.source],
    target: original[item.target],
    value: item.value
  })
}

let data = { nodes: nodes, links: links }


fs.writeFileSync('data.json', JSON.stringify(data, null, 2))