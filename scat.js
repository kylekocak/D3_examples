async function drawPlot() {
	const dat = await d3.csv("https://raw.githubusercontent.com/kylekocak/example/master/example.csv");
	var pars = dat.map(d => d.Types);
	ppars= pars.map(d => d.split('/'))
	const uniqueLetter = [... new Set(ppars.flat())]
	yData = d => d['TraitX']
	xData = d => d['TraitY']
	colorData = d => d['TraitZ']
	windowWidth= window.innerWidth * 0.9
	windowHeight = window.innerHeight*0.8
	let dimensions = {height:windowHeight, width: windowWidth,margin: {top:20, right:20, left:30, bottom: 30}}

	boundHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom
	boundWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
	
	//Create Canvas
	var tooltip = d3.select('body').append("div").attr('class','tooltip')
	  .style('opacity',0)
	  .text("Opening")
	var wrapper = d3.select("#wrapper")
	  .append("svg")
	  .attr("height", dimensions.height)
	  .attr("width",dimensions.width)
	var bounds = wrapper.append("g")
	  .style("transform",`translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`)
	var xline = bounds.append('line')
		.style('opacity',0)
		.attr("stroke", "darkgray")
		.attr("stroke-width", 2)
		.attr("stroke-dasharray", "2,2")
	var yline = bounds.append('line')
		.style('opacity',0)
		.attr("stroke", "darkgray")
		.attr("stroke-width", 2)
		.attr("stroke-dasharray", "2,2")
	//Create Scales  
	var yScale = d3.scaleLinear()
	  .domain(d3.extent(dat,yData))
	  .range([boundHeight,0])
	var xScale = d3.scaleLinear()
	  .domain(d3.extent(dat,xData))
	  .range([0,boundWidth])
	var colorScale = d3.scaleSequential(d3.interpolateRdBu)
	  .domain(d3.extent(dat,colorData))

	//Draw Data 
	var mouseOver = function(d) {
		d3.select('tooltip')
		tooltip
		  .style('opacity',1)
		  .html('<strong>' + d.Types + '</strong>')
		  .style("left", (d3.mouse(this)[0]) + "px")
		  .style("top", (d3.mouse(this)[1]) + "px")
       /* xline
		.style('opacity',1)
		.attr('x1',0)
		.attr('x2',boundWidth)
		.attr("y1",d3.select(this).attr("cy"))
        .attr("y2",d3.select(this).attr("cy"))
        yline
		.style('opacity',1)
		.attr('y1',0)
		.attr('y2',boundHeight)
		.attr("x1",d3.select(this).attr("cx"))
        .attr("x2",d3.select(this).attr("cx")) */
	}
	var mouseL = function(d){
		d3.select('tooltip')
		tooltip
		  .style('opacity',0)
		xline
		.style('opacity',0)
		yline
		.style('opacity',0)
	}
	var dots = bounds.selectAll('circle')
	  .data(dat)
	  .enter().append('circle')
		.attr("cx",d => xScale(xData(d)))
		.attr("cy",d => yScale(yData(d)))
		.attr("r",6)
		.style("fill",d=>colorScale(colorData(d)))
		.style('opacity',0.3)
		.classed("selected", false)
		.on("mouseover",mouseOver)
		.on('mouseleave',mouseL)
	var changeSelectedColor = function(selPop){
		d3.selectAll('circle')
			.transition().duration(1500)
			.attr("cx",d => xScale(xData(d)))
			.attr("cy",d => yScale(yData(d)))
			.style("fill",'black')
			.attr("r",3.5)
		d3.selectAll('circle.selected')
			.transition().duration(1500)
			.attr("cx",d => xScale(xData(d)))
			.attr("cy",d => yScale(yData(d)))
			.style('fill','orange')
			.attr("r",10)
			.style('opacity',100)
			
	}
	var dropdown = d3.select('#dropdown')
	  .selectAll("option")
	  .data(uniqueLetter.sort())
	  .enter().append('option')
		.text(d => d)
		.attr("value",d => d)
	//Generate Axes
	var yAxisGenerator = d3.axisLeft()
	  .scale(yScale)
	var xAxisGenerator = d3.axisBottom()
	  .scale(xScale)
	var xAxis = bounds.append('g')
	  .call(xAxisGenerator)
	  .style("transform",`translateY(${boundHeight}px)`)
	var yAxis = bounds.append('g')
	  .call(yAxisGenerator)

	d3.select('#dropdown').on('change',function(d){
		var sel = d3.select(this).property('value')	
		dots.classed('selected',false)
		dots
			.data(dat.filter(d => d.Types.includes(sel)))
			.classed("selected",true) 
		changeSelectedColor(sel)
	  })  
}
drawPlot()