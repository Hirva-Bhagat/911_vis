timeLine = function (_parentElement, _data, stack) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.stack = stack;
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

    vis.margin = {top: 40, right: 50, bottom: 30, left: 50};
    vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
    vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // add title
    vis.svg.append('g')
        .attr('class', 'title')
        .append('text')
        .text('Number of all 911 calls by Time')
        .attr('transform', `translate(350, -15)`)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white');

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

    vis.svg.append("text")
        .attr("x", -50)
        .attr("y", -15)
        .attr('fill', 'white')
        .text("Number of Calls");
    vis.svg.append("text")
        .attr("x", vis.width - 5)
        .attr("y", vis.height + 25)
        .attr('fill', 'white')
        .text("Time");


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

    var hover_line_group = vis.svg.append("g")
        .attr("class", "hover-line");

    var hover_line = hover_line_group
        .append("line")
        .attr("stroke", "red")
        .attr("x1", 10).attr("x2", 10)
        .attr("y1", 0).attr("y2", vis.height);

    var hoverX = hover_line_group.append('text')
        .attr("class", "hover-text")
        .attr('dy', "1.00em");

    var hoverY = hover_line_group.append('text')
        .attr("class", "hover-text")
        .attr('dy', "0.35em");

    vis.svg.append("rect")
        .data(vis.preProcessedData)
        .attr("fill", "none")
        .attr("class", "overlay")
        .attr("width", vis.width)
        .attr("height", vis.height);
    vis.svg
        .on("mouseout", hoverMouseOff)
        .on("mousemove", hoverMouseOn);

    let bisectDate = d3.bisector(function(d) { return d.date; }).left;

    function hoverMouseOn(event) {
        var mouse_x = d3.pointer(event)[0];
        var calenderNameFormat = d3.timeFormat("%Y-%m-%d");
        var date_x = calenderNameFormat(vis.x.invert(mouse_x - 20));

        var x0 = vis.x.invert(mouse_x - 20)
        var  i = bisectDate(vis.preProcessedData, x0, 1)

        console.log(i);
        var  d0 = vis.preProcessedData[i - 1]
        var  d1 = vis.preProcessedData[i]
        var  d = x0 - d0.date > d1.date - x0 ? d1 : d0

        hoverX.text("Date: " + date_x)
            .attr('x', mouse_x + 5)
            .attr('y', 20);
        hoverY.text("Total Call: " + d.sum)
            .attr('x', mouse_x + 5)
            .attr('y', 10);

        hover_line.attr("x1", mouse_x).attr("x2", mouse_x)
        hover_line_group.style("opacity", 100);

        vis.stack.updateNum(date_x, mouse_x, i);
    }

    function hoverMouseOff() {
        hover_line_group.style("opacity", 0);
        vis.stack.updateNone();
    }

};
