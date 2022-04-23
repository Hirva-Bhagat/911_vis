timeLine = function (_parentElement, _data) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = [];
    //this.parseDate = d3.timeParse("%m/%d/%Y");
    //this.parseDate = d3.timeFormat("%b");
    this.parseDate = d3.timeFormat("%B %d, %Y");

    // call method initVis
    this.initVis();
};

// init brushVis
timeLine.prototype.initVis = function () {
    let vis = this;

    vis.margin = {top: 20, right: 50, bottom: 20, left: 50};
    vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
    vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // clip path
    vis.svg.append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", vis.width)
        .attr("height", vis.height)
        .attr("transform", "translate(20," + 0 + ")");

    // add title
    vis.svg.append('g')
        .attr('class', 'title')
        .append('text')
        .text('Title for Timeline')
        .attr('transform', `translate(${vis.width-100}, 20)`)
        .attr('text-anchor', 'middle');

    // init scales
    vis.x = d3.scaleTime()
        .range([0, vis.width]);
    vis.xAxis = d3.axisBottom()
        .scale(vis.x)

    vis.y = d3.scaleLinear()
        .range([vis.height, 0]);
    vis.yAxis = d3.axisLeft()
        .scale(vis.y)

    // init x & y axis
    vis.svg.append("g")
        .attr("class", "time-x-axis")
        .attr("transform", "translate(20," + vis.height + ")")
        .call(vis.xAxis);
    vis.svg.append("g")
        .attr("class", "time-y-axis")
        .attr("transform", "translate(20," + 0 + ")")
        .call(vis.yAxis);

    // init path generator
    vis.area = d3.area()
        .x(function (d) {
            return vis.x(d.date);
        })
        .y0(vis.y(0))
        .y1(function (d) {
            return vis.y(d.sum);
        });

    vis.timePath = vis.svg.append("path")
        .attr("class", "area area-time");

    // init brush
    vis.brush = d3.brushX()
        .extent([[0, 0], [vis.width, vis.height]])
        .on("brush end", function (event) {
            selectedTimeRange = [vis.x(event.selection[0]), vis.x(event.selection[1])];
            console.log(selectedTimeRange);
            //myMapVis.wrangleData(); // TODO: Uncomment when implemented
        });

    vis.brushGroup = vis.svg.append("g")
        .attr("class", "brush")
        .attr("transform", "translate(20," + 0 + ")")
        .call(vis.brush);

    // init basic data processing
    this.wrangleData();
};

timeLine.prototype.wrangleData = function () {
    let vis = this;

    let dataByDate = Array.from(d3.group(vis.data, d => d.Date_of_call), ([key, value]) => ({key, value}))

    console.log(dataByDate);

    vis.preProcessedData = [];

    // iterate over each year
    dataByDate.forEach(day => {
        let tmpSumNewCases = 0;
        day.value.forEach(entry => {
            tmpSumNewCases = tmpSumNewCases + 1;
        });

        vis.preProcessedData.push(
            {date: day.key, sum: tmpSumNewCases}
        )
    });

    vis.preProcessedData.sort((a, b) => {
        return a.date - b.date;
    })

    console.log(vis.preProcessedData);

    this.updateVis();
}

// updateVis
timeLine.prototype.updateVis = function () {
    let vis = this;

    // update the x and y domain
    vis.x.domain(d3.extent(vis.preProcessedData, function(d) { return d.date; }))
    vis.y.domain([0, d3.max(vis.preProcessedData, d=>d.sum)])

    vis.svg.select(".time-x-axis")
        .call(vis.xAxis)
        .selectAll("text")
        .attr("dx", "-2em")
        .attr("dy", "1em")
        .attr("transform", "translate(20," + 0 + ")")
        .attr("stroke","white");
    vis.svg.select(".time-y-axis")
        .call(vis.yAxis)
        .attr("stroke","white");

    vis.timePath
        .datum(vis.preProcessedData)
        .attr("fill", "#cce5df")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 1.5)
        .attr("transform", "translate(20," + 0 + ")")
        .attr("d", vis.area)

    vis.brushGroup
        .call(vis.brush);

};