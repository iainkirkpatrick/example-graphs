//for livereload purposes - dam you dan :D
graph.innerHTML = '';

//graph setup
var margin = {top: 20, right: 50, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%d/%m/%Y").parse;

var x = d3.time.scale()
    .range([0, width]);

var y0 = d3.scale.linear()
    .range([height, 0]);
var y1 = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxisLeft = d3.svg.axis()
    .scale(y0)
    .orient("left");
var yAxisRight = d3.svg.axis()
    .scale(y1)
    .orient("right");

var line0 = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y0(d.value); })
var line1 = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y0(d.value); })

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//csv parsing and graph building
d3.csv("../data/OCR_Test_2014.csv", function(error, data) {

    data.forEach(function(d) {
      d.Date = parseDate(d.Date);
      d['90Day'] = +d['90Day'];
      d.OCR = +d.OCR;
      d.TWI = +d.TWI;
    });

    console.log(data);

    x.domain(d3.extent(data, function(d) { return d.date; }));
    y0.domain(d3.extent(data, function(d) { return d.value; }));

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxisLeft)
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

            return line0(interpolatedLine);
          }

        });
});
