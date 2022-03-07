let width = 954
let height =720

let json = require('./data.json')
console.log(json)

let sankey = d3.sankey()
  .nodeId(d => d.name)
  .nodeAlign(d3[`sankey${align[0].toUpperCase()}${align.slice(1)}`])
  .nodeSort(inputOrder ? null : undefined)
  .nodeWidth(15)
  .nodePadding(padding)
  .extent([[0, 5], [width, height - 5]])

const svg = d3.select(DOM.svg(width, height))
  .style("background", "#fff")
  .style("width", "100%")
  .style("height", "auto");

const {nodes, links} = sankey({
  nodes: data.nodes.map(d => Object.assign({}, d)),
  links: data.links.map(d => Object.assign({}, d))
});

svg.append("g")
  .selectAll("rect")
  .data(nodes)
  .join("rect")
    .attr("x", d => d.x0 + 1)
    .attr("y", d => d.y0)
    .attr("height", d => d.y1 - d.y0)
    .attr("width", d => d.x1 - d.x0 - 2)
    .attr("fill", d => {
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
    })
  .append("title")
    .text(d => `${d.name}\n${d.value.toLocaleString()}`);

const link = svg.append("g")
    .attr("fill", "none")
  .selectAll("g")
  .data(links)
  .join("g")
    .attr("stroke", d => d3.color(d.color) || color)
    .style("mix-blend-mode", "multiply");

link.append("path")
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke-width", d => Math.max(1, d.width));

link.append("title")
    .text(d => `${d.source.name} → ${d.target.name}\n${d.value.toLocaleString()}`);

svg.append("g")
    .style("font", "10px sans-serif")
  .selectAll("text")
  .data(nodes)
  .join("text")
    .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
    .attr("y", d => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
    .text(d => d.name)
  .append("tspan")
    .attr("fill-opacity", 0.7)
    .text(d => ` ${d.value.toLocaleString()}`);
