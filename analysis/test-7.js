const fs = require('fs')
const _ = require('lodash')
const original = require('./original.json')

let hash = {}
for (let id of Object.keys(original)) {
  let array = id.split('-')
  array.pop()
  let category = array.join('-')
  if (array[0] === '3') {
    category = '3'
  }
  if (array[0] === '10') {
    category = '10'
  }

  let key = `category-${category}`
  if (!hash[key]) hash[key] = []
  hash[key].push({
    id: id,
    name: original[id]
  })
}

fs.writeFileSync('category.json', JSON.stringify(hash, null, 2))

