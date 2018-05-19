
//Width and height
var w = 900;
var h = 500;

//Define map projection
var projection = d3.geo.mercator()
    .center([-120,45])
    .translate([w/2, h/2])
    .scale([300]);

var zoom = d3.behavior.zoom()
    .scaleExtent([1, 100])
    .on("zoom", zoomed);

var zoomEnabled = false;

//Define path generator
var path = d3.geo.path()
    .projection(projection);

//Create SVG element
var svg = d3.select("#vis")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .append("g");

var map = svg.append("g")
       .classed("map",true);

var basemap = map.append("g")
        .classed("basemap",true);

var overlay = map.append("g")
        .classed("overlay",true);

//Create containing box for proper pan-zoom
var rect = map.append("rect")
    .attr("x",0)
    .attr("y",0)
    .attr("width",w)
    .attr("height",h)
    .style("fill","none");
                
    
//Load in GeoJSON data and plot state boundaries
d3.json("world-110m.json", function(error,world) {
    if (error) throw error;
    
    //map.append("path")
    //    .datum(topojson.feature(world, world.objects.land))
    //    .attr("class", "land")
    //    .attr("d", path);
        
    var defs = basemap.append("defs");
    defs.append("path")
        .datum(topojson.feature(world, world.objects.land))
        .attr("id", "land")
        .attr("d", path)
        .style("fill", "none");
    
    //some ugly code here to get shaded relief background image properly placed, scaled and clipped.
    var delx = 137,
        dely = -22;
    basemap.append("clipPath")
        .attr("id", "clip1")
        .attr("transform","translate("+(-1*delx)+","+(-1*dely)+")") 
      .append("use")
        .attr("xlink:href", "#land");
        
    basemap.append("image")
        .attr("width", 900*0.89)
        .attr("height", 669*0.89)
        .attr("transform","translate("+delx+","+dely+")")
        .attr("clip-path", "url(#clip1)")
        .attr("xlink:href", "shaded_relief.png");
  
    basemap.append("path")
        .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
        .attr("class", "boundary")
        .attr("d", path);
    
    d3.json("us-states.json", function(sts) {
        
        basemap.append("path")
            .datum(topojson.feature(sts, sts.objects.states))
            .attr("class", "boundary")
            .attr("d", path);
    
    }); //ends d3.json states callback
    
}); //ends d3.json world callback


//Pan and zoom behavior
function zoomed() {
    if (zoomEnabled) {
        map.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        zoom_level = d3.event.scale;
        
        svg.selectAll(".location_dots")
          .attr("r", 7 / zoom_level)
          .style("stroke-width",1/ zoom_level);				
    };
};

svg.call(zoom).call(zoom.event);

function zoomClick() {
  svg.call(zoom.event); // https://github.com/mbostock/d3/issues/2387

  // Record the coordinates (in data space) of the center (in screen space).
  var center0 = [w/2, h/2];
  var translate0 = zoom.translate();
  var coordinates0 = coordinates(center0);
  zoom.scale(zoom.scale() * Math.pow(2, +this.getAttribute("data-zoom")));

  // Translate back to the center.
  var center1 = point(coordinates0);
  zoom.translate([translate0[0] + center0[0] - center1[0], translate0[1] + center0[1] - center1[1]]);

  svg.transition().duration(750).call(zoom.event);
}

function coordinates(point) {
  var scale = zoom.scale(), translate = zoom.translate();
  return [(point[0] - translate[0]) / scale, (point[1] - translate[1]) / scale];
}

function point(coordinates) {
  var scale = zoom.scale(), translate = zoom.translate();
  return [coordinates[0] * scale + translate[0], coordinates[1] * scale + translate[1]];
}

d3.selectAll('button[data-zoom]').on('click', zoomClick);


  
  