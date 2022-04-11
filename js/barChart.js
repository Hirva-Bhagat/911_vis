class barChart {

    // constructor method to initialize Timeline object
    constructor(parentElement,data, order) {
        this.parentElement = parentElement;
        this.data=data
        this.order = order

        // call initVis method
        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 50, right: 20, bottom: 40, left: 160};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        if (vis.order) {
            vis.barTitle = "Top 10 Issues";
        }
        else {
            vis.barTitle = "Bottom 10 Issues";
        }

        // title
        vis.svg.append('g')
            .attr('class', 'title bar-title')
            .append('text')
            .text(vis.barTitle)
            .attr('transform', `translate(${vis.width / 2 - 60}, -30)`)
            .attr("stroke","white")
            .attr('text-anchor', 'middle');


        // x-axis range
        vis.x = d3.scaleLinear()
            .range([0, vis.width])

        // x-axis scale
        vis.xAxis = d3.axisBottom()
            .scale(vis.x)

        // y-axis range
        vis.y = d3.scaleBand()
            .range([vis.height, 0])
            .paddingInner(0.2);

        // y-axs scale
        vis.yAxis = d3.axisLeft()
            .scale(vis.y)

        // x-axis draw
        vis.svg.append("g")
            .attr("class", "bar-x-axis")
            .attr("stroke","white")
            .attr("transform", "translate(0," + (vis.height -9) + ")")
            .call(vis.xAxis);

        // y-axis draw
        vis.svg.append("g")
            .attr("class", "bar-y-axis")
            .attr("stroke","white")
            .attr("transform", "translate(0," + -9 + ")")
            .call(vis.yAxis);

        // Declare bar graph
        vis.bar = vis.svg.append("rect")
            .attr("class", "bar")

        vis.wrangleData();
    }
    wrangleData() {
        let vis = this

        vis.displayData = [];
        vis.groupData = d3.nest()
            .key(function(d){
                return d.Reason;
            })
            .rollup(function(leaves){
                return d3.sum(leaves, function(d){
                    return leaves.length;
                });
            }).entries(vis.data)

        // Whether given class is descending order or ascending order
        if (this.order){
            vis.groupData.sort((a,b) => {return b.value - a.value})
        } else {
            vis.groupData.sort((a,b) => {return a.value - b.value})
        }


        vis.topTenData = vis.groupData.slice(0, 10)

        vis.updateVis();
    }
    updateVis() {
        let vis = this;

        // Color scale for the bar chart
        vis.colorScale = d3.scaleSequential()
            .interpolator(d3.interpolatePuRd)
            .domain([d3.min(vis.groupData, d=>d.value),
                d3.max(vis.groupData, d=>d.value)])

        // update the x and y domain
        vis.x.domain([0,d3.max(vis.topTenData, d=>d.value)])
        vis.y.domain(vis.topTenData.map(d=>d.key))

        vis.svg.select(".bar-x-axis")
            .call(vis.xAxis)
            .selectAll("text")
            .attr("dx", "-2em")
            .attr("dy", "1em")
            .attr("stroke","white")
            .attr("transform", "rotate(-30)");
        vis.svg.select(".bar-y-axis")
            .call(vis.yAxis)
            .attr("stroke","white");

        let cases_bar = vis.svg.selectAll(".bar")
            .data(vis.topTenData);
        cases_bar.enter().append("rect")
            .attr("class", "bar")
            .merge(cases_bar)
            .transition()
            .duration(1000)
            .attr("transform", "translate(0," + -9 + ")")
            .attr("fill", d => vis.colorScale(d.value))
            .attr("y", function(d) { return vis.y(d.key); })
            .attr("x", function (d) { return 0;} )
            .attr("width", function(d) {return (vis.x(d.value)); })
            .attr("height", vis.y.bandwidth())
    }
}