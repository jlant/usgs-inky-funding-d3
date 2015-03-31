var margin_stacked = {
    top: 40,
    right: 20,
    bottom: 85,
    left: 80
}

var width_bar_stacked = 1200 - margin_stacked.left - margin_stacked.right
var height_bar_stacked = 500 - margin_stacked.top - margin_stacked.bottom

var x_scale_stacked = d3.scale.ordinal()
    .rangeRoundBands([0, width_bar_stacked], 0.1);

var y_scale_stacked = d3.scale.linear()
    .range([height_bar_stacked, 0]);

var color_stacked = d3.scale.ordinal()
    .range(["#0000CC", "#E65C00", "#007300"]);

var x_axis_stacked = d3.svg.axis()
    .scale(x_scale_stacked)
    .orient("bottom");

var y_axis_stacked = d3.svg.axis()
    .scale(y_scale_stacked)
    .orient("left")
    .tickFormat(d3.format(".2s"));

var svg_bar_chart_stacked = d3.select("#bar-chart-stacked")
    .append("svg")
    .attr("width", width_bar_stacked + margin_stacked.left + margin_stacked.right)
    .attr("height", height_bar_stacked + margin_stacked.top + margin_stacked.bottom)
    .append("g")
    .attr("transform", "translate(" + margin_stacked.left + "," + margin_stacked.top + ")");

d3.csv("data/2015-usgs-water-science-centers-detail-funding.csv" , function(error, data) {

    color_stacked.domain(d3.keys(data[0]).filter(function(key) { return key !== "state"; }));

    data.forEach(function(d) {
        var y0 = 0;
        d.funds = color_stacked.domain().map(function(name) { 
            console.log(name)
            return {name: name, y0: y0, y1: y0 += +d[name]}; 
        });
        d.total = d.funds[d.funds.length - 1].y1;
        console.log(d.funds)
    });

    data.sort(function(a, b) { 
        return b.total - a.total; 
    });

    x_scale_stacked.domain(data.map(function(d) {
        return d.state;
    }));

    y_scale_stacked.domain([0, d3.max(data, function(d) {
        return d.total;
    })]);

    svg_bar_chart_stacked.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height_bar_stacked + ")")
      .call(x_axis_stacked)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("transform", function(d) {
          return "rotate(-45)";
      });

    svg_bar_chart_stacked.append("g")
      .attr("class", "y axis")
      .call(y_axis_stacked)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Funding");

    var state = svg_bar_chart_stacked.selectAll(".state")
      .data(data)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x_scale_stacked(d.state) + ",0)"; });

    state.selectAll("rect")
      .data(function(d) { return d.funds; })
    .enter().append("rect")
      .attr("width", x_scale_stacked.rangeBand())
      .attr("y", function(d) { return y_scale_stacked(d.y1); })
      .attr("height", function(d) { return y_scale_stacked(d.y0) - y_scale_stacked(d.y1); })
      .style("fill", function(d) { return color_stacked(d.name); })
      .style("stroke", "None");

    var legend_stacked = svg_bar_chart_stacked.selectAll(".legend_stacked")
      .data(color_stacked.domain().slice().reverse())
    .enter().append("g")
      .attr("class", "legend_stacked")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend_stacked.append("rect")
      .attr("x", width_bar_stacked - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color_stacked)
      .style("stroke", "none");

    legend_stacked.append("text")
      .attr("x", width_bar_stacked - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .style("fill", "black")
      .style("stroke", "none")
      .text(function(d) { return d; });

})