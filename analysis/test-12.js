const fs = require('fs')
const data = require('./data-v3.json')

let newLinks = []
let links = data.links

for (let link of links) {
  let target = link.target
  if (target.includes('evaluation')) {
    let array = target.split(' - ')
    array.pop()
    target = array.join(' - ')
  }
  newLinks.push({
    source: link.source,
    target: target,
    value: link.value,
    count: link.count,
    total: link.total
  })
}

let items = []
let hash = {}
for (let i = 0;  i < newLinks.length; i++) {
  let link = newLinks[i]
  for (let j = i+1; j < newLinks.length; j++) {
    let test = newLinks[j]
    if (link.source === test.source && link.target === test.target) {
      let id = `${link.source} + ${link.target}`
      if (!hash[id]) hash[id] = 0
      hash[id] += link.value
    }
  }
}


data.links = newLinks

fs.writeFileSync('hoge.json', JSON.stringify(hash, null, 2))
