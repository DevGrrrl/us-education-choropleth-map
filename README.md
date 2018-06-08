
# United States Educational Attainment - Choropleth Map using D3  🗺🌎

## A Free Code Camp(beta) Data Visualisation Project (WiP)

### Objective:
Build a scatterplot that is functionall similart to [this](https://codepen.io/FreeCodeCamp/full/ONxvaa/).

The map will show the percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)

### Resources:

#### Data Sets (provided by Free Code Camp)
[US Education Data](https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json)

[US County Data](https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json)

#### Other
[Data Classification & Choropleth Maps](https://gisgeography.com/choropleth-maps-data-classification/)

[TopoJSON extension](https://github.com/topojson/topojson)

Screenshot of progress so far: 

![choropleth](https://user-images.githubusercontent.com/22034073/41162985-5d8a7bb8-6b2f-11e8-9b66-e4f102e42d01.gif)

---

### Things I learned

#### Projected Data & geoPath()

d3.geoPath()translate GeoJSON coordinates into SVG path codes. We can use geoPath().projection() to specify a projection.The projection method projects 3D space onto a 2D plane (see more about projections [here](https://www.youtube.com/watch?v=QjVNXfI8YRk)). I spent several hours trying to work out why the built in projection I was using (d3.geoAlbersUsa()) was producing a mess, only to discover that I was trying to project already projected data. 

I found [an example](https://bl.ocks.org/Andrew-Reid/496078bd5e37fd22a9b43fd6be84b36b) of using the projection method to scale the map on the page and used this to resize my chart. 

---



