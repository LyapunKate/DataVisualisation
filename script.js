// Enhanced sample data
const data = [
    { month: "Jan", sales: 45, profit: 15, customers: 200 },
    { month: "Feb", sales: 32, profit: 12, customers: 180 },
    { month: "Mar", sales: 58, profit: 20, customers: 250 },
    { month: "Apr", sales: 37, profit: 14, customers: 190 },
    { month: "May", sales: 63, profit: 25, customers: 280 },
    { month: "Jun", sales: 42, profit: 17, customers: 220 },
];

// Common dimensions
const margin = { top: 20, right: 20, bottom: 40, left: 40 };
const width = 400 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;

// Create tooltip
const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Bar Chart
function createBarChart() {
    const svg = d3.select("#bar-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .range([0, width])
        .padding(0.1)
        .domain(data.map(d => d.month));

    const y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(data, d => d.sales)]);

    // Add bars
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.month))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.sales))
        .attr("height", d => height - y(d.sales))
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Sales: $${d.sales}K`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Add axes
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

    // Add axis labels
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width/2)
        .attr("y", height + margin.bottom - 5)
        .text("Month");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 15)
        .attr("x", -height/2)
        .text("Sales ($K)");
}

// Line Chart
function createLineChart() {
    const svg = d3.select("#line-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .range([0, width])
        .padding(0.1)
        .domain(data.map(d => d.month));

    const y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(data, d => d.sales)]);

    // Add line
    const line = d3.line()
        .x(d => x(d.month) + x.bandwidth()/2)
        .y(d => y(d.sales));

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#4CAF50")
        .attr("stroke-width", 2)
        .attr("d", line);

    // Add dots
    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.month) + x.bandwidth()/2)
        .attr("cy", d => y(d.sales))
        .attr("r", 5)
        .attr("fill", "#4CAF50")
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Sales: $${d.sales}K`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Add axes and labels
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width/2)
        .attr("y", height + margin.bottom - 5)
        .text("Month");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 15)
        .attr("x", -height/2)
        .text("Sales ($K)");
}

// Pie Chart
function createPieChart() {
    const radius = Math.min(width, height) / 2;
    
    const svg = d3.select("#pie-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${width/2 + margin.left},${height/2 + margin.top})`);

    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.month))
        .range(d3.schemeCategory10);

    const pie = d3.pie()
        .value(d => d.sales);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius * 0.8);

    // Modify the labelArc to position labels closer to the center
    const labelArc = d3.arc()
        .innerRadius(radius * 0.4)  // Changed from 0.85 to 0.4
        .outerRadius(radius * 0.4);  // Changed from 0.85 to 0.4

    // Calculate total for percentages
    const total = d3.sum(data, d => d.sales);

    const arcs = svg.selectAll("arc")
        .data(pie(data))
        .enter()
        .append("g");

    // Add the pie slices
    arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.month))
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            const percent = ((d.data.sales / total) * 100).toFixed(1);
            tooltip.html(`${d.data.month}: $${d.data.sales}K (${percent}%)`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Modify the percentage labels styling
    arcs.append("text")
        .attr("transform", d => `translate(${labelArc.centroid(d)})`)
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "#fff")
        .style("font-weight", "bold")  // Added bold font
        .text(d => {
            const percent = ((d.data.sales / total) * 100).toFixed(1);
            return percent + "%";
        });

    // Move legend closer to pie chart
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${radius * 0.9}, ${-radius * 0.5})`);  // Changed from (radius + 30, -radius)

    const legendItems = legend.selectAll(".legend-item")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    // Add colored rectangles
    legendItems.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", d => color(d.month));

    // Add text labels
    legendItems.append("text")
        .attr("x", 20)
        .attr("y", 12)
        .style("font-size", "12px")
        .text(d => `${d.month} ($${d.sales}K)`);
}

// Scatter Plot
function createScatterPlot() {
    const svg = d3.select("#scatter-plot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.sales)])
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.profit)])
        .range([height, 0]);

    // Add dots
    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.sales))
        .attr("cy", d => y(d.profit))
        .attr("r", 6)
        .attr("fill", "#4CAF50")
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Sales: $${d.sales}K<br>Profit: $${d.profit}K`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Add axes and labels
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width/2)
        .attr("y", height + margin.bottom - 5)
        .text("Sales ($K)");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 15)
        .attr("x", -height/2)
        .text("Profit ($K)");
}

// Initialize all charts
createBarChart();
createLineChart();
createPieChart();
createScatterPlot(); 