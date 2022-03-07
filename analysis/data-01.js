const fs = require('fs')

const tex = fs.readFileSync('./appendix.tex', 'utf8')
let citations = tex.match(/\\cite\{(.*?)\}/g)
let result = {}
let i = 0
let key = require('./original.json')

let items = []
for (let id of Object.keys(key)) {
  let title = key[id]
  items.push({
    id: id,
    title: title
  })
}

i = 0
let json = []
for (let citation of citations) {
  citation = citation.replaceAll('\\cite{', '')
  citation = citation.replaceAll('}', '')
  citation = citation.replaceAll(' ', '')
  let array = citation.split(',')
  let item = items[i]
  if (!item) continue
  json.push({
    id: item.id,
    title: item.title,
    citations: array
  })
  i++
  // keys = keys.concat(array)
}

fs.writeFileSync('result.json', JSON.stringify(json, null, 2))