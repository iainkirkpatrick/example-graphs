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
    .attr("height", height);

var color = d3.scale.ordinal()
    .domain(function(d) { return d; })
    .range(colorbrewer.YlOrRd[7]);

var graphTransitionTime = 1000;
var timePerRadian = graphTransitionTime / (Math.PI * 2);

//csv parsing
var pieData;
d3.csv("../data/chart-12-pie.csv", function(error, data) {
    data.forEach(function(d) {
      d.Percentage = +d.Percentage;
    });

    pieData = data;
});

//graph building func
var renderPie = function(data, svg) {

    //fix this, it's ugly
    d3.selectAll(svg[0][0].childNodes).remove();

    var g = svg.append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    .selectAll(".arc")
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

};

//determine if any part of DOM element is in view
var isScrolledIntoView = function(element) {
    var elementTop = element.getBoundingClientRect().top;
    var elementBottom = element.getBoundingClientRect().bottom;
    return elementTop <= window.innerHeight && elementBottom >= 0;
};

//scroll event listening, efficiency with animationframe
(function() {
    var throttle = function(type, name, obj) {
        var obj = obj || window;
        var running = false;
        var func = function() {
            if (running) { return; }
            running = true;
            requestAnimationFrame(function() {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
        obj.addEventListener(type, func);
    };

    throttle("scroll", "optimizedScroll");
})();

//listen to scroll event, redraw graph if graph element within viewport
var inViewBool = false;
window.addEventListener("optimizedScroll", function() {
  var graphInView = isScrolledIntoView(document.getElementById("graph"))
  if (graphInView != inViewBool) {
    inViewBool = graphInView;
    if (inViewBool) {
      renderPie(pieData, svg)
      console.log('rendering graph')
    }
  };
});
