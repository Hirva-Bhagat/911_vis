class myDateSlider {

    // constructor method to initialize Timeline object
    constructor(clockvis,parentElement,data) {
        this.clockvis=clockvis
        this.parentElement = parentElement;
        this.data=data

        // call initVis method
        this.initVis()
    }

    initVis() {
        let vis = this;


        vis.margin = {top: 50, right: 20, bottom: 40, left: 160};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;
        // drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("foreignObject")
            .attr("width", 200)
            .attr("height", 80)
            .html(function(d) {
                return '<input id="sTextbox" >\n'
                    +
                    '<input id="slider" type="range" min="0" max="258">'
            })
        vis.svg = d3.select("#" + vis.parentElement).append("foreignObject")
            .attr("width", 500)
            .attr("height", 80)
            .html(function(d) {
                return '<p id="datevalue"></p>\n' +
                    '<div id="dateslider"></div>'
            })



        function sortByDateAscending(a, b) {
            return a.Date_of_call - b.Date_of_call;
        }
        vis.sortedData = vis.data.sort(sortByDateAscending);
        vis.grouped=d3.nest()
            .key(function(d){ return d.Date_of_call.toISOString().split('T')[0]; }).entries(vis.sortedData);
        console.log(vis.grouped)


        //console.log(vis.dates)
        vis.start=vis.sortedData[0].Date_of_call
        vis.end=vis.sortedData[86636].Date_of_call
        vis.numberOfDays = d3.timeDay.count(vis.start,vis.end);
        vis.timeScale = d3.scaleTime()
            .domain([vis.start,vis.end])
            .range([0, vis.numberOfDays])
vis.dates=[vis.grouped.map(d=>d.key)]
        console.log(vis.dates)


        console.log()
        var sliderSimple = d3
            .sliderBottom()
            .min(0)
            .max(258)
            .step(1)
            .width(500)
            .tickFormat(function(d,i){return vis.dates[i]})
            .ticks(259)
            .fill("#206595")
            .on('onchange', val => {
                //d3.select('g.parameter-value text').text(ticks[val])
                //document.getElementById("value-simple").value=vis.dates[val]
            });

        var gSimple=d3.select("#dateslider")
            .append("svg")
            .attr('width', 500)
            .attr('height', 100)
            .append('g')
            .attr('transform', 'translate(30,30)');
        console.log(vis.dates)



        const formatTime = d3.timeFormat("%B %d, %Y");
        d3.select("#slider").on("input", function() {
            //console.log(vis.dates[0][this.value])
            //d3.select("#sTextbox").dispatch('click');
            d3.select("#sTextbox").property("value",vis.dates[0][this.value]);
            //const tillDate = arrayData.find(item => item.key === "baz");
            console.log(vis.grouped.slice(0,this.value+1))
            let myCC=vis.clockvis.myCrimeCharts.updateData(vis.clockvis,vis.grouped[this.value].values)

        });
        //gSimple.call(sliderSimple);




    }



}
