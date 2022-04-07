class barChart {

    // constructor method to initialize Timeline object
    constructor(parentElement,data, order) {
        this.parentElement = parentElement;
        this.circleColors = {"EMS":'#b2182b', "Fire":'#d6604d', "Traffic":'#f4a582'};
        this.data=data
        this.order = order

        // call initVis method
        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 60, right: 50, bottom: 200, left: 100};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // title
        vis.svg.append('g')
            .attr('class', 'title bar-title')
            .append('text')
            .text(vis.barTitle)
            .attr('transform', `translate(${vis.width / 2}, 10)`)
            .attr('text-anchor', 'middle');

        // x-axis range
        vis.x = d3.scaleBand()
            .range([0, vis.width])
            .paddingInner(0.2);

        // x-axis scale
        vis.xAxis = d3.axisBottom()
            .scale(vis.x)

        // y-axis range
        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        // y-axs scale
        vis.yAxis = d3.axisLeft()
            .scale(vis.y)

        // x-axis draw
        vis.svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + (vis.height - 9) + ")")
            .call(vis.xAxis);

        // y-axis draw
        vis.svg.append("g")
            .attr("class", "y-axis")
            .attr("transform", "translate(0," + -9 + ")")
            .call(vis.yAxis);

        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'barTooltip');

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

        console.log(d3.max(vis.groupData, d=>d.value));

        console.log(d3.max(vis.topTenData, d=>d.value));

        vis.updateVis();
    }
    updateVis() {
        let vis = this;

        // Color scale for the bar chart
        vis.colorScale = d3.scaleSequential()
            .interpolator(d3.interpolatePuBu)
            .domain([d3.min(vis.groupData, d=>d.value),
                d3.max(vis.groupData, d=>d.value)])

        // update the x and y domain
        vis.x.domain(vis.topTenData.map(d=>d.key))
        vis.y.domain([0,d3.max(vis.topTenData, d=>d.value)])

        vis.svg.select(".x-axis")
            .call(vis.xAxis)
            .selectAll("text")
            .attr("dx", "-2em")
            .attr("dy", "1em")
            .attr("transform", "rotate(-30)");
        vis.svg.select(".y-axis")
            .call(vis.yAxis);

        let cases_bar = vis.svg.selectAll(".bar")
            .data(vis.topTenData);
        cases_bar.enter().append("rect")
            .attr("class", "bar")
            .merge(cases_bar)
            .transition()
            .duration(1000)
            .attr("transform", "translate(0," + -10 + ")")
            .attr("fill", d => vis.colorScale(d.value))
            .attr("x", function (d) { return vis.x(d.key);} )
            .attr("y", function(d) { return vis.y(d.value); })
            .attr("width", vis.x.bandwidth())
            .attr("height", function(d) {
                console.log(vis.y(d.value));
                console.log(vis.height-vis.y(d.value));
                return (vis.height-vis.y(d.value)); })

        console.log("this is:" + vis.groupData)

    }
}