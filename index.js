// Width and height
var margin = { top: 10, right: 10, bottom: 10, left: 10 };

var chart_width = 1000 - margin.left - margin.right;
var chart_height = 700 - margin.top - margin.bottom;

var color = d3.scaleThreshold().range(d3.schemeGnBu[9]);

//function to scale map

function scale(scaleFactor, width, height) {
  return d3.geoTransform({
    point: function(x, y) {
      this.stream.point(
        (x - width / 2) * scaleFactor + width / 2,
        (y - height / 2) * scaleFactor + height / 2
      );
    }
  });
}

var path = d3.geoPath().projection(scale(0.8, chart_width, chart_height));

var education = [];

var svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", chart_width)
  .attr("height", chart_height);

//fetch education data and push into education array, set color domain with min and max values of education data

d3
  .json(
    "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json"
  )
  .then(function(data) {
    var min = d3.min(data, function(d) {
      return d.bachelorsOrHigher;
    });
    var max = d3.max(data, function(d) {
      return d.bachelorsOrHigher;
    });
    //last value of d3.range (below) is the step value and bin size.
    //anything less than min will be the first colour in d3.range, and anything above or equal to max will be the last color in d3.range
    color.domain(d3.range(min, max, (max - min) / 8));
    education.push(data);
  });

//get state/coutnties data to draw map

d3
  .json(
    "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json"
  )
  .then(function(data) {
    var geojsonStates = topojson.mesh(data, data.objects.states, function(
      a,
      b
    ) {
      return a !== b;
    });

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

      //create tooltips

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

    //state boudary stroke

    svg
      .append("path")
      .datum(
        topojson.mesh(data, data.objects.states, function(a, b) {
          return a !== b;
        })
      )
      .attr("d", path)
      .attr("margin", 1)
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round")
      .attr("fill", "none");

    //legend

    //legend colors

    var legend = svg
      .selectAll("rect")
      .data(d3.schemeGnBu[8])
      .enter()
      .append("rect")
      .attr("y", 55)
      .attr("x", function(d, i) {
        return 750 + i * 25;
      })
      .attr("width", 25)
      .attr("height", 10)
      .style("fill", function(d) {
        return d;
      });

    //legend axis

    var min = d3.min(education[0], function(d) {
      return d.bachelorsOrHigher;
    });
    var max = d3.max(education[0], function(d) {
      return d.bachelorsOrHigher;
    });

    var axisValues = d3.range(
      Math.round(min),
      Math.round(max),
      (Math.round(max) - Math.round(min)) / 8
    );

    var legendScale = d3
      .scaleLinear()
      .domain([Math.round(min), Math.round(max)])
      .range([750, 950]);

    var legendAxis = d3
      .axisBottom()
      .scale(legendScale)
      .ticks(8)
      .tickValues(axisValues)
      .tickFormat(function(element) {
        return element + "%";
      })
      .tickSize(15)

    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0, 55)")
      .call(legendAxis);
  });
