import React, { Component } from 'react'
import './App.css'
import data from './data-v2.json'
import * as d3 from 'd3'
import * as d3Sankey from 'd3-sankey'

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
    this.state = {}
  }

  componentDidMount() {

    let div = document.querySelector('#main')
    let color = '#ddd'
    let width = window.innerWidth
    let height = window.innerHeight
    let padding = 10
    let align = [{ value: 'justify' }]
    let inputOrder = true

    let sankey = d3Sankey.sankey()
      .nodeId(d => d.name)
      .nodeAlign(d3Sankey.sankeyRight)
      .nodeSort(inputOrder ? null : undefined)
      .nodeWidth(15)
      .nodePadding(padding)
      .extent([[0, 5], [width, height - 5]])

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
          /*
          let c;
          for (const link of d.sourceLinks) {
            if (c === undefined) c = link.color;
            else if (c !== link.color) c = null;
          }
          if (c === undefined) for (const link of d.targetLinks) {
            if (c === undefined) c = link.color;
            else if (c !== link.color) c = null;
          }
          return (d3.color(c) || d3.color(color)).darker(0.5);
          */
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
        .text(d => `${d.name}\n${d.value.toLocaleString()}`);

    const link = svg.append('g')
        .attr('fill', 'none')
      .selectAll('g')
      .data(links)
      .join('g')
        .attr('stroke', (d) => {
          console.log(d)
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
          color.opacity = 0.3
          return color
        })
        .style('mix-blend-mode', 'multiply');

    link.append('path')
        .attr('d', d3Sankey.sankeyLinkHorizontal())
        .attr('stroke-width', d => Math.max(1, d.width));

    link.append('title')
        .text(d => `${d.source.name} → ${d.target.name}\n${d.value.toLocaleString()}`);

    svg.append('g')
        .style('font', '10px sans-serif')
      .selectAll('text')
      .data(nodes)
      .join('text')
        .attr('x', d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
        .attr('y', d => (d.y1 + d.y0) / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', d => d.x0 < width / 2 ? 'start' : 'end')
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
        .text(d => d.name.split(' - ').pop())
      .append('tspan')
        .attr('fill-opacity', 0.7)
        .text(d => ` ${d.value.toLocaleString()}`);

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