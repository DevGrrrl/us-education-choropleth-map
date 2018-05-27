// Width and height
var margin = { top: 10, right: 10, bottom: 10, left: 10 };

var chart_width = 1000 - margin.left - margin.right;
var chart_height = 700 - margin.top - margin.bottom;

var color = d3
  .scaleQuantize()
  .range([
    "#fff7ff",
    "#e9dbea",
    "#d2bfd6",
    "#bba4c3",
    "#a38bb1",
    "#8c729f",
    "#735a8e",
    "#5a437d",
    "#402e6d"
  ]);

var path = d3.geoPath();

var education = [];

var svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", chart_width)
  .attr("height", chart_height);

d3
  .json(
    "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json"
  )
  .then(function(data) {
    color.domain([
      d3.min(data, function(d) {
        return d.bachelorsOrHigher;
      }),
      d3.max(data, function(d) {
        return d.bachelorsOrHigher;
      })
    ]);

    education.push(data);
  });

d3
  .json(
    "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json"
  )
  .then(function(data) {
    var geojsonStates = topojson.feature(data, data.objects.states).features;
    var geojsonCounties = topojson.feature(data, data.objects.counties)
      .features;

    for (var i = 0; i < education[0].length; i++) {
      var state = education[0][i].state;
      var bachelorsOrHigher = education[0][i].bachelorsOrHigher;
      var countyFips = education[0][i].fips;
      var county = education[0][i].area_name;

      for (var j = 0; j < geojsonCounties.length; j++) {
        var countyId = geojsonCounties[j].id;
        if (countyFips == countyId) {
          geojsonCounties[j].properties.value = {
            bachelorsOrHigher: bachelorsOrHigher,
            state: state,
            county: county
          };
        }
      }
    }

    svg
      .selectAll("path")
      .data(geojsonCounties)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", function(d) {
        var value = d.properties.value;
        if (value) {
          return color(value.bachelorsOrHigher);
        } else {
          return "#ccc";
        }
      })
      .attr("stroke-width", 0.1)
      .attr("stroke", "white")

      .on("mouseover", function(d) {
        var coordinates = [];
        coordinates = d3.mouse(this);

        d3
          .select("#tooltip")
          .style("background-color", "rgb(255, 247, 188)")
          .style("opacity", "0.8")
          .style("left", coordinates[0] + 200 + "px")
          .style("top", coordinates[1] - 30 + "px")
          .style("display", "block")
          .html(
            d.properties.value.state +
              " " +
              d.properties.value.county +
              " " +
              d.properties.value.bachelorsOrHigher +
              "%"
          );
      })

      .on("mouseout", function() {
        d3.select("#tooltip").style("display", "none");
      });

    svg
      .selectAll(".outline")
      .data(geojsonStates)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("margin", 2)
      .attr("fill", "none");
  });
