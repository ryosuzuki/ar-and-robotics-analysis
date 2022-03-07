const fs = require('fs')
const _ = require('lodash')
const init = require('./data-init.json')
const original = require('./original.json')
const entries = require('./hash.json')

const result = require('./result-v2.json')

let links = init.links

for (let i = 0; i < links.length; i++) {
  let link = links[i]
  let source = link.source
  let target = link.target

  for (let key of Object.keys(entries)) {
    let ids = entries[key]
    if (ids.includes(source) && ids.includes(target)) {
      if (!link.citations) link.citations = []
      link.citations.push(key)
    }
  }
  link.citations = _.uniq(link.citations)
  link.value = link.citations.length
  links[i] = link
}

let hash = {}
for (let item of result) {
  let sourceTotal = 0
  let targetTotal = 0
  for (let link of links) {
    let source = link.source
    if (source === item.id) {
      sourceTotal += link.value
    }
    let target = link.target
    if (target === item.id) {
      targetTotal += link.value
    }
  }
  hash[item.id] = {
    count: item.count,
    sourceTotal: sourceTotal,
    targetTotal: targetTotal,
  }
}


let newLinks = []
for (let link of links) {
  let sinfo = hash[link.source]
  let svalue = (link.value / sinfo.sourceTotal) * sinfo.count
  let tinfo = hash[link.target]
  let tvalue = (link.value / tinfo.targetTotal) * tinfo.count

  let value = Math.min(svalue, tvalue)
  newLinks.push({
    source: original[link.source],
    target: original[link.target],
    value: value,
    citations: link.citations
  })
}

let data = {
  nodes: init.nodes,
  links: newLinks
}

fs.writeFileSync('data-v2.json', JSON.stringify(data, null, 2))