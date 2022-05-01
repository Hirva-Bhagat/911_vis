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
            .attr("class","charts areas")
            .attr("width",vis.barWidth)
            .attr("height",vis.barHeight)
        vis.bSvg = d3.select("#box-5").append("svg")
            .attr("class","charts callsPlaces")
            .attr("width",vis.bwidth)
            .attr("height",vis.bheight)
        vis.disp = d3.select("#box-6")


        //console.log(vis.data)
        vis.linex = d3.scaleLinear()
            .domain([0,24])
            .range([ vis.margin.left, vis.lineWidth ]);


        vis.liney = d3.scaleLinear()
            .domain( [0,vis.data.length])
            .range([ vis.lineHeight-10, 0 ]);



        vis.bd= vis.bwidth;


        vis.tooltip = d3.select("#clockSlide").append('div')
            .attr('class', "tooltip")
            .style("opacity", 0)
            .style("left", 0)
            .style("top", 0)


        // set the ranges
        vis.barx = d3.scaleBand()
            .range([0, vis.barWidth-20])
            .padding(0.1)
        ;
        vis.bary = d3.scaleLinear()
            .range([vis.barHeight-50, 0]);

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
        vis.barSvg=vis.barSvg
            .append("g")
            .attr("transform",
                "translate(" + vis.margin.left + "," + vis.margin.top + ")")
        ;



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
            .entries(vis.data);
        vis.places=d3.nest()
            .key(function (d){ return d.addr})
            .entries(vis.data)
        vis.addbyplaces=d3.nest()
            .key(function(d){ return d.twp })
            .key(function (d){return d.addr})
            .entries(vis.data);
        console.log("ADDDRESS")
        console.log(vis.address)
        console.log(vis.places)
        console.log(vis.addbyplaces)
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
        vis.t=vis.clockvis.t.toLocaleTimeString('it-IT')
        let closesti=null
        let secs = timeToSecs(vis.t);
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
        vis.tillHour = vis.hourList.findIndex(item => item.key === vis.t.split(":")[0]);
        if(vis.tillHour<0){ vis.tillHour=0
            vis.lineData=vis.hourList[0]
        }
        else
        {
            vis.lineData=vis.hourList.slice(0,vis.tillHour)
        }
        console.log(vis.tillHour)

        vis.sum=d3.sum(vis.lineData, x => x.values.length)
        console.log(vis.lineData);
        vis.updateVis()

    }
    updateVis(){
        let vis=this
        vis.lineSvg.selectAll("*").remove();
        vis.bSvg.selectAll("*").remove();
        vis.barSvg.selectAll("*").remove();
        vis.disp.selectAll("*").remove();
        d3.select("#box-5").selectAll("text").remove();




        vis.lineSvg.append("g").append("text")
            .text("Hours in a day")
            .attr("class","labels")
            .attr("x", vis.lineWidth)
            .attr("y", 190)
            .attr("font-family" , "sans-serif")
            .attr("font-size" , "10px")
            .attr("fill" , "black")
            .attr("text-anchor", "middle");
        vis.lineSvg.append("g").append("text")
            .text("No of calls")
            .attr("class","labels")
            .attr("x", -40)
            .attr("y", vis.lineHeight-135)
            .attr("font-family" , "sans-serif")
            .attr("font-size" , "10px")
            .attr("fill" , "black")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)");

    vis.bSvg.append("text")
        .attr("x", vis.bheight-90)
            .attr("y", vis.bwidth-15)
            .text("No. of calls by cities till "+vis.t)
            .attr("class","labels")
            .attr("font-family" , "sans-serif")
            .attr("font-size" , "10px")
            .attr("fill" , "black")
            .attr("text-anchor", "middle");


        vis.barSvg.append("g").append("text")
            .attr("x", 100)
            .attr("y", 10)
            .text("Top 3 high activity places ")
            .attr("class","labels")
            .attr("font-family" , "sans-serif")
            .attr("font-size" , "10px")
            .attr("fill" , "black")
            .attr("text-anchor", "middle");

        vis.lineSvg.append("g")
            .attr("transform", "translate("+"0"+"," + vis.lineHeight + ")")
            .call(d3.axisBottom(vis.linex));

        vis.lineSvg.append("g")
            .attr("transform", "translate("+vis.margin.left+", 10)")
            .call(d3.axisLeft(vis.liney));

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
            .size([vis.bwidth, vis.bheight])
            .padding(0.5);
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

        vis.selected_place=null
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
            vis.selected_place=d.data.twp
            vis.tooltip
                .style("opacity", 1)
                .style("left", event.pageX + 20 + "px")
                .style("top", event.pageY + "px")
                .html(`
         <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
             <h3>${"place: "+d.data.twp}<h3>
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

        function sortByDesc(a, b) {
            return b.values.length-a.values.length;
        }
        vis.sortedData = vis.places.sort(sortByDesc);

        //console.log(vis.sortedData)
        //console.log(vis.selected_place)
        //vis.add = vis.addbyplaces.findIndex(item => item.key === vis.selected_place);
        //console.log(vis.add)
        vis.xlist=vis.sortedData.slice(0,3)
        console.log(vis.sortedData)
        vis.barx.domain(vis.xlist.map((s)=>s.key))
        vis.bary.domain([0, 20])
        vis.barSvg.append('g')
            .call(d3.axisLeft(vis.bary)
            );
        //console.log(vis.places.map((s)=>s.key))
        vis.barSvg.append('g')
            .attr('transform', `translate(0, ${vis.barHeight-50})`)
            .call(d3.axisBottom(vis.barx))
            .selectAll("text") // select all the x tick texts
            .call(function(t){
                t.each(function(d){ // for each one
                    var self = d3.select(this);
                    var s = self.text().split('&');  // get the text and split it
                    self.text(''); // clear it out
                    self.append("tspan") // insert two tspans
                        .attr("x", "0")
                        .attr("dy",".8em")
                        .text(s[0]+" & ")
                        .attr("padding","12px");
                    self.append("tspan")
                        .attr("x", "0")
                        .attr("dy","0.8em")
                        .text(s[1]);
                })})
            .attr("transform", "rotate(7)");;



        vis.barSvg.selectAll()
            .data(vis.xlist)
            .enter()
            .append('rect')
            .attr('x', (s) => vis.barx(s.key))
            .attr('y', (s) => vis.bary(s.values.length))
            .attr('height', (s) => vis.barHeight -50 - vis.bary(s.values.length))
            .attr('width', vis.barx.bandwidth()-10)
            .attr('fill',"rgba(79,183,213,0.47)")

        vis.barSvg
            .selectAll()
            .data(vis.xlist)
            .enter()
            .append('text')
            .attr("class", "texts")
            .attr("fill","darkblue")
            .style("text-anchor", "middle")
            .style("font-size", "11px")
            .attr('x', d => vis.barx(d.key) + vis.barx.bandwidth()/2)
            .attr('dx', 0)
            .attr('y', d => vis.bary(d.values.length))
            .attr('dy', -6)
            .text(d => d.values.length);


        vis.disp.html(`
         <div style=" align-content: center; border: thin solid rgba(146,236,255,0.47); margin-left: 5px; margin-top: 5px; width:90%; height:90%; border-radius: 5px; background: rgba(3,117,164,0.47); padding: 10px">
             <h3>${"On Date: " + vis.clockvis.currentDate}<h3>
             <h4> ${"At Time: " + vis.t}</h4>   
             <h5>Total Number Of Calls: ${vis.sum}</h5>
             <h5>High Activity Places: ${vis.xlist.map((s) => s.key)}</h5>   
         
         </div>`)




    }



}
