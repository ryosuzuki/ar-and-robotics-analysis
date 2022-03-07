import React, { Component } from 'react'
import './App.css'
import data from './data-v2.json'
import * as d3 from 'd3'
import * as d3Sankey from 'd3-sankey'
import d3SaveSvg from 'd3-save-svg'
import d3SavePdf from 'd3-save-pdf'
import results from './result-v2.json'

let colors = {
  '3-1': '#3d3ca4',
  '3-2': '#308377',
  '3': '#3d3ca4',
  '4': '#3c88a4',
  '5': '#9a6003',
  '6': '#359266',
  '7': '#359091',
  '8': '#84005f',
  '9': '#926735',
  '10': '#444'
}

class App extends Component {
  constructor(props) {
    super(props)
    window.App = this
    window.d3 = d3
    window.data = data
    window.results = results
    this.state = {}

    this.hash = {}
    for (let item of results) {
      this.hash[item.id] = item.count
    }

    window.save = () => {
      let config = {
        filename: 'graph',
      }
      d3SavePdf.save(d3.select('svg').node(), config)
    }
  }

  componentDidMount() {

    let div = document.querySelector('#main')
    let color = '#ddd'
    let width = window.innerWidth
    let height = window.innerHeight * 0.7
    let padding = 10
    let align = [{ value: 'justify' }]
    let inputOrder = true

    let sankey = d3Sankey.sankey()
      .nodeId(d => d.name)
      .nodeAlign(d3Sankey.sankeyRight)
      .nodeSort(inputOrder ? null : undefined)
      .nodeWidth(15)
      .nodePadding(padding)
      .extent([[50, 200], [width-150, height - 5]])

    const svg = d3.select(div)
        .style('background', '#fff')
        .style('width', width)
        .style('height', height);

    const {nodes, links} = sankey({
      nodes: data.nodes.map(d => Object.assign({}, d)),
      links: data.links.map(d => Object.assign({}, d))
    });

    this.setState({ nodes: nodes, links: links })

    svg.append('g')
      .selectAll('rect')
      .data(nodes)
      .join('rect')
        .attr('x', d => d.x0 + 1)
        .attr('y', d => d.y0)
        .attr('height', d => d.y1 - d.y0)
        .attr('width', d => d.x1 - d.x0 - 2)
        .attr('fill', d => {
          let sectionId = d.id.split('-')[0]
          let color = colors[sectionId]
          if (sectionId === '3') {
            if (d.id.includes('3-1')) {
              color = colors['3-1']
            }
            if (d.id.includes('3-2')) {
              color = colors['3-2']
            }
          }
          color = d3.color(color).brighter(0.5)
          return color
        })
      .append('title')
        .text((d) => {
          let count = d.sourceLinks.map(i => i.count).reduce((a, b) => a + b, 0)
          count = count/460
          if (isNaN(count)) count = d.value
          return `${d.name}\n${count.toLocaleString()}`
        });

    const link = svg.append('g')
        .attr('fill', 'none')
      .selectAll('g')
      .data(links)
      .join('g')
        .attr('stroke', (d) => {
          let sectionId = d.source.id.split('-')[0]
          let targetSectionId = d.target.id.split('-')[0]
          let color = colors[sectionId]

          if (sectionId === '3') {
            if (d.source.id.includes('3-1')) {
              color = colors['3-1']
            }
            if (d.source.id.includes('3-2')) {
              color = colors['3-2']
            }
          }

          color = d3.color(color).brighter(1)
          color.opacity = 0.1
          return color
        })
        .style('mix-blend-mode', 'multiply');

    link.append('path')
        .attr('d', d3Sankey.sankeyLinkHorizontal())
        .attr('stroke-width', d => Math.max(1, d.width));

    link.append('title')
        .text(d => `${d.source.name} → ${d.target.name}\n${d.value.toLocaleString()}`);

    svg.append('g')
        .style('font', '13px sans-serif')
      .selectAll('text')
      .data(nodes)
      .join('text')
        // .attr('x', d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
        .attr('transform', (d) =>  {
          return `translate(${d.x1-10}, 180) rotate(-45)`
        })
        // .attr('x', d => d.x1 + 6)
        // .attr('y', d => 880)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'start')
        .attr('fill', (d) => {
          let sectionId = d.id.split('-')[0]
          let color = colors[sectionId]
          if (sectionId === '3') {
            if (d.id.includes('3-1')) {
              color = colors['3-1']
            }
            if (d.id.includes('3-2')) {
              color = colors['3-2']
            }
          }
          color = d3.color(color).darker(1)
          return color
        })
        .text((d) => {
          let array = d.name.split(' - ')
          array.pop()
          let title = array[0]
          if (['characteristics', 'design', 'interactions'].includes(title)) {
            title = array[1] // .join(' - ')
          }
          return title
        })


    svg.append('g')
        .style('font', '8px sans-serif')
      .selectAll('text')
      .data(nodes)
      .join('text')
        // .attr('x', d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
        .attr('x', d => d.x1 + 6)
        .attr('y', d => (d.y1 + d.y0) / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', d => d.x0 < width / 2 ? 'start' : 'start')
        .attr('fill', (d) => {
          let sectionId = d.id.split('-')[0]
          let color = colors[sectionId]
          if (sectionId === '3') {
            if (d.id.includes('3-1')) {
              color = colors['3-1']
            }
            if (d.id.includes('3-2')) {
              color = colors['3-2']
            }
          }
          color = d3.color(color).darker(1)
          color = '#000'
          return color
        })
        .text(d => d.name.split(' - ').pop())
      .append('tspan')
        .attr('fill-opacity', 0.7)
        .text((d) => {
          console.log(d)
          let count = this.hash[d.id]
          return ` ${count.toLocaleString()}`
        });
  }

  render() {
    return (
      <>
        <svg id='main'></svg>
      </>
    )
  }
}

export default App