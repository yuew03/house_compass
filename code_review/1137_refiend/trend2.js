
//d3.csv("https://raw.githubusercontent.com/yuew03/house_compass/master/dataset/data_set/9cities_month_transpose.csv", function(error, data) { console.log(data);
    

// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 20, left: 10},
    width = 540 - margin.left - margin.right,
    height = 360 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#trendvis2")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

svg
  .insert('rect', ':first-child')
  .attr('width', '100%')
  .attr('height', '100%')
  .attr('fill', '#ff96ca');

//Read the data
d3.csv("https://gist.githubusercontent.com/mia-zhu/dd3182fc702534aae97ab7552a2c57ce/raw/eef725c7a2cb89200f6a3b9828bb0d68500a52e6/monthly_data.csv", function(data) {

    // List of cities (here I have one cit per column)
    var allCity = ["Seattle", "Renton", "Bellevue", "Bothell",	"Redmond",	"Lynnwood",	"Kirkland",	"Sammamish", "Shoreline"]
    // console.log(data);
    // Reformat the data: we need an array of arrays of {x, y} tuples
    var dataReady = allCity.map( function(cityName) { // .map allows to do something for each element of the list
        // console.log(cityName);
      return {
        city: cityName,
        prices: d3.map(function(d) {
          return {date: d.date, price: +d[cityName]};
        })
      };
    });
    
    // I strongly advise to have a look to dataReady with
    // console.log(dataReady)

   // A color scale: one color for each city
    var myColor = d3.scaleOrdinal()
      .domain(allCity)
      .range(d3.schemeSet2);

    // Add X axis --> it is a date format
    var x = d3.scaleLinear()
      // .domain()
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain( [0,1150000])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add the lines
    var line = d3.line()
      .x(function(d) { return x(+d.date) })
      .y(function(d) { return y(+d.price) });
    svg.selectAll("myLines")
      .data(dataReady)
      .enter()
      .append("path")
        .attr("class", function(d){ return d.city })
        .attr("d", function(d){ return line(d.prices) } )
        .attr("stroke", function(d){ return myColor(d.city) })
        .style("stroke-width", 3)
        .style("fill", "none");
    
    // Add the points
    svg
      // First we need to enter in a city
      .selectAll("myDots")
      .data(dataReady)
      .enter()
        .append('g')
        .style("fill", function(d){ return myColor(d.city) })
        .attr("class", function(d){ return d.city })
      // Second we need to enter in the 'prices' part of this group
      .selectAll("myPoints")
      .data(function(d){ return d.prices })
      .enter()
      .append("circle")
        .attr("cx", function(d) { return x(d.date) } )
        .attr("cy", function(d) { return y(d.price) } )
        .attr("r", 3)
        .attr("stroke", "white");
      //console.log("this is a test");

 /*   // Add a label at the end of each line
    svg
      .selectAll("myLabels")
      .data(dataReady)
      .enter()
        .append('g')
        .append("text")
          .attr("class", function(d){ return d.city })
          .datum(function(d) { return {city: d.city, price: d.prices[d.prices.length - 1]}; }) // keep only the last price of each time sery
          .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.price) + ")"; }) // Put the text at the position of the last point
          .attr("x", 10) // shift the text a bit more right
          .text(function(d) { return d.city; })
          .style("fill", function(d){ return myColor(d.city) })
          .style("font-size", 15)

    // Add a legend (interactive)
    svg
      .selectAll("myLegend")
      .data(dataReady)
      .enter()
        .append('g')
        .append("text")
          .attr('x', function(d,i){ return 30 + i*60})
          .attr('y', 30)
          .text(function(d) { return d.city; })
          .style("fill", function(d){ return myColor(d.city) })
          .style("font-size", 15)
        .on("click", function(d){
          // is the element currently visible ?
          currentOacity = d3.selectAll("." + d.city).style("opacity")
          // Change the opacity: from 0 to 1 or from 1 to 0
          d3.selectAll("." + d.city).transition().style("opacity", currentOpacity == 1 ? 0:1)

        })*/
})