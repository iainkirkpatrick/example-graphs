//for livereload purposes - dam you dan :D
graph.innerHTML = '';

//graph setup
var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

var svg = d3.select("#graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "chart")
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

d3.csv("../data/bar-graph-data.csv", type, function(error, data) {
    x.domain(data.map(function(d) {
        return d.date;
    }));
    y.domain([0, d3.max(data, function(d) {
        return d.value;
    })]);

    svg.selectAll("g")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("y", height)
        .attr("height", 0)
        .attr("x", function(d) {
            return x(d.date);
        })
        .attr("width", x.rangeBand())
        .transition()
        .delay(function(d, i) {
            return i * 300;
        })
        .attr("y", function(d) {
            return y(d.value);
        })
        .attr("height", function(d) {
            return height - y(d.value);
        });

     svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
});

function type(d) {
    d.value = +d.value; // coerce to number
    return d;
}
