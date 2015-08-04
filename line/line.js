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
      d.date = +parseDate(d.date);
      d.value = +d.value;
    });


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
        .ease("linear")
        .duration(3000)

        //NO ANIMATION
        // .attr("d", line);

        //CHOPPY ANIMATION
        // .attrTween("d", function(d){
        //   //i becomes a func that takes a value within the domain
        //   //and converts to equivalent value in the range
        //   var i = d3.scale.quantile()
        //     .domain([0,1])
        //     .range(d3.range(1, data.length + 1));
        //     // .range([1,5]);

        //   return function(t) {
        //     var interpolatedLine = data.slice(0, i(t));

        //     //at each t frame, interpolatedLine is an ever-growing
        //     //slice of the data array
        //     console.log(interpolatedLine[0]);
            
        //     //recalc the entire path each frame with new data slice
        //     return line(interpolatedLine);
        //   }

        // });

        //SMOOTH ANIMATIONs
        .attrTween("d", function(d){
          var i = d3.scale.linear()
            .domain([0,1])
            .range([1, data.length + 1]);

          return function(t) {
            var flooredX = Math.floor(i(t));
            var interpolatedLine = data.slice(0, flooredX);


            if(flooredX > 0 && flooredX < data.length) {
              var weight = i(t) - flooredX;
              var weightedY = data[flooredX].value * weight + data[flooredX-1].value * (1-weight);
              var weightedX = data[flooredX].date * weight + data[flooredX-1].date * (1-weight);
              // console.log(weightedX, weightedY)
              // console.log(data)
              interpolatedLine.push( {"date":weightedX, "value":weightedY} );
            }

            // console.log(interpolatedLine)
      
            return line(interpolatedLine);
          }

        });
});
