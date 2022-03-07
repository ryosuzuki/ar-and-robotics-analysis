const fs = require('fs')
let original = require('./original.json')
let json = require('./category.json')
let items = require('./flow.json')

let nodes = []
for (let id of Object.keys(original)) {
  nodes.push({
    id: id,
    name: original[id]
  })
}

let links = []
for (let i = 0; i < Object.keys(json).length-1; i++) {
  let current = Object.keys(json)[i]
  let next = Object.keys(json)[i+1]

  let citems = json[current]
  let nitems = json[next]

  for (let citem of citems) {
    for (let nitem of nitems) {
      links.push({
        source: citem.id,
        target: nitem.id,
        value: 0
      })
    }
  }
}

let data = { nodes: nodes, links: links }

fs.writeFileSync('data-init.json', JSON.stringify(data, null, 2))