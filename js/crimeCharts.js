class myCrimeCharts {

    // constructor method to initialize Timeline object
    constructor(clockvis,data) {
        this.data=data
        this.clockvis=clockvis
        // call initVis method
        this.initVis()
    }

    initVis() {
        let vis = this;


        vis.margin = {top: 10, right: 10, bottom: 10, left: 10};
        vis.lineWidth = document.getElementById("box-2").getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.barWidth = document.getElementById("box-4").getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.lineHeight = document.getElementById("box-2").getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;
        vis.barHeight = document.getElementById("box-4").getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;
        vis.pieWidth = document.getElementById("box-5").getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.pieHeight = document.getElementById("box-5").getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;
        // drawing area
        vis.lineSvg = d3.select("#box-2").append("svg")
            .attr("class","charts callsTT")
            .attr("width",vis.lineWidth)
            .attr("height",vis.lineHeight)
        vis.barSvg = d3.select("#box-4").append("svg")
            .attr("class","charts callsTT")
            .attr("width",vis.barWidth)
            .attr("height",vis.barHeight)
        vis.pieSvg = d3.select("#box-5").append("svg")
            .attr("class","charts callsPlaces")
            .attr("width",vis.pieWidth)
            .attr("height",vis.pieHeight)

        //line chart
        d3.select("#sTextbox").on("change", change);
        function change(){
            console.log(this.attr("value"))
        }
        vis.day="2015-12-10"
        vis.t = new Date();
        vis.hvalue = (vis.t.getHours() % 12);
        vis.mvalue = vis.t.getMinutes();
        vis.svalue = vis.t.getSeconds();





    }



}
