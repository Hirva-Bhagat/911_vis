/* * * * * * * * * * * * * *
*         PieChart         *
* * * * * * * * * * * * * */


class DayNightVis {

    // constructor method to initialize Timeline object
    constructor(parentElement,data) {
        this.parentElement = parentElement;
        this.circleColors = ['#b2182b', '#d6604d', '#f4a582', '#fddbc7'];
        this.data=data
        // call initVis method
        this.initVis()
    }

    initVis() {
        let vis = this;

        // margin conventions
        vis.margin = {top: 10, right: 50, bottom: 10, left: 50};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

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

        vis.groupCalls = [];
        vis.maxCount = 0;
        vis.count=function (dataset, chosenCategory) {
            var count = 0;
            for (var d in dataset) {
                if (d.Type_of_call==chosenCategory) {
                    count += 1;
                } else {
                    count += 0;
                }

            }
            return count
        }

        vis.xScale = d3.scalePoint()
            .range([0, vis.width], 1)
            .domain(vis.xDomain);

        vis.yScale = d3.scaleLinear()
            .domain(0,2000000000)
            .range([ height, 0]);;

        vis.xAxis = d3.axisBottom(vis.xScale)
            .tickSizeInner(-(vis.height + 6));

        vis.yAxis = d3.axisLeft(vis.yScale)
            .tickSizeInner(-(vis.width + 6));

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

        vis.groupData=d3.nest().key(function(d){
            return d.Type_of_call;
        })

            .rollup(function(leaves){
                return d3.sum(leaves, function(d){
                    return leaves.length;
                });
            }).entries(vis.data)

console.log(vis.groupData)
        vis.updateVis()

    }

    // updateVis method
    updateVis() {
        let vis = this;

        vis.bubble = vis.svg.append("g")
            .selectAll("g")
            .data(vis.data)
            .enter().append("g")


        vis.bubble.append("circle")
            .attr("r", function(d) {
                return 1;
            })
            .style("fill", "#337ab7");

    }
}
