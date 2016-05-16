
var d3 = require('d3');
var css = require('./index.scss');

var data = [20, 10, 40, Math.PI, Math.E];

var width = 300;
var height = 80;
var svg = d3.select(document.body)
  .append('svg');

var y = d3.scale.linear().domain([0,100]).range([0,height]);
var barWidth = width/data.length - 1;

(function loop() {

  y.domain([0,d3.max(data)]);
  var bars = svg.selectAll('rect').data(data);

  bars.enter().append('rect')
    .attr('x', (d, i) => i * (barWidth + 1))
    .attr('width', barWidth)
    .classed('bar', true);

  bars.transition()
    .attr('height', d => y(d))
    .attr('y', d => height - y(d))

  data.push(Math.floor(Math.random() * 100));
  data.shift();

  setTimeout(loop, 200);
})();