var width, height, yMax, xMax, yScale, xScale, svg, padding,
colorScale, radiusScale, xAxis;

padding = 30;
width = 1200;
height = 650;

// scale y-axis
yMax = d3.max(birthData2011, d => d.lifeExpectancy);
yMin = d3.min(birthData2011, d => d.lifeExpectancy);


yScale = d3.scaleLinear()
		.domain(d3.extent(birthData2011, d => d.lifeExpectancy)) // return min and max in single function
		.range([height - padding, padding]);

xScale = d3.scaleLinear()
		.domain(d3.extent(birthData2011, d => d.births/d.population))
		.range([padding, width-padding]);

colorScale = d3.scaleLinear()
				.domain(d3.extent(birthData2011, d => d.population / d.area))
				.range(['lightgreen', 'black']);
radiusScale = d3.scaleLinear()
				.domain(d3.extent(birthData2011, d => d.births))
				.range([5,40])
xAxis = d3.axisBottom(xScale)
			.tickSize(-height + 2 * padding)
			.tickSizeOuter(0);			
yAxis = d3.axisLeft(yScale)
			.tickSize(-width + 2 * padding)
			.tickSizeOuter(0);			

// tooltip
var tooltip = d3.select("body")
				.append("div")
				.classed("tooltip", true);

svg = d3.select("svg");

// axes
svg.append('g')
	.call(xAxis)
	.attr("transform", `translate(0, ${height - padding})`)	// moves x-axis from top of svg to bottom

svg.append('g')
	.call(yAxis)
	.attr("transform", `translate(${padding}, 0)`)

// add axis labels
svg.append("text")
	.attr("x", width / 2)
	.attr('y', height - padding)
	.attr('dy', "1.5em")	// push down relative to x-axis
	.style('text-anchor', "middle")
	.text("Births per capita")

svg.append("text")
	.attr("transform", "rotate(-90)")
	.attr("x", -height / 2)
	.attr('y', padding)
	.attr('dy', "-1.1em")	// push down relative to x-axis
	.style('text-anchor', "middle")
	.text("Life Expectancy (years)")



svg.attr("width", width)
	.attr("height", height)
	.selectAll("cicle")
	.data(birthData2011)
	.enter()
	.append("circle")
		.attr("cx", d => xScale(d.births/d.population))
		.attr("cy", d => yScale(d.lifeExpectancy))
		.attr("fill", d => colorScale(d.population/d.area))
		.attr("r", d => radiusScale(d.births))
		.attr("stroke", "#000")
		.attr("stroke-width", "0.5px")
	.on("mousemove", showTooltip)
	.on("touchstart", showTooltip)
	.on("mouseout", hideTooltip);	

// graph title
svg.append("text")
	.attr("x", width / 2)
	.attr('y', padding)
	.attr("z-index", "2")
	// .attr('dy', "1.1em")	// push down relative to x-axis
	.style('text-anchor', "middle")
	.style("font-size", "1.5em")
	.text("Data on Births by Country in 2011");

function showTooltip (d){
	tooltip
		.style("opacity", 1)
		.style("left", `${d3.event.x - tooltip.node().offsetWidth/1.9}px`)
		.style("top", `${d3.event.y+10}px`)
		.html(`
			<p>Region: ${d.region}</p>
			<p>Births: ${d.births.toLocaleString()}</p>
			<p>Population: ${d.population.toLocaleString()}</p>
			<p>Land Area: ${d.area.toLocaleString()}</p>
			<p>LifeExpectancy: ${d.lifeExpectancy}</p>
		`);
};

function hideTooltip(){
	tooltip
		.style("opacity", 0)
};