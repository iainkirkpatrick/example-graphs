//for livereload purposes - dam you dan :D
graph.innerHTML = '';

//graph setup
var margin = {top: 20, right: 50, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%d/%m/%y").parse;

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
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y0(d.TWI); })
var line1 = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y1(d['90Day']); })
var line2 = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y1(d.OCR); })

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

    //domains determine how large the range is for the axis.
    //generally, extracted from the data as min-max (extent)
    //ideally, programatically 'pad' the extent rather than hardcode?
    x.domain(d3.extent(data, function(d) { return d.Date; }));
    // y0.domain(d3.extent(data, function(d) { return d.TWI; }));
    y0.domain([70,85]);
    // y1.domain(d3.extent(data, function(d) { return d['90Day']; }));
    y1.domain([2,5]);

    // console.log(d3.extent(data, function(d) { return d['90Day']; }));

    //draw x axis
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    //draw both y axes
    svg.append("g")
        .attr("class", "yLeft axis")
        .call(yAxisLeft)
      .append("text");
        // .attr("transform", "rotate(-90)")
        // .attr("y", 6)
        // .attr("dy", ".71em")
        // .style("text-anchor", "end")
        // .text("$b");
    svg.append("g")
        .attr("class", "yRight axis")
        .attr("transform", "translate(" + width + " ,0)")  
        .call(yAxisRight)
      .append("text");

    //draw TWI
    svg.append("path")
        .datum(data)
        .attr("class", "line0")
        .transition()
        .ease("linear")
        .duration(1000)
        //SMOOTH ANIMATIONs
        .attrTween("d", function(d){
          var i = d3.scale.linear()
            .domain([0,1])
            .range([1, data.length + 1]);

          return function(t) {
            var flooredX = Math.floor(i(t));
            var interpolatedLine = data.slice(0, flooredX);
            // console.log(interpolatedLine);

            if(flooredX > 0 && flooredX < data.length) {
              var weight = i(t) - flooredX;
              var weightedY = data[flooredX].TWI * weight + data[flooredX-1].TWI * (1-weight);
              var weightedX = data[flooredX].Date * weight + data[flooredX-1].Date * (1-weight);
              // console.log(weightedX, weightedY)
              // console.log(data)
              interpolatedLine.push( {"Date":weightedX, "TWI":weightedY} );
            }

            // console.log(interpolatedLine)

            return line0(interpolatedLine);
          }

        });

    //draw 90Day
    svg.append("path")
        .datum(data)
        .attr("class", "line1")
        .transition()
        .delay(1000)
        .ease("linear")
        .duration(1000)
        //SMOOTH ANIMATIONs
        .attrTween("d", function(d){
          var i = d3.scale.linear()
            .domain([0,1])
            .range([1, data.length + 1]);

          return function(t) {
            var flooredX = Math.floor(i(t));
            var interpolatedLine = data.slice(0, flooredX);
            // console.log(interpolatedLine);
            // console.log(i(t), flooredX);

            if(flooredX > 0 && flooredX < data.length) {
              var weight = i(t) - flooredX;
              var weightedY = data[flooredX]['90Day'] * weight + data[flooredX-1]['90Day'] * (1-weight);
              var weightedX = data[flooredX].Date * weight + data[flooredX-1].Date * (1-weight);
              // console.log(data[flooredX]['90Day'] * weight, data[flooredX-1]['90Day'] * (1-weight))
              // console.log(data)
              interpolatedLine.push( {"Date":weightedX, "90Day":weightedY} );
            }

            // console.log(interpolatedLine)

            return line1(interpolatedLine);
          }

        });

    //draw OCR
    svg.append("path")
        .datum(data)
        .attr("class", "line1")
        .transition()
        .delay(1000)
        .ease("linear")
        .duration(1000)
        //SMOOTH ANIMATIONs
        .attrTween("d", function(d){
          var i = d3.scale.linear()
            .domain([0,1])
            .range([1, data.length + 1]);

          return function(t) {
            var flooredX = Math.floor(i(t));
            var interpolatedLine = data.slice(-flooredX);
            // console.log(i(t), flooredX);

            if(flooredX > 0 && flooredX < data.length) {
              var weight = i(t) - flooredX;
              var weightedY = data[data.length - flooredX].OCR * weight + data[data.length - flooredX+1].OCR * (1-weight);
              var weightedX = data[data.length - flooredX].Date * weight + data[data.length - flooredX+1].Date * (1-weight);
              // console.log(weightedX, weightedY)
              // console.log(data[data.length - flooredX])
              // console.log(weight)
              interpolatedLine.unshift( {"Date":weightedX, "OCR":weightedY} );
            }

            // console.log(interpolatedLine)

            return line2(interpolatedLine);
          }

        });
});
