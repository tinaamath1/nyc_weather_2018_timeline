import * as d3 from 'https://unpkg.com/d3?module'

async function drawLineChart() {
  const data = await d3.json("data/my_weather_data.json");
  // console.log(data);

  const yAccessor = d => d["temperatureMax"]
  // console.log(yAccessor(data[0]));

  const parseDate = d3.timeParse("%Y-%m-%d") //Convert date string to Javascript date object

  const xAccessor = d => parseDate(d["date"])
  // console.log(xAccessor(data[0]));

  let dimensions = {
    width: window.innerWidth*0.9, 
    height: 600, 
    margins :{
      top: 15, 
      right: 15, 
      bottom: 40, 
      left: 60, 
    }
  }

  dimensions.boundedWidth = dimensions.width 
    -dimensions.margins.left 
    -dimensions.margins.right

  dimensions.boundedHeight = dimensions.height
    -dimensions.margins.top 
    -dimensions.margins.bottom
    // console.log(dimensions);

  const wrapper = d3.select("#wrapper")
    .append("svg")
      .attr("width",dimensions.width)
      .attr("height",dimensions.height)
  console.log(wrapper)


  const bounds = wrapper.append("g")
      .style("transform", `translate(${
        dimensions.margins.left
      }px, ${
        dimensions.margins.top
      }px)`)
  console.log(bounds)


  //Create yScale

  const yScale = d3.scaleLinear() 
    .domain(d3.extent(data, yAccessor))
    .range([dimensions.boundedHeight, 0])
    
  const freezingTemperaturePlacement = yScale(32)
  const freezingTemperatures = bounds.append("rect")
      .attr("x", 0)
      .attr("width", dimensions.boundedWidth)
      .attr("y", freezingTemperaturePlacement)
      .attr("height", dimensions.boundedHeight - freezingTemperaturePlacement)
      .attr("fill", "#e0f3f3")

  const xScale = d3.scaleTime()
    .domain(d3.extent(data,xAccessor))
    .range([0, dimensions.boundedWidth])

  // Draw data

  const lineGenerator = d3.line()
      .x(d=> xScale(xAccessor(d)))
      .y(d=> yScale(yAccessor(d)))
  const line = bounds.append("path")
      .attr("d", lineGenerator(data))
      .attr("fill", "none")
      .attr("stroke", "cornflowerblue")
      .attr("stroke-width", 2)

  //Draw peripherals

  const yAxisGenerator = d3.axisLeft()
      .scale(yScale)

  const yAxis = bounds.append("g")
      .call(yAxisGenerator)
      .style("font-size", 15)

  const yAxisLabel = yAxis.append("text")
      .attr("x", -dimensions.boundedHeight / 2)
      .attr("y", -dimensions.margins.left + 20)
      .attr("fill", "black")
      .style("font-size", "1.2em")
      .html("Maximum Temperature")
      .style("transform", "rotate(-90deg)")
      .style("text-anchor", "middle")

  const xAxisGenerator = d3.axisBottom()
      .scale(xScale)

  const xAxis = bounds.append("g")
      .call(xAxisGenerator)
      .style("transform", `translateY(${
        dimensions.boundedHeight
      }px)`)
      .style("font-size", 15)

}


drawLineChart()