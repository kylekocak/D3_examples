async function drawMap() {
	var svg = d3.select("body").append('svg')
		.attr("height",600)
		.attr("width",1000)
  //Creates tooltip and makes it invisiblae
  	var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 1)
	.text('Hello')
	var dat = await d3.csv('soy.csv')
	//var map = await d3.json('us-10m.v1.json')
	const specs=d3.map(dat, function(d){return d.year}).keys()
	var us = await d3.json("https://unpkg.com/us-atlas@1/us/10m.json")
	var unemployment = await d3.tsv("https://gist.githubusercontent.com/jdev42092/9a314291805640a097e16e58248627eb/raw/365c199c5a173a0018608615b6823b5cdcaa6bae/unemployment.tsv", ({id, rate}) => ({county: id, rate : +rate}))
	var rateById = { };
	unemployment.forEach(d => (rateById[d.county] = +d.rate));
	var color = d3.scaleQuantize()
      .domain([1, 10])
      .range(d3.schemePurples[9]);
	var path = d3.geoPath()
	////////////////////////////////////////
	var startDate = new Date ("2005-01-01"),
	  endDate = new Date ("2018-01-01")

	function update(h) {
	    // update position and text of label according to slider scale
	    handle.attr("cx", x(h));
	    label
	      .attr("x", x(h))
	      .text(formatDateIntoYear(h));
	  }

	var mouseOver = function(d) {}
	var mouseOut = function(d) {}
	svg.append("g")
	  .attr('id', 'counties')
	  .selectAll("path")
	  .data(topojson.feature(us, us.objects.counties).features)
	  .enter().append("path")
	  .attr("d", path)
	  .attr("class", "county-border")
	  .style("fill",d => color(rateById[d.id]))
	svg.append("g")
	  .attr("id", "states")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
	  .enter().append("path")
	  .attr("d", path)
	  .attr('class', 'states')
  var svgSlider = svg.append('g')
    //.append("svg")
    .attr("width", 1000)
    .attr("height", 200)
	var x = d3.scaleTime()
    .domain([startDate, endDate])
    .range([0, 500])
    .clamp(true);
	var slider = svgSlider.append("g")
      .attr("class", "slider")
      .attr("transform", "translate(30,100)")
	slider.append("line")
      .attr("class", "track")
      .attr("x1", x.range()[0])
      .attr("x2", x.range()[1])
  		.select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
		  .attr("class", "track-inset")
  		.select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
 	  .attr("class", "track-overlay")
 	  .call(d3.drag()
   	   .on("start.interrupt", function() { slider.interrupt(); })
   	   .on("start drag", function() {
      currentValue = d3.event.x;
      update(x.invert(currentValue))
	})
)	
	var formatDateIntoYear = d3.timeFormat("%Y");
	  slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 18 + ")")
  	  .selectAll("text")
        .data(x.ticks(5))
        .enter()
    	  .append("text")
    	  .attr("x", x)
    	  .attr("y", 10)
    	  .attr("text-anchor", "middle")
		.text(d => formatDateIntoYear(d))
	var handle = slider.insert("circle", ".track-overlay")
  	.attr("class", "handle")
  	.attr("r", 9);
	var label = slider.append("text")  
  	  .attr("class", "label")
  	  .attr("text-anchor", "middle")
  	  .text(formatDateIntoYear(startDate))
  	  .attr("transform", "translate(0," + (-25) + ")")
  }
drawMap()