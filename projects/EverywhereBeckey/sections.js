
// For use with scroller_template2.html and mfreeman_scroller.js.

// function to move a selection to the front/top, from
// https://gist.github.com/trtg/3922684
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

// Settings object

var settings = {
  // could be used to save settings for styling things.
};

var data = [];

var mainvis = d3.select("#vis");

var section_w = 450;
var section_h = 100;

var vis0 = d3.select("#vis0");
var vis1 = d3.select("#vis1");
var vis2 = d3.select("#vis2");
var vis3 = d3.select("#vis3");
var vis4 = d3.select("#vis4");



//color palette from iWantHue "Intense"
var colors = ["#BA4B4E",
            "#639F43",
            "#C054B6",
            "#AC7B32",
            "#7B72AF",
            "#4C8987"];

var showFunctions = [];
showFunctions[0] = showSection_0;
showFunctions[1] = showSection_1;
showFunctions[2] = showSection_2;
showFunctions[3] = showSection_3;
showFunctions[4] = showSection_4;
var lastSection = 0;

var update = function(section) {
  
  var activeSection = section;
  var sign = (activeSection - lastSection) < 0 ? -1 : 1;
  var scrolledSections = d3.range(lastSection + sign, activeSection + sign, sign);
  scrolledSections.forEach(function(i) {
    showFunctions[i]();
  });
  lastSection = activeSection;

}

function showSection_0(){
  /*
   *section 0
   *
   *show: nothing
   *hide: location dots on map
   */
  d3.selectAll(".location_dots")
    .transition()
    .duration(0)
    .attr("r", 0);
    
  d3.selectAll(".bars")
    .transition()
    .duration(0)
    .attr("opacity", 0);
}

function showSection_1(){
  /*
   *section 1
   *
   *show: dots on map
   *hide: hexbins on map (section 2)
   */
  var duration = 10;
  var n = d3.selectAll(".location_dots").length;
  
  d3.transition()
    .duration(duration)
    .ease("linear")
    .each(function() {
      d3.selectAll(".location_dots")
      .transition()
      .ease("back-out")
      .duration(duration)
      .delay(function(d, i) { return i / n * duration; })
      .attr("r", 7);
      d3.selectAll(".bars")
      .transition()
      .duration(0)
      .delay(function(d, i) { return i / n * duration; })
      .attr("opacity", 1);
  });
    
  d3.selectAll(".hexbins")
    .transition()
    .duration(0)
    .attr("opacity", 0);
    
  d3.select(".topAreas")
    .transition()
    .duration(0)
    .attr("opacity", 0);
  
}

function showSection_2(){
  /*
   *section 2
   *
   *show: hexbins on map
   *hide: location dots on map and section 4
   */
  var duration = 1000;
  d3.selectAll(".hexbins")
    .transition()
    .duration(duration)
    .attr("opacity", 1);
  
  d3.select(".topAreas")
    .transition()
    .duration(duration)
    .attr("opacity", 1);
    
  d3.selectAll(".location_dots")
    .transition()
    .duration(0)
    //.delay(duration)
    .attr("r", 0);
    
  d3.selectAll(".bars")
    .transition()
    .duration(0)
    .attr("opacity", 0);
    
    d3.selectAll(".area_labels")
    .transition()
    .duration(0)
    .attr("r", 0);
}

function showSection_3() {
  /*
   *section 3
   *
   *show: early locations visited on map and dot plot in section vis
   *hide: hexbins on map and areaLabels of section 4
   */
  d3.select(".zoom-buttons")
    .style("visibility", "hidden");
  
  d3.selectAll(".area_labels")
    .transition()
    .duration(1000)
    .attr("r", 10);
    
  d3.selectAll(".hexbins")
    .transition()
    .duration(0)
    .attr("opacity", 0);
  
  d3.select(".topAreas")
    .transition()
    .duration(0)
    .attr("opacity", 0);
    
  d3.selectAll(".location_dots")
    .transition()
    .duration(0)
    .attr("r", 0);
    
  d3.selectAll(".location_dots")
    .on("mouseover", null)
    .on("mouseout", null);
  
  if (lastSection == 4) {
    map
      .transition()
      .duration(1000)
      .attr("transform","translate(0,0)");
  }

  zoomEnabled = false;
  zoom.translate([0,0]);
  zoom.scale(1);
 
  
}

function showSection_4(){
  /*
   *section 4
   *
   *show: expand map and enable exploratory interaction
   *hide: area label circles of section 3
   */
  d3.select(".zoom-buttons")
    .style("visibility", "visible");
    
  d3.selectAll(".area_labels")
    .transition()
    .duration(0)
    .attr("r", 0);
    
  d3.selectAll(".location_dots")
    .transition()
    .ease("back-out")
    .duration(0)
    .attr("r", 7);
  
  map
    .transition()
    .duration(1000)
    .attr("transform","translate(-70,50)");
    
  var displayTooltip = false;
  d3.select("#tooltip")
    .on("mouseover", function(){
      displayTooltip = true;
      d3.select(this).classed("hidden", false);
    })
    .on("mouseout", function(){
      displayTooltip = false;
      d3.select(this).classed("hidden", true);
    });
        
  d3.selectAll(".location_dots")
    .on("mouseover", function(d) {
      
      displayTooltip = true;
      var xPosition = 0;
      var yPosition = 0;
      xPosition = d3.event.pageX;
      yPosition = d3.event.pageY;
  
      //Update the tooltip position and value
      d3.select("#tooltip")
        .style("left", xPosition + 20 + "px")
        .style("top", yPosition - 40 + "px")
        .select("#title")
        .text(d.search_string)
      d3.select("#tooltip")
        .select("#year")
        .text(d.year);
      d3.select("#tooltip")
        .select("#link")
        .attr("href",d.link);
  
      //Show the tooltip
      d3.select("#tooltip").classed("hidden", false)

    })
    .on("mouseout", function() {
      
      displayTooltip = false;
      setTimeout(function () {
        if (!displayTooltip) {
          d3.select("#tooltip").classed("hidden", true);
        }}, 100
      );
    });
  
  zoomEnabled = true;
  zoom.translate([-70,50]);
  zoom.scale(1);
  
}

function setupVis(data, area_data){
  
  //section 0
  setupSection_0();
  //section 1
  setupSection_1(data);
  //section 2
  setupSection_2(data);
  //section 3
  setupSection_3(area_data);
  
}

function setupSection_0 (){
  
  var margin = {top: 50, right: 10, bottom: 20, left: 30},
    width = section_w - margin.left - margin.right,
    height = section_h - margin.top - margin.bottom;
    
  var svg0 = vis0.append("svg")
    .attr("width", section_w)
    .attr("height", section_h)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  var circRadius = 20;  
  svg0.append("circle")
    .attr("r", circRadius)
    .attr("fill","#000");
  
  svg0.append("path")
    .attr("d","M "+ (-0.5*circRadius) +" "+ (-0.2*circRadius) +" L 0 "+ (0.2*circRadius) +" L "+ (0.5*circRadius) +" "+ (-0.2*circRadius) +" ")
    .attr("class", "scroll_arrow");
  
  svg0.append("text")
    .attr("x", 1.5*circRadius)
    .attr("dy", "0.4em")
    .attr("class", "title")
    .text("Scroll");
}

function setupSection_1(data){
  
  data.sort(function(a,b) {return b.year - a.year;});
  
  //Draw circle for each location
  var dots = overlay.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class","location_dots")
    .attr("cx", function(d) {
      var coords = projection([d.lng, d.lat]);
      if (coords) {
       return coords[0];
      }
      return null;
    })
    .attr("cy", function(d) {
      var coords = projection([d.lng, d.lat]);
      if (coords) {
       return coords[1];
      }
      return null;
    })
    .attr("r", 0);
    
  //Draw section 1 bar chart
  var section_h = 150
  var margin = {top: 10, right: 10, bottom: 20, left: 20},
    width = section_w - margin.left - margin.right,
    height = section_h - margin.top - margin.bottom;
    
  var x = d3.scale.ordinal()
    .rangeBands([0, width],0.1,0.1)
    .domain(_.range(d3.min(data, function(d) { return d.year; }), d3.max(data, function(d) { return d.year; })+1));

  var y = d3.scale.linear()
    .range([height, 0]);
  
  var year_data = d3.nest()
    .key(function(d) { return d.year; })
    .entries(data);
  
  year_data.forEach(function(d){
    d.total = d.values.length
  });
  y.domain([0,d3.max(year_data, function(d) { return d.total; })])
  
  var yearsFormatter = d3.format(".0f")
  var xAxis = d3.svg.axis()
    .scale(x)
    .tickFormat(function(d) { //return '75 for 1975 etc.
        var dec = ( (d/100) % 1).toFixed(2).substring(2);
        return "'" + dec;
      })
    .tickValues(x.domain().filter(function(d, i) { return !(d % 5); }))
    .orient("bottom");
  
  var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(5)
    .orient("left");
      
  var svg1 = vis1.append("svg")
    .attr("width", section_w)
    .attr("height", section_h)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
  svg1.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("transform", "translate("+width+",0)")
      .attr("dx",-10)
      .attr("dy", "1.5em")
      .text("Year");;

  svg1.append("g")
      .attr("class", "y axis")
      .call(yAxis);
  
  var g = svg1.append("g")
    .selectAll("g")
    .data(year_data)
    .enter()
    .append("g")
    .attr("transform",function(d,i) {return "translate("+x(+d.key)+",0)";});
  
  var barHeight = y(1)-y(2);
  bars = g.selectAll("rect")
    .data(function(d){return d.values})
    .enter()
    .append("rect")
    .attr("class","bars")
    .attr("x",0) 
    .attr("width", x.rangeBand()*0.8)
    .attr("y", function(d,i) { return  y(i) - barHeight; })
    .attr("height", 1)
    .attr("opacity", 0);
  
}

function setupSection_2(data){
  
  var binRadius = 8;
  var hexbin = d3.hexbin()
    .size([w, h])
    .radius(binRadius);
  
  var highColor = "#e31a1c",
      lowColor = "#fffffc";
  
  var binColor = d3.scale.linear()
    .domain([0, 80])
    .range([lowColor, highColor]);
  
  var points = [];
  data.forEach(function(d,i) {
    points.push(projection([d.lng, d.lat]));
  });
  var binnedData = hexbin(points);
  binnedData.sort(function(a,b) {return b.length - a.length});
  
  var hexbinLayer = overlay.append("g")
    .attr("class", "hexagons")
    
  var hexbins = hexbinLayer
    .selectAll("path")
    .data(binnedData) 
    .enter()
    .append("path")
    .attr("d", function(d) { return hexbin.hexagon(); })
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    .style("fill", function(d) { return binColor(d3.sum(d, function(d,i) { return 1; })); })
    .attr("class", "hexbins")
    .attr("opacity", 0);
  
  var topAreas = [{"name":"High Sierra", "bin": binnedData[0]},
                  {"name":"North Cascades", "bin": binnedData[1]},
                  {"name":"Wind River Range", "bin": binnedData[2]},
                  {"name":"Canadian Rockies", "bin": binnedData[4]}];
  
  var areaOutlines = hexbinLayer.append("g")
    .attr("class","topAreas")
    .selectAll("g")
    .data(topAreas)
    .enter()
    .append("g");
            
  areaOutlines
    .append("path")
    .attr("d", function(d) { return hexbin.hexagon(); })
    .attr("transform", function(d) { return "translate(" + d.bin.x + "," + d.bin.y + ")"; })
    .attr("class","areaOutline");
  
  areaOutlines
    .append("text")
    .text(function(d){ return d.name;})
    .attr("transform", function(d) { return "translate(" + (d.bin.x + binRadius + 5) + "," + (d.bin.y + binRadius) + ")"; });
    
  d3.select(".topAreas")
    .attr("opacity", 0);
    
  //for debugging
  //hexbins
  //  .on("mouseover", function(d,i) {
  //    var xPosition = 0;
  //    var yPosition = 0;
  //    //console.log(d3.mouse(d3.select(".container")))
  //    //[xPosition, yPosition] = d3.mouse("body");
  //    xPosition = d3.event.pageX;
  //    yPosition = d3.event.pageY;
  //
  //    //Update the tooltip position and value
  //    d3.select("#tooltip")
  //    .style("left", xPosition + 20 + "px")
  //    .style("top", yPosition + "px")
  //    .select("#title")
  //    .text("bin "+i+": "+d.length);
  //
  //    //Show the tooltip
  //    d3.select("#tooltip").classed("hidden", false);
  //  })
  //  .on("mouseout", function() {
  //    //Hide the tooltip
  //    d3.select("#tooltip").classed("hidden", true);
  //  });
    
  //Create color scale key
  var scale_width = 200,
      scale_height = 25,
      divisions = 75;
  
  var margin = {top: 30, right: 20, bottom: 20, left: 0},
    width = section_w - margin.left - margin.right,
    height = section_h - margin.top - margin.bottom;
    
  var newData = [];
  var sectionWidth = Math.floor(scale_width / divisions);
  
  for (var i=0; i < scale_width; i+= sectionWidth ) {
     newData.push(i);
  }
  
  var colorScaleKey = d3.scale.linear()
    .domain([0, newData.length-1])
    .range([lowColor, highColor]);
  
  var svg2 = vis2.append("svg")
    .attr("width", section_w)
    .attr("height", section_h)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
  svg2.selectAll('rect')
    .data(newData)
    .enter()
    .append('rect')
    .attr("y", 0)
    .attr("x", function(d) { return d; })
    .attr("height", scale_height)
    .attr("width", sectionWidth)
    .attr('fill', function(d, i) { return colorScaleKey(i)});
  
  var keyLabels = d3.scale.linear()
    .domain([0, scale_width])
    .range([0, 80]);
    
  svg2.selectAll('text')
    .data(newData)
    .enter()
    .append('text')
    .attr("y", scale_height+5)
    .attr("dy",-0.5*scale_height)
    .attr("x", function(d) { return d; })
    .text(function(d,i){
      var binVal = keyLabels(d);
      if (binVal % 10 < 0.1) {
        return binVal;
      }
      else {
        return "";
      }
    });
    
  svg2.append('text')
    .attr("dy","-0.4em")
    .text("Number of climbs")
}

function setupSection_3(area_data) {
  
  var grouped_data = d3.nest()
    .key(function(d) { return d.place; })
    .entries(area_data);
    
  //draw area labels on main map
  var areas = {"Whitney Portal":{"lat":36.5885514, "lng":-118.2377668, "color":colors[0]},
                        "Wind River Range":{"lat":42.7726335, "lng":-109.2358535, "color":colors[1]},
                        "Mt. Huntington":{"lat":62.9678103, "lng":-150.9664281, "color":colors[2]},
                        "Stikine":{"lat":56.9723708, "lng":-132.405266, "color":colors[3]},
                        "Cascade Range":{"lat":48.8724501, "lng":-121.3728328, "color":colors[4]},
                        "Sawtooth Range":{"lat":44.0724831, "lng":-115.03549, "color":colors[5]}
                        };
  
  var areaLabelsLayer = overlay.append("g");
    
  var areaLabels = areaLabelsLayer.selectAll("circle")
    .data(grouped_data.map(function(d){return d.key}))
    .enter()
    .append("circle")
    .attr("cx",function(d) {
      var coords = projection([areas[d].lng, areas[d].lat]);
      return coords[0];
    })
    .attr("cy",function(d) {
      var coords = projection([areas[d].lng, areas[d].lat]);
      return coords[1];
    })
    .attr("fill",function(d){ return areas[d].color})
    .attr("class", "area_labels")
    .attr("r",0);
    
  //Draw section 4 area dot plot
  var section_h = 150; //a local section height
  var margin = {top: 20, right: 10, bottom: 20, left: 100},
    width = section_w - margin.left - margin.right,
    height = section_h - margin.top - margin.bottom;
    
  var x = d3.scale.linear()
    .range([0, width])
    .domain([d3.min(area_data, function(d) { return d.year; }), d3.max(area_data, function(d) { return d.year; })+1]);

  var yPadding = 10;
  var y = d3.scale.ordinal()
    .rangePoints([yPadding, height-yPadding])
    .domain(grouped_data.map(function(d){return d.key}));

  var xAxis = d3.svg.axis()
    .scale(x)
    .tickFormat(function(d) { //return '75 for 1975 etc.
        var dec = ( (d/100) % 1).toFixed(2).substring(2);
        return "'" + dec;
      })
    .orient("bottom");
  
  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
      
  var svg3 = vis3.append("svg")
    .attr("width", section_w)
    .attr("height", section_h)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
  svg3.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height +")")
      .call(xAxis)
    .append("text")
      .attr("transform", "translate("+width+",0)")
      .attr("dx",-15)
      .attr("dy", "1.5em")
      .text("Year");

  svg3.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(0,0)")
      .call(yAxis);
  
  var g = svg3.append("g")
    .selectAll("g")
    .data(grouped_data)
    .enter()
    .append("g")
    .attr("transform",function(d,i) {return "translate(0,"+y(d.key)+")";});
  
  var circles = g.selectAll("circle")
    .data(function(d){return d.values})
    .enter()
    .append("circle")
    .attr("class","area_dots")
    .attr("cx",function(d,i) { return  x(+d.year); }) 
    .attr("cy", 0)
    .attr("fill",function(d){
      if (d.beckey) {
        return areas[d.place].color;
      }
      else {
        return "rgba(200,200,200,0.3)";
      }
    })
    .attr("r",5);
    
  //draw key
  var key = svg3.append("g")
    .attr("class","section4_key")
    .attr("transform", "translate(0,"+(-margin.top)+")");
  var space = 100,
      xpadding = 10,
      ypadding = 10;
      
  key.append("circle")
    .attr("r",5)
    .attr("cx",xpadding)
    .attr("cy",ypadding)
    .attr("fill",areas["Whitney Portal"].color);
    
  key.append("text")
    .attr("transform", "translate("+(xpadding+10)+","+ypadding+")")
    .attr("dy", ".4em")
    .text("Beckey");
    
  key.append("circle")
    .attr("r",5)
    .attr("cx",xpadding+space)
    .attr("cy",ypadding)
    .attr("fill","rgba(200,200,200,0.5)");
    
  key.append("text")
    .attr("transform", "translate("+(xpadding+space+10)+","+ypadding+")")
    .attr("dy", ".4em")
    .text("Everyone Else");
    
}

// setup scroll functionality
function display(error, data, area_data) {
  if (error) {
    console.log(error);
  } else {
    //console.log(data);
    
    var vis = d3.select("#vis");

    var scroll = scroller()
      .container(d3.select('#graphic'));

    // pass in .step selection as the steps
    scroll(d3.selectAll('.step'));

    // Pass the update function to the scroll object
    scroll.update(update);
    
    setupVis(data, area_data);
   
  }

} // end display

function parser_1(d) {
  return {
    num: +d.num, 
    lat: d.lat,
    link: d.link,
    lng: +d.lng, 
    location: d.location,
    long_name: d.long_name,
    month: d.month,
    report_type: d.report_type,
    manual_entry: +d.manual_entry,
    search_string: d.search_string,
    state: d.state,
    text: d.text,
    year: +d.year-1
  };
}

function parser_2(d) {
  return {
    num: +d.num, 
    link: d.link,
    place: d.place,
    location: d.location,
    report_type: d.report_type,
    beckey: +d.beckey,
    text: d.text,
    year: +d.year-1
  };
}

d3_queue.queue()
  .defer(d3.csv, "geocoded_data_1_utf8.csv", parser_1)
  .defer(d3.csv, "area_data.csv", parser_2)
  .await(display);
