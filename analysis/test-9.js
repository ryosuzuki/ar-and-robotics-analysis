const fs = require('fs')
const init = require('./data-init.json')
const original = require('./original.json')
const entries = require('./hash.json')

let links = init.links

for (let i = 0; i < links.length; i++) {
  let link = links[i]
  let source = link.source
  let target = link.target

  for (let key of Object.keys(entries)) {
    let ids = entries[key]
    if (ids.includes(source) && ids.includes(target)) {
      link.value = link.value + 1
      if (!link.citations) link.citations = []
      link.citations.push(key)
    }
  }
  links[i] = link
}

let newLinks = []
for (let link of links) {
  newLinks.push({
    source: original[link.source],
    target: original[link.target],
    value: link.value
  })
}

let data = {
  nodes: init.nodes,
  links: newLinks
}

fs.writeFileSync('data-v2.json', JSON.stringify(data, null, 2))