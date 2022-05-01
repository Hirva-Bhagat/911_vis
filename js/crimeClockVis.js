/* * * * * * * * * * * * * *
*          CrimeClockVis          *
* * * * * * * * * * * * * */


class crimeClockVis {

    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.clockData = data;

        // define colors
        this.colors = ['#fddbc7', '#f4a582', '#d6604d', '#b2182b']

        this.initVis()
    }

    initVis() {
        let vis = this;
        vis.radians = 0.0174532925;
        vis.clockRadius = 200;
        vis.margin = 50;
        vis.width = (vis.clockRadius+vis.margin)*2;
        vis.height = (vis.clockRadius+vis.margin)*2;
        vis.hourHandLength = 2*vis.clockRadius/3;
        vis.minuteHandLength = vis.clockRadius;
        vis.secondHandLength = vis.clockRadius-12;
        vis.secondHandBalance = 30;
        vis.secondTickStart = vis.clockRadius;
        vis.secondTickLength = -10;
        vis.hourTickStart = vis.clockRadius;
        vis.hourTickLength = -18;
        vis.secondLabelRadius = vis.clockRadius + 16;
        vis.secondLabelYOffset = 5;
        vis.hourLabelRadius = vis.clockRadius - 40;
        vis.hourLabelYOffset = 7;

        vis.hourScale = d3.scaleLinear()
            .range([0,330])
            .domain([0,11]);

        vis.minuteScale  = d3.scaleLinear()
            .range([0,354])
            .domain([0,59]);

        vis.secondScale =d3.scaleLinear()
            .range([0,354])
            .domain([0,59]);

        vis.handData = [
            {
                type:'hour',
                value:0,
                length:-vis.hourHandLength,
                scale:vis.hourScale
            },
            {
                type:'minute',
                value:0,
                length:-vis.minuteHandLength,
                scale:vis.minuteScale
            },
            {
                type:'second',
                value:0,
                length:-vis.secondHandLength,
                scale:vis.secondScale,
                balance:vis.secondHandBalance
            }
        ];



        vis.picktime = d3.select("#" + vis.parentElement).append("foreignObject")
            .attr("class","timepicker")
            .attr("width", 250)
            .attr("height", 80)
            .html(function(d) {
                return'<input type="time"\n' +
                    '               id="timepick"\n' +
                    '               placeholder="Enter time">\n'
                    +
                    '<button type="button"\n' +
                    '                id="selectedTime">\n' +
                    '            Enter\n' +
                    '        </button>'
            })
        d3.select("#" + vis.parentElement).append("foreignObject")
            .attr("class","rstbtn")
            .attr("width", 30)
            .attr("height", 30)
            .html(function(d) {
                return '<button type="button"\n' +
                '                id="reset">\n' +
                '            Reset\n' +
                '        </button>'
            })
        d3.select("#reset").on("click", function() {
            clearInterval(vis.refreshId)
            vis.wrangleData()
        })
        d3.select("#selectedTime").on("click", function() {
            vis.reset=true
            console.log("INTERVAL1")
            vis.updateTime()
        })




        vis.myDateSlider = new myDateSlider(vis,'box-3', vis.clockData);
        vis.currentDate=vis.myDateSlider.grouped[100].key
        vis.myCrimeCharts=new myCrimeCharts(vis,vis.myDateSlider.grouped[100].values);
        vis.updateVis();	//draw them in the correct starting position

        vis.svg = d3.select("#"+vis.parentElement).append("svg")
            .attr('class','clock')
            .attr("width", "100%")
            .attr("height", "100%")
            .style("display", "block")
            .style("margin","auto");


        vis.svg.append("text")
            .text("Pick a Date")
            .attr("class","labels")
            .attr("x", 520)
            .attr("y", 20)
            .attr("font-family" , "sans-serif")
            .attr("font-size" , "14px")
            .attr("fill" , "black")
            .attr("text-anchor", "middle");

        vis.svg.append("text")
            .text("Select Time")
            .attr("class","labels")
            .attr("x", 50)
            .attr("y", 20)
            .attr("font-family" , "sans-serif")
            .attr("font-size" , "14px")
            .attr("fill" , "black")
            .attr("text-anchor", "middle");

        vis.svg.append("foreignObject")
            .attr("class","help")
            .attr("width", 50)
            .attr("height", 30)
            .attr("x","530")
            .attr("y","520")
            .html(function(d) {
                return '<button type="button"\n' +
                    'onclick="showhelp"\n'+
                    '                id="help">\n' +
                    '            Help\n' +
                    '        </button>'
            });
        d3.select("#help").on("mouseover", function() {
            showhelp()
        })
        d3.select("#help").on("mouseout", function() {
            closehelp()
        })
        vis.tooltip = vis.svg.append('div')
            .attr('class', "tooltip")
            .attr('id', 'tickTooltip')
            .style("opacity", 0)
            .style("left", 0)
            .style("top", 0)
            .html(``);
        function showhelp(){

            vis.tooltip
                .style("opacity", 1)
                .style("left", event.pageX - 20 + "px")
                .style("top", event.pageY -200+ "px")
                .html('<div><div style="align-content: center; padding: 20px;"><p>The defualt date is shown in the summariser (blue block in the middle). However, you can pick any day from the' +
                ' silder above</p>' +
                '<p>The line graph will show the count by the nearest hour. You can see how the graph changes by either selecting a specific time or hovering over the hour labels</p>' +
                '<p>Observe how the other two graphs change by the date</p><p>' +
                    'enjoy!</p></div>' +
                '</div>');
        }
        function closehelp(){

            vis.tooltip
                .style("opacity", 0)
                .style("left", 0)
                .style("top", 0)
                .html(``);
        }






        vis.face = vis.svg.append('g')
            .attr('id','clock-face')
            .attr('transform','translate(' + (vis.clockRadius + vis.margin) + ',' + (vis.clockRadius + vis.margin) + ')')


        vis.tooltip = d3.select("#clockSlide").append('div')
            .attr('class', "tooltip")
            .attr('id', 'tickTooltip')

        //add marks for seconds
        vis.face.selectAll('.second-tick')
            .data(d3.range(0,60)).enter()
            .append('line')
            .attr('class', 'second-tick')
            .attr('x1',0)
            .attr('x2',0)
            .attr('y1',vis.secondTickStart)
            .attr('y2',vis.secondTickStart + vis.secondTickLength)
            .attr('transform',function(d){
                return 'rotate(' + vis.secondScale(d) + ')';
            })
        //and labels

        vis.face.selectAll('.second-label')
            .data(d3.range(5,61,5))
            .enter()
            .append('text')
            .attr('class', 'second-label')
            .attr('text-anchor','middle')
            .attr('x',function(d){
                return vis.secondLabelRadius*Math.sin(vis.secondScale(d)*vis.radians);
            })
            .attr('y',function(d){
                return -vis.secondLabelRadius*Math.cos(vis.secondScale(d)*vis.radians) + vis.secondLabelYOffset;
            })
            .text(function(d){
                return d;
            });

        //... and hours
        vis.face.selectAll('.hour-tick')
            .data(d3.range(0,12)).enter()
            .append('line')
            .attr('class', 'hour-tick')
            .attr('x1',0)
            .attr('x2',0)
            .attr('y1',vis.hourTickStart)
            .attr('y2',vis.hourTickStart + vis.hourTickLength)
            .attr('transform',function(d){
                return 'rotate(' + vis.hourScale(d) + ')';
            });


        vis.face.selectAll('.hour-label')
            .data(d3.range(1,13,1))
            .enter()
            .append('text')
            .attr('class', 'hour-label')
            .attr('text-anchor','middle')
            .attr('x',function(d){
                return vis.hourLabelRadius*Math.sin(vis.hourScale(d)*vis.radians);
            })
            .attr('y',function(d){
                return -vis.hourLabelRadius*Math.cos(vis.hourScale(d)*vis.radians) + vis.hourLabelYOffset;
            })
            .text(function(d){
                return d;
            })

        vis.face.selectAll('.circs')
            .data(d3.range(1,13,1))
            .enter()
            .append('circle').attr('class','circs')
            .attr('text-anchor','middle')
            .attr('cx',function(d){
                return vis.hourLabelRadius*Math.sin(vis.hourScale(d)*vis.radians);
            })
            .attr('cy',function(d){
                return -vis.hourLabelRadius*Math.cos(vis.hourScale(d)*vis.radians) + vis.hourLabelYOffset -7;
            })
            .attr('r',function(d){
                return vis.clockRadius/10;
            })
            .attr("id",function (d){
                return d;
            })
            .on('mouseover', function(event, d){
            d3.select(this)
                .attr('stroke-width', '2px')
                .attr('stroke', 'darkblue')
                .attr('fill', 'paleturquoise')

                console.log(event.target.id)
                //console.log("SEL:"+event)
                vis.selected = vis.toDate(event.target.id+":00","h:m")
                vis.hover=true



        })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '1px')
                    .attr('fill', 'cadetblue')
                vis.hover=false

            });




        vis.hands = vis.face.append('g').attr('id','clock-hands');

        vis.face.append('g').attr('id','face-overlay')
            .append('circle').attr('class','hands-cover')
            .attr('x',0)
            .attr('y',0)
            .attr('r',vis.clockRadius/20);

        vis.hands.selectAll('line')
            .data(vis.handData)
            .enter()
            .append('line')
            .attr('class', function(d){
                return d.type + '-hand';
            })
            .attr('x1',0)
            .attr('y1',function(d){
                return d.balance ? d.balance : 0;
            })
            .attr('x2',0)
            .attr('y2',function(d){
                return d.length;
            })
            .attr('transform',function(d){
                return 'rotate('+ d.scale(d.value) +')';
            });
        d3.select(self.frameElement).style("height", vis.height + "px");


        vis.wrangleData()


    }

    wrangleData() {
        let vis=this;
        vis.refreshId=setInterval(function(){
            vis.updateVis();
            vis.moveHands();


        }, 1000);




    }

    updateVis(reset, time) {
        let vis=this;
        if(reset){
            vis.t=time
        }
        else {
            if(vis.hover){
                vis.t=vis.selected
            }
            else
            {
                vis.t = new Date();
            }
            }


        console.log("t:"+vis.t)
        vis.myCrimeCharts.drawCharts(vis)
        vis.handData[0].value = (vis.t.getHours() % 12) + vis.t.getMinutes()/60 ;
        vis.handData[1].value = vis.t.getMinutes();
        vis.handData[2].value = vis.t.getSeconds();
        //vis.totalTime=vis.t.getHours()*3.6e3 + vis.t.getMinutes()*60 + vis.t.getSeconds()*1

    }
    moveHands(){
        let vis=this;
        d3.select('#clock-hands').selectAll('line')
            .data(vis.handData)
            .transition()
            .attr('transform',function(d){
                return 'rotate('+ d.scale(d.value) +')';
            });
        if(vis.reset){
            console.log("stopping")
            vis.reset=false
            clearInterval(vis.refreshId)
        }
    }

    updateTime(){
        let vis=this;
        let a =document.getElementById('timepick').value
        vis.newt = vis.toDate(a,"h:m")
        console.log(document.getElementById('timepick').value+" "+vis.newt)
        vis.updateVis(true,vis.newt);
        vis.moveHands();
    }

    toDate(dStr,format) {
        let vis=this;
        var now = new Date();
        if (format == "h:m") {
            now.setHours(dStr.substr(0,dStr.indexOf(":")));
            now.setMinutes(dStr.substr(dStr.indexOf(":")+1));
            now.setSeconds(0);
            return now;
        }
        else
            return "Invalid Format";
    }



}

