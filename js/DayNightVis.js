/* * * * * * * * * * * * * *
*         PieChart         *
* * * * * * * * * * * * * */


class DayNightVis {

    // constructor method to initialize Timeline object
    constructor(parentElement,data) {
        this.parentElement = parentElement;
        this.circleColors = {"EMS":'#b2182b', "Fire":'#d6604d', "Traffic":'#f4a582'};
        this.data=data
        // call initVis method
        this.initVis()
    }

    initVis() {
        let vis = this;

        // margin conventions
        vis.margin = {top: 60, right: 50, bottom: 10, left: 100};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        vis.norm=function(enteredValue, minEntry, maxEntry, normalizedMin, normalizedMax) {

            var mx = (enteredValue-minEntry)/(maxEntry-minEntry);
            var preshiftNormalized = mx*(normalizedMax-normalizedMin);
            var shiftedNormalized = preshiftNormalized + normalizedMin;

            return shiftedNormalized;

        }

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // add title
        vis.svg.append('g')
            .attr('class', 'title DNvis-title')
            .append('text')
            .text('Day Night Visualisation')
            .attr('transform', `translate(${vis.width / 2}, 20)`)
            .attr('text-anchor', 'middle');



        vis.xDomain = vis.data.reduce(function(p, c) {
            if (p.indexOf(c.Day_or_night) < 0) p.push(c.Day_or_night);
            return p;
        }, []);


        vis.groupData=d3.nest()
            .key(function(d){
            return d.Day_or_night;
        })
            .key(function(d){
                return d.Type_of_call;
            })
            .rollup(function(leaves){
                return d3.sum(leaves, function(d){
                    return leaves.length;
                });
            }).entries(vis.data)
        console.log(vis.groupData)




        vis.xScale = d3.scalePoint()
            .range([0, vis.width],1)
            .domain(vis.xDomain);

        console.log(vis.xDomain)

        vis.yScale = d3.scaleLinear()
            .domain([0,1300000000])
            .range([ vis.height, 0]);
        console.log(vis.yScale)

        vis.xAxis = d3.axisTop(vis.xScale).tickSizeInner(-(vis.height + 6)).tickSizeOuter(0);

        vis.yAxis = d3.axisLeft(vis.yScale);

        vis.x = vis.svg.append("g")
            .call(vis.xAxis);

        vis.x.selectAll("path")
            .style("fill", "none")
            .style("stroke", "#000")
            .style("shape-rendering", "crispEdges");

        vis.x.selectAll("line")
            .attr("transform", "translate(0,-6)")
            .style("fill", "none")
            .style("stroke", "#000")
            .style("shape-rendering", "crispEdges")
            .style("opacity", 0.2);

        vis.x.selectAll("text")
            .style("font", "10px sans-serif")
            .style("text-anchor", "start")
            .attr("dx", "1em")
            .attr("dy", "0.5em")
            .attr("transform", "rotate(-75)");


        vis.y = vis.svg.append("g")
            .call(vis.yAxis);

        vis.y.selectAll("path")
            .style("fill", "none")
            .style("stroke", "#000")
            .style("shape-rendering", "crispEdges");

        vis.y.selectAll("line")
            .attr("transform", "translate(-6,0)")
            .style("fill", "none")
            .style("stroke", "#000")
            .style("shape-rendering", "crispEdges")
            .style("opacity", 0.2);

        vis.y.selectAll("text")
            .style("font", "10px sans-serif")
            .style("text-anchor", "end")
            .attr("dx", "-1em")
            .attr("dy", "0.5em");



vis.wrangleData()
    }

    // wrangleData method
    wrangleData() {
        let vis = this
        vis.displayData=[]
        vis.groupData.forEach(e=>{
            e.values.forEach(g=>{
                vis.displayData.push(
                    {
                        "DON":e.key,
                        "TOC":g.key,
                        "count":g.value,
                        "colour":vis.circleColors[g.key]
                    }
                )
            })

        })



console.log(vis.groupData)
        vis.updateVis()

    }

    // updateVis method
    updateVis() {

        let vis = this;
        console.log(vis.displayData)

        vis.bubble = vis.svg.append("g")
            .selectAll("g")
            .data(vis.displayData)
            .enter().append("g")
            .attr("transform", function(d) {
                    console.log(d.key)
                    return "translate(" + vis.xScale(d.DON) + "," + vis.yScale(d.count) + ")";


            });

        vis.bubble.append("circle")
            .attr("r", function(d) {
                return vis.norm(d.count,500000,1300000000,5,30);
            })
            .style("fill", function(d) {
                return d.colour});

    }
}
