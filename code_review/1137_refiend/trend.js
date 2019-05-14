
//d3.csv("https://raw.githubusercontent.com/yuew03/house_compass/master/dataset/data_set/city_date_price_Monthly.csv", function(error, data) { console.log(data);
 
//d3.csv("https://raw.githubusercontent.com/yuew03/house_compass/82f42de31958ce4b5baeeee6f0bb6ab4ad2f90aa/dataset/data_set/9cities_month_transpose.csv  ", function(error, data) { console.log(data                                                                                                                                        
    
var margin = {top: 10, right: 20, bottom: 10, left: 10},
    margin2 = { top: 340, right: 20, bottom: 20, left: 10 },
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom,
    height2 = 400 - margin2.top - margin2.bottom;

    d3.select("#trendvis")
      .style('height', height)
      .style('width', width);

var svg = d3.select("#trendvis")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom); //height + margin.top + margin.bottom
    
    svg.append("g")
    .attr("transform", "translate(" + margin.left +"," + margin.top +")")
    .style("fill", "grey"); 

var title = svg.append("text")
    .attr("transform", "translate(" + (width + margin.left + margin.right) /2 +"," + 20 +")" )
    .style("text-anchor", "Left")
    .style("font-weight", 700)
    .text("Cities' Monthly Housing Price Trends");
 

var parseDate = d3.timeFormat("%Y%m").parse;
var bisectDate = d3.bisector(function(d) { return d.date; }).left;

var xScale = d3.scaleTime()
    .range([0, width]),

    xScale2 = d3.scaleTime()
    .range([0, width]); // Duplicate xScale for brushing ref later

var yScale = d3.scaleLinear()
    .range([height, 0]);

// Custom DDV colors 
var color = d3.scaleOrdinal().range(["#48A36D", "#80CCB3", "#9788CD", "#CE80B0", "#E16167", "#E39158", "#DDC05E", "#F2DE8A"]);  


var xAxis = d3.axisBottom(xScale),
// d3.svg.axis()
//     .scale(xScale)
//     .orient("bottom"),

    xAxis2 = d3.axisBottom(xScale2);
    // svg.axis() // xAxis for brush slider
    // .scale(xScale2)
    // .orient("bottom");    

var yAxis = d3.axisBottom(yScale);

// svg.axis()
//     .scale(yScale)
//     .orient("left");  

var line = d3.line()
    .curve("basis")
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale(d.rating); })
    .defined(function(d) { return d.rating; });  // Hiding line value defaults of 0 for missing data

var maxY; // Defined later to update yAxis

// Create invisible rect for mouse tracking
svg.append("rect")
    .attr("width", width)
    .attr("height", height)                                    
    .attr("x", 0) 
    .attr("y", 0)
    .attr("id", "mouse-tracker")
    .style("fill", "grey"); 

//for slider part-----------------------------------------------------------------------------------
  
var context = svg.append("g") // Brushing context box container
    .attr("transform", "translate(" + 0 + "," + 410 + ")")
    .attr("class", "context");

//append clip path for lines plotted, hiding those part out of bounds
svg.append("z")
  .append("clipPath") 
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height); 

//end slider part----------------------------------------------------------------------------------- 
city_date_price_Monthly = "https://raw.githubusercontent.com/yuew03/house_compass/master/dataset/data_set/city_date_price_Monthly.csv";
d3.csv(city_date_price_Monthly, function( data ) { 
  
  color.domain(d3.keys(data).filter(function(key) { // Set the domain of the color ordinal scale to be all the csv headers except "date", matching a color to an issue
    return key !== "Date"; 
  }));
  //console.log(data.length);
  d3.csv(city_date_price_Monthly)
    .then(function(d){
      d.date = d3.timeParse(d.date);
    });
  // data.forEach(function(d) { // Make every date in the csv data a javascript date object format
  //   d.date = parseDate(d.date);
  // });

  var categories = color.domain().map(function(name) { // Nest the data into an array of objects with new keys
    // console.log(name);
    return {
      name: "City", // "name": the csv headers except date
      values: d3.map(function(d) { // "prices": which has an array of the dates and ratings
        return {
          date: d.date, 
          price: +(d[name]),
          };
      }),
      visible: (name === "Seattle" ? true : false) // "visible": all false except for economy which is true.
    };
  });

  xScale.domain(d3.extent(data, function(d) { return d.date; })); // extent = highest and lowest points, domain is data, range is bouding box

  yScale.domain([0, 100
    //d3.max(categories, function(c) { return d3.max(c.values, function(v) { return v.rating; }); })
  ]);

  xScale2.domain(xScale.domain()); // Setting a duplicate xdomain for brushing reference later
 
 
//for slider part-----------------------------------------------------------------------------------

 var brush = d3.brushX(xScale2)//for slider bar at the bottom
    // .x(xScale2) 
    .on("brush end", brushed);

  context.append("g") // Create brushing xAxis
      .attr("class", "xaxis1")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);

  var contextArea = d3.area() // Set attributes for area chart in brushing context graph
    // .interpolate("monotone")
    .x(function(d) { return xScale2(d.date); }) // x is scaled to xScale2
    .y0(height2) // Bottom line begins at height2 (area chart not inverted) 
    .y1(0); // Top line of area, 0 (area chart not inverted)

  //plot the rect as the bar at the bottom
  context.append("path") // Path is created using svg.area details
    .attr("class", "area")
    .attr("d", contextArea(categories[0].values)) // pass first categories data .values to area path generator 
    .attr("fill", "#F1F1F2");
    
  //append the brush for the selection of subsection  
  context.append("g")
    .attr("class", "x brush")
    .call(brush)
    .selectAll("rect")
    .attr("height", height2) // Make brush rects same height 
      .attr("fill", "#E6E7E8");  
  //end slider part-----------------------------------------------------------------------------------

  // draw line graph
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("x", -10)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Housing Price(USD)");

  var price = svg.selectAll(".price")
      .data(categories) // Select nested data and append to new svg group elements
    .enter().append("g")
      .attr("class", "price");   

  price.append("path")
      .attr("class", "line")
      .style("pointer-events", "none") // Stop line interferring with cursor
      .attr("id", function(d) {
        return "line-" + d.name.replace(" ", "").replace("/", ""); // Give line id of line-(insert issue name, with any spaces replaced with no spaces)
      })
      .attr("d", function(d) { 
        return d.visible ? line(d.values) : null; // If array key "visible" = true then draw line, if not then don't 
      })
      .attr("clip-path", "url(#clip)")//use clip path to make irrelevant part invisible
      .style("stroke", function(d) { return color(d.name); });

  // draw legend
  var legendSpace = 300 / categories.length; // 450/number of issues (ex. 40)    

  price.append("rect")
      .attr("width", 10)
      .attr("height", 10)                                    
      .attr("x", width + (margin.right/3) - 15) 
      .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace) - 8; })  // spacing
      .attr("fill",function(d) {
        return d.visible ? color(d.name) : "#F1F1F2"; // If array key "visible" = true then color rect, if not then make it grey 
      })
      .attr("class", "legend-box")

      .on("click", function(d){ // On click make d.visible 
        d.visible = !d.visible; // If array key for this data selection is "visible" = true then make it false, if false then make it true

        maxY = findMaxY(categories); // Find max Y rating value categories data with "visible"; true
        yScale.domain([0,maxY]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true
        svg.select(".y.axis")
          .transition()
          .call(yAxis);   

        price.select("path")
          .transition()
          .attr("d", function(d){
            return d.visible ? line(d.values) : null; // If d.visible is true then draw line for this d selection
          })

        price.select("rect")
          .transition()
          .attr("fill", function(d) {
          return d.visible ? color(d.name) : "#F1F1F2";
        });
      })

      .on("mouseover", function(d){

        d3.select(this)
          .transition()
          .attr("fill", function(d) { return color(d.name); });

        d3.select("#line-" + d.name.replace(" ", "").replace("/", ""))
          .transition()
          .style("stroke-width", 2.5);  
      })

      .on("mouseout", function(d){

        d3.select(this)
          .transition()
          .attr("fill", function(d) {
          return d.visible ? color(d.name) : "#F1F1F2";});

        d3.select("#line-" + d.name.replace(" ", "").replace("/", ""))
          .transition()
          .style("stroke-width", 1.5);
      })
      
  price.append("text")
      .attr("x", width + (margin.right/3)) 
      .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace); })  // (return (11.25/2 =) 5.625) + i * (5.625) 
      .text(function(d) { return d.name; }); 

  // Hover line 
  var hoverLineGroup = svg.append("g") 
            .attr("class", "hover-line");

  var hoverLine = hoverLineGroup // Create line with basic attributes
        .append("line")
            .attr("id", "hover-line")
            .attr("x1", 10).attr("x2", 10) 
            .attr("y1", 0).attr("y2", height + 10)
            .style("pointer-events", "none") // Stop line interferring with cursor
            .style("opacity", 1e-6); // Set opacity to zero 

  var hoverDate = hoverLineGroup
        .append('text')
            .attr("class", "hover-text")
            .attr("y", height - (height-40)) // hover date text position
            .attr("x", width - 150) // hover date text position
            .style("fill", "#E6E7E8");

  var columnNames = d3.keys(data[0]) //grab the key values from your first data row
                                     //these are the same as your column names
                  .slice(1); //remove the first column name (`date`);

  var focus = price.select("g") // create group elements to house tooltip text
      .data(columnNames) // bind each column name date to each g element
    .enter().append("g") //create one <g> for each columnName
      .attr("class", "focus"); 

  focus.append("text") // http://stackoverflow.com/questions/22064083/d3-js-multi-series-chart-with-y-value-tracking
        .attr("class", "tooltip")
        .attr("x", width + 20) // position tooltips  
        .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace); }); // (return (11.25/2 =) 5.625) + i * (5.625) // position tooltips       



  //for brusher of the slider bar at the bottom
  function brushed() {

    xScale.domain(brush.empty() ? xScale2.domain() : brush.extent()); // If brush is empty then reset the Xscale domain to default, if not then make it the brush extent 

    svg.select(".x.axis") // replot xAxis with transition when brush used
          .transition()
          .call(xAxis);

    maxY = findMaxY(categories); // Find max Y rating value categories data with "visible"; true
    yScale.domain([0,maxY]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true
    
    svg.select(".y.axis") // Redraw yAxis
      .transition()
      .call(yAxis);   

    price.select("path") // Redraw lines based on brush xAxis scale and domain
      .transition()
      .attr("d", function(d){
          return d.visible ? line(d.values) : null; // If d.visible is true then draw line for this d selection
      });
    
  };      

}); // End Data callback function
  
  function findMaxY(data){  // Define function "findMaxY"
    var maxYValues = data.map(function(d) { 
      if (d.visible){
        return d3.max(d.values, function(value) { // Return max rating value
          return value.rating; })
      }
    });
    return d3.max(maxYValues);
  }


























