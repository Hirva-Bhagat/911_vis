class myCrimeCharts {

    // constructor method to initialize Timeline object
    constructor(clockvis, data) {
        this.data=data
        this.clockvis=clockvis
        // call initVis method
        this.initVis()
    }

    initVis() {
        let vis = this;


        vis.margin = {top: 10, right: 10, bottom: 10, left: 50};
        vis.lineWidth = document.getElementById("box-2").getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.barWidth = document.getElementById("box-4").getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.lineHeight = document.getElementById("box-2").getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;
        vis.barHeight = document.getElementById("box-4").getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;
        vis.bwidth = document.getElementById("box-5").getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;
        vis.bheight = document.getElementById("box-5").getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;
        // drawing area
        vis.lineSvg = d3.select("#box-2").append("svg")
            .attr("class","charts callsTT")
            .attr("width",document.getElementById("box-2").getBoundingClientRect().width)
            .attr("height",document.getElementById("box-2").getBoundingClientRect().height)
            .attr("align","center")
        vis.barSvg = d3.select("#box-4").append("svg")
            .attr("class","charts callsTT")
            .attr("width",vis.barWidth)
            .attr("height",vis.barHeight)
        vis.bSvg = d3.select("#box-5").append("svg")
            .attr("class","charts callsPlaces")
            .attr("width",vis.bwidth)
            .attr("height",vis.bheight)

        //console.log(vis.data)
        vis.linex = d3.scaleLinear()
            .domain([0,24])
            .range([ vis.margin.left, vis.lineWidth ]);
        vis.lineSvg.append("g")
            .attr("transform", "translate("+"0"+"," + vis.lineHeight + ")")
            .call(d3.axisBottom(vis.linex));

        vis.liney = d3.scaleLinear()
            .domain( [0,vis.data.length])
            .range([ vis.lineHeight-10, 0 ]);
        vis.lineSvg.append("g")
            .attr("transform", "translate("+vis.margin.left+", 10)")
            .call(d3.axisLeft(vis.liney));


        vis.bd= vis.bwidth;


        vis.tooltip = d3.select("#clockSlide").append('div')
            .attr('class', "tooltip")
            .style("opacity", 0)
            .style("left", 0)
            .style("top", 0)



        console.log(vis.clockvis.t)
        vis.updateData(vis.clockvis,vis.data)






    }
    updateData(clockvis,data){
       let vis=this;
        vis.data=data
        vis.clockvis=clockvis
        vis.times=d3.nest()
            .key(function(d){ return d.Time_of_call.toLocaleTimeString('it-IT'); }).entries(vis.data);
        vis.timesList=[vis.times.map(d=>d.key)]
        vis.hourList=d3.nest()
            .key(function(d){ return d.Time_of_call.toLocaleTimeString('it-IT').split(":")[0]; }).entries(vis.data);
        vis.address=d3.nest()
            .key(function(d){ return d.twp })
            .key(function (d){ return d.addr}).entries(vis.data);
        console.log(vis.address)
        vis.addList = {
            children: []
        };

        for(var i in vis.address) {

            var item = vis.address[i];

            vis.addList.children.push({
                "twp" : item.key,
                "count"       : item.values.length
            });
        }
        console.log(vis.addList)
        //vis.drawCharts(vis.clockvis)

    }

    drawCharts(clockvis){
        let vis=this;
        vis.clockvis=clockvis;


        function timeToSecs(time) {
            //console.log(time)
            let [h, m, s] = time.split(':');
            return h*3.6e3 + m*60 + s*1;
        }



        console.log(clockvis.t.toLocaleTimeString('it-IT'))
        let t=vis.clockvis.t.toLocaleTimeString('it-IT')
        let closesti=null
        let secs = timeToSecs(t);
            let closest = null;
            vis.timesList[0].reduce((acc, obj, i) => {
                //console.log(obj)
                let diff = Math.abs(timeToSecs(obj) - secs);
                if (diff < acc) {
                    acc = diff;
                    closest = obj;
                    closesti=i;
                }
                return acc;
            }, Number.POSITIVE_INFINITY);
            // Display result
        //console.log("time:"+t)
        //console.log("closest:"+closest)
        //let h=parseInt(t.split(":")[0])
        console.log(vis.hourList)
        vis.tillHour = vis.hourList.findIndex(item => item.key === t.split(":")[0]);
        if(vis.tillHour<0){ vis.tillHour=0
            vis.lineData=vis.hourList[0]
        }
        else
        {
            vis.lineData=vis.hourList.slice(0,vis.tillHour)
        }
        console.log(vis.tillHour)

        console.log(vis.lineData);
        vis.updateVis()

    }
    updateVis(){
        let vis=this
        vis.linechart = vis.lineSvg
            .append('g')
            .append("path")
            .datum(vis.lineData)
            .attr("d", d3.line()
                .x(function(d) { return vis.linex(+d.key) })
                .y(function(d) { return vis.liney(+d.values.length) })
            )
            .attr("stroke", function(d){ return"red" })
            .style("stroke-width", 4)
            .style("fill", "none")


        var bubble = d3.pack(vis.addList)
            .size([vis.bwidth, vis.bwidth])
            .padding(1.5);
        var color = d3.scaleOrdinal(d3.schemeCategory10)


        vis.bSvg=vis.bSvg
            .attr("class", "bubble");

        //console.log(vis.address)





        var nodes = d3.hierarchy(vis.addList)
            .sum(function(d) { return d.count; });

        console.log(nodes)
        var node = vis.bSvg.selectAll(".node")
            .data(bubble(nodes).descendants())
            .enter()
            .filter(function(d){
                return  !d.children
            })
            .append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        node.append("title")
            .text(function(d) {
                return d.twp + ": " + d.count;
            });

        node.append("circle")
            .attr("r", function(d) {
                return d.r;
            })
            .style("fill", function(d,i) {
                return color(i);
            }).on("mouseover", function(event, d){
            d3.select(this)
                .attr('stroke-width', '2px')
                .attr('stroke', 'black')
            vis.tooltip
                .style("opacity", 1)
                .style("left", event.pageX + 20 + "px")
                .style("top", event.pageY + "px")
                .html(`
         <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
             <h3>${"place"+d.data.twp}<h3>
             <h4> Count: ${d.data.count}</h4>                           
         </div>`);
        })
            .on("mouseout",function(event, d){
                d3.select(this)
                    .attr('stroke-width', '0px')

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            });

        node.append("text")
            .attr("dy", ".2em")
            .style("text-anchor", "middle")
            .text(function(d) {
                return d.data.twp.substring(0, d.r / 3);
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", function(d){
                return d.r/5;
            })
            .attr("fill", "white");

        node.append("text")
            .attr("dy", "1.3em")
            .style("text-anchor", "middle")
            .text(function(d) {
                return d.data.count;
            })
            .attr("font-family",  "Gill Sans", "Gill Sans MT")
            .attr("font-size", function(d){
                return d.r/5;
            })
            .attr("fill", "white");

        d3.select(self.frameElement)
            .style("height", vis.bd + "px");


    }



}
