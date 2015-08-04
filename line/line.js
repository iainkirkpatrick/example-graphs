//for livereload purposes - dam you dan :D
graph.innerHTML = '';

//graph setup
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    // .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value); })

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//csv parsing and graph building
d3.csv("/data/line-graph-data.csv", function(error, data) {

    data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.value = +d.value;
    });

    console.log(data);

    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain(d3.extent(data, function(d) { return d.value; }));

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text");
        // .attr("transform", "rotate(-90)")
        // .attr("y", 6)
        // .attr("dy", ".71em")
        // .style("text-anchor", "end")
        // .text("$b");

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .transition()
        .duration(1000)
        // .attr("d", line);
        .attrTween("d", function(d){
          var i = d3.scale.quantile()
            .domain([0,1])
            .range(d3.range(1, data.length + 1));

          return function(t) {
            var flooredX = Math.floor(i(t));
            var interpolatedLine = data.slice(0, flooredX);
            console.log(interpolatedLine)

            if(flooredX > 0 && flooredX < data.length) {
              var weight = i(t) - flooredX;
              var weightedLineAverage = data[flooredX].y * weight + data[flooredX-1].y * (1-weight);
              interpolatedLine.push( {"x":i(t)-1, "y":weightedLineAverage} );
            }
      
            return line(interpolatedLine);
          }

        });
});
