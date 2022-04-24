let top_ten_key;

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
            .attr("class", "bar_Sungwon")


        vis.wrangleData();
    }
    wrangleData() {
        let vis = this

        console.log(vis.data);

        vis.displayData = [];
        vis.groupData = d3.nest()
            .key(function(d){
                return d.Reason;
            }).entries(vis.data)

        console.log(vis.groupData);

        vis.groupData.forEach(row => {
            vis.displayData.push(
                {key: row.key, value: row.values.length}
            )
        })

        console.log(vis.displayData);

        // Whether given class is descending order or ascending order
        if (this.order){
            vis.displayData.sort((a,b) => {return b.value - a.value})
        } else {
            vis.displayData.sort((a,b) => {return a.value - b.value})
        }


        vis.topTenData = vis.displayData.slice(0, 11);

        if (this.order){
            vis.topTenData.splice(6, 1);
        }
        else {
            vis.topTenData.splice(11, 1);
        }

        console.log(vis.topTenData);

        vis.updateVis();
    }
    updateVis() {
        let vis = this;

        // Color scale for the bar chart
        vis.colorScale = d3.scaleSequential()
            .interpolator(d3.interpolatePuRd)
            .domain([d3.min(vis.displayData, d=>d.value),
                d3.max(vis.displayData, d=>d.value)])

        console.log(vis.displayData);

        // update the x and y domain
        vis.x.domain([0,d3.max(vis.topTenData, d=>d.value)])
        vis.y.domain(vis.topTenData.map(d=>d.key))

        if (this.order){
            top_ten_key = vis.topTenData.map(d=>d.key);
            console.log(top_ten_key);
        }

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

        let cases_bar = vis.svg.selectAll(".bar_Sungwon")
            .data(vis.topTenData);
        cases_bar.enter().append("rect")
            .attr("class", "bar_Sungwon")
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

    updateVisualization() {
        let vis = this;

        if (this.order) {
            vis.topTenData.sort((a, b) => { return a.value - b.value})
            this.order = false;
        }
        else {
            vis.topTenData.sort((a, b) => { return b.value - a.value})
            this.order = true;
        }

        vis.y.domain(vis.topTenData.map(d=>d.key))


        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.svg.select(".bar-y-axis")
            .transition()
            .duration(1000)
            .call(vis.yAxis);

        vis.svg.selectAll("rect")
            .style("opacity", 0.5)
            .transition()
            .duration(1000)
            .attr("y", function(d) { return vis.y(d.key); })
            .attr("width", function(d) {return (vis.x(d.value)); })
            .style("opacity", 1)
    }

}