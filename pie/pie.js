//for livereload purposes - dam you dan :D
graph.innerHTML = '';

//graph setup
var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2;

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 100);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.Percentage; });

var svg = d3.select("#graph").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var color = d3.scale.ordinal()
    .domain(function(d) { return d; })
    .range(colorbrewer.YlOrRd[7]);

var graphTransitionTime = 1000;
var timePerRadian = graphTransitionTime / (Math.PI * 2);

//csv parsing and graph building
d3.csv("../data/chart-12-pie.csv", function(error, data) {

    data.forEach(function(d) {
      d.Percentage = +d.Percentage;
    });

    // console.log(data);



    var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

    g.append("path")
      //.attr("d", arc)
      .transition()
      .ease("linear")
      .delay(function(d, i) {
        // console.log(d);
        // return i * (1000 * (d.value/100));
        return d.startAngle * timePerRadian;
      })
      .duration(function(d, i) {
        // console.log(d.value);
        // return 1000 * (d.value/100) ;
        return (d.endAngle - d.startAngle) * timePerRadian;
      })
      .attrTween('d', function(d) {
        console.log(d);
        var i = d3.interpolate(d.startAngle, d.endAngle);
        return function(t) {
          d.endAngle = i(t);
          return arc(d);
        }
      });

    //better way to do this?
    svg.selectAll("path").style("fill", function(d,i) {
        return color(i);
      });

    g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.data.Percentage + '%'; });

});

//form submission logic
d3.select("#form")
  .on("submit", function() {
    d3.event.preventDefault();
    var data = d3.select("#csvData").node().value; //.node() selects the first result of the selection

    console.log(d3.csv.parseRows(data));
});


/* DUMMY DATA + BUILDING */
// var data = [
//     2704659,
//     4499890,
//     2159981,
//     3853788,
//     14106543,
//     8819342,
//     612463
// ];
//graph building
// (function() {
//     console.log(data);

//     var g = svg.selectAll(".arc")
//       .data(pie(data))
//     .enter().append("g")
//       .attr("class", "arc");

//     g.append("path")
//       .attr("d", arc)
//       // .style("fill", "black");
//       .style("fill", function(d,i) {
//         return scale(i);
//       })
// })();
